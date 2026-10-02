"use client";

import { useEffect, useMemo } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

import type { BubbleDatum } from "@/components/attendance/BubbleChart";
import PortraitBubbleChart from "@/components/attendance/PortraitBubbleChart";
import useTweenedNumber from "@/components/attendance/useTweenedNumber";
import { formatEventDayDate, type EventDay } from "@/lib/event-day";
import { siteShortName } from "@/lib/seo";

const DAY_LABELS: Record<EventDay, string> = { day1: "Day 1", day2: "Day 2" };

// Keeps the kiosk screen awake while the display is showing.
function useScreenWakeLock() {
  useEffect(() => {
    if (!("wakeLock" in navigator)) {
      return;
    }

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    async function acquire() {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await lock.release();
        } else {
          sentinel = lock;
        }
      } catch {
        // The browser can refuse (e.g. battery saver); the display still works without it.
      }
    }

    // Wake locks are dropped whenever the tab is hidden, so re-acquire on return.
    function handleVisibilityChange() {
      if (!document.hidden) {
        acquire();
      }
    }

    acquire();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      sentinel?.release().catch(() => {});
    };
  }, []);
}

export default function LiveAttendanceDisplay({
  data,
  day,
  lastUpdatedAt,
  isFullscreen,
  onToggleFullscreen,
  onExit,
}: {
  data: BubbleDatum[];
  day: EventDay;
  lastUpdatedAt: number | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExit: () => void;
}) {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data]);
  const shownTotal = useTweenedNumber(total);

  useScreenWakeLock();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[radial-gradient(120%_55%_at_50%_0%,#1f3d73_0%,#0c1a38_55%,#070f24_100%)] px-[2.5vw] pb-[1.5vh] pt-[2vh] text-white">
      <div className="group absolute right-[3vw] top-[2.5vh] z-10 flex gap-2 opacity-30 transition-opacity hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
        </button>
        <button
          type="button"
          onClick={onExit}
          aria-label="Close display mode"
          className="rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
      </div>

      <header className="text-center">
        <p className="inline-flex items-center gap-[1.2vw] text-[min(2.4vh,4.4vw)] font-semibold uppercase tracking-[0.35em] text-[#5fc2c8]">
          <span className="relative flex size-[min(1.6vh,3vw)]">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#5fc2c8] opacity-75" />
            <span className="relative inline-flex size-full rounded-full bg-[#5fc2c8]" />
          </span>
          Live Attendance
        </p>
        <h1 className="mt-[0.8vh] text-[min(3.8vh,7vw)] font-semibold text-white/90">Check-ins by archdiocese</h1>
        <p className="mt-[0.4vh] text-[min(2.6vh,4.8vw)] text-white/60">
          {DAY_LABELS[day]} · {formatEventDayDate(day)}
        </p>

        <p className="mt-[1.2vh] text-[min(14vh,26vw)] font-extrabold leading-none tabular-nums tracking-tight">
          {shownTotal.toLocaleString()}
        </p>
        <p className="mt-[0.4vh] text-[min(2.4vh,4.4vw)] font-semibold uppercase tracking-[0.3em] text-white/60">
          Checked in
        </p>
      </header>

      <div className="relative mt-[1.5vh] min-h-0 flex-1">
        <PortraitBubbleChart data={data} />
      </div>

      <footer className="mt-[1vh] flex items-center justify-between text-[min(1.9vh,3.4vw)] text-white/50">
        <span>{siteShortName}</span>
        <span className="tabular-nums">
          {lastUpdatedAt
            ? `Updated ${new Date(lastUpdatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}`
            : "Updates live"}
        </span>
      </footer>
    </div>
  );
}
