import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSubmissionDisplayName } from "@/lib/admin-submissions";
import { getEvaluationStatus } from "@/lib/evaluation.server";
import { getSubmissionById } from "@/lib/submissions.server";
import EvaluationForm from "../EvaluationForm";
import EvaluationShell from "../EvaluationShell";

export const metadata: Metadata = {
  title: "Evaluation Form",
  description: "Share your feedback on the 2nd Cebu Metropolitan Catholic Mass Media Congress.",
};

type ParticipantEvaluationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ParticipantEvaluationPage({ params }: ParticipantEvaluationPageProps) {
  const { id } = await params;
  const [submission, status] = await Promise.all([getSubmissionById(id), getEvaluationStatus()]);

  if (!submission) {
    notFound();
  }

  return (
    <EvaluationShell
      status={status}
      banner={
        <div className="rounded-2xl border border-[#1a2e5a]/15 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Evaluating as</p>
          <p className="mt-1 text-lg font-semibold text-[#1a2e5a]">{getSubmissionDisplayName(submission)}</p>
        </div>
      }
    >
      <EvaluationForm source="qr" submissionId={submission.id} />
    </EvaluationShell>
  );
}
