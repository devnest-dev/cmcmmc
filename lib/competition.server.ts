import "server-only";

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import {
  mockCompetitionEntries,
  type CompetitionEntry,
  type CompetitionEntryWithVotes,
  type EntryStatus,
  type PublicCompetitionEntry,
} from "@/lib/competition";
import { createClient } from "@/lib/supabase.server";

type EntryRow = {
  id: string;
  title: string;
  participant_name: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  status: EntryStatus;
  created_at: string;
  updated_at: string;
};

export type CompetitionEntryInput = {
  title: string;
  participantName: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
};

function mapRowToEntry(row: EntryRow): CompetitionEntry {
  return {
    id: row.id,
    title: row.title,
    participantName: row.participant_name,
    description: row.description,
    youtubeUrl: row.youtube_url,
    youtubeVideoId: row.youtube_video_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCompetitionEntries(
  opts: { includeHidden?: boolean } = {},
): Promise<CompetitionEntry[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return opts.includeHidden
      ? mockCompetitionEntries
      : mockCompetitionEntries.filter((entry) => entry.status === "visible");
  }

  let queryBuilder = supabase.from("competition_entries").select("*");

  if (!opts.includeHidden) {
    queryBuilder = queryBuilder.eq("status", "visible");
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapRowToEntry(row as EntryRow));
}

export async function listCompetitionEntriesWithVotes(
  opts: { includeHidden?: boolean } = {},
): Promise<CompetitionEntryWithVotes[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const entries = await listCompetitionEntries(opts);

  if (!supabase) {
    return entries.map((entry) => ({ ...entry, voteCount: 0 }));
  }

  // Count per entry in the database (head-only, no rows returned). Fetching
  // vote rows and tallying them here silently truncates at PostgREST's
  // max-rows cap (1000 by default), zeroing out entries past the cutoff.
  const withVotes = await Promise.all(
    entries.map(async (entry) => {
      const { count, error } = await supabase
        .from("competition_votes")
        .select("*", { count: "exact", head: true })
        .eq("entry_id", entry.id);

      if (error) {
        throw new Error(error.message);
      }

      return { ...entry, voteCount: count ?? 0 };
    }),
  );

  return withVotes.sort((a, b) => b.voteCount - a.voteCount);
}

export async function getCompetitionEntryById(id: string): Promise<CompetitionEntry | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockCompetitionEntries.find((entry) => entry.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToEntry(data as EntryRow) : null;
}

export async function createCompetitionEntry(
  input: CompetitionEntryInput,
): Promise<CompetitionEntry> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const now = new Date().toISOString();
    const entry: CompetitionEntry = {
      id: randomUUID(),
      title: input.title,
      participantName: input.participantName,
      description: input.description,
      youtubeUrl: input.youtubeUrl,
      youtubeVideoId: input.youtubeVideoId,
      status: "visible",
      createdAt: now,
      updatedAt: now,
    };
    mockCompetitionEntries.push(entry);
    return entry;
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .insert({
      title: input.title,
      participant_name: input.participantName,
      description: input.description,
      youtube_url: input.youtubeUrl,
      youtube_video_id: input.youtubeVideoId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToEntry(data as EntryRow);
}

export async function updateCompetitionEntry(
  id: string,
  input: CompetitionEntryInput,
): Promise<CompetitionEntry | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const entry = mockCompetitionEntries.find((item) => item.id === id);

    if (!entry) {
      return null;
    }

    entry.title = input.title;
    entry.participantName = input.participantName;
    entry.description = input.description;
    entry.youtubeUrl = input.youtubeUrl;
    entry.youtubeVideoId = input.youtubeVideoId;
    entry.updatedAt = new Date().toISOString();
    return entry;
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .update({
      title: input.title,
      participant_name: input.participantName,
      description: input.description,
      youtube_url: input.youtubeUrl,
      youtube_video_id: input.youtubeVideoId,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToEntry(data as EntryRow) : null;
}

export async function setCompetitionEntryStatus(
  id: string,
  status: EntryStatus,
): Promise<CompetitionEntry | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const entry = mockCompetitionEntries.find((item) => item.id === id);

    if (!entry) {
      return null;
    }

    entry.status = status;
    entry.updatedAt = new Date().toISOString();
    return entry;
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToEntry(data as EntryRow) : null;
}

let mockVotingOpen = false;

export async function getVotingStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockVotingOpen;
  }

  const { data, error } = await supabase
    .from("competition_settings")
    .select("voting_open")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as { voting_open: boolean } | null)?.voting_open ?? false;
}

export async function setVotingStatus(open: boolean): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    mockVotingOpen = open;
    return;
  }

  const { error } = await supabase
    .from("competition_settings")
    .update({ voting_open: open })
    .eq("id", true);

  if (error) {
    throw new Error(error.message);
  }
}

let mockShowVoteCounts = true;

export async function getShowVoteCounts(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockShowVoteCounts;
  }

  const { data, error } = await supabase
    .from("competition_settings")
    .select("show_vote_counts")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as { show_vote_counts: boolean } | null)?.show_vote_counts ?? true;
}

export async function setShowVoteCounts(show: boolean): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    mockShowVoteCounts = show;
    return;
  }

  const { error } = await supabase
    .from("competition_settings")
    .update({ show_vote_counts: show })
    .eq("id", true);

  if (error) {
    throw new Error(error.message);
  }
}

// Visible entries for guests. When vote counts are hidden, counts are stripped
// server-side and entries keep their default (newest-first) order so the
// ranking isn't leaked either.
export async function listPublicCompetitionEntries(): Promise<PublicCompetitionEntry[]> {
  if (!(await getShowVoteCounts())) {
    const entries = await listCompetitionEntries();
    return entries.map((entry) => ({ ...entry, voteCount: null }));
  }

  return listCompetitionEntriesWithVotes();
}
