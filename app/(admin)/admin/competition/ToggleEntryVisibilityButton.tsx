"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { setCompetitionEntryStatusAction } from "@/lib/admin/competition/actions";
import type { EntryStatus } from "@/lib/competition";

export default function ToggleEntryVisibilityButton({
  entryId,
  status,
}: {
  entryId: string;
  status: EntryStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const nextStatus: EntryStatus = status === "visible" ? "hidden" : "visible";

  function handleClick() {
    startTransition(async () => {
      const result = await setCompetitionEntryStatusAction(entryId, nextStatus);

      if (result.status === "error") {
        toast.error(result.message ?? "Failed to update entry visibility.");
      } else {
        toast.success(result.message);
        router.refresh();
      }
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? "Saving…" : status === "visible" ? "Hide" : "Unhide"}
    </Button>
  );
}
