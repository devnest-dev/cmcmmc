import { NextResponse } from "next/server";

import { isStaffSessionActive } from "@/lib/auth/session";
import { getSubmissionById } from "@/lib/submissions.server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await isStaffSessionActive())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    return NextResponse.json({ ok: false, error: "Registrant not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, submission });
}
