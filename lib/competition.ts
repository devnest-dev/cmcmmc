export const ENTRY_STATUSES = ["visible", "hidden"] as const;

export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export type CompetitionEntry = {
  id: string;
  title: string;
  participantName: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
};

export type CompetitionEntryWithVotes = CompetitionEntry & { voteCount: number };

// Shape sent to guests; `voteCount` is null when an admin has hidden vote counts.
export type PublicCompetitionEntry = CompetitionEntry & { voteCount: number | null };

export const mockCompetitionEntries: CompetitionEntry[] = [
  {
    id: "ENTRY-001",
    title: "Light in the Digital Age",
    participantName: "St. Joseph Parish Youth Ministry",
    description: "A short film on responsible use of social media in evangelization.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    status: "visible",
    createdAt: "2026-08-01T09:00:00+08:00",
    updatedAt: "2026-08-01T09:00:00+08:00",
  },
  {
    id: "ENTRY-002",
    title: "Communion in Community",
    participantName: "University of San Carlos Media Circle",
    description: "Documenting how young Catholics stay connected through digital media.",
    youtubeUrl: "https://youtu.be/jNQXAC9IVRw",
    youtubeVideoId: "jNQXAC9IVRw",
    status: "visible",
    createdAt: "2026-08-02T10:30:00+08:00",
    updatedAt: "2026-08-02T10:30:00+08:00",
  },
];

export function getEntryDisplayName(entry: Pick<CompetitionEntry, "title" | "participantName">) {
  return `${entry.title} — ${entry.participantName}`;
}
