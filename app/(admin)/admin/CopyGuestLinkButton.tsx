"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buildCheckinUrl } from "@/lib/checkin";

export default function CopyGuestLinkButton({
  submissionId,
}: {
  submissionId: string;
  displayName: string;
}) {
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(buildCheckinUrl(submissionId));
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Failed to copy link.");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      Copy Link
    </Button>
  );
}
