"use server";

import { revalidatePath } from "next/cache";

import { requireStaffSession } from "@/lib/auth/session";
import {
  clearSubmissionArrival,
  KitReceivedBlockedError,
  markSubmissionArrival,
  setKitReceived,
  setShirtPaymentReceived,
  type AttendanceMode,
} from "@/lib/submissions.server";
import type { Submission } from "@/lib/admin-submissions";

export type MarkArrivalState = {
  status: "idle" | "success" | "error";
  message?: string;
  oldData?: string | null;
  newData?: Submission;
  id?: string;
  mode?: AttendanceMode;
};

export type MarkKitReceivedState = {
  status: "idle" | "success" | "error";
  message?: string;
  oldData?: boolean;
  newData?: Submission;
  id?: string;
};

export type MarkShirtPaymentReceivedState = {
  status: "idle" | "success" | "error";
  message?: string;
  oldData?: boolean;
  newData?: Submission;
  id?: string;
};

const MODE_LABELS: Record<AttendanceMode, string> = {
  dayOneAttendance: "Day 1 Attendance",
  dayTwoAttendance: "Day 2 Attendance",
  dayOneBreakoutAttendance: "Day 1 Breakout",
  dayTwoBreakoutAttendance: "Day 2 Breakout",
};

function isAttendanceMode(value: string): value is AttendanceMode {
  return (
    value === "dayOneAttendance" ||
    value === "dayTwoAttendance" ||
    value === "dayOneBreakoutAttendance" ||
    value === "dayTwoBreakoutAttendance"
  );
}

function formatTime(iso: string | null) {
  if (!iso) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(iso));
}

export async function markArrivalAction(
  _previousState: MarkArrivalState,
  formData: FormData,
): Promise<MarkArrivalState> {
  await requireStaffSession();

  const id = String(formData.get("id") ?? "").trim();
  const modeRaw = String(formData.get("mode") ?? "").trim();
  const override = formData.get("override") === "true";

  if (!id || !isAttendanceMode(modeRaw)) {
    return { status: "error", message: "Invalid attendance payload." };
  }

  const mode = modeRaw;
  let result;

  try {
    result = await markSubmissionArrival(id, mode, { override });
  } catch {
    return { status: "error", message: "Failed to mark attendance. Please try again.", id, mode };
  }

  if (!result) {
    return { status: "error", message: "Registrant not found.", id, mode };
  }

  if (result.alreadyArrived && !override) {
    return {
      status: "error",
      message: `Already checked in for ${MODE_LABELS[mode]} at ${formatTime(result.oldData)}.`,
      oldData: result.oldData,
      id,
      mode,
    };
  }

  revalidatePath("/attendance");
  // SAFE: no pathMappings registry exists in this codebase; oldData/newData preserved
  // instead, revalidatePath used as the closest existing "what to refresh" mechanism.
  return {
    status: "success",
    message: `Marked arrived for ${MODE_LABELS[mode]}.`,
    oldData: result.oldData,
    newData: result.newData,
    id,
    mode,
  };
}

export async function revertArrivalAction(
  _previousState: MarkArrivalState,
  formData: FormData,
): Promise<MarkArrivalState> {
  await requireStaffSession();

  const id = String(formData.get("id") ?? "").trim();
  const modeRaw = String(formData.get("mode") ?? "").trim();

  if (!id || !isAttendanceMode(modeRaw)) {
    return { status: "error", message: "Invalid attendance payload." };
  }

  const mode = modeRaw;
  let result;

  try {
    result = await clearSubmissionArrival(id, mode);
  } catch {
    return { status: "error", message: "Failed to revert attendance. Please try again.", id, mode };
  }

  if (!result) {
    return { status: "error", message: "Registrant not found.", id, mode };
  }

  revalidatePath("/attendance");
  // SAFE: no pathMappings registry exists in this codebase; oldData/newData preserved
  // instead, revalidatePath used as the closest existing "what to refresh" mechanism.
  return {
    status: "success",
    message: `Reverted ${MODE_LABELS[mode]}.`,
    oldData: result.oldData,
    newData: result.newData,
    id,
    mode,
  };
}

export async function markKitReceivedAction(
  _previousState: MarkKitReceivedState,
  formData: FormData,
): Promise<MarkKitReceivedState> {
  await requireStaffSession();

  const id = String(formData.get("id") ?? "").trim();
  const received = formData.get("received") === "true";

  if (!id) {
    return { status: "error", message: "Invalid kit status payload." };
  }

  let result;

  try {
    result = await setKitReceived(id, received);
  } catch (error) {
    if (error instanceof KitReceivedBlockedError) {
      return { status: "error", message: error.message, id };
    }
    return { status: "error", message: "Failed to update kit status. Please try again.", id };
  }

  if (!result) {
    return { status: "error", message: "Registrant not found.", id };
  }

  revalidatePath("/attendance");
  // SAFE: no pathMappings registry exists in this codebase; oldData/newData preserved
  // instead, revalidatePath used as the closest existing "what to refresh" mechanism.
  return {
    status: "success",
    message: received ? "Kit marked as received." : "Kit marked as not received.",
    oldData: result.oldData,
    newData: result.newData,
    id,
  };
}

export async function markShirtPaymentReceivedAction(
  _previousState: MarkShirtPaymentReceivedState,
  formData: FormData,
): Promise<MarkShirtPaymentReceivedState> {
  await requireStaffSession();

  const id = String(formData.get("id") ?? "").trim();
  const received = formData.get("received") === "true";

  if (!id) {
    return { status: "error", message: "Invalid shirt payment payload." };
  }

  let result;

  try {
    result = await setShirtPaymentReceived(id, received);
  } catch {
    return { status: "error", message: "Failed to update shirt payment status. Please try again.", id };
  }

  if (!result) {
    return { status: "error", message: "Registrant not found.", id };
  }

  revalidatePath("/attendance");
  // SAFE: no pathMappings registry exists in this codebase; oldData/newData preserved
  // instead, revalidatePath used as the closest existing "what to refresh" mechanism.
  return {
    status: "success",
    message: received ? "Shirt payment marked as received." : "Shirt payment marked as not received.",
    oldData: result.oldData,
    newData: result.newData,
    id,
  };
}
