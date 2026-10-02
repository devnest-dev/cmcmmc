"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parishOptions } from "@/lib/registration-options";
import {
  EVALUATION_CONSENT_TEXT,
  EVALUATION_SECTIONS,
  OPEN_QUESTIONS,
  RATING_SCALE,
  getEvaluationSchema,
  type EvaluationFormValues,
  type EvaluationSource,
} from "@/lib/evaluation";

const REASON_MESSAGES: Record<string, string> = {
  closed: "The evaluation form is no longer accepting responses.",
  submission_not_found: "We couldn't find your registration. Please use the public evaluation form instead.",
};

const RATING_LABELS: Record<(typeof RATING_SCALE)[number], string> = {
  1: "1 – lowest",
  2: "2",
  3: "3",
  4: "4 – highest",
};

// The theme's default focus ring is a 50% grey that is hard to see; use a
// solid, high-contrast ring throughout this form instead.
const FOCUS_RING =
  "focus-visible:border-[#1a2e5a] focus-visible:ring-2 focus-visible:ring-[#1a2e5a] focus-visible:ring-offset-2";
// Input borders need at least 3:1 contrast against white to be perceivable.
const FIELD_CLASS = cn("border-slate-500 aria-invalid:border-destructive", FOCUS_RING);
const OPTION_CARD_CLASS =
  "flex items-start gap-3 rounded-lg border border-slate-300 p-4 transition hover:border-[#2aadb5] has-[[data-state=checked]]:border-[#2aadb5] has-[[data-state=checked]]:bg-[#2aadb5]/5 has-[[aria-invalid=true]]:border-destructive motion-reduce:transition-none";

type PersonalTextField = {
  name: "fullName" | "parishName" | "parishAddress" | "email";
  label: string;
  type?: string;
  autoComplete?: string;
  wide?: boolean;
};

// Arch/diocese (a select) is rendered between the first and remaining fields.
const PERSONAL_TEXT_FIELDS: PersonalTextField[] = [
  { name: "fullName", label: "Complete name", autoComplete: "name", wide: true },
  { name: "parishName", label: "Complete name of parish / affiliated institution" },
  { name: "parishAddress", label: "Address of parish / affiliated institution" },
  {
    name: "email",
    label: "Email address (for sending of certificates)",
    type: "email",
    autoComplete: "email",
    wide: true,
  },
];

const defaultValues: EvaluationFormValues = {
  consent: false,
  certificateRequested: false,
  ratings: {},
  insights: "",
  improvements: "",
  topics: "",
  volunteerMessage: "",
  fullName: "",
  archdiocese: "",
  parishName: "",
  parishAddress: "",
  email: "",
};

