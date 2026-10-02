"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteSubmissionAction } from "@/lib/admin/submissions/actions";

export default function DeleteSubmissionButton({
  submissionId,
}: {
  submissionId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this submission permanently? This cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteSubmissionAction(submissionId);

      if (result.status === "error") {
        toast.error(result.message ?? "Failed to delete submission.");
      } else {
        toast.success("Submission deleted.");
        router.refresh();
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {isPending ? "Deleting…" : "Delete"}
    </Button>
  );
}
