"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BubbleChart, { type BubbleDatum } from "@/components/attendance/BubbleChart";
import type { ArchdioceseAttendanceCounts } from "@/lib/attendance/dashboard.server";
import { getCurrentEventDay, type EventDay } from "@/lib/event-day";
import LiveAttendanceDisplay from "./LiveAttendanceDisplay";

// Matches the server/CDN cache window for the counts endpoint.
const POLL_INTERVAL_MS = 5000;
const DAY_CHECK_INTERVAL_MS = 60_000;

function toBubbleData(counts: Record<string, number>): BubbleDatum[] {
  return Object.entries(counts).map(([archdiocese, count]) => ({ archdiocese, count }));
}

export default function LiveAttendanceDashboard({
  initialCounts,
  initialDay,
  initialDisplay,
}: {
  initialCounts: ArchdioceseAttendanceCounts;
  initialDay: EventDay;
  initialDisplay: boolean;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [isDisplay, setIsDisplay] = useState(initialDisplay);
  const [displayDay, setDisplayDay] = useState(initialDay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // True when display mode was opened via the button, so leaving fullscreen (e.g. Esc) closes it too.
  const exitOnFullscreenEndRef = useRef(false);

  const dayOneData = useMemo(() => toBubbleData(counts.dayOne), [counts.dayOne]);
  const dayTwoData = useMemo(() => toBubbleData(counts.dayTwo), [counts.dayTwo]);

  useEffect(() => {
    let inFlight = false;

    async function resync() {
      if (inFlight || document.hidden) {
        return;
      }

      inFlight = true;

      try {
        const response = await fetch("/api/attendance/dashboard-counts");
        const result = (await response.json()) as { ok: boolean } & Partial<ArchdioceseAttendanceCounts>;

        if (result.ok && result.dayOne && result.dayTwo) {
          setCounts({ dayOne: result.dayOne, dayTwo: result.dayTwo });
          setLastUpdatedAt(Date.now());
        }
      } catch {
        // Ignore transient resync failures; the next poll will retry.
      } finally {
        inFlight = false;
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        resync();
      }
    }

    const interval = window.setInterval(resync, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    function handleFullscreenChange() {
      const active = document.fullscreenElement !== null;
      setIsFullscreen(active);

      if (!active && exitOnFullscreenEndRef.current) {
        exitOnFullscreenEndRef.current = false;
        setIsDisplay(false);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // A kiosk can't tap tabs, so the display follows the event day on its own.
  useEffect(() => {
    if (!isDisplay) {
      return;
    }

    const interval = window.setInterval(() => setDisplayDay(getCurrentEventDay()), DAY_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isDisplay]);

  function enterDisplay() {
    setDisplayDay(getCurrentEventDay());
    setIsDisplay(true);

    if (document.fullscreenEnabled) {
      exitOnFullscreenEndRef.current = true;
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen was refused; the full-window layout still works.
        exitOnFullscreenEndRef.current = false;
      });
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      exitOnFullscreenEndRef.current = false;
      document.exitFullscreen().catch(() => {});
    } else if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function exitDisplay() {
    exitOnFullscreenEndRef.current = false;
    setIsDisplay(false);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const url = new URL(window.location.href);
    if (url.searchParams.has("display")) {
      url.searchParams.delete("display");
      window.history.replaceState(null, "", url);
    }
  }

  if (isDisplay) {
    return (
      <LiveAttendanceDisplay
        data={displayDay === "day1" ? dayOneData : dayTwoData}
        day={displayDay}
        lastUpdatedAt={lastUpdatedAt}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onExit={exitDisplay}
      />
    );
  }

  return (
    <Tabs defaultValue={initialDay} className="items-center">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span aria-hidden />
        <TabsList>
          <TabsTrigger value="day1">Day 1</TabsTrigger>
          <TabsTrigger value="day2">Day 2</TabsTrigger>
        </TabsList>
        <button
          type="button"
          onClick={enterDisplay}
          className="inline-flex items-center gap-2 justify-self-end rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-[#1a2e5a] transition-colors hover:bg-slate-50"
        >
          <Maximize2 className="size-4" />
          <span className="hidden sm:inline">Display mode</span>
        </button>
      </div>

      <TabsContent value="day1" className="w-full">
        <BubbleChart data={dayOneData} />
      </TabsContent>
      <TabsContent value="day2" className="w-full">
        <BubbleChart data={dayTwoData} />
      </TabsContent>
    </Tabs>
  );
}
