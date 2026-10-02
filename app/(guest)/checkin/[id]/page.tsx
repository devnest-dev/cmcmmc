import { notFound, redirect } from "next/navigation";

import { isStaffSessionActive } from "@/lib/auth/session";
import { isEvaluationLaunched } from "@/lib/evaluation-launch";
import { getEvaluationStatus } from "@/lib/evaluation.server";
import { getSubmissionById } from "@/lib/submissions.server";
import { toGuestView } from "@/lib/guest-submission-view";
import GuestRegistrationView from "./GuestRegistrationView";

type CheckinPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { id } = await params;

  if (await isStaffSessionActive()) {
    redirect(`/attendance?id=${encodeURIComponent(id)}`);
  }

  const [submission, evaluationStatus] = await Promise.all([
    getSubmissionById(id),
    getEvaluationStatus(),
  ]);

  if (!submission) {
    notFound();
  }

  return (
    <GuestRegistrationView
      submission={toGuestView(submission)}
      evaluationHref={
        isEvaluationLaunched() && evaluationStatus.isAcceptingResponses
          ? `/evaluation/${encodeURIComponent(submission.id)}`
          : undefined
      }
    />
  );
}
