"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BubbleChart, { type BubbleDatum } from "@/components/attendance/BubbleChart";
import type { ArchdioceseAttendanceCounts } from "@/lib/attendance/dashboard.server";

// Matches the server/CDN cache window for the counts endpoint.
const POLL_INTERVAL_MS = 5000;

function toBubbleData(counts: Record<string, number>): BubbleDatum[] {
  return Object.entries(counts).map(([archdiocese, count]) => ({ archdiocese, count }));
}

export default function LiveAttendanceDashboard({
  initialCounts,
}: {
  initialCounts: ArchdioceseAttendanceCounts;
}) {
  const [counts, setCounts] = useState(initialCounts);

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

  return (
    <Tabs defaultValue="day1" className="items-center">
      <TabsList>
        <TabsTrigger value="day1">Day 1</TabsTrigger>
        <TabsTrigger value="day2">Day 2</TabsTrigger>
      </TabsList>

      <TabsContent value="day1" className="w-full">
        <BubbleChart data={toBubbleData(counts.dayOne)} />
      </TabsContent>
      <TabsContent value="day2" className="w-full">
        <BubbleChart data={toBubbleData(counts.dayTwo)} />
      </TabsContent>
    </Tabs>
  );
}
