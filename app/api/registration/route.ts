import { NextResponse } from "next/server";

import {
  checkSessionAvailability,
  createRegistrationSubmission,
  SESSION_AVAILABILITY_MESSAGES,
  type RegistrationSubmissionInput,
} from "@/lib/submissions.server";
import { isRegistrationOpen } from "@/lib/registration-status";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function assertFile(value: FormDataEntryValue | null, key: string) {
  if (!(value instanceof File) || value.size === 0) {
    throw new Error(`Missing ${key}.`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    if (!isRegistrationOpen()) {
      return NextResponse.json(
        { ok: false, error: "Registration is closed." },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const payload: RegistrationSubmissionInput = {
      affiliationType: getString(formData, "affiliationType") as RegistrationSubmissionInput["affiliationType"],
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
      firstName: getString(formData, "firstName"),
      middleName: getString(formData, "middleName"),
      surname: getString(formData, "surname"),
      congregation: getString(formData, "congregation"),
      email: getString(formData, "email"),
      mobile: getString(formData, "mobile"),
      completeAddress: getString(formData, "completeAddress"),
      shirtSize: getString(formData, "shirtSize"),
      day1Session: getString(formData, "day1Session"),
      day2Session: getString(formData, "day2Session"),
      accommodation: getString(formData, "accommodation") as RegistrationSubmissionInput["accommodation"],
      paymentMode: getString(formData, "paymentMode") as RegistrationSubmissionInput["paymentMode"],
      transactionNumber: getString(formData, "transaction_number"),
    };

    const availability = await checkSessionAvailability(payload);

    if (!availability.ok) {
      return NextResponse.json(
        { ok: false, error: SESSION_AVAILABILITY_MESSAGES[availability.reason] },
        { status: 409 },
      );
    }

    const submission = await createRegistrationSubmission(payload, {
      idUpload: assertFile(formData.get("idUpload"), "idUpload"),
      paymentProof: assertFile(formData.get("paymentProof"), "paymentProof"),
    });

    return NextResponse.json({ ok: true, submissionId: submission.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create submission.";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
