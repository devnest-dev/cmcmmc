import type { Metadata } from "next";

import { getArchdioceseAttendanceCounts } from "@/lib/attendance/dashboard.server";
import LiveAttendanceDashboard from "./LiveAttendanceDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Attendance",
  description: "Live attendance counts by archdiocese.",
};

export default async function LiveAttendancePage() {
  const counts = await getArchdioceseAttendanceCounts();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_45%,#f8fbff_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Live Attendance</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">Check-ins by archdiocese</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Updates live as attendees are checked in at the venue.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <LiveAttendanceDashboard initialCounts={counts} />
        </div>
      </div>
    </main>
  );
}
