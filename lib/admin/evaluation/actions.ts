"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminSessionActive } from "@/lib/auth/session";
import { setEvaluationOpen } from "@/lib/evaluation.server";

export type EvaluationActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function setEvaluationOpenAction(open: boolean): Promise<EvaluationActionState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  try {
    await setEvaluationOpen(open);
  } catch {
    return { status: "error", message: "Failed to update evaluation status." };
  }

  revalidatePath("/admin/evaluations");
  revalidatePath("/evaluation", "layout");
  revalidatePath("/checkin/[id]", "page");

  return {
    status: "success",
    message: open ? "Evaluation form is now open." : "Evaluation form is now closed.",
  };
}
