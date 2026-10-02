import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSubmissionDate } from "@/lib/admin-submissions";
import { formatAverage } from "@/lib/evaluation";
import {
  getEvaluationStatus,
  getEvaluationSummary,
  listEvaluationsPage,
} from "@/lib/evaluation.server";
import EvaluationStatusToggle from "./EvaluationStatusToggle";
import EvaluationSummaryView from "./EvaluationSummaryView";

export const metadata: Metadata = {
  title: "Evaluations | Admin",
  description: "Review participant evaluation responses.",
};

const PAGE_SIZE = 25;

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#1a2e5a]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

type EvaluationsAdminPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function EvaluationsAdminPage({ searchParams }: EvaluationsAdminPageProps) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const [status, summary, pageResult] = await Promise.all([
    getEvaluationStatus(),
    getEvaluationSummary(),
    listEvaluationsPage({ page: requestedPage, pageSize: PAGE_SIZE }),
  ]);

  const { evaluations, total, page } = pageResult;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2aadb5]">Protected area</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">Evaluations</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/evaluations/export" prefetch={false}>Export CSV</Link>
        </Button>
      </div>

      <EvaluationStatusToggle status={status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total responses" value={String(summary.totalResponses)} hint="All evaluation submissions" />
        <StatCard
          label="Via QR / Public"
          value={`${summary.qrResponses} / ${summary.publicResponses}`}
          hint="Linked to a registration vs. public form"
        />
        <StatCard
          label="Certificate requests"
          value={String(summary.certificateRequests)}
          hint="Respondents who asked for a certificate"
        />
        <StatCard
          label="Overall average"
          value={formatAverage(summary.overallAverage)}
          hint="Across all 25 rated statements (1–4)"
        />
      </div>

      <EvaluationSummaryView summary={summary} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a2e5a]">Responses</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Attended Day 1 &amp; 2</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.length > 0 ? (
                evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="whitespace-nowrap">{formatSubmissionDate(evaluation.createdAt)}</TableCell>
                    <TableCell className="font-medium text-[#1a2e5a]">{evaluation.fullName}</TableCell>
                    <TableCell>{evaluation.email}</TableCell>
                    <TableCell>
                      <Badge variant={evaluation.source === "qr" ? "default" : "secondary"}>
                        {evaluation.source === "qr" ? "QR" : "Public"}
                      </Badge>
                    </TableCell>
                    <TableCell>{evaluation.certificateRequested ? "Requested" : "—"}</TableCell>
                    <TableCell>
                      {evaluation.attendedBothDays === null ? "—" : evaluation.attendedBothDays ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/evaluations/${encodeURIComponent(evaluation.id)}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    No evaluations yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/evaluations?page=${page - 1}`}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
              )}
              {page < totalPages ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/evaluations?page=${page + 1}`}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
