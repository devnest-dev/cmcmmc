import { NextResponse } from "next/server";

import { isAdminSessionActive } from "@/lib/auth/session";
import { createEvaluationCsv } from "@/lib/evaluation.server";

export async function GET(request: Request) {
  if (!(await isAdminSessionActive())) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const csv = await createEvaluationCsv();

  // Leading BOM so Excel opens the UTF-8 text answers correctly.
  return new NextResponse(`﻿${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cmcmmc-evaluations.csv"',
    },
  });
}
