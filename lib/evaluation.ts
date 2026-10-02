import { z } from "zod";

export type EvaluationQuestion = {
  id: string;
  text: string;
};

export type EvaluationSection = {
  key: string;
  title: string;
  questions: EvaluationQuestion[];
};

export const RATING_SCALE = [1, 2, 3, 4] as const;

// Question ids match the numbering on the printed evaluation form and are the
// keys stored in `evaluations.ratings`, so never renumber existing questions.
export const EVALUATION_SECTIONS: EvaluationSection[] = [
  {
    key: "registration",
    title: "Registration",
    questions: [
      { id: "q1", text: "The registration process was easy and convenient." },
      { id: "q2", text: "Conference kits and materials were distributed efficiently." },
      { id: "q3", text: "Announcements during the conference were timely and accurate." },
      { id: "q4", text: "The conference schedule and updates were easy to access." },
    ],
  },
  {
    key: "program",
    title: "Program",
    questions: [
      { id: "q5", text: "The program of the Congress was well-organized." },
      { id: "q6", text: "The sequence of activities was logical and engaging." },
      { id: "q7", text: "Time was managed effectively throughout the program." },
      { id: "q8", text: "Transitions between activities were smooth and seamless." },
      { id: "q9", text: "Liturgical activities were meaningful, appropriate and enriching." },
      { id: "q10", text: "Audio-visual presentations supported the program effectively." },
    ],
  },
  {
    key: "concessionaires",
    title: "Concessionaires",
    questions: [
      { id: "q11", text: "There was an adequate variety of food and merchandise." },
      { id: "q12", text: "The food options met my expectations." },
      { id: "q13", text: "Prices were reasonable." },
    ],
  },
  {
    key: "sessions",
    title: "Plenary and Concurrent Sessions",
    questions: [
      { id: "q14", text: "The ideas shared during the plenary sessions were relevant to the Congress theme." },
      {
        id: "q15",
        text: "The plenary speakers demonstrated expertise in their respective fields by providing practical and meaningful insights.",
      },
      { id: "q16", text: "The plenary speakers engaged the audience effectively." },
      { id: "q17", text: "The duration of each plenary session was appropriate." },
      { id: "q18", text: "The topics of the concurrent sessions were relevant to my interests and/or ministry." },
      { id: "q19", text: "The speakers during the concurrent sessions demonstrated competence and preparedness." },
      { id: "q20", text: "The concurrent sessions encouraged participant engagement." },
      { id: "q21", text: "The venue and room setup was conducive for learning." },
      { id: "q22", text: "The allotted time for the plenary and breakout sessions were sufficient." },
    ],
  },
  {
    key: "volunteers",
    title: "Volunteers",
    questions: [
      { id: "q23", text: "Volunteers and ushers were courteous and welcoming." },
      { id: "q24", text: "Volunteers and ushers demonstrated professionalism throughout the Congress." },
      { id: "q25", text: "Volunteers and ushers responded promptly to participants' concerns." },
    ],
  },
];

export const EVALUATION_QUESTIONS = EVALUATION_SECTIONS.flatMap((section) => section.questions);

export const OPEN_QUESTIONS = [
  {
    key: "insights",
    label: "Share with us your insights and reflections from the talks.",
    hint: "Chosen responses may be published in the Archdiocese's social media accounts.",
    optional: false,
  },
  {
    key: "improvements",
    label: "What are some points which we need to improve for the next Congress?",
    optional: false,
  },
  {
    key: "topics",
    label: "What topics and workshops would you want us to consider for the next Congress?",
    optional: false,
  },
  {
    key: "volunteerMessage",
    label: "Do you have words to share with our volunteers? Write them here.",
    optional: true,
  },
] as const;

export const EVALUATION_CONSENT_TEXT =
  "I voluntarily give my full consent for CADCOMM to use and process the information submitted through this form for the 2nd CM-CMMC.";

