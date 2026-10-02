"use client";

import { useMemo, useState } from "react";
import { hierarchy, pack, type HierarchyCircularNode } from "d3-hierarchy";

import { cn } from "@/lib/utils";

export type BubbleDatum = {
  archdiocese: string;
  count: number;
};

type PackDatum = BubbleDatum & { children?: BubbleDatum[] };

const SIZE = 600;
const MIN_VALUE = 0.001;

const TEAL_RAMP = ["#5fc2c8", "#2aadb5", "#228e94", "#1b6f74", "#135053", "#0c3033"];
const ZERO_FILL = "#f1f5f9";
const ZERO_STROKE = "#cbd5e1";

function rampColor(count: number, maxCount: number): string {
  if (maxCount <= 0) {
    return TEAL_RAMP[0];
  }
  const step = Math.min(
    TEAL_RAMP.length - 1,
    Math.floor((count / maxCount) * (TEAL_RAMP.length - 1)),
  );
  return TEAL_RAMP[step];
}

function textColorFor(fill: string): string {
  const darkFillsFromIndex = TEAL_RAMP.indexOf("#228e94");
  const index = TEAL_RAMP.indexOf(fill);
  return index >= darkFillsFromIndex ? "#ffffff" : "#0f172a";
}

export default function BubbleChart({ data }: { data: BubbleDatum[] }) {
  const [activeArchdiocese, setActiveArchdiocese] = useState<string | null>(null);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);
  const maxCount = useMemo(() => data.reduce((max, d) => Math.max(max, d.count), 0), [data]);

  const nodes = useMemo(() => {
    const root = hierarchy<PackDatum>({ archdiocese: "__root__", count: 0, children: data }).sum(
      (d) => Math.max(d.count, MIN_VALUE),
    );

    const layout = pack<PackDatum>().size([SIZE, SIZE]).padding(6);

    return (layout(root).children ?? []) as HierarchyCircularNode<PackDatum>[];
  }, [data]);

  const active = data.find((d) => d.archdiocese === activeArchdiocese) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Attendance by archdiocese"
          className="mx-auto block h-auto w-full max-w-xl"
        >
          {nodes.map((node) => {
            const datum = node.data;
            const isZero = datum.count === 0;
            const fill = isZero ? ZERO_FILL : rampColor(datum.count, maxCount);
            const textColor = isZero ? "#64748b" : textColorFor(fill);
            const fontSize = Math.max(10, Math.min(18, node.r / 3.2));
            const isActive = activeArchdiocese === datum.archdiocese;

            return (
              <g
                key={datum.archdiocese}
                transform={`translate(${node.x}, ${node.y})`}
                onPointerEnter={() => setActiveArchdiocese(datum.archdiocese)}
                onPointerLeave={() => setActiveArchdiocese((cur) => (cur === datum.archdiocese ? null : cur))}
                onFocus={() => setActiveArchdiocese(datum.archdiocese)}
                onBlur={() => setActiveArchdiocese((cur) => (cur === datum.archdiocese ? null : cur))}
                tabIndex={0}
                className="cursor-default outline-none"
              >
                <circle
                  r={node.r}
                  fill={fill}
                  stroke={isZero ? ZERO_STROKE : "#ffffff"}
                  strokeWidth={isActive ? 3 : 1.5}
                  strokeDasharray={isZero ? "4 4" : undefined}
                />
                {node.r > 22 && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={fontSize}
                    fill={textColor}
                    className="pointer-events-none font-semibold"
                  >
                    <tspan x="0" dy="-0.6em">
                      {datum.archdiocese}
                    </tspan>
                    <tspan x="0" dy="1.3em">
                      {datum.count}
                    </tspan>
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {active && (
          <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-[#1a2e5a] px-3 py-1.5 text-xs font-semibold text-white shadow-md">
            {active.archdiocese}: {active.count} present
            {total > 0 && <span className="ml-1 text-white/70">({Math.round((active.count / total) * 100)}%)</span>}
          </div>
        )}
      </div>

      <table className="w-full text-left text-sm">
        <caption className="sr-only">Attendance count by archdiocese</caption>
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th scope="col" className="py-2">Archdiocese</th>
            <th scope="col" className="py-2 text-right">Present</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr
              key={d.archdiocese}
              className={cn(
                "border-b border-slate-100",
                d.archdiocese === activeArchdiocese && "bg-slate-50",
              )}
            >
              <td className="py-2 text-slate-700">{d.archdiocese}</td>
              <td className="py-2 text-right font-semibold text-[#1a2e5a]">{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
