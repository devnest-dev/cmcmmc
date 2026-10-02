import type { Metadata } from "next";

import { isWalkInOpen } from "@/lib/registration-status";
import { getBreakoutSessionCounts } from "@/lib/submissions.server";
import WalkInForm from "./WalkInForm";

// Session counts and the open/closed flag must be read on every request so
// full breakout sessions are grayed out with up-to-date numbers.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Walk-in Registration",
  description: "On-site walk-in registration for the Cebu Metropolitan Catholic Mass Media Congress.",
  robots: { index: false, follow: false },
};

export default async function WalkInPage() {
  if (!isWalkInOpen()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-[#1a2e5a]">
          Walk-in registration is not open.
        </h1>
      </main>
    );
  }

  const { day1Counts, day2Counts, limit } = await getBreakoutSessionCounts();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_45%,#f8fbff_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Walk-in</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">
            2nd CM-CMMC Walk-in Registration
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Fill in your details, then proceed to the cashier to pay and have your registration verified.
          </p>
        </div>

        <WalkInForm counts={{ day1Counts, day2Counts, limit }} />
      </div>
    </main>
  );
}
