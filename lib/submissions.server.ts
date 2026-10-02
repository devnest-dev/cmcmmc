import "server-only";

import { randomUUID } from "crypto";

import {
  mockSubmissions,
  type Submission,
  type SubmissionStatus,
  getAffiliationLabel,
  getSourceLabel,
  getSubmissionOrganization,
} from "@/lib/admin-submissions";
import {
  ACCOMMODATION_CAP,
  day1Options,
  day2Options,
  SESSION_CAP,
} from "@/lib/registration-options";
import { getStorageBucketName, createClient } from "@/lib/supabase.server";
import { cookies } from 'next/headers'

type SubmissionRow = {
  id: string;
  submitted_at: string;
  status: Submission["status"];
  source: Submission["source"] | null;
  affiliation_type: Submission["affiliationType"];
  title: string;
  first_name: string;
  middle_name: string;
  surname: string;
  congregation: string;
  email: string;
  mobile: string;
  complete_address: string | null;
  shirt_size: string | null;
  organization_name: string;
  archdiocese: string;
  archdiocese_other: string | null;
  parish_name: string;
  parish_address: string;
  role_in_ministry: string;
  role_in_ministry_other: string;
  province: string;
  school_name: string;
  school_address: string;
  designation: string;
  designation_other: string;
  company_organization: string;
  company_address: string;
  position_designation: string;
  day1_session: string;
  day2_session: string;
  accommodation: Submission["accommodation"];
  payment_mode: Submission["paymentMode"];
  transaction_number: string | null;
  id_upload_name: string | null;
  payment_proof_name: string | null;
  id_upload_path: string | null;
  payment_proof_path: string | null;
  invoice_name: string;
  invoice_path: string;
  day_one_attendance: string | null;
  day_two_attendance: string | null;
  day_one_breakout_attendance: string | null;
  day_two_breakout_attendance: string | null;
  kit_received: boolean;
  shirt_payment_received: boolean;
};

export type RegistrationSubmissionInput = {
  affiliationType: Submission["affiliationType"];
  archdiocese: string;
  archdioceseOther: string;
  parishName: string;
  parishAddress: string;
  organizationName: string;
  roleInMinistry: string;
  roleInMinistryOther: string;
  province: string;
  schoolName: string;
  schoolAddress: string;
  designation: string;
  designationOther: string;
  companyOrganization: string;
  companyAddress: string;
  positionDesignation: string;
  title: string;
  firstName: string;
  middleName: string;
  surname: string;
  congregation: string;
  email: string;
  mobile: string;
  completeAddress: string;
  shirtSize: string;
  day1Session: string;
  day2Session: string;
  accommodation: Submission["accommodation"];
  paymentMode: Submission["paymentMode"];
  transactionNumber: string;
};

function mapRowToSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    status: row.status,
    source: row.source ?? "online",
    affiliationType: row.affiliation_type,
    title: row.title,
    firstName: row.first_name,
    middleName: row.middle_name,
    surname: row.surname,
    congregation: row.congregation,
    email: row.email,
    mobile: row.mobile,
    completeAddress: row.complete_address ?? "",
    shirtSize: row.shirt_size ?? "",
    organizationName: row.organization_name,
    archdiocese: row.archdiocese,
    archdioceseOther: row.archdiocese_other ?? "",
    parishName: row.parish_name,
    parishAddress: row.parish_address,
    roleInMinistry: row.role_in_ministry,
    roleInMinistryOther: row.role_in_ministry_other,
    province: row.province,
    schoolName: row.school_name,
    schoolAddress: row.school_address,
    designation: row.designation,
    designationOther: row.designation_other,
    companyOrganization: row.company_organization,
    companyAddress: row.company_address,
    positionDesignation: row.position_designation,
    day1Session: row.day1_session,
    day2Session: row.day2_session,
    accommodation: row.accommodation,
    paymentMode: row.payment_mode,
    transactionNumber: row.transaction_number ?? "",
    idUploadName: row.id_upload_name ?? "",
    paymentProofName: row.payment_proof_name ?? "",
    idUploadPath: row.id_upload_path ?? undefined,
    paymentProofPath: row.payment_proof_path ?? undefined,
    invoiceName: row.invoice_name,
    invoicePath: row.invoice_path,
    dayOneAttendance: row.day_one_attendance ?? null,
    dayTwoAttendance: row.day_two_attendance ?? null,
    dayOneBreakoutAttendance: row.day_one_breakout_attendance ?? null,
    dayTwoBreakoutAttendance: row.day_two_breakout_attendance ?? null,
    kitReceived: row.kit_received ?? false,
    shirtPaymentReceived: row.shirt_payment_received ?? false,
  };
}

