"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { setEvaluationOpenAction } from "@/lib/admin/evaluation/actions";
import type { EvaluationStatus } from "@/lib/evaluation";

export default function EvaluationStatusToggle({ status }: { status: EvaluationStatus }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const cutoff = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(status.closesAt));
  const pastCutoff = status.open && !status.isAcceptingResponses;

  function handleChange(checked: boolean) {
    startTransition(async () => {
      const result = await setEvaluationOpenAction(checked);

      if (result.status === "error") {
        toast.error(result.message ?? "Failed to update evaluation status.");
      } else {
        toast.success(result.message);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <Switch checked={status.open} onCheckedChange={handleChange} disabled={isPending} />
      <div>
        <p className="text-sm font-semibold text-[#1a2e5a]">
          Evaluation form is currently {status.isAcceptingResponses ? "OPEN" : "CLOSED"}
        </p>
        <p className="text-xs text-slate-500">
          {pastCutoff
            ? `Toggled on, but the cutoff (${cutoff}) has passed.`
            : `Guests can only submit while this is toggled on, until ${cutoff}.`}
        </p>
      </div>
    </div>
  );
}
