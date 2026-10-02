"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  SUBMISSION_STATUSES,
  type SubmissionStatus,
} from "@/lib/admin-submissions";
import { updateSubmissionStatusAction } from "@/lib/admin/submissions/actions";

type StatusUpdateFormProps = {
  submissionId: string;
  currentStatus: SubmissionStatus;
  requireInvoice: boolean;
};

export default function StatusUpdateForm({
  submissionId,
  currentStatus,
  requireInvoice,
}: StatusUpdateFormProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus>(currentStatus);
  const [state, formAction, isPending] = useActionState(
    updateSubmissionStatusAction,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      router.refresh();
      return;
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [router, state]);

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <p className="text-sm font-semibold text-[#1a2e5a]">Update status</p>
      <input type="hidden" name="id" value={submissionId} />
      <select
        name="status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as SubmissionStatus)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        disabled={isPending}
      >
        {SUBMISSION_STATUSES.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
      {requireInvoice && selectedStatus === "Verified" && (
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Invoice PDF
          </label>
          <input
            type="file"
            name="invoice"
            accept="application/pdf"
            required
            disabled={isPending}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Save status"}
      </Button>
    </form>
  );
}
