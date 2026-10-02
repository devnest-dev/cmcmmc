import type { Metadata } from "next";

import { getEvaluationStatus } from "@/lib/evaluation.server";
import EvaluationForm from "./EvaluationForm";
import EvaluationShell from "./EvaluationShell";

export const metadata: Metadata = {
  title: "Evaluation Form",
  description: "Share your feedback on the 2nd Cebu Metropolitan Catholic Mass Media Congress.",
};

export default async function EvaluationPage() {
  const status = await getEvaluationStatus();

  return (
    <EvaluationShell status={status}>
      <EvaluationForm source="public" />
    </EvaluationShell>
  );
}
