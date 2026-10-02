import "server-only";

import { cookies } from "next/headers";
import { createHmac, randomUUID } from "crypto";

import { createClient } from "@/lib/supabase.server";
import { getCompetitionEntryById, getVotingStatus } from "@/lib/competition.server";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashVoterEmail(email: string) {
  const secret = process.env.VOTE_EMAIL_HASH_SECRET;

  if (!secret) {
    console.error(
      "VOTE_EMAIL_HASH_SECRET is not set; using an insecure development fallback.",
    );
  }

  return createHmac("sha256", secret || "dev-insecure-default-secret")
    .update(normalizeEmail(email))
    .digest("hex");
}

export type RecordVoteReason = "voting_closed" | "entry_not_found" | "already_voted";

export type RecordVoteResult =
  | { ok: true; entryId: string }
  | { ok: false; reason: RecordVoteReason };

// In-memory fallback used only when Supabase env vars are absent (local dev).
// Resets on every dev-server restart, same as mockCompetitionEntries.
const mockVotes: { id: string; entryId: string; voterEmailHash: string }[] = [];

/**
 * Records a vote for an email that Google has already verified (via the
 * `/api/auth/google/*` OAuth flow) -- no OTP/code step here. The unique
 * constraint on `voter_email_hash` is the actual one-vote-per-person
 * guarantee; this reuses the exact same hash function the old email-OTP flow
 * used, so it stays compatible with any votes already recorded that way.
 */
export async function recordVerifiedVote(input: {
  entryId: string;
  email: string;
}): Promise<RecordVoteResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const votingOpen = await getVotingStatus();
  if (!votingOpen) {
    return { ok: false, reason: "voting_closed" };
  }

  const entry = await getCompetitionEntryById(input.entryId);
  if (!entry || entry.status !== "visible") {
    return { ok: false, reason: "entry_not_found" };
  }

  const emailHash = hashVoterEmail(input.email);

  if (!supabase) {
    if (mockVotes.some((vote) => vote.voterEmailHash === emailHash)) {
      return { ok: false, reason: "already_voted" };
    }

    mockVotes.push({ id: randomUUID(), entryId: entry.id, voterEmailHash: emailHash });
    return { ok: true, entryId: entry.id };
  }

  const { error } = await supabase.from("competition_votes").insert({
    entry_id: entry.id,
    voter_email_hash: emailHash,
  });

  if (error) {
    // Unique-violation on voter_email_hash is the real one-vote-per-person
    // guard -- treat it as already_voted rather than a generic failure.
    if (error.code === "23505") {
      return { ok: false, reason: "already_voted" };
    }

    throw new Error(error.message);
  }

  return { ok: true, entryId: entry.id };
}