function buildStoragePath(
  submissionId: string,
  kind: "id-upload" | "payment-proof" | "invoice",
  fileName: string,
) {
  const safeName = fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
  return `submissions/${submissionId}/${kind}/${randomUUID()}-${safeName}`;
}

export async function uploadInvoice(
  submissionId: string,
  file: File,
): Promise<{ invoicePath: string; invoiceBuffer: Buffer }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const bucketName = getStorageBucketName();

  const invoicePath = buildStoragePath(submissionId, "invoice", file.name);
  const arrayBuffer = await file.arrayBuffer();
  const invoiceBuffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(invoicePath, invoiceBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("submissions")
    .update({ invoice_name: file.name, invoice_path: invoicePath })
    .eq("id", submissionId);

  return { invoicePath, invoiceBuffer };
}

export type BreakoutSessionCounts = {
  day1Counts: Record<string, number>;
  day2Counts: Record<string, number>;
  limit: number;
  accommodationCount: number;
  accommodationLimit: number;
};

function buildInitialCounts(options: ReadonlyArray<{ value: string }>) {
  return Object.fromEntries(options.map((option) => [option.value, 0]));
}

function incrementCount(counts: Record<string, number>, key?: string | null) {
  if (!key) {
    return;
  }

  if (counts[key] === undefined) {
    counts[key] = 1;
    return;
  }

  counts[key] += 1;
}

export async function getBreakoutSessionCounts(): Promise<BreakoutSessionCounts> {
  const day1Counts = buildInitialCounts(day1Options);
  const day2Counts = buildInitialCounts(day2Options);
  let accommodationCount = 0;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    mockSubmissions.forEach((submission) => {
      incrementCount(day1Counts, submission.day1Session);
      incrementCount(day2Counts, submission.day2Session);
      if (submission.accommodation === "avail") {
        accommodationCount += 1;
      }
    });

    return {
      day1Counts,
      day2Counts,
      limit: SESSION_CAP,
      accommodationCount,
      accommodationLimit: ACCOMMODATION_CAP,
    };
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("day1_session, day2_session, accommodation");

  if (error) {
    throw new Error(error.message);
  }

  (data ?? []).forEach((row) => {
    const record = row as {
      day1_session?: string | null;
      day2_session?: string | null;
      accommodation?: Submission["accommodation"] | null;
    };
    incrementCount(day1Counts, record.day1_session ?? undefined);
    incrementCount(day2Counts, record.day2_session ?? undefined);
    if (record.accommodation === "avail") {
      accommodationCount += 1;
    }
  });

  return {
    day1Counts,
    day2Counts,
    limit: SESSION_CAP,
    accommodationCount,
    accommodationLimit: ACCOMMODATION_CAP,
  };
}

export type SessionAvailabilityResult =
  | { ok: true }
  | {
      ok: false;
      reason: "day1_full" | "day2_full" | "accommodation_full";
      counts: BreakoutSessionCounts;
    };

export const SESSION_AVAILABILITY_MESSAGES: Record<
  Exclude<SessionAvailabilityResult, { ok: true }>["reason"],
  string
