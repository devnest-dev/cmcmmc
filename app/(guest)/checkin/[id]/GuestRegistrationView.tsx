import Link from "next/link";

import { Button } from "@/components/ui/button";
import { day1Options, day2Options } from "@/lib/registration-options";
import type { GuestRegistrationView as GuestRegistrationViewType } from "@/lib/guest-submission-view";

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value || "—"}</p>
    </div>
  );
}

function ArrivalStatus({ label, timestamp }: { label: string; timestamp: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">
        {timestamp
          ? new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Manila",
            }).format(new Date(timestamp))
          : "Not yet checked in"}
      </p>
    </div>
  );
}

export default function GuestRegistrationView({
  submission,
  evaluationHref,
}: {
  submission: GuestRegistrationViewType;
  evaluationHref?: string;
}) {
  const day1Label = day1Options.find((option) => option.value === submission.day1Session)?.label ?? submission.day1Session;
  const day2Label = day2Options.find((option) => option.value === submission.day2Session)?.label ?? submission.day2Session;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Registration</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a]">{submission.displayName}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {submission.confirmed ? "Registration confirmed" : "Registration under review"}
          </p>
        </div>

        {evaluationHref && (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#2aadb5]/30 bg-[#2aadb5]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1a2e5a]">Evaluate the Congress</h2>
              <p className="text-sm text-slate-600">Share your feedback to help us improve future events.</p>
            </div>
            <Button asChild>
              <Link href={evaluationHref}>Answer evaluation</Link>
            </Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Diocese" value={submission.diocese} />
          <DetailItem label="Parish name" value={submission.parishName} />
          <DetailItem label="Shirt size" value={submission.shirtSize} />
          <DetailItem
            label="Accommodation"
            value={submission.accommodation === "avail" ? "Requested" : "Not requested"}
          />
          <DetailItem label="Day 1 session" value={day1Label} />
          <DetailItem label="Day 2 session" value={day2Label} />
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-[#1a2e5a]">Attendance</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ArrivalStatus label="Day 1 attendance" timestamp={submission.dayOneAttendance} />
            <ArrivalStatus label="Day 2 attendance" timestamp={submission.dayTwoAttendance} />
            <ArrivalStatus label="Day 1 breakout" timestamp={submission.dayOneBreakoutAttendance} />
            <ArrivalStatus label="Day 2 breakout" timestamp={submission.dayTwoBreakoutAttendance} />
          </div>
          <DetailItem label="Kit received" value={submission.kitReceived ? "Yes" : "Not yet"} />
        </div>
      </section>
    </main>
  );
}
