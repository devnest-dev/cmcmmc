import "server-only";

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import {
  getSubmissionDisplayName,
  getSubmissionOrganization,
  type Submission,
} from "@/lib/admin-submissions";
import {
  EVALUATION_QUESTIONS,
  EVALUATION_SECTIONS,
  RATING_SCALE,
  mockEvaluations,
  type Evaluation,
  type EvaluationFormValues,
  type EvaluationRatings,
  type EvaluationSource,
  type EvaluationStatus,
  type EvaluationSummary,
  type EvaluationWithAttendance,
  type QuestionSummary,
} from "@/lib/evaluation";
import { getSubmissionById } from "@/lib/submissions.server";
import { createClient } from "@/lib/supabase.server";

type EvaluationRow = {
  id: string;
  created_at: string;
  submission_id: string | null;
  source: EvaluationSource;
  full_name: string;
  archdiocese: string;
  parish_name: string;
  parish_address: string;
  email: string;
  certificate_requested: boolean;
  ratings: EvaluationRatings;
  insights: string;
  improvements: string;
  topics: string;
  volunteer_message: string | null;
};

type EvaluationRowWithAttendance = EvaluationRow & {
  submissions: { day_one_attendance: string | null; day_two_attendance: string | null } | null;
};

const SELECT_WITH_ATTENDANCE = "*, submissions(day_one_attendance, day_two_attendance)";
// PostgREST caps responses at 1000 rows by default, so bulk reads are paged.
const BULK_PAGE_SIZE = 1000;
const DEFAULT_CLOSES_AT = "2026-10-17T23:59:59+08:00";

let mockEvaluationOpen = false;
const mockEvaluationRows: Evaluation[] = [...mockEvaluations];

function mapRowToEvaluation(row: EvaluationRow): Evaluation {
  return {
    id: row.id,
    createdAt: row.created_at,
    submissionId: row.submission_id,
    source: row.source,
    fullName: row.full_name,
    archdiocese: row.archdiocese,
    parishName: row.parish_name,
    parishAddress: row.parish_address,
    email: row.email,
    certificateRequested: row.certificate_requested,
    ratings: row.ratings ?? {},
    insights: row.insights,
    improvements: row.improvements,
    topics: row.topics,
    volunteerMessage: row.volunteer_message ?? "",
  };
}

function mapRowToEvaluationWithAttendance(row: EvaluationRowWithAttendance): EvaluationWithAttendance {
  return {
    ...mapRowToEvaluation(row),
    attendedBothDays: row.submissions
      ? Boolean(row.submissions.day_one_attendance && row.submissions.day_two_attendance)
      : null,
  };
}

function getPersonalInfoFromSubmission(submission: Submission) {
  switch (submission.affiliationType) {
    case "parish":
      return {
        archdiocese:
          submission.archdiocese === "Others" && submission.archdioceseOther
            ? submission.archdioceseOther
            : submission.archdiocese,
        parishAddress: submission.parishAddress,
      };
    case "school":
      return { archdiocese: "", parishAddress: submission.schoolAddress };
    default:
      return { archdiocese: "", parishAddress: submission.companyAddress };
  }
}

export async function getEvaluationStatus(): Promise<EvaluationStatus> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let open = mockEvaluationOpen;
  let closesAt = DEFAULT_CLOSES_AT;

  if (supabase) {
    const { data, error } = await supabase
      .from("evaluation_settings")
      .select("evaluation_open, closes_at")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    const settings = data as { evaluation_open: boolean; closes_at: string } | null;
    open = settings?.evaluation_open ?? false;
    closesAt = settings?.closes_at ?? DEFAULT_CLOSES_AT;
  }

  return {
    open,
    closesAt,
    isAcceptingResponses: open && Date.now() < new Date(closesAt).getTime(),
  };
}

export async function setEvaluationOpen(open: boolean): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    mockEvaluationOpen = open;
    return;
  }

  const { error } = await supabase
    .from("evaluation_settings")
    .update({ evaluation_open: open })
    .eq("id", true);

  if (error) {
    throw new Error(error.message);
  }
}

export type CreateEvaluationReason = "closed" | "submission_not_found";

export type CreateEvaluationResult =
  | { ok: true; id: string }
  | { ok: false; reason: CreateEvaluationReason };

export async function createEvaluation(
  values: EvaluationFormValues,
  source: EvaluationSource,
  submissionId?: string,
): Promise<CreateEvaluationResult> {
  const status = await getEvaluationStatus();

  if (!status.isAcceptingResponses) {
    return { ok: false, reason: "closed" };
  }

  let personalInfo = {
    fullName: values.fullName,
    archdiocese: values.archdiocese,
    parishName: values.parishName,
    parishAddress: values.parishAddress,
    email: values.email,
  };

  // QR responses never trust client-sent personal info; snapshot it from the
  // linked registration instead.
  if (source === "qr") {
    const submission = submissionId ? await getSubmissionById(submissionId) : null;

    if (!submission) {
      return { ok: false, reason: "submission_not_found" };
    }

    personalInfo = {
      fullName: getSubmissionDisplayName(submission),
      parishName: getSubmissionOrganization(submission),
      email: submission.email,
      ...getPersonalInfoFromSubmission(submission),
    };
  }

  const ratings = Object.fromEntries(
    EVALUATION_QUESTIONS.map((question) => [question.id, values.ratings[question.id]]),
  );

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const id = randomUUID();
    mockEvaluationRows.unshift({
      id,
      createdAt: new Date().toISOString(),
      submissionId: source === "qr" ? (submissionId ?? null) : null,
      source,
      ...personalInfo,
      certificateRequested: values.certificateRequested,
      ratings,
      insights: values.insights,
      improvements: values.improvements,
      topics: values.topics,
      volunteerMessage: values.volunteerMessage,
    });
    return { ok: true, id };
  }

  const { data, error } = await supabase
    .from("evaluations")
    .insert({
      submission_id: source === "qr" ? submissionId : null,
      source,
      full_name: personalInfo.fullName,
      archdiocese: personalInfo.archdiocese,
      parish_name: personalInfo.parishName,
      parish_address: personalInfo.parishAddress,
      email: personalInfo.email,
      consent: values.consent,
      certificate_requested: values.certificateRequested,
      ratings,
      insights: values.insights,
      improvements: values.improvements,
      topics: values.topics,
      volunteer_message: values.volunteerMessage || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true, id: (data as { id: string }).id };
}

