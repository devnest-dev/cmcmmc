"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { setVotingOpenAction } from "@/lib/admin/competition/actions";

export default function VotingStatusToggle({ votingOpen }: { votingOpen: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(checked: boolean) {
    startTransition(async () => {
      const result = await setVotingOpenAction(checked);

      if (result.status === "error") {
        toast.error(result.message ?? "Failed to update voting status.");
      } else {
        toast.success(result.message);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <Switch checked={votingOpen} onCheckedChange={handleChange} disabled={isPending} />
      <div>
        <p className="text-sm font-semibold text-[#1a2e5a]">
          Voting is currently {votingOpen ? "OPEN" : "CLOSED"}
        </p>
        <p className="text-xs text-slate-500">
          Guests can only submit votes while this is toggled on.
        </p>
      </div>
    </div>
  );
}