> = {
  day1_full: "Selected Day 1 breakout session is full.",
  day2_full: "Selected Day 2 breakout session is full.",
  accommodation_full: "Accommodation slots are already full.",
};

export async function checkSessionAvailability(selection: {
  day1Session: string;
  day2Session: string;
  accommodation: Submission["accommodation"];
}): Promise<SessionAvailabilityResult> {
  const counts = await getBreakoutSessionCounts();

  if ((counts.day1Counts[selection.day1Session] ?? 0) >= counts.limit) {
    return { ok: false, reason: "day1_full", counts };
  }

  if ((counts.day2Counts[selection.day2Session] ?? 0) >= counts.limit) {
    return { ok: false, reason: "day2_full", counts };
  }

  if (
    selection.accommodation === "avail" &&
    counts.accommodationCount >= counts.accommodationLimit
  ) {
    return { ok: false, reason: "accommodation_full", counts };
  }

  return { ok: true };
}

export async function createSubmissionCsv(submissions: Submission[]) {
  const header = [
    "ID",
    "Submitted At",
    "Status",
    "Source",
    "Title",
    "First Name",
    "Middle Name",
    "Surname",
    "Congregation",
    "Email",
    "Mobile",
    "Complete Address",
    "Shirt Size",
    "Affiliation",
    "Organization",
    "Archdiocese",
    "Archdiocese (Other)",
    "Parish name",
    "Parish address",
    "Role in ministry",
    "Role in ministry (Other)",
    "Province",
    "School name",
    "School address",
    "Designation",
    "Designation (Other)",
    "Company / Organization",
    "Company address",
    "Position / Designation",
    "Day 1 Session",
    "Day 2 Session",
    "Accommodation",
    "Payment Mode",
    "Transaction Number",
    "ID upload URL",
    "Payment proof URL",
  ];

  const rows = await Promise.all(
    submissions.map(async (submission) => {
      const idUploadUrl = await getSubmissionFileUrl(submission.idUploadPath);
      const paymentProofUrl = await getSubmissionFileUrl(submission.paymentProofPath);

      return [
        submission.id,
        new Intl.DateTimeFormat("sv-SE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Manila",
        }).format(new Date(submission.submittedAt)),
        submission.status,
        getSourceLabel(submission.source),
        submission.title,
        submission.firstName,
        submission.middleName,
        submission.surname,
        submission.congregation,
        submission.email,
        submission.mobile,
        submission.completeAddress,
        submission.shirtSize,
        getAffiliationLabel(submission.affiliationType),
        getSubmissionOrganization(submission),
        // Parish-specific
        submission.affiliationType === "parish" ? submission.archdiocese : "",
        submission.affiliationType === "parish" ? submission.archdioceseOther : "",
        submission.affiliationType === "parish" ? submission.parishName : "",
        submission.affiliationType === "parish" ? submission.parishAddress : "",
        submission.affiliationType === "parish" ? submission.roleInMinistry : "",
        submission.affiliationType === "parish" ? submission.roleInMinistryOther : "",
        // School-specific
        submission.affiliationType === "school" ? submission.province : "",
        submission.affiliationType === "school" ? submission.schoolName : "",
        submission.affiliationType === "school" ? submission.schoolAddress : "",
        submission.affiliationType === "school" ? submission.designation : "",
        submission.affiliationType === "school" ? submission.designationOther : "",
        // Neither / Company
        submission.affiliationType === "neither" ? submission.companyOrganization : "",
        submission.affiliationType === "neither" ? submission.companyAddress : "",
        submission.affiliationType === "neither" ? submission.positionDesignation : "",
        submission.day1Session,
        submission.day2Session,
        submission.accommodation,
        submission.paymentMode,
        submission.transactionNumber,
        idUploadUrl || submission.idUploadName || "",
        paymentProofUrl || submission.paymentProofName || "",
      ];
    }),
  );

  return [header, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export async function listSubmissions() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockSubmissions;
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapRowToSubmission(row as SubmissionRow));
}

