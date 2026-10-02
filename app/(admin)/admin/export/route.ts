import { NextResponse } from "next/server";

import { isAdminSessionActive } from "@/lib/auth/session";
import { createSubmissionCsv } from "@/lib/submissions.server";
import { listSubmissions } from "@/lib/submissions.server";

export async function GET(request: Request) {
  if (!(await isAdminSessionActive())) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const csv = await createSubmissionCsv(await listSubmissions());

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cmcmmc-submissions.csv"',
    },
  });
}