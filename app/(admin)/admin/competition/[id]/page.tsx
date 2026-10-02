import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getCompetitionEntryById } from "@/lib/competition.server";
import EntryForm from "../EntryForm";

type EditEntryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditEntryPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await getCompetitionEntryById(id);

  return { title: entry ? `Edit ${entry.title} | Admin` : "Entry not found" };
}

export default async function EditCompetitionEntryPage({ params }: EditEntryPageProps) {
  const { id } = await params;
  const entry = await getCompetitionEntryById(id);

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/admin/competition">Back to competition</Link>
        </Button>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-[#1a2e5a]">Edit entry</h1>

      <EntryForm mode="edit" entry={entry} />
    </main>
  );
}
