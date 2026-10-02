export const SUBMISSION_STATUSES = ["Pending", "Verified", "Needs review"] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const SUBMISSION_SOURCES = ["online", "walk_in", "admin"] as const;

export type SubmissionSource = (typeof SUBMISSION_SOURCES)[number];

export const PAYMENT_MODES = ["GCash", "BDO", "Cash"] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

export type Submission = {
  id: string;
  submittedAt: string;
  status: SubmissionStatus;
  source: SubmissionSource;
  affiliationType: "parish" | "school" | "neither";
  title: string;
  firstName: string;
  middleName: string;
  surname: string;
  congregation: string;
  email: string;
  mobile: string;
  completeAddress: string;
  shirtSize: string;
  organizationName: string;
  archdiocese: string;
  archdioceseOther: string;
  parishName: string;
  parishAddress: string;
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
  day1Session: string;
  day2Session: string;
  accommodation: "avail" | "self";
  paymentMode: PaymentMode;
  transactionNumber: string;
  idUploadName: string;
  paymentProofName: string;
  idUploadPath?: string;
  paymentProofPath?: string;
  invoiceName: string;
  invoicePath: string;
  dayOneAttendance: string | null;
  dayTwoAttendance: string | null;
  dayOneBreakoutAttendance: string | null;
  dayTwoBreakoutAttendance: string | null;
  kitReceived: boolean;
  shirtPaymentReceived: boolean;
};

export const mockSubmissions: Submission[] = [
  {
    id: "CMC-001",
    submittedAt: "2026-05-28T09:20:00+08:00",
    status: "Verified",
    source: "online",
    affiliationType: "parish",
    title: "Rev. Fr.",
    firstName: "Albert",
    middleName: "Santos",
    surname: "Garong",
    congregation: "SSP",
    email: "albert.garong@example.com",
    mobile: "09171234567",
    completeAddress: "Archdiocese of Cebu, Cebu City",
    shirtSize: "XL",
    organizationName: "Diocesan Media Ministry",
    archdiocese: "Archdiocese of Cebu",
    archdioceseOther: "",
    parishName: "Saint Joseph Parish",
    parishAddress: "Cebu City",
    roleInMinistry: "Spiritual Director",
    roleInMinistryOther: "",
    province: "",
    schoolName: "",
    schoolAddress: "",
    designation: "",
    designationOther: "",
    companyOrganization: "",
    companyAddress: "",
    positionDesignation: "",
    day1Session: "day1-audio",
    day2Session: "day2-production",
    accommodation: "avail",
    paymentMode: "GCash",
    transactionNumber: "GCASH-001",
    idUploadName: "albert-garong-id.pdf",
    paymentProofName: "gcash-receipt-albert.pdf",
    invoiceName: "",
    invoicePath: "",
    dayOneAttendance: null,
    dayTwoAttendance: null,
    dayOneBreakoutAttendance: null,
    dayTwoBreakoutAttendance: null,
    kitReceived: false,
    shirtPaymentReceived: false,
  },
  {
    id: "CMC-002",
    submittedAt: "2026-05-28T11:45:00+08:00",
    status: "Pending",
    source: "online",
    affiliationType: "school",
    title: "Ms.",
    firstName: "April",
    middleName: "Frances",
    surname: "Ortigas",
    congregation: "",
    email: "april.ortigas@example.com",
    mobile: "+639171234568",
    completeAddress: "University of San Carlos, Cebu City",
    shirtSize: "M",
    organizationName: "",
    archdiocese: "",
    archdioceseOther: "",
    parishName: "",
    parishAddress: "",
    roleInMinistry: "",
    roleInMinistryOther: "",
    province: "Cebu",
    schoolName: "University of San Carlos",
    schoolAddress: "Talamban Campus, Cebu City",
    designation: "Graphic Artist",
    designationOther: "",
    companyOrganization: "",
    companyAddress: "",
    positionDesignation: "",
    day1Session: "day1-writing",
    day2Session: "day2-graphics",
    accommodation: "self",
    paymentMode: "BDO",
    transactionNumber: "BDO-002",
    idUploadName: "april-ortigas-id.png",
    paymentProofName: "bdo-transfer-april.png",
    invoiceName: "",
    invoicePath: "",
    dayOneAttendance: null,
    dayTwoAttendance: null,
    dayOneBreakoutAttendance: null,
    dayTwoBreakoutAttendance: null,
    kitReceived: false,
    shirtPaymentReceived: false,
  },
  {
    id: "CMC-003",
    submittedAt: "2026-05-29T14:05:00+08:00",
    status: "Needs review",
    source: "online",
    affiliationType: "neither",
    title: "Mr.",
    firstName: "Aubry",
    middleName: "",
    surname: "Lerio",
    congregation: "",
    email: "aubry.lerio@example.com",
    mobile: "09171234569",
    completeAddress: "Mandaue City",
    shirtSize: "L",
    organizationName: "",
    archdiocese: "",
    archdioceseOther: "",
    parishName: "",
    parishAddress: "",
    roleInMinistry: "",
    roleInMinistryOther: "",
    province: "",
    schoolName: "",
    schoolAddress: "",
    designation: "",
    designationOther: "",
    companyOrganization: "Catholic Media Studio",
    companyAddress: "Mandaue City",
    positionDesignation: "Producer",
    day1Session: "day1-video",
    day2Session: "day2-cognitive",
    accommodation: "avail",
    paymentMode: "GCash",
    transactionNumber: "GCASH-003",
    idUploadName: "aubry-lerio-id.webp",
    paymentProofName: "gcash-proof-aubry.pdf",
    invoiceName: "",
    invoicePath: "",
    dayOneAttendance: null,
    dayTwoAttendance: null,
    dayOneBreakoutAttendance: null,
    dayTwoBreakoutAttendance: null,
    kitReceived: false,
    shirtPaymentReceived: false,
  },
];

export function formatSubmissionDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(isoDate));
}

export function getSubmissionDisplayName(submission: Submission) {
  return [submission.title, submission.firstName, submission.middleName, submission.surname]
    .filter(Boolean)
    .join(" ");
}

export function getSubmissionOrganization(submission: Submission) {
  if (submission.affiliationType === "parish") {
    return submission.organizationName || submission.parishName || "Parish submission";
  }

  if (submission.affiliationType === "school") {
    return submission.schoolName || submission.province || "School submission";
  }

  return submission.companyOrganization || submission.positionDesignation || "Independent submission";
}

export function getAffiliationLabel(affiliationType: Submission["affiliationType"]) {
  switch (affiliationType) {
    case "parish":
      return "Parish";
    case "school":
      return "School";
    default:
      return "Unaffiliated";
  }
}

export function getSourceLabel(source: SubmissionSource) {
  switch (source) {
    case "walk_in":
      return "Walk-in";
    case "admin":
      return "Admin";
    default:
      return "Online";
  }
}

export function buildSubmissionCsv(submissions: Submission[]) {
  const header = [
    "ID",
    "Submitted At",
    "Status",
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
    "ID upload name",
    "Payment proof name",
  ];

  const rows = submissions.map((submission) => [
    submission.id,
    formatSubmissionDate(submission.submittedAt),
    submission.status,
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
    submission.idUploadName,
    submission.paymentProofName,
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}