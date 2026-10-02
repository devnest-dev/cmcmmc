import type { Metadata } from "next";

import AdminDashboard from "./AdminDashboard";
import {
  getSubmissionStats,
  listSubmissionsPage,
  type SubmissionSortKey,
} from "@/lib/submissions.server";
import { PAYMENT_MODES, SUBMISSION_SOURCES, type Submission } from "@/lib/admin-submissions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Review and export registration submissions.",
};

const SORT_KEYS: SubmissionSortKey[] = [
  "name",
  "affiliation",
  "organization",
  "payment",
  "status",
  "submitted",
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Math.max(1, Number(firstValue(params.page)) || 1);
  const query = firstValue(params.q) ?? "";
  const affiliationParam = firstValue(params.affiliation);
  const affiliation =
    (["parish", "school", "neither"] as const).find((value) => value === affiliationParam) ?? "all";
  const paymentModeParam = firstValue(params.payment);
  const paymentMode = PAYMENT_MODES.find((value) => value === paymentModeParam) ?? "all";
  const sourceParam = firstValue(params.source);
  const source = SUBMISSION_SOURCES.find((value) => value === sourceParam) ?? "all";
  const sortParam = firstValue(params.sort);
  const sortKey = SORT_KEYS.find((value) => value === sortParam) ?? "submitted";
  const sortDir = firstValue(params.dir) === "asc" ? "asc" : "desc";
  const pageSize = 25;

  const [{ submissions, total }, stats] = await Promise.all([
    listSubmissionsPage({ page, pageSize, query, affiliation, paymentMode, source, sortKey, sortDir }),
    getSubmissionStats(),
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef4ff_45%,#f8fbff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2aadb5]">Protected area</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">Submission dashboard</h1>
        </div>

        <AdminDashboard
          submissions={submissions as Submission[]}
          stats={stats}
          total={total}
          page={page}
          pageSize={pageSize}
          query={query}
          affiliation={affiliation}
          paymentMode={paymentMode}
          source={source}
          sortKey={sortKey}
          sortDir={sortDir}
        />
      </div>
    </main>
  );
}
