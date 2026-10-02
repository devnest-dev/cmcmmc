import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import EntryForm from "../EntryForm";

export const metadata: Metadata = {
  title: "Add Entry | Admin",
};

export default function NewCompetitionEntryPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/admin/competition">Back to competition</Link>
        </Button>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-[#1a2e5a]">Add entry</h1>

      <EntryForm mode="create" />
    </main>
  );
}
