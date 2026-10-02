import { NextResponse } from "next/server";

import { getCompetitionEntryById, getVotingStatus } from "@/lib/competition.server";
import { buildGoogleAuthUrl, generateNonce, signState } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entryId = url.searchParams.get("entryId")?.trim();
  const voteUrl = new URL("/vote", url.origin);

  if (!entryId) {
    voteUrl.searchParams.set("error", "entry_not_found");
    return NextResponse.redirect(voteUrl);
  }

  const votingOpen = await getVotingStatus();
  if (!votingOpen) {
    voteUrl.searchParams.set("error", "voting_closed");
    return NextResponse.redirect(voteUrl);
  }

  const entry = await getCompetitionEntryById(entryId);
  if (!entry || entry.status !== "visible") {
    voteUrl.searchParams.set("error", "entry_not_found");
    return NextResponse.redirect(voteUrl);
  }

  const nonce = generateNonce();
  const state = await signState({ entryId, nonce });

  return NextResponse.redirect(buildGoogleAuthUrl({ state, nonce }));
}
