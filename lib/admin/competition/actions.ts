"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminSessionActive } from "@/lib/auth/session";
import { parseYoutubeVideoId } from "@/lib/youtube";
import type { EntryStatus } from "@/lib/competition";
import {
  createCompetitionEntry,
  setCompetitionEntryStatus,
  setShowVoteCounts,
  setVotingStatus,
  updateCompetitionEntry,
} from "@/lib/competition.server";

export type EntryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function buildEntryInput(formData: FormData) {
  const title = getString(formData, "title");
  const participantName = getString(formData, "participantName");
  const description = getString(formData, "description");
  const youtubeUrl = getString(formData, "youtubeUrl");

  if (!title || !participantName || !youtubeUrl) {
    return { error: "Please fill in the title, participant name, and YouTube URL." } as const;
  }

  const youtubeVideoId = parseYoutubeVideoId(youtubeUrl);

  if (!youtubeVideoId) {
    return {
      error: "Could not parse a YouTube video ID from this URL. Check the link and try again.",
    } as const;
  }

  return {
    input: { title, participantName, description, youtubeUrl, youtubeVideoId },
  } as const;
}

export async function createCompetitionEntryAction(
  _previousState: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const result = buildEntryInput(formData);

  if ("error" in result) {
    return { status: "error", message: result.error };
  }

  try {
    await createCompetitionEntry(result.input);
  } catch {
    return { status: "error", message: "Failed to create entry. Please try again." };
  }

  revalidatePath("/admin/competition");
  revalidatePath("/vote");

  return { status: "success", message: "Entry created." };
}

export async function updateCompetitionEntryAction(
  _previousState: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const id = getString(formData, "id");

  if (!id) {
    return { status: "error", message: "Missing entry ID." };
  }

  const result = buildEntryInput(formData);

  if ("error" in result) {
    return { status: "error", message: result.error };
  }

  let updated;
  try {
    updated = await updateCompetitionEntry(id, result.input);
  } catch {
    return { status: "error", message: "Failed to update entry. Please try again." };
  }

  if (!updated) {
    return { status: "error", message: "Entry not found." };
  }

  revalidatePath("/admin/competition");
  revalidatePath(`/admin/competition/${id}`);
  revalidatePath("/vote");

  return { status: "success", message: "Entry updated." };
}

export async function setCompetitionEntryStatusAction(
  entryId: string,
  status: EntryStatus,
): Promise<EntryFormState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const id = entryId.trim();

  if (!id) {
    return { status: "error", message: "Missing entry ID." };
  }

  try {
    const updated = await setCompetitionEntryStatus(id, status);

    if (!updated) {
      return { status: "error", message: "Entry not found." };
    }
  } catch {
    return { status: "error", message: "Failed to update entry visibility." };
  }

  revalidatePath("/admin/competition");
  revalidatePath("/vote");

  return { status: "success", message: status === "hidden" ? "Entry hidden." : "Entry unhidden." };
}

export async function setVotingOpenAction(open: boolean): Promise<EntryFormState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  try {
    await setVotingStatus(open);
  } catch {
    return { status: "error", message: "Failed to update voting status." };
  }

  revalidatePath("/admin/competition");
  revalidatePath("/vote");

  return { status: "success", message: open ? "Voting is now open." : "Voting is now closed." };
}

export async function setShowVoteCountsAction(show: boolean): Promise<EntryFormState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  try {
    await setShowVoteCounts(show);
  } catch {
    return { status: "error", message: "Failed to update vote count visibility." };
  }

  revalidatePath("/admin/competition");
  revalidatePath("/vote");

  return { status: "success", message: show ? "Vote counts are now visible." : "Vote counts are now hidden." };
}
