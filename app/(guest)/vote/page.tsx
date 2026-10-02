import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";

import {
  getShowVoteCounts,
  getVotingStatus,
  listPublicCompetitionEntries,
} from "@/lib/competition.server";
import VoteGallery from "./VoteGallery";
import VoteStatusToast from "./VoteStatusToast";

export const metadata: Metadata = {
  title: "Video Competition Voting",
  description: "Vote for your favorite video competition entry.",
};

export default async function VotePage() {
  const [entries, votingOpen, showVoteCounts, cookieStore] = await Promise.all([
    listPublicCompetitionEntries(),
    getVotingStatus(),
    getShowVoteCounts(),
    cookies(),
  ]);

  const hasVoted = Boolean(cookieStore.get("cmcmmc-voted")?.value);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_45%,#f8fbff_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <VoteStatusToast />
      </Suspense>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Video Competition</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">Cast your vote</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Watch each submission and vote for your favorite. Sign in with Google to confirm it&apos;s really
            you — we never see your password, and nothing gets emailed.
          </p>
          {!votingOpen && (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              Voting is currently closed. Please check back later.
            </p>
          )}
          {!showVoteCounts && (
            <div className="mx-auto mt-4 max-w-md rounded-xl border border-[#2aadb5]/30 bg-[#2aadb5]/10 px-4 py-3 text-sm text-[#1a2e5a]">
              <p className="font-semibold">
                The number of votes is now hidden to keep the excitement and suspense alive!
              </p>
              <p className="mt-1">Voting ends on October 2, 2026 (Friday) at 11:59 PM.</p>
            </div>
          )}
        </div>

        <VoteGallery initialEntries={entries} votingOpen={votingOpen} hasVoted={hasVoted} />
      </div>
    </main>
  );
}
