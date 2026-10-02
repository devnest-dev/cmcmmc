import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSubmissionDate } from "@/lib/admin-submissions";
import { EVALUATION_SECTIONS, OPEN_QUESTIONS } from "@/lib/evaluation";
import { getEvaluationById } from "@/lib/evaluation.server";

export const metadata: Metadata = {
  title: "Evaluation Response | Admin",
  description: "Review a participant evaluation response.",
};

type EvaluationDetailPageProps = {
  params: Promise<{ id: string }>;
};

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="mt-2 text-sm font-medium text-slate-700">{value || "—"}</div>
    </div>
  );
}

export default async function EvaluationDetailPage({ params }: EvaluationDetailPageProps) {
  const { id } = await params;
  const evaluation = await getEvaluationById(id);

  if (!evaluation) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2aadb5]">Evaluation response</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a]">{evaluation.fullName}</h1>
          <p className="mt-2 text-sm text-slate-500">Submitted {formatSubmissionDate(evaluation.createdAt)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/evaluations">Back to evaluations</Link>
        </Button>
      </div>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <DetailItem
          label="Source"
          value={
            <Badge variant={evaluation.source === "qr" ? "default" : "secondary"}>
              {evaluation.source === "qr" ? "QR" : "Public"}
            </Badge>
          }
        />
        <DetailItem
          label="Registration"
          value={
            evaluation.submissionId ? (
              <Link
                href={`/admin/submissions/${encodeURIComponent(evaluation.submissionId)}`}
                className="text-[#2aadb5] underline-offset-4 hover:underline"
              >
                View registration
              </Link>
            ) : (
              "Not linked"
            )
          }
        />
        <DetailItem label="Email" value={evaluation.email} />
        <DetailItem label="Arch/diocese" value={evaluation.archdiocese} />
        <DetailItem label="Parish / institution" value={evaluation.parishName} />
        <DetailItem label="Parish / institution address" value={evaluation.parishAddress} />
        <DetailItem label="Certificate" value={evaluation.certificateRequested ? "Requested" : "Not requested"} />
        <DetailItem
          label="Attended Day 1 & 2"
          value={evaluation.attendedBothDays === null ? "Not linked" : evaluation.attendedBothDays ? "Yes" : "No"}
        />
      </section>

      {EVALUATION_SECTIONS.map((section) => (
        <section key={section.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1a2e5a]">{section.title}</h2>
          <ul className="divide-y divide-slate-100">
            {section.questions.map((question) => (
              <li key={question.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                <span className="text-slate-600">
                  {question.id.slice(1)}. {question.text}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2e5a] font-semibold text-white">
                  {evaluation.ratings[question.id] ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a2e5a]">Thoughts about the Congress</h2>
        {OPEN_QUESTIONS.map((question) => (
          <div key={question.key}>
            <p className="text-sm font-semibold text-slate-700">{question.label}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{evaluation[question.key] || "—"}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
