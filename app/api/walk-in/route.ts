import { NextResponse } from "next/server";

import { isWalkInOpen } from "@/lib/registration-status";
import {
  checkSessionAvailability,
  createWalkInSubmission,
  SESSION_AVAILABILITY_MESSAGES,
} from "@/lib/submissions.server";
import { walkInSchema } from "@/lib/walk-in";

export async function POST(request: Request) {
  try {
    if (!isWalkInOpen()) {
      return NextResponse.json(
        { ok: false, error: "Walk-in registration is closed." },
        { status: 403 },
      );
    }

    const parsed = walkInSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid registration." },
        { status: 400 },
      );
    }

    const availability = await checkSessionAvailability({
      day1Session: parsed.data.day1Session,
      day2Session: parsed.data.day2Session,
      accommodation: "self",
    });

    if (!availability.ok) {
      return NextResponse.json(
        {
          ok: false,
          reason: availability.reason,
          error: SESSION_AVAILABILITY_MESSAGES[availability.reason],
        },
        { status: 409 },
      );
    }

    const submission = await createWalkInSubmission(parsed.data);

    return NextResponse.json({ ok: true, submissionId: submission.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create registration.";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
