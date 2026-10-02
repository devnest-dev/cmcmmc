import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getShowVoteCounts,
  getVotingStatus,
  listCompetitionEntriesWithVotes,
} from "@/lib/competition.server";
import VotingStatusToggle from "./VotingStatusToggle";
import VoteCountsVisibilityToggle from "./VoteCountsVisibilityToggle";
import ToggleEntryVisibilityButton from "./ToggleEntryVisibilityButton";

export const metadata: Metadata = {
  title: "Video Competition | Admin",
  description: "Manage video competition entries and voting.",
};

export default async function CompetitionAdminPage() {
  const [entries, votingOpen, showVoteCounts] = await Promise.all([
    listCompetitionEntriesWithVotes({ includeHidden: true }),
    getVotingStatus(),
    getShowVoteCounts(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2aadb5]">Protected area</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a] md:text-4xl">Video competition</h1>
        </div>
        <Button asChild>
          <Link href="/admin/competition/new">Add entry</Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <VotingStatusToggle votingOpen={votingOpen} />
        <VoteCountsVisibilityToggle showVoteCounts={showVoteCounts} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entry</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium text-[#1a2e5a]">{entry.title}</TableCell>
                  <TableCell>{entry.participantName}</TableCell>
                  <TableCell>{entry.voteCount}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === "visible" ? "default" : "secondary"}>
                      {entry.status === "visible" ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/competition/${encodeURIComponent(entry.id)}`}>Edit</Link>
                      </Button>
                      <ToggleEntryVisibilityButton entryId={entry.id} status={entry.status} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                  No entries yet. Add the first entry to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
