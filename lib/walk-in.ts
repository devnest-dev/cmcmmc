import { z } from "zod";

import { day1Options, day2Options, parishOptions, titleOptions } from "@/lib/registration-options";

const day1Values = day1Options.map((option) => option.value) as [string, ...string[]];
const day2Values = day2Options.map((option) => option.value) as [string, ...string[]];

function requiredText(message: string) {
  return z.string().trim().min(1, message);
}

export const walkInSchema = z
  .object({
    title: z.enum(titleOptions, { error: "Select a title." }),
    firstName: requiredText("First name is required."),
    middleName: z.string().trim(),
    surname: requiredText("Last name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    mobile: z
      .string()
      .trim()
      .regex(/^(09|\+639)\d{9}$/, "Enter a valid mobile number (e.g. 09171234567)."),
    archdiocese: z.enum(parishOptions as [string, ...string[]], { error: "Select an arch/diocese." }),
    archdioceseOther: z.string().trim(),
    parishName: requiredText("Parish is required."),
    parishAddress: requiredText("Parish address is required."),
    organizationName: z.string().trim(),
    day1Session: z.enum(day1Values, { error: "Select a Day 1 breakout session." }),
    day2Session: z.enum(day2Values, { error: "Select a Day 2 breakout session." }),
  })
  .refine((values) => values.archdiocese !== "Others" || values.archdioceseOther.length > 0, {
    path: ["archdioceseOther"],
    message: "Specify your arch/diocese.",
  });

export type WalkInFormValues = z.infer<typeof walkInSchema>;

export type WalkInSessionCounts = {
  day1Counts: Record<string, number>;
  day2Counts: Record<string, number>;
  limit: number;
};

export function isSessionFull(counts: Record<string, number>, value: string, limit: number) {
  return (counts[value] ?? 0) >= limit;
}
