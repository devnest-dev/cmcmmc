"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { forceCollide, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";

import type { BubbleDatum } from "@/components/attendance/BubbleChart";
import useTweenedNumber from "@/components/attendance/useTweenedNumber";

type Size = { width: number; height: number };

type SimNode = SimulationNodeDatum & {
  datum: BubbleDatum;
  r: number;
  targetX: number;
  targetY: number;
};

type PlacedBubble = {
  datum: BubbleDatum;
  r: number;
  x: number;
  y: number;
};

// Gap between neighbouring bubbles, in screen pixels.
const GAP = 12;
// Share of the drawing area the bubbles should cover before collisions settle.
const FILL_RATIO = 0.5;
// How much consecutive bubbles in the zig-zag column overlap vertically (1 = stacked flush).
const STACK_OVERLAP = 0.74;
const TICKS = 300;

// Brighter = more attendees, so the leaders glow against the navy background.
const GLOW_RAMP = ["#1b6f74", "#228e94", "#2aadb5", "#45bcc3", "#5fc2c8", "#8fd8dc"];
const DARK_TEXT_FROM_INDEX = 3;
const NAVY_TEXT = "#0c1a38";

function rampIndex(count: number, maxCount: number): number {
  if (maxCount <= 0) {
    return 0;
  }
  return Math.min(GLOW_RAMP.length - 1, Math.floor((count / maxCount) * (GLOW_RAMP.length - 1)));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function columnSpan(radii: number[]): number {
  return radii.reduce(
    (span, r, i) => span + (i === 0 ? r : (radii[i - 1] + r) * STACK_OVERLAP),
    0,
  ) + (radii.at(-1) ?? 0);
}

// Packs bubbles into a tall, narrow box: seed them in a zig-zag column that spans the
// height, then let collision forces settle them into an organic arrangement.
function computeLayout(data: BubbleDatum[], { width, height }: Size): PlacedBubble[] {
  if (width <= 0 || height <= 0 || data.length === 0) {
    return [];
  }

  const sorted = [...data].sort(
    (a, b) => b.count - a.count || a.archdiocese.localeCompare(b.archdiocese),
  );
  const total = sorted.reduce((sum, d) => sum + d.count, 0);
  const minR = Math.min(width, height) * 0.11;
  const maxR = width / 2 - GAP;
  const areaScale = Math.sqrt((FILL_RATIO * width * height) / Math.PI);

  let radii = sorted.map((d) =>
    total > 0 ? clamp(Math.sqrt(d.count / total) * areaScale, minR, maxR) : minR,
  );

  const available = height - GAP * 2;
  const span = columnSpan(radii);
  if (span > available) {
    radii = radii.map((r) => (r * available) / span);
  }

  let cursorY = (height - columnSpan(radii)) / 2;
  const nodes: SimNode[] = sorted.map((datum, i) => {
    const r = radii[i];
    cursorY += i === 0 ? r : (radii[i - 1] + r) * STACK_OVERLAP;
    const side = i === 0 ? 0 : i % 2 === 1 ? -1 : 1;
    const targetX = width / 2 + side * Math.max(0, width / 2 - r - GAP) * 0.6;

    return { datum, r, targetX, targetY: cursorY, x: targetX, y: cursorY };
  });

  const simulation = forceSimulation(nodes)
    .force("x", forceX<SimNode>((d) => d.targetX).strength(0.05))
    .force("y", forceY<SimNode>((d) => d.targetY).strength(0.05))
    .force("collide", forceCollide<SimNode>((d) => d.r + GAP / 2).strength(1).iterations(3))
    .stop();

  for (let i = 0; i < TICKS; i++) {
    simulation.tick();
    for (const node of nodes) {
      node.x = clamp(node.x ?? 0, node.r + GAP / 2, width - node.r - GAP / 2);
      node.y = clamp(node.y ?? 0, node.r + GAP / 2, height - node.r - GAP / 2);
    }
  }

  return nodes.map((node) => ({ datum: node.datum, r: node.r, x: node.x ?? 0, y: node.y ?? 0 }));
}

function splitName(archdiocese: string): { prefix: string | null; name: string } {
  const match = archdiocese.match(/^((?:Arch)?diocese of) (.+)$/i);
  return match ? { prefix: match[1], name: match[2] } : { prefix: null, name: archdiocese };
}

function Bubble({
  bubble,
  maxCount,
  isLeader,
  pulse,
}: {
  bubble: PlacedBubble;
  maxCount: number;
  isLeader: boolean;
  pulse: number;
}) {
  const { datum, r, x, y } = bubble;
  const shownCount = useTweenedNumber(datum.count);
  const isZero = datum.count === 0;
  const index = rampIndex(datum.count, maxCount);
  const fill = isZero ? "rgba(255,255,255,0.04)" : GLOW_RAMP[index];
  const textColor = isZero ? "rgba(255,255,255,0.55)" : index >= DARK_TEXT_FROM_INDEX ? NAVY_TEXT : "#ffffff";

  const { prefix, name } = splitName(datum.archdiocese);
  const nameSize = Math.min(r * 0.3, (r * 1.5) / (0.6 * name.length));
  const countSize = r * 0.34;
  const prefixSize = nameSize * 0.42;
  const showPrefix = prefix !== null && prefixSize >= 9;

  const lines = [
    ...(showPrefix ? [{ key: "prefix", text: prefix.toUpperCase(), size: prefixSize, weight: 600, opacity: 0.75, gap: 1.6 }] : []),
    { key: "name", text: name, size: nameSize, weight: 600, opacity: 1, gap: 1.15 },
    { key: "count", text: shownCount.toLocaleString(), size: countSize, weight: 800, opacity: 1, gap: 1 },
  ];
  const blockHeight = lines.reduce((sum, line) => sum + line.size * line.gap, 0);
  let cursor = -blockHeight / 2;

  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <circle
        r={r}
        fill={fill}
        stroke={isZero ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.35)"}
        strokeWidth={isZero ? 2 : 1.5}
        strokeDasharray={isZero ? "6 6" : undefined}
        className="transition-[r,fill] duration-900 ease-out"
        style={isLeader ? { filter: "drop-shadow(0 0 32px rgba(95, 194, 200, 0.55))" } : undefined}
      />
      {pulse > 0 && (
        <circle
          key={pulse}
          r={r}
          fill="none"
          stroke="#8fd8dc"
          strokeWidth={4}
          className="pointer-events-none animate-bubble-pulse"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      {r > 24 && (
        <text textAnchor="middle" fill={textColor} className="pointer-events-none">
          {lines.map((line) => {
            const lineY = cursor + (line.size * line.gap) / 2;
            cursor += line.size * line.gap;
            return (
              <tspan
                key={line.key}
                x={0}
                y={lineY}
                dominantBaseline="central"
                fontSize={line.size}
                fontWeight={line.weight}
                opacity={line.opacity}
                letterSpacing={line.key === "prefix" ? "0.18em" : undefined}
                className="tabular-nums"
              >
                {line.text}
              </tspan>
            );
          })}
        </text>
      )}
    </g>
  );
}

export default function PortraitBubbleChart({ data }: { data: BubbleDatum[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);

  // Count each archdiocese's increases so its bubble can pulse when someone checks in.
  const [prevData, setPrevData] = useState(data);
  const [pulses, setPulses] = useState<Record<string, number>>({});

  if (prevData !== data) {
    const prevCounts = new Map(prevData.map((d) => [d.archdiocese, d.count]));
    const increased = data.filter((d) => d.count > (prevCounts.get(d.archdiocese) ?? 0));

    setPrevData(data);
    if (increased.length > 0) {
      setPulses((current) => {
        const next = { ...current };
        for (const d of increased) {
          next[d.archdiocese] = (next[d.archdiocese] ?? 0) + 1;
        }
        return next;
      });
    }
  }

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSize((current) =>
        current && current.width === width && current.height === height ? current : { width, height },
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const bubbles = useMemo(() => (size ? computeLayout(data, size) : []), [data, size]);
  const maxCount = useMemo(() => data.reduce((max, d) => Math.max(max, d.count), 0), [data]);
  const leader = bubbles[0]?.datum.count ? bubbles[0].datum.archdiocese : null;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {size && (
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          width={size.width}
          height={size.height}
          role="img"
          aria-label="Attendance by archdiocese"
          className="absolute inset-0 overflow-visible"
        >
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.datum.archdiocese}
              bubble={bubble}
              maxCount={maxCount}
              isLeader={bubble.datum.archdiocese === leader}
              pulse={pulses[bubble.datum.archdiocese] ?? 0}
            />
          ))}
        </svg>
      )}

      <ul className="sr-only">
        {data.map((d) => (
          <li key={d.archdiocese}>
            {d.archdiocese}: {d.count} present
          </li>
        ))}
      </ul>
    </div>
  );
}