// The shared form primitives don't wire up ids, so derive stable ones per field
// to associate labels, hints, and error messages with their controls.
function fieldIds(name: string) {
  const id = `evaluation-${name.replace(/\./g, "-")}`;
  return { id, labelId: `${id}-label`, hintId: `${id}-hint`, messageId: `${id}-message` };
}

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function SectionCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const headingId = `${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 id={headingId} className="text-lg font-semibold text-[#1a2e5a]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-[#e63946]">
      *
    </span>
  );
}

export default function EvaluationForm({
  source,
  submissionId,
}: {
  source: EvaluationSource;
  submissionId?: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [archdioceseChoice, setArchdioceseChoice] = React.useState("");
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(getEvaluationSchema(source)),
    defaultValues,
  });

  React.useEffect(() => {
    if (!submitted) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    // Move focus so screen reader users hear the confirmation.
    successHeadingRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  const onSubmit = async (values: EvaluationFormValues) => {
    try {
      const response = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, submissionId, values }),
      });
      const result = (await response.json()) as { ok: boolean; reason?: string; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(
          (result.reason && REASON_MESSAGES[result.reason]) ||
            result.error ||
            "Unable to submit your evaluation.",
        );
      }

      setSubmitted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your evaluation.");
    }
  };

  const onInvalid = () => {
    toast.error("Please complete all required fields before submitting.");
  };

  const renderTextField = (config: PersonalTextField) => (
    <FormField
      key={config.name}
      control={form.control}
      name={config.name}
      render={({ field, fieldState }) => {
        const ids = fieldIds(field.name);

        return (
          <FormItem className={cn(config.wide && "md:col-span-2")}>
            <FormLabel htmlFor={ids.id}>
              {config.label} <RequiredMark />
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id={ids.id}
                type={config.type ?? "text"}
                autoComplete={config.autoComplete}
                aria-required="true"
                aria-describedby={describedBy(fieldState.error && ids.messageId)}
                className={FIELD_CLASS}
              />
            </FormControl>
            <FormMessage id={ids.messageId} />
          </FormItem>
        );
      }}
    />
  );

  if (submitted) {
    return (
      <section
        role="status"
        className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <CheckCircle2 aria-hidden="true" className="mx-auto size-12 text-[#2aadb5]" />
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="rounded-md text-2xl font-semibold text-[#1a2e5a] focus:outline-none"
        >
          Thank you for your feedback!
        </h2>
        <p className="text-sm text-slate-600">
          Your evaluation has been recorded. Your honest feedback will help us improve future
          formation programs.
        </p>
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
        <p className="text-sm text-slate-600">
          Fields marked with <RequiredMark /> are required.
        </p>

        <SectionCard id="evaluation-consent" title="Data privacy consent">
          <FormField
            control={form.control}
            name="consent"
            render={({ field, fieldState }) => {
              const ids = fieldIds(field.name);

              return (
                <FormItem>
                  <label htmlFor={ids.id} className={OPTION_CARD_CLASS}>
                    <FormControl>
                      <Checkbox
                        ref={field.ref}
                        id={ids.id}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        onBlur={field.onBlur}
                        aria-required="true"
                        aria-describedby={describedBy(fieldState.error && ids.messageId)}
                        className={cn("mt-0.5 border-slate-500", FOCUS_RING)}
                      />
                    </FormControl>
                    <span className="text-sm text-slate-700">
                      {EVALUATION_CONSENT_TEXT} <RequiredMark />
                    </span>
                  </label>
                  <FormMessage id={ids.messageId} />
                </FormItem>
              );
            }}
          />
        </SectionCard>

        <SectionCard id="evaluation-personal" title="Personal information">
          {source === "public" ? (
            <div className="grid gap-5 md:grid-cols-2">
              {renderTextField(PERSONAL_TEXT_FIELDS[0])}

              <FormField
                control={form.control}
                name="archdiocese"
                render={({ field, fieldState }) => {
                  const ids = fieldIds(field.name);
                  const errorId = fieldState.error && ids.messageId;

                  return (
                    <FormItem className="md:col-span-2">
                      <FormLabel htmlFor={ids.id}>
                        Arch/diocese <RequiredMark />
                      </FormLabel>
                      <Select
                        value={archdioceseChoice}
                        onValueChange={(value) => {
                          setArchdioceseChoice(value);
                          field.onChange(value === "Others" ? "" : value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger
                            ref={archdioceseChoice === "Others" ? undefined : field.ref}
                            id={ids.id}
                            aria-required="true"
                            aria-describedby={describedBy(archdioceseChoice !== "Others" && errorId)}
                            className={cn("w-full", FIELD_CLASS)}
                          >
                            <SelectValue placeholder="Select your arch/diocese" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parishOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {archdioceseChoice === "Others" && (
                        <Input
                          ref={field.ref}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          aria-label="Specify your arch/diocese"
                          aria-required="true"
                          aria-invalid={Boolean(fieldState.error) || undefined}
                          aria-describedby={describedBy(errorId)}
                          placeholder="Specify your arch/diocese"
                          className={FIELD_CLASS}
                        />
                      )}
                      <FormMessage id={ids.messageId} />
                    </FormItem>
                  );
                }}
              />

              {PERSONAL_TEXT_FIELDS.slice(1).map(renderTextField)}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Your personal information will be taken from your registration record.
            </p>
          )}

          <FormField
            control={form.control}
            name="certificateRequested"
            render={({ field }) => {
              const ids = fieldIds(field.name);

              return (
                <FormItem>
                  <label htmlFor={ids.id} className={OPTION_CARD_CLASS}>
                    <FormControl>
                      <Checkbox
                        ref={field.ref}
                        id={ids.id}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        onBlur={field.onBlur}
                        className={cn("mt-0.5 border-slate-500", FOCUS_RING)}
                      />
                    </FormControl>
                    <span className="text-sm text-slate-700">I would like to request for a certificate.</span>
                  </label>
                </FormItem>
              );
            }}
          />
        </SectionCard>

        <div className="rounded-2xl border border-[#2aadb5]/40 bg-[#2aadb5]/5 px-5 py-4 text-sm text-slate-700">
          On a scale of 1–4, with <span className="font-semibold">1 being the lowest and 4 being the highest</span>,
          please rate the following statements based on your experience during the Congress.
        </div>

        {EVALUATION_SECTIONS.map((section) => (
          <SectionCard key={section.key} id={`evaluation-section-${section.key}`} title={section.title}>
            <div className="divide-y divide-slate-100">
              {section.questions.map((question) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={`ratings.${question.id}`}
                  render={({ field, fieldState }) => {
                    const ids = fieldIds(field.name);
                    const hasError = Boolean(fieldState.error);

                    return (
                      <FormItem className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1 md:max-w-xl">
                          <FormLabel id={ids.labelId} className="text-sm leading-relaxed font-medium text-slate-700">
                            {question.id.slice(1)}. {question.text} <RequiredMark />
                          </FormLabel>
                          <FormMessage id={ids.messageId} />
                        </div>
                        <FormControl>
                          <RadioGroup
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(value) => field.onChange(Number(value))}
                            aria-labelledby={ids.labelId}
                            aria-describedby={describedBy(hasError && ids.messageId)}
                            aria-required="true"
                            className="grid shrink-0 grid-cols-4 gap-2"
                          >
                            {RATING_SCALE.map((rating, index) => {
                              const isSelected = field.value === rating;

                              return (
                                <label
                                  key={rating}
                                  className={cn(
                                    "relative flex h-11 w-14 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition motion-reduce:transition-none",
                                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1a2e5a] has-[:focus-visible]:ring-offset-2",
                                    isSelected
                                      ? "border-[#1a2e5a] bg-[#1a2e5a] text-white"
                                      : hasError
                                        ? "border-destructive text-slate-700 hover:border-[#2aadb5]"
                                        : "border-slate-400 text-slate-700 hover:border-[#2aadb5]",
                                  )}
                                >
                                  <RadioGroupItem
                                    // Lets react-hook-form focus the group when it has an error.
                                    ref={index === 0 ? field.ref : undefined}
                                    value={String(rating)}
                                    aria-label={RATING_LABELS[rating]}
                                    className="sr-only"
                                  />
                                  <span aria-hidden="true">{rating}</span>
                                </label>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </SectionCard>
        ))}

        <SectionCard id="evaluation-thoughts" title="Your thoughts about the Congress">
          {OPEN_QUESTIONS.map((question, index) => (
            <FormField
              key={question.key}
              control={form.control}
              name={question.key}
              render={({ field, fieldState }) => {
                const ids = fieldIds(field.name);
                const hasHint = "hint" in question;

                return (
                  <FormItem>
                    <FormLabel htmlFor={ids.id} className="leading-relaxed">
                      {index + 1}. {question.optional && "[Optional] "}
                      {question.label} {!question.optional && <RequiredMark />}
                    </FormLabel>
                    {hasHint && (
                      <p id={ids.hintId} className="text-xs text-slate-600">
                        {question.hint}
                      </p>
                    )}
                    <FormControl>
                      <Textarea
                        {...field}
                        id={ids.id}
                        rows={4}
                        aria-required={question.optional ? undefined : "true"}
                        aria-describedby={describedBy(hasHint && ids.hintId, fieldState.error && ids.messageId)}
                        className={FIELD_CLASS}
                      />
                    </FormControl>
                    <FormMessage id={ids.messageId} />
                  </FormItem>
                );
              }}
            />
          ))}
        </SectionCard>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-busy={form.formState.isSubmitting || undefined}
            className="focus-visible:ring-2 focus-visible:ring-[#1a2e5a] focus-visible:ring-offset-2"
          >
            {form.formState.isSubmitting ? "Submitting…" : "Submit evaluation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
