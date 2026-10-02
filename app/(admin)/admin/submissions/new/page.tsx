import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import NewSubmissionForm from "./NewSubmissionForm";

export const metadata: Metadata = {
  title: "Add entry | Admin",
  description: "Manually add a registration submission.",
};

export default function NewSubmissionPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>

      <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Add entry</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a]">New submission</h1>
          <p className="mt-2 text-sm text-slate-500">
            Entries added here are marked as Admin and start as Pending. ID and payment proof uploads are left empty.
          </p>
        </div>

        <NewSubmissionForm />
      </div>
    </main>
  );
}
