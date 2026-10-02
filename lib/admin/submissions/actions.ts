"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminSessionActive } from "@/lib/auth/session";
import {
  PAYMENT_MODES,
  SUBMISSION_STATUSES,
  type SubmissionStatus,
  getSubmissionDisplayName,
} from "@/lib/admin-submissions";
import {
  SESSION_AVAILABILITY_MESSAGES,
  checkSessionAvailability,
  createAdminSubmission,
  deleteSubmission,
  updateSubmissionDetails,
  updateSubmissionStatus,
  uploadInvoice,
  type RegistrationSubmissionInput,
} from "@/lib/submissions.server";
import { sendParticipationConfirmationEmail } from "@/lib/mail-service";

export type UpdateSubmissionStatusState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function isSubmissionStatus(value: string): value is SubmissionStatus {
  return SUBMISSION_STATUSES.includes(value as SubmissionStatus);
}

export async function updateSubmissionStatusAction(
  _previousState: UpdateSubmissionStatusState,
  formData: FormData,
): Promise<UpdateSubmissionStatusState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id || !isSubmissionStatus(status)) {
    return {
      status: "error",
      message: "Invalid submission status update payload.",
    };
  }

  let invoiceFile: File | null = null;
  let invoiceBuffer: Buffer | undefined;

  if (status === "Verified" && process.env.SEND_CONFIRMATION_EMAIL === "true") {
    const raw = formData.get("invoice");

    if (!(raw instanceof File) || raw.size === 0) {
      return {
        status: "error",
        message: "Please upload an invoice PDF before verifying.",
      };
    }

    if (raw.type !== "application/pdf") {
      return {
        status: "error",
        message: "Invoice must be a PDF file.",
      };
    }

    invoiceFile = raw;
  }

  const updatedSubmission = await updateSubmissionStatus(id, status);

  if (!updatedSubmission) {
    return {
      status: "error",
      message: "Submission not found.",
    };
  }

  if (invoiceFile) {
    try {
      const result = await uploadInvoice(id, invoiceFile);
      invoiceBuffer = result.invoiceBuffer;
    } catch {
      return {
        status: "error",
        message: "Failed to upload invoice. Please try again.",
      };
    }

    if (process.env.SEND_CONFIRMATION_EMAIL === "true") {
      const name = getSubmissionDisplayName(updatedSubmission);
      sendParticipationConfirmationEmail({
        name,
        email: updatedSubmission.email,
        invoiceBuffer,
        invoiceFileName: invoiceFile.name,
      }).catch((err) => console.error("Failed to send participation confirmation email:", err));
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/submissions/${id}`);

  return {
    status: "success",
    message: `Status updated to ${status}.`,
  };
}

export type DeleteSubmissionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function deleteSubmissionAction(
  submissionId: string,
): Promise<DeleteSubmissionState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const id = submissionId.trim();

  if (!id) {
    return { status: "error", message: "Missing submission ID." };
  }

  try {
    await deleteSubmission(id);
  } catch {
    return { status: "error", message: "Failed to delete submission." };
  }

  revalidatePath("/admin");

  return { status: "success" };
}

export type UpdateSubmissionDetailsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const AFFILIATION_TYPES = ["parish", "school", "neither"] as const;
const ACCOMMODATIONS = ["avail", "self"] as const;

function isAffiliationType(
  value: string,
): value is RegistrationSubmissionInput["affiliationType"] {
  return (AFFILIATION_TYPES as readonly string[]).includes(value);
}

function isAccommodation(
  value: string,
): value is RegistrationSubmissionInput["accommodation"] {
  return (ACCOMMODATIONS as readonly string[]).includes(value);
}

function isPaymentMode(
  value: string,
): value is RegistrationSubmissionInput["paymentMode"] {
  return (PAYMENT_MODES as readonly string[]).includes(value);
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

type ParseSubmissionDetailsResult =
  | { ok: true; input: RegistrationSubmissionInput }
  | { ok: false; message: string };

function parseSubmissionDetailsForm(formData: FormData): ParseSubmissionDetailsResult {
  const affiliationType = getString(formData, "affiliationType");
  const accommodation = getString(formData, "accommodation");
  const paymentMode = getString(formData, "paymentMode");

  if (!isAffiliationType(affiliationType)) {
    return { ok: false, message: "Invalid affiliation type." };
  }

  if (!isAccommodation(accommodation)) {
    return { ok: false, message: "Invalid accommodation option." };
  }

  if (!isPaymentMode(paymentMode)) {
    return { ok: false, message: "Invalid payment mode." };
  }

  const firstName = getString(formData, "firstName");
  const surname = getString(formData, "surname");
  const email = getString(formData, "email");
  const mobile = getString(formData, "mobile");
  const shirtSize = getString(formData, "shirtSize");
  const day1Session = getString(formData, "day1Session");
  const day2Session = getString(formData, "day2Session");

  if (!firstName || !surname || !email || !mobile || !shirtSize || !day1Session || !day2Session) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  return {
    ok: true,
    input: {
      affiliationType,
      archdiocese: getString(formData, "archdiocese"),
      archdioceseOther: getString(formData, "archdioceseOther"),
      parishName: getString(formData, "parishName"),
      parishAddress: getString(formData, "parishAddress"),
      organizationName: getString(formData, "organizationName"),
      roleInMinistry: getString(formData, "roleInMinistry"),
      roleInMinistryOther: getString(formData, "roleInMinistryOther"),
      province: getString(formData, "province"),
      schoolName: getString(formData, "schoolName"),
      schoolAddress: getString(formData, "schoolAddress"),
      designation: getString(formData, "designation"),
      designationOther: getString(formData, "designationOther"),
      companyOrganization: getString(formData, "companyOrganization"),
      companyAddress: getString(formData, "companyAddress"),
      positionDesignation: getString(formData, "positionDesignation"),
      title: getString(formData, "title"),
      firstName,
      middleName: getString(formData, "middleName"),
      surname,
      congregation: getString(formData, "congregation"),
      email,
      mobile,
      completeAddress: getString(formData, "completeAddress"),
      shirtSize,
      day1Session,
      day2Session,
      accommodation,
      paymentMode,
      transactionNumber: getString(formData, "transactionNumber"),
    },
  };
}

export async function updateSubmissionDetailsAction(
  _previousState: UpdateSubmissionDetailsState,
  formData: FormData,
): Promise<UpdateSubmissionDetailsState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const id = getString(formData, "id");

  if (!id) {
    return { status: "error", message: "Missing submission ID." };
  }

  const parsed = parseSubmissionDetailsForm(formData);

  if (!parsed.ok) {
    return { status: "error", message: parsed.message };
  }

  let updated;

  try {
    updated = await updateSubmissionDetails(id, parsed.input);
  } catch {
    return { status: "error", message: "Failed to update submission. Please try again." };
  }

  if (!updated) {
    return { status: "error", message: "Submission not found." };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/submissions/${id}`);

  return { status: "success", message: "Submission details updated." };
}

export type CreateSubmissionState = {
  status: "idle" | "success" | "error";
  message?: string;
  id?: string;
};

export async function createSubmissionAction(
  _previousState: CreateSubmissionState,
  formData: FormData,
): Promise<CreateSubmissionState> {
  if (!(await isAdminSessionActive())) {
    redirect("/login");
  }

  const parsed = parseSubmissionDetailsForm(formData);

  if (!parsed.ok) {
    return { status: "error", message: parsed.message };
  }

  let created;

  try {
    const availability = await checkSessionAvailability(parsed.input);

    if (!availability.ok) {
      return { status: "error", message: SESSION_AVAILABILITY_MESSAGES[availability.reason] };
    }

    created = await createAdminSubmission(parsed.input);
  } catch {
    return { status: "error", message: "Failed to create submission. Please try again." };
  }

  revalidatePath("/admin");

  return { status: "success", message: "Submission added.", id: created.id };
}
