import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSubmissionDisplayName } from "@/lib/admin-submissions";
import {
  getSubmissionById,
  getSubmissionFileUrl,
} from "@/lib/submissions.server";
import StatusUpdateForm from "./StatusUpdateForm";
import EditableSubmissionDetails from "./EditableSubmissionDetails";

type SubmissionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: SubmissionPageProps): Promise<Metadata> {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    return { title: "Submission not found" };
  }

  return {
    title: `${getSubmissionDisplayName(submission)} | Admin`,
    description: `Review submission ${submission.id}`,
  };
}

function getStatusTone(status: string) {
  if (status === "Verified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Needs review") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const idUploadUrl = await getSubmissionFileUrl(submission.idUploadPath);
  const paymentProofUrl = await getSubmissionFileUrl(submission.paymentProofPath);
  const invoiceUrl = await getSubmissionFileUrl(submission.invoicePath || undefined);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
        <span className="text-sm text-slate-500">
          Submission ID {submission.id}
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <EditableSubmissionDetails
          submission={submission}
          idUploadUrl={idUploadUrl ?? null}
          paymentProofUrl={paymentProofUrl ?? null}
          invoiceUrl={invoiceUrl ?? null}
        />

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">
              Status
            </p>
            <div
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getStatusTone(submission.status)}`}
            >
              {submission.status}
            </div>
          </div>

          <StatusUpdateForm
            submissionId={submission.id}
            currentStatus={submission.status}
            requireInvoice={process.env.SEND_CONFIRMATION_EMAIL === "true"}
          />

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-semibold text-[#1a2e5a]">Review checklist</p>
            <p>Confirm the uploaded ID is readable.</p>
            <p>Confirm the payment proof matches the selected mode.</p>
            <p>Confirm the breakout sessions are still available.</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            <p className="font-semibold text-[#1a2e5a]">Next actions</p>
            <p>
              Use the dashboard list to continue filtering or searching other
              submissions.
            </p>
            <p>Export the dataset when you need a spreadsheet copy.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