export type EvaluationSource = "qr" | "public";

export type EvaluationRatings = Record<string, number>;

const ratingsSchema = z.object(
  Object.fromEntries(
    EVALUATION_QUESTIONS.map((question) => [
      question.id,
      z
        .number({ error: "Select a rating." })
        .int({ error: "Select a rating." })
        .min(1, { error: "Select a rating." })
        .max(4, { error: "Select a rating." }),
    ]),
  ),
);

const requiredText = (message: string) => z.string().trim().min(1, { error: message });

const baseEvaluationSchema = z.object({
  consent: z.boolean().refine((value) => value === true, {
    error: "You must give your consent to submit this form.",
  }),
  certificateRequested: z.boolean(),
  ratings: ratingsSchema,
  insights: requiredText("Please share your insights and reflections."),
  improvements: requiredText("Please share what we can improve."),
  topics: requiredText("Please suggest topics or workshops."),
  volunteerMessage: z.string().trim(),
  // Personal info is only required on the public form; QR responses take it
  // from the linked registration instead.
  fullName: z.string().trim(),
  archdiocese: z.string().trim(),
  parishName: z.string().trim(),
  parishAddress: z.string().trim(),
  email: z.string().trim(),
});

const publicEvaluationSchema = baseEvaluationSchema.extend({
  fullName: requiredText("Enter your complete name."),
  archdiocese: requiredText("Select your arch/diocese."),
  parishName: requiredText("Enter your parish or affiliated institution."),
  parishAddress: requiredText("Enter the address of your parish or institution."),
  email: z.string().trim().email({ error: "Enter a valid email address." }),
});

export type EvaluationFormValues = z.infer<typeof baseEvaluationSchema>;

export function getEvaluationSchema(source: EvaluationSource) {
  return source === "public" ? publicEvaluationSchema : baseEvaluationSchema;
}

export type Evaluation = {
  id: string;
  createdAt: string;
  submissionId: string | null;
  source: EvaluationSource;
  fullName: string;
  archdiocese: string;
  parishName: string;
  parishAddress: string;
  email: string;
  certificateRequested: boolean;
  ratings: EvaluationRatings;
  insights: string;
  improvements: string;
  topics: string;
  volunteerMessage: string;
};

// Present only for responses linked to a registration.
export type EvaluationWithAttendance = Evaluation & {
  attendedBothDays: boolean | null;
};

export type EvaluationStatus = {
  open: boolean;
  closesAt: string;
  isAcceptingResponses: boolean;
};

export type QuestionSummary = {
  id: string;
  text: string;
  average: number | null;
  distribution: Record<(typeof RATING_SCALE)[number], number>;
  responses: number;
};

export type SectionSummary = {
  key: string;
  title: string;
  average: number | null;
  questions: QuestionSummary[];
};

export type EvaluationSummary = {
  totalResponses: number;
  qrResponses: number;
  publicResponses: number;
  certificateRequests: number;
  overallAverage: number | null;
  sections: SectionSummary[];
};

export function formatAverage(value: number | null) {
  return value === null ? "—" : value.toFixed(2);
}

export const mockEvaluations: Evaluation[] = [
  {
    id: "EVAL-001",
    createdAt: "2026-10-05T14:00:00+08:00",
    submissionId: "CMC-001",
    source: "qr",
    fullName: "Maria Santos",
    archdiocese: "Archdiocese of Cebu",
    parishName: "St. Joseph Parish",
    parishAddress: "Mabolo, Cebu City",
    email: "maria@example.com",
    certificateRequested: true,
    ratings: Object.fromEntries(EVALUATION_QUESTIONS.map((question) => [question.id, 4])),
    insights: "The talks reminded me that digital media is a mission field.",
    improvements: "More seating during the plenary sessions.",
    topics: "Short-form video for parish ministries.",
    volunteerMessage: "Thank you for your warm welcome!",
  },
];
