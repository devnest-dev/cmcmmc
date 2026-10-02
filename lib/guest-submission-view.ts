import type { Submission } from "@/lib/admin-submissions";

export type GuestRegistrationView = {
  displayName: string;
  diocese: string;
  parishName: string;
  day1Session: string;
  day2Session: string;
  accommodation: Submission["accommodation"];
  shirtSize: string;
  confirmed: boolean;
  dayOneAttendance: string | null;
  dayTwoAttendance: string | null;
  dayOneBreakoutAttendance: string | null;
  dayTwoBreakoutAttendance: string | null;
  kitReceived: boolean;
};

function getGuestDisplayName(submission: Submission) {
  return [submission.title, submission.firstName, submission.surname].filter(Boolean).join(" ");
}

function getGuestDiocese(submission: Submission) {
  if (submission.affiliationType !== "parish") return "";
  return submission.archdiocese === "Others"
    ? submission.archdioceseOther || submission.archdiocese
    : submission.archdiocese;
}

export function toGuestView(submission: Submission): GuestRegistrationView {
  return {
    displayName: getGuestDisplayName(submission),
    diocese: getGuestDiocese(submission),
    parishName: submission.affiliationType === "parish" ? submission.parishName : "",
    day1Session: submission.day1Session,
    day2Session: submission.day2Session,
    accommodation: submission.accommodation,
    shirtSize: submission.shirtSize,
    confirmed: submission.status === "Verified",
    dayOneAttendance: submission.dayOneAttendance,
    dayTwoAttendance: submission.dayTwoAttendance,
    dayOneBreakoutAttendance: submission.dayOneBreakoutAttendance,
    dayTwoBreakoutAttendance: submission.dayTwoBreakoutAttendance,
    kitReceived: submission.kitReceived,
  };
}
