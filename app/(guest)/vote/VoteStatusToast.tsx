"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const ERROR_MESSAGES: Record<string, string> = {
  voting_closed: "Voting is currently closed.",
  entry_not_found: "This entry is no longer available.",
  already_voted: "That Google account has already voted. Only one vote is allowed per person.",
  invalid_state: "Your sign-in session expired. Please try again.",
  google_error: "We couldn't verify your Google sign-in. Please try again.",
  oauth_cancelled: "Sign-in was cancelled.",
};

export default function VoteStatusToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const voted = searchParams.get("voted");
    const error = searchParams.get("error");

    if (voted) {
      toast.success("Your vote has been recorded. Thank you!");
    } else if (error) {
      toast.error(ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.");
    }

    if (voted || error) {
      router.replace("/vote");
    }
    // Runs once on mount to show a one-time toast for the OAuth redirect result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
