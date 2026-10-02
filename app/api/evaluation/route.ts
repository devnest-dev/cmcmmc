import { NextResponse } from "next/server";

import { getEvaluationSchema, type EvaluationSource } from "@/lib/evaluation";
import { createEvaluation, type CreateEvaluationReason } from "@/lib/evaluation.server";

const STATUS_BY_REASON: Record<CreateEvaluationReason, number> = {
  closed: 403,
  submission_not_found: 404,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const source: EvaluationSource = body.source === "qr" ? "qr" : "public";
    const submissionId = String(body.submissionId ?? "").trim();

    if (source === "qr" && !submissionId) {
      return NextResponse.json({ ok: false, error: "Missing submissionId." }, { status: 400 });
    }

    const parsed = getEvaluationSchema(source).safeParse(body.values);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid evaluation." },
        { status: 400 },
      );
    }

    const result = await createEvaluation(parsed.data, source, submissionId || undefined);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason },
        { status: STATUS_BY_REASON[result.reason] },
      );
    }

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit evaluation.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
