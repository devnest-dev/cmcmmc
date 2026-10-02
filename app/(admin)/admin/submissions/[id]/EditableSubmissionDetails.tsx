"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  formatSubmissionDate,
  getAffiliationLabel,
  getSourceLabel,
  getSubmissionDisplayName,
  getSubmissionOrganization,
  type Submission,
} from "@/lib/admin-submissions";
import { updateSubmissionDetailsAction } from "@/lib/admin/submissions/actions";
import { day1Options, day2Options } from "@/lib/registration-options";

import SubmissionDetailsFields from "../SubmissionDetailsFields";

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value || "—"}</p>
    </div>
  );
}

function getAffiliationDetails(submission: Submission) {
  if (submission.affiliationType === "parish") {
    const archdioceseLabel =
      submission.archdiocese === "Others" && submission.archdioceseOther
        ? `${submission.archdiocese} (${submission.archdioceseOther})`
        : submission.archdiocese;

    return [
      { label: "Archdiocese", value: archdioceseLabel },
      { label: "Parish name", value: submission.parishName },
      { label: "Parish address", value: submission.parishAddress },
      { label: "Organization name", value: submission.organizationName },
      {
        label: "Role in the ministry",
        value:
          submission.roleInMinistry === "Others" && submission.roleInMinistryOther
            ? `${submission.roleInMinistry} (${submission.roleInMinistryOther})`
            : submission.roleInMinistry,
      },
    ];
  }

  if (submission.affiliationType === "school") {
    return [
      { label: "Province", value: submission.province },
      { label: "School name", value: submission.schoolName },
      { label: "School address", value: submission.schoolAddress },
      {
        label: "Designation",
        value:
          submission.designation === "Others" && submission.designationOther
            ? `${submission.designation} (${submission.designationOther})`
            : submission.designation,
      },
    ];
  }

  return [
    { label: "Company / Organization", value: submission.companyOrganization },
    { label: "Company address", value: submission.companyAddress },
    { label: "Position / Designation", value: submission.positionDesignation },
  ];
}

function EditFields({
  submission,
  onCancel,
  onSaved,
}: {
  submission: Submission;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateSubmissionDetailsAction({ status: "idle" }, formData);

      if (result.status === "success") {
        toast.success(result.message ?? "Submission details updated.");
        onSaved();
        return;
      }

      toast.error(result.message ?? "Failed to update submission.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={submission.id} />

      <SubmissionDetailsFields defaults={submission} disabled={isPending} />

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function EditableSubmissionDetails({
  submission,
  idUploadUrl,
  paymentProofUrl,
  invoiceUrl,
}: {
  submission: Submission;
  idUploadUrl: string | null;
  paymentProofUrl: string | null;
  invoiceUrl: string | null;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const day1SessionLabel =
    day1Options.find((option) => option.value === submission.day1Session)?.label || submission.day1Session;
  const day2SessionLabel =
    day2Options.find((option) => option.value === submission.day2Session)?.label || submission.day2Session;
  const day1SessionSpeaker = day1Options.find((option) => option.value === submission.day1Session)?.speaker;
  const day2SessionSpeaker = day2Options.find((option) => option.value === submission.day2Session)?.speaker;
  const day1SessionInfo = day1SessionSpeaker ? `${day1SessionLabel} (${day1SessionSpeaker})` : day1SessionLabel;
  const day2SessionInfo = day2SessionSpeaker ? `${day2SessionLabel} (${day2SessionSpeaker})` : day2SessionLabel;
  const affiliationDetails = getAffiliationDetails(submission);

  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2aadb5]">Submission detail</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1a2e5a]">{getSubmissionDisplayName(submission)}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {getAffiliationLabel(submission.affiliationType)} submission •{" "}
            {submission.source !== "online" ? `${getSourceLabel(submission.source)} • ` : ""}
            {formatSubmissionDate(submission.submittedAt)}
          </p>
        </div>
        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Edit submission details"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <EditFields
          submission={submission}
          onCancel={() => setIsEditing(false)}
          onSaved={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem label="Email" value={submission.email} />
            <DetailItem label="Mobile" value={submission.mobile} />
            <DetailItem label="Congregation" value={submission.congregation} />
            <DetailItem label="Organization" value={getSubmissionOrganization(submission)} />
            <DetailItem label="Shirt size" value={submission.shirtSize} />
            <DetailItem label="Day 1 session" value={day1SessionInfo} />
            <DetailItem label="Day 2 session" value={day2SessionInfo} />
            <DetailItem
              label="Accommodation"
              value={submission.accommodation === "avail" ? "Requested" : "Not requested"}
            />
            <DetailItem label="Payment mode" value={submission.paymentMode} />
            <DetailItem label="Transaction number" value={submission.transactionNumber} />
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-[#1a2e5a]">Affiliation details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {affiliationDetails.map((detail) => (
                <DetailItem key={detail.label} label={detail.label} value={detail.value} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-[#1a2e5a]">Address and notes</h2>
        {!isEditing && <DetailItem label="Complete address" value={submission.completeAddress} />}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Valid ID upload</p>
            <p className="mt-2 text-sm font-medium text-slate-700 truncate">{submission.idUploadName || "—"}</p>
            {idUploadUrl ? (
              <a
                className="mt-2 inline-block text-sm font-semibold text-[#2aadb5] hover:underline"
                href={idUploadUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open file
              </a>
            ) : null}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Payment proof</p>
            <p className="mt-2 text-sm font-medium text-slate-700 truncate">{submission.paymentProofName || "—"}</p>
            {paymentProofUrl ? (
              <a
                className="mt-2 inline-block text-sm font-semibold text-[#2aadb5] hover:underline"
                href={paymentProofUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open file
              </a>
            ) : null}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Invoice</p>
            <p className="mt-2 text-sm font-medium text-slate-700 truncate">{submission.invoiceName || "—"}</p>
            {invoiceUrl ? (
              <a
                className="mt-2 inline-block text-sm font-semibold text-[#2aadb5] hover:underline"
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open file
              </a>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-slate-500">
          These file names are placeholders in the mock dataset. When storage is connected later, this section can
          link directly to the uploaded files.
        </p>
      </div>
    </div>
  );
}
