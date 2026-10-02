"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Submission } from "@/lib/admin-submissions";
import { createSubmissionAction } from "@/lib/admin/submissions/actions";

import SubmissionDetailsFields from "../SubmissionDetailsFields";

const NEW_SUBMISSION_DEFAULTS: Partial<Submission> = {
  affiliationType: "parish",
  accommodation: "self",
  paymentMode: "Cash",
};

export default function NewSubmissionForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createSubmissionAction({ status: "idle" }, formData);

      if (result.status === "success" && result.id) {
        toast.success(result.message ?? "Submission added.");
        router.push(`/admin/submissions/${encodeURIComponent(result.id)}`);
        return;
      }

      toast.error(result.message ?? "Failed to create submission.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SubmissionDetailsFields defaults={NEW_SUBMISSION_DEFAULTS} disabled={isPending} />

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Adding..." : "Add entry"}
        </Button>
        <Button asChild type="button" variant="outline" className="flex-1" disabled={isPending}>
          <Link href="/admin">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