export type SubmissionSortKey =
  | "name"
  | "affiliation"
  | "organization"
  | "payment"
  | "status"
  | "submitted";

export type ListSubmissionsPageParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  affiliation?: Submission["affiliationType"] | "all";
  paymentMode?: Submission["paymentMode"] | "all";
  source?: Submission["source"] | "all";
  sortKey?: SubmissionSortKey;
  sortDir?: "asc" | "desc";
};

export type ListSubmissionsPageResult = {
  submissions: Submission[];
  total: number;
  page: number;
  pageSize: number;
};

const SORT_COLUMNS: Record<SubmissionSortKey, keyof SubmissionRow> = {
  name: "surname",
  affiliation: "affiliation_type",
  organization: "organization_name",
  payment: "payment_mode",
  status: "status",
  submitted: "submitted_at",
};

const SEARCH_COLUMNS = [
  "first_name",
  "middle_name",
  "surname",
  "email",
  "mobile",
  "organization_name",
  "school_name",
  "company_organization",
  "parish_name",
] as const;

function quoteOrFilterValue(value: string) {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"%${escaped}%"`;
}

function filterMockSubmissions(params: ListSubmissionsPageParams): Submission[] {
  const normalizedQuery = (params.query ?? "").trim().toLowerCase();

  return mockSubmissions.filter((submission) => {
    const searchableText = [
      submission.id,
      submission.firstName,
      submission.middleName,
      submission.surname,
      submission.email,
      submission.mobile,
      getSubmissionOrganization(submission),
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);
    const matchesAffiliation =
      !params.affiliation || params.affiliation === "all" || submission.affiliationType === params.affiliation;
    const matchesPayment =
      !params.paymentMode || params.paymentMode === "all" || submission.paymentMode === params.paymentMode;

    const matchesSource =
      !params.source || params.source === "all" || submission.source === params.source;

    return matchesQuery && matchesAffiliation && matchesPayment && matchesSource;
  });
}

export async function listSubmissionsPage(
  params: ListSubmissionsPageParams = {},
): Promise<ListSubmissionsPageResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 25, 1), 100);
  const sortKey = params.sortKey ?? "submitted";
  const sortDir = params.sortDir ?? "desc";

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const filtered = filterMockSubmissions(params);
    const from = (page - 1) * pageSize;
    return {
      submissions: filtered.slice(from, from + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  let queryBuilder = supabase.from("submissions").select("*", { count: "exact" });

  if (params.affiliation && params.affiliation !== "all") {
    queryBuilder = queryBuilder.eq("affiliation_type", params.affiliation);
  }

  if (params.paymentMode && params.paymentMode !== "all") {
    queryBuilder = queryBuilder.eq("payment_mode", params.paymentMode);
  }

  if (params.source && params.source !== "all") {
    queryBuilder = queryBuilder.eq("source", params.source);
  }

  const trimmedQuery = (params.query ?? "").trim();
  if (trimmedQuery.length > 0) {
    const quoted = quoteOrFilterValue(trimmedQuery);
    queryBuilder = queryBuilder.or(SEARCH_COLUMNS.map((column) => `${column}.ilike.${quoted}`).join(","));
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await queryBuilder
    .order(SORT_COLUMNS[sortKey], { ascending: sortDir === "asc" })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    submissions: (data ?? []).map((row) => mapRowToSubmission(row as SubmissionRow)),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export type SubmissionStats = {
  total: number;
  verified: number;
  pending: number;
  accommodationRequests: number;
};

export async function getSubmissionStats(): Promise<SubmissionStats> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return {
      total: mockSubmissions.length,
      verified: mockSubmissions.filter((s) => s.status === "Verified").length,
      pending: mockSubmissions.filter((s) => s.status === "Pending").length,
      accommodationRequests: mockSubmissions.filter((s) => s.accommodation === "avail").length,
    };
  }

  const [totalRes, verifiedRes, pendingRes, accommodationRes] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "Verified"),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("accommodation", "avail"),
  ]);

  for (const res of [totalRes, verifiedRes, pendingRes, accommodationRes]) {
    if (res.error) {
      throw new Error(res.error.message);
    }
  }

  return {
    total: totalRes.count ?? 0,
    verified: verifiedRes.count ?? 0,
    pending: pendingRes.count ?? 0,
    accommodationRequests: accommodationRes.count ?? 0,
  };
}

export async function getSubmissionById(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return mockSubmissions.find((submission) => submission.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToSubmission(data as SubmissionRow) : null;
}

export async function getSubmissionFileUrl(storagePath?: string) {
  if (!storagePath) {
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    return storagePath;
  }

  return supabase.storage.from(getStorageBucketName()).getPublicUrl(storagePath)
    .data.publicUrl;
}

function buildDetailsRow(input: RegistrationSubmissionInput) {
  return {
    affiliation_type: input.affiliationType,
    title: input.title,
    first_name: input.firstName,
    middle_name: input.middleName,
    surname: input.surname,
    congregation: input.congregation,
    email: input.email,
    mobile: input.mobile,
    complete_address: input.completeAddress,
    shirt_size: input.shirtSize,
    organization_name: input.organizationName,
    archdiocese: input.archdiocese,
    archdiocese_other: input.archdioceseOther,
    parish_name: input.parishName,
    parish_address: input.parishAddress,
    role_in_ministry: input.roleInMinistry,
    role_in_ministry_other: input.roleInMinistryOther,
    province: input.province,
    school_name: input.schoolName,
    school_address: input.schoolAddress,
    designation: input.designation,
    designation_other: input.designationOther,
    company_organization: input.companyOrganization,
    company_address: input.companyAddress,
    position_designation: input.positionDesignation,
    day1_session: input.day1Session,
    day2_session: input.day2Session,
    accommodation: input.accommodation,
    payment_mode: input.paymentMode,
    transaction_number: input.transactionNumber,
  } satisfies Partial<SubmissionRow>;
}

export type WalkInSubmissionInput = {
  title: string;
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  mobile: string;
  archdiocese: string;
  archdioceseOther: string;
  parishName: string;
  parishAddress: string;
  organizationName: string;
  day1Session: string;
  day2Session: string;
};

// Walk-ins register as parish representatives, pay cash at the cashier and
// stay Pending until an admin verifies them.
export async function createWalkInSubmission(input: WalkInSubmissionInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const details = buildDetailsRow({
    ...input,
    affiliationType: "parish",
    roleInMinistry: "",
    roleInMinistryOther: "",
    province: "",
    schoolName: "",
    schoolAddress: "",
    designation: "",
    designationOther: "",
    companyOrganization: "",
    companyAddress: "",
    positionDesignation: "",
    congregation: "",
    completeAddress: "",
    shirtSize: "",
    accommodation: "self",
    paymentMode: "Cash",
    transactionNumber: "",
  });

  const row = {
    ...details,
    id: randomUUID(),
    submitted_at: new Date().toISOString(),
    status: "Pending" as const,
    source: "walk_in" as const,
    complete_address: null,
    shirt_size: null,
    id_upload_name: null,
    id_upload_path: null,
    payment_proof_name: null,
    payment_proof_path: null,
  } satisfies Partial<SubmissionRow>;

  const { data, error } = await supabase
    .from("submissions")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToSubmission(data as SubmissionRow);
}

// Admin-added entries skip the ID and payment proof uploads and stay Pending
// until an admin verifies them, same as walk-ins.
export async function createAdminSubmission(input: RegistrationSubmissionInput) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const row = {
    ...buildDetailsRow(input),
    id: randomUUID(),
    submitted_at: new Date().toISOString(),
    status: "Pending" as const,
    source: "admin" as const,
    id_upload_name: null,
    id_upload_path: null,
    payment_proof_name: null,
    payment_proof_path: null,
  } satisfies Partial<SubmissionRow>;

  const { data, error } = await supabase
    .from("submissions")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToSubmission(data as SubmissionRow);
}

export async function createRegistrationSubmission(
  input: RegistrationSubmissionInput,
  files: {
    idUpload: File;
    paymentProof: File;
  },
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const submissionId = randomUUID();
  const bucketName = getStorageBucketName();
  const idUploadPath = buildStoragePath(
    submissionId,
    "id-upload",
    files.idUpload.name,
  );
  const paymentProofPath = buildStoragePath(
    submissionId,
    "payment-proof",
    files.paymentProof.name,
  );

  const [idUploadResult, paymentProofResult] = await Promise.all([
    supabase.storage.from(bucketName).upload(idUploadPath, files.idUpload, {
      contentType: files.idUpload.type,
      upsert: false,
    }),
    supabase.storage
      .from(bucketName)
      .upload(paymentProofPath, files.paymentProof, {
        contentType: files.paymentProof.type,
        upsert: false,
      }),
  ]);

  if (idUploadResult.error) {
    throw new Error(idUploadResult.error.message);
  }

  if (paymentProofResult.error) {
    throw new Error(paymentProofResult.error.message);
  }

  const row = {
    id: submissionId,
    submitted_at: new Date().toISOString(),
    status: "Pending" as const,
    source: "online" as const,
    ...buildDetailsRow(input),
    id_upload_name: files.idUpload.name,
    payment_proof_name: files.paymentProof.name,
    id_upload_path: idUploadPath,
    payment_proof_path: paymentProofPath,
  } satisfies Partial<SubmissionRow>;

  const { data, error } = await supabase
    .from("submissions")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToSubmission(data as SubmissionRow);
}

export async function updateSubmissionDetails(
  id: string,
  input: RegistrationSubmissionInput,
): Promise<Submission | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const row = buildDetailsRow(input);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    Object.assign(submission, input);
    return submission;
  }

  const { data, error } = await supabase
    .from("submissions")
    .update(row)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToSubmission(data as SubmissionRow) : null;
}

export async function deleteSubmission(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const idx = mockSubmissions.findIndex((s) => s.id === id);
    if (idx !== -1) mockSubmissions.splice(idx, 1);
    return;
  }

  const { data } = await supabase
    .from("submissions")
    .select("id_upload_path, payment_proof_path")
    .eq("id", id)
    .maybeSingle();

  if (data) {
    const paths = [
      (data as { id_upload_path?: string | null }).id_upload_path,
      (data as { payment_proof_path?: string | null }).payment_proof_path,
    ].filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from(getStorageBucketName()).remove(paths);
    }
  }

  const { error } = await supabase.from("submissions").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    submission.status = status;
    return submission;
  }

  const { data, error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRowToSubmission(data as SubmissionRow) : null;
}

export type AttendanceMode =
  | "dayOneAttendance"
  | "dayTwoAttendance"
  | "dayOneBreakoutAttendance"
  | "dayTwoBreakoutAttendance";

const ATTENDANCE_MODE_TO_COLUMN: Record<AttendanceMode, keyof SubmissionRow> = {
  dayOneAttendance: "day_one_attendance",
  dayTwoAttendance: "day_two_attendance",
  dayOneBreakoutAttendance: "day_one_breakout_attendance",
  dayTwoBreakoutAttendance: "day_two_breakout_attendance",
};

const ATTENDANCE_MODE_TO_FIELD: Record<AttendanceMode, keyof Submission> = {
  dayOneAttendance: "dayOneAttendance",
  dayTwoAttendance: "dayTwoAttendance",
  dayOneBreakoutAttendance: "dayOneBreakoutAttendance",
  dayTwoBreakoutAttendance: "dayTwoBreakoutAttendance",
};

export type MarkArrivalResult = {
  alreadyArrived: boolean;
  oldData: string | null;
  newData: Submission;
};

export async function markSubmissionArrival(
  id: string,
  mode: AttendanceMode,
  opts: { override?: boolean } = {},
): Promise<MarkArrivalResult | null> {
  const column = ATTENDANCE_MODE_TO_COLUMN[mode];
  const field = ATTENDANCE_MODE_TO_FIELD[mode];
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    const oldData = submission[field] as string | null;

    if (oldData && !opts.override) {
      return { alreadyArrived: true, oldData, newData: submission };
    }

    (submission as unknown as Record<string, string>)[field] = new Date().toISOString();
    return { alreadyArrived: false, oldData, newData: submission };
  }

  const { data: existing, error: existingError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    return null;
  }

  const existingRow = existing as SubmissionRow;
  const oldData = (existingRow[column] as string | null) ?? null;

  if (oldData && !opts.override) {
    return { alreadyArrived: true, oldData, newData: mapRowToSubmission(existingRow) };
  }

  const { data, error } = await supabase
    .from("submissions")
    .update({ [column]: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return { alreadyArrived: false, oldData, newData: mapRowToSubmission(data as SubmissionRow) };
}

export type ClearArrivalResult = {
  oldData: string | null;
  newData: Submission;
};

export async function clearSubmissionArrival(
  id: string,
  mode: AttendanceMode,
): Promise<ClearArrivalResult | null> {
  const column = ATTENDANCE_MODE_TO_COLUMN[mode];
  const field = ATTENDANCE_MODE_TO_FIELD[mode];
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    const oldData = submission[field] as string | null;
    (submission as unknown as Record<string, string | null>)[field] = null;
    return { oldData, newData: submission };
  }

  const { data: existing, error: existingError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    return null;
  }

  const oldData = ((existing as SubmissionRow)[column] as string | null) ?? null;

  const { data, error } = await supabase
    .from("submissions")
    .update({ [column]: null })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return { oldData, newData: mapRowToSubmission(data as SubmissionRow) };
}

export type SetKitReceivedResult = {
  oldData: boolean;
  newData: Submission;
};

export class KitReceivedBlockedError extends Error {}

export async function setKitReceived(
  id: string,
  received: boolean,
): Promise<SetKitReceivedResult | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    if (received && !submission.dayOneAttendance) {
      throw new KitReceivedBlockedError("Cannot mark kit received before Day 1 check-in.");
    }

    const oldData = submission.kitReceived;
    submission.kitReceived = received;
    return { oldData, newData: submission };
  }

  const { data: existing, error: existingError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    return null;
  }

  if (received && !(existing as SubmissionRow).day_one_attendance) {
    throw new KitReceivedBlockedError("Cannot mark kit received before Day 1 check-in.");
  }

  const oldData = (existing as SubmissionRow).kit_received ?? false;

  const { data, error } = await supabase
    .from("submissions")
    .update({ kit_received: received })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return { oldData, newData: mapRowToSubmission(data as SubmissionRow) };
}

export type SetShirtPaymentReceivedResult = {
  oldData: boolean;
  newData: Submission;
};

export async function setShirtPaymentReceived(
  id: string,
  received: boolean,
): Promise<SetShirtPaymentReceivedResult | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  if (!supabase) {
    const submission = mockSubmissions.find((item) => item.id === id);

    if (!submission) {
      return null;
    }

    const oldData = submission.shirtPaymentReceived;
    submission.shirtPaymentReceived = received;
    return { oldData, newData: submission };
  }

  const { data: existing, error: existingError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (!existing) {
    return null;
  }

  const oldData = (existing as SubmissionRow).shirt_payment_received ?? false;

  const { data: updated, error: updateError } = await supabase
    .from("submissions")
    .update({ shirt_payment_received: received })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (!updated) {
    return null;
  }

  return { oldData, newData: mapRowToSubmission(updated as SubmissionRow) };
}
