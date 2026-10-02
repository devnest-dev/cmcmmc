"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PublicCompetitionEntry } from "@/lib/competition";

export default function VoteDialog({
  entry,
  open,
  onOpenChange,
  hasVoted,
}: {
  entry: PublicCompetitionEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasVoted: boolean;
}) {
  const startUrl = `/api/auth/google/start?entryId=${encodeURIComponent(entry.id)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Vote for &quot;{entry.title}&quot;</DialogTitle>
        <DialogDescription>
          {hasVoted
            ? "You've already voted in this competition. If this isn't you, sign in with a different Google account to vote."
            : "Sign in with your Google account to confirm your vote — this makes sure each person can only vote once, without emailing you anything."}
        </DialogDescription>
        <DialogFooter>
          {/* Plain <a>, not next/link's Link -- this must be a real browser
              navigation so the redirect chain out to Google and back works. */}
          <Button asChild>
            <a href={startUrl}>{hasVoted ? "Continue with a different account" : "Continue with Google"}</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
