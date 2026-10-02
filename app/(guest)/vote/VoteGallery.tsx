"use client";

import { useEffect, useState } from "react";

import type { PublicCompetitionEntry } from "@/lib/competition";
import EntryCard from "./EntryCard";
import VoteDialog from "./VoteDialog";

const POLL_INTERVAL_MS = 15_000;

export default function VoteGallery({
  initialEntries,
  votingOpen,
  hasVoted,
}: {
  initialEntries: PublicCompetitionEntry[];
  votingOpen: boolean;
  hasVoted: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Results are final once voting closes, so the server-rendered entries are enough.
    if (!votingOpen) {
      return;
    }

    let inFlight = false;

    async function refreshResults() {
      if (inFlight || document.hidden) {
        return;
      }

      inFlight = true;

      try {
        const response = await fetch("/api/vote/results");
        const result = (await response.json()) as { ok: boolean; entries?: PublicCompetitionEntry[] };

        if (result.ok && result.entries) {
          setEntries(result.entries);
        }
      } catch {
        // Silently ignore polling failures; the next interval will retry.
      } finally {
        inFlight = false;
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        refreshResults();
      }
    }

    const interval = window.setInterval(refreshResults, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [votingOpen]);

  const activeEntry = entries.find((entry) => entry.id === activeEntryId) ?? null;

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        No entries have been published yet. Check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {entries.map((entry, index) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            rank={index + 1}
            votingOpen={votingOpen}
            onVoteClick={() => setActiveEntryId(entry.id)}
          />
        ))}
      </div>

      {activeEntry && (
        <VoteDialog
          entry={activeEntry}
          open={Boolean(activeEntry)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveEntryId(null);
            }
          }}
          hasVoted={hasVoted}
        />
      )}
    </>
  );
}