export type ListEvaluationsPageResult = {
  evaluations: EvaluationWithAttendance[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listEvaluationsPage(
  params: { page?: number; pageSize?: number } = {},
): Promise<ListEvaluationsPageResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 25, 1), 100);
  const from = (page - 1) * pageSize;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return {
      evaluations: mockEvaluationRows
        .slice(from, from + pageSize)
        .map((evaluation) => ({ ...evaluation, attendedBothDays: null })),
      total: mockEvaluationRows.length,
      page,
      pageSize,
    };
  }

  const { data, error, count } = await supabase
    .from("evaluations")
    .select(SELECT_WITH_ATTENDANCE, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    evaluations: (data ?? []).map((row) =>
      mapRowToEvaluationWithAttendance(row as EvaluationRowWithAttendance),
    ),
    total: count ?? 0,
    page,
    pageSize,
  };
}

async function listAllEvaluations(): Promise<EvaluationWithAttendance[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockEvaluationRows.map((evaluation) => ({ ...evaluation, attendedBothDays: null }));
  }

  const evaluations: EvaluationWithAttendance[] = [];

  for (let from = 0; ; from += BULK_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("evaluations")
      .select(SELECT_WITH_ATTENDANCE)
      .order("created_at", { ascending: false })
      .range(from, from + BULK_PAGE_SIZE - 1);

    if (error) {
      throw new Error(error.message);
    }

    const rows = data ?? [];
    rows.forEach((row) =>
      evaluations.push(mapRowToEvaluationWithAttendance(row as EvaluationRowWithAttendance)),
    );

    if (rows.length < BULK_PAGE_SIZE) {
      break;
    }
  }

  return evaluations;
}

export async function getEvaluationById(id: string): Promise<EvaluationWithAttendance | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const evaluation = mockEvaluationRows.find((row) => row.id === id);
    return evaluation ? { ...evaluation, attendedBothDays: null } : null;
  }

  const { data, error } = await supabase
    .from("evaluations")
    .select(SELECT_WITH_ATTENDANCE)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToEvaluationWithAttendance(data as EvaluationRowWithAttendance) : null;
}

function average(values: number[]) {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export async function getEvaluationSummary(): Promise<EvaluationSummary> {
  const evaluations = await listAllEvaluations();
  const allRatings: number[] = [];

  const sections = EVALUATION_SECTIONS.map((section) => {
    const sectionRatings: number[] = [];

    const questions: QuestionSummary[] = section.questions.map((question) => {
      const values = evaluations
        .map((evaluation) => evaluation.ratings[question.id])
        .filter((value): value is number => typeof value === "number");

      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0 };
      values.forEach((value) => {
        if (RATING_SCALE.includes(value as (typeof RATING_SCALE)[number])) {
          distribution[value as (typeof RATING_SCALE)[number]] += 1;
        }
      });

      sectionRatings.push(...values);

      return {
        id: question.id,
        text: question.text,
        average: average(values),
        distribution,
        responses: values.length,
      };
    });

    allRatings.push(...sectionRatings);

    return { key: section.key, title: section.title, average: average(sectionRatings), questions };
  });

  return {
    totalResponses: evaluations.length,
    qrResponses: evaluations.filter((evaluation) => evaluation.source === "qr").length,
    publicResponses: evaluations.filter((evaluation) => evaluation.source === "public").length,
    certificateRequests: evaluations.filter((evaluation) => evaluation.certificateRequested).length,
    overallAverage: average(allRatings),
    sections,
  };
}

export async function createEvaluationCsv() {
  const evaluations = await listAllEvaluations();

  const header = [
    "ID",
    "Submitted At",
    "Source",
    "Registration ID",
    "Complete Name",
    "Arch/diocese",
    "Parish / Institution",
    "Parish / Institution Address",
    "Email",
    "Certificate Requested",
    "Attended Day 1 & 2",
    ...EVALUATION_QUESTIONS.map((question) => `Q${question.id.slice(1)}. ${question.text}`),
    "Insights and reflections",
    "Points to improve",
    "Suggested topics and workshops",
    "Words for volunteers",
  ];

  const rows = evaluations.map((evaluation) => [
    evaluation.id,
    new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Manila",
    }).format(new Date(evaluation.createdAt)),
    evaluation.source === "qr" ? "QR" : "Public",
    evaluation.submissionId ?? "",
    evaluation.fullName,
    evaluation.archdiocese,
    evaluation.parishName,
    evaluation.parishAddress,
    evaluation.email,
    evaluation.certificateRequested ? "Yes" : "No",
    evaluation.attendedBothDays === null ? "" : evaluation.attendedBothDays ? "Yes" : "No",
    ...EVALUATION_QUESTIONS.map((question) => evaluation.ratings[question.id] ?? ""),
    evaluation.insights,
    evaluation.improvements,
    evaluation.topics,
    evaluation.volunteerMessage,
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => `"${neutralizeFormula(String(value ?? "")).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

// Free-text answers come from the public form; stop spreadsheet apps from
// evaluating them as formulas.
function neutralizeFormula(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}
