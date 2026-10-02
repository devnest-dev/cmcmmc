"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { setShowVoteCountsAction } from "@/lib/admin/competition/actions";

export default function VoteCountsVisibilityToggle({ showVoteCounts }: { showVoteCounts: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(checked: boolean) {
    startTransition(async () => {
      const result = await setShowVoteCountsAction(checked);

      if (result.status === "error") {
        toast.error(result.message ?? "Failed to update vote count visibility.");
      } else {
        toast.success(result.message);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <Switch checked={showVoteCounts} onCheckedChange={handleChange} disabled={isPending} />
      <div>
        <p className="text-sm font-semibold text-[#1a2e5a]">
          Vote counts are currently {showVoteCounts ? "VISIBLE" : "HIDDEN"}
        </p>
        <p className="text-xs text-slate-500">
          Controls whether guests see vote counts and rankings on the voting page.
        </p>
      </div>
    </div>
  );
}
