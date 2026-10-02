"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteSubmissionButton from "./DeleteSubmissionButton";
import CopyGuestLinkButton from "./CopyGuestLinkButton";
import {
  PAYMENT_MODES,
  formatSubmissionDate,
  getAffiliationLabel,
  getSubmissionDisplayName,
  getSubmissionOrganization,
  type Submission,
} from "@/lib/admin-submissions";
import type { SubmissionSortKey, SubmissionStats } from "@/lib/submissions.server";

type FilterValue = "all" | Submission["affiliationType"];
type PaymentFilterValue = "all" | Submission["paymentMode"];
type SourceFilterValue = "all" | Submission["source"];
type SortDir = "asc" | "desc";

type AdminDashboardProps = {
  submissions: Submission[];
  stats: SubmissionStats;
  total: number;
  page: number;
  pageSize: number;
  query: string;
  affiliation: FilterValue;
  paymentMode: PaymentFilterValue;
  source: SourceFilterValue;
  sortKey: SubmissionSortKey;
  sortDir: SortDir;
};

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#1a2e5a]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Submission["status"] }) {
  const tone =
    status === "Verified"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Needs review"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function SortableHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SubmissionSortKey;
  active: SubmissionSortKey;
  dir: SortDir;
  onSort: (key: SubmissionSortKey) => void;
}) {
  const isActive = active === sortKey;
  return (
    <th
      className="cursor-pointer select-none px-4 py-3"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-slate-400">
          {isActive ? (dir === "asc" ? "↑" : "↓") : <span className="opacity-30">↕</span>}
        </span>
      </span>
    </th>
  );
}

export default function AdminDashboard({
  submissions,
  stats,
  total,
  page,
  pageSize,
  query,
  affiliation,
  paymentMode,
  source,
  sortKey,
  sortDir,
}: AdminDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [queryInput, setQueryInput] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setQueryInput(query);
  }

  function navigate(overrides: {
    q?: string;
    affiliation?: FilterValue;
    payment?: PaymentFilterValue;
    source?: SourceFilterValue;
    sort?: SubmissionSortKey;
    dir?: SortDir;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const nextQuery = overrides.q ?? query;
    const nextAffiliation = overrides.affiliation ?? affiliation;
    const nextPayment = overrides.payment ?? paymentMode;
    const nextSource = overrides.source ?? source;
    const nextSort = overrides.sort ?? sortKey;
    const nextDir = overrides.dir ?? sortDir;
    const nextPage = overrides.page ?? page;

    if (nextQuery.trim().length > 0) params.set("q", nextQuery.trim());
    if (nextAffiliation !== "all") params.set("affiliation", nextAffiliation);
    if (nextPayment !== "all") params.set("payment", nextPayment);
    if (nextSource !== "all") params.set("source", nextSource);
    if (nextSort !== "submitted") params.set("sort", nextSort);
    if (nextDir !== "desc") params.set("dir", nextDir);
    if (nextPage !== 1) params.set("page", String(nextPage));

    const queryString = params.toString();
    router.push(queryString.length > 0 ? `${pathname}?${queryString}` : pathname);
  }

  function handleQueryChange(value: string) {
    setQueryInput(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      navigate({ q: value, page: 1 });
    }, 400);
  }

  function handleSort(key: SubmissionSortKey) {
    if (key === sortKey) {
      navigate({ sort: key, dir: sortDir === "asc" ? "desc" : "asc", page: 1 });
    } else {
      navigate({ sort: key, dir: "asc", page: 1 });
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total submissions" value={String(stats.total)} hint="All records currently in the dashboard" />
        <StatCard label="Verified" value={String(stats.verified)} hint="Payments or records already cleared" />
        <StatCard label="Pending" value={String(stats.pending)} hint="Awaiting review or confirmation" />
        <StatCard
          label="Accommodation requests"
          value={String(stats.accommodationRequests)}
          hint="Participants requesting the free accommodation"
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Submissions</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1a2e5a]">Review registration records</h2>
            <p className="mt-2 text-sm text-slate-600">
              Search the current submissions, filter by affiliation or payment mode, and jump into a detail view for a full record.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/submissions/new">Add entry</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/export">Export CSV</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <Input
            placeholder="Search by name, email, or organization"
            value={queryInput}
            onChange={(event) => handleQueryChange(event.target.value)}
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={affiliation}
            onChange={(event) => navigate({ affiliation: event.target.value as FilterValue, page: 1 })}
          >
            <option value="all">All affiliations</option>
            <option value="parish">Parish</option>
            <option value="school">School</option>
            <option value="neither">Neither</option>
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={paymentMode}
            onChange={(event) => navigate({ payment: event.target.value as PaymentFilterValue, page: 1 })}
          >
            <option value="all">All payment modes</option>
            {PAYMENT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={source}
            onChange={(event) => navigate({ source: event.target.value as SourceFilterValue, page: 1 })}
          >
            <option value="all">All sources</option>
            <option value="online">Online</option>
            <option value="walk_in">Walk-in</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <SortableHeader label="Submission" sortKey="name" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Affiliation" sortKey="affiliation" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Organization" sortKey="organization" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Payment" sortKey="payment" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Status" sortKey="status" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Submitted" sortKey="submitted" active={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <tr key={submission.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#1a2e5a]">
                          {getSubmissionDisplayName(submission)}
                          {submission.source === "walk_in" && (
                            <span className="ml-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                              Walk-in
                            </span>
                          )}
                          {submission.source === "admin" && (
                            <span className="ml-2 inline-flex rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{submission.id}</div>
                        <div className="mt-1 text-xs text-slate-500">{submission.email}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{getAffiliationLabel(submission.affiliationType)}</td>
                      <td className="px-4 py-4 text-slate-600">{getSubmissionOrganization(submission)}</td>
                      <td className="px-4 py-4 text-slate-600">{submission.paymentMode}</td>
                      <td className="px-4 py-4"><StatusPill status={submission.status} /></td>
                      <td className="px-4 py-4 text-slate-600">{formatSubmissionDate(submission.submittedAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/submissions/${encodeURIComponent(submission.id)}`}>View</Link>
                          </Button>
                          <CopyGuestLinkButton
                            submissionId={submission.id}
                            displayName={getSubmissionDisplayName(submission)}
                          />
                          <DeleteSubmissionButton submissionId={submission.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={7}>
                      No submissions match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {total === 0 ? "No results" : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => navigate({ page: page - 1 })}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => navigate({ page: page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
