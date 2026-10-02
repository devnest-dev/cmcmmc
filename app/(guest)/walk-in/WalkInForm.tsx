"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { day1Options, day2Options, parishOptions, titleOptions } from "@/lib/registration-options";
import {
  isSessionFull,
  walkInSchema,
  type WalkInFormValues,
  type WalkInSessionCounts,
} from "@/lib/walk-in";

// The kiosk returns to a blank form on its own so the next guest can start.
const RESET_AFTER_MS = 15_000;

const FOCUS_RING =
  "focus-visible:border-[#1a2e5a] focus-visible:ring-2 focus-visible:ring-[#1a2e5a] focus-visible:ring-offset-2";
const FIELD_CLASS = cn("border-slate-500 aria-invalid:border-destructive", FOCUS_RING);
const SESSION_CARD_CLASS =
  "flex items-start gap-3 rounded-lg border border-slate-300 p-4 transition hover:border-[#2aadb5] has-[[data-state=checked]]:border-[#2aadb5] has-[[data-state=checked]]:bg-[#2aadb5]/5 has-[:disabled]:cursor-not-allowed has-[:disabled]:border-slate-200 has-[:disabled]:bg-slate-100 has-[:disabled]:opacity-60 has-[:disabled]:hover:border-slate-200 motion-reduce:transition-none";

type TextFieldName =
  | "firstName"
  | "middleName"
  | "surname"
  | "email"
  | "mobile"
  | "parishName"
  | "parishAddress"
  | "organizationName";

type TextFieldConfig = {
  name: TextFieldName;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
};

const NAME_FIELDS: TextFieldConfig[] = [
  { name: "firstName", label: "First name", required: true, autoComplete: "given-name" },
  { name: "middleName", label: "Middle name", autoComplete: "additional-name" },
  { name: "surname", label: "Last name", required: true, autoComplete: "family-name" },
];

const CONTACT_FIELDS: TextFieldConfig[] = [
  { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
  {
    name: "mobile",
    label: "Contact no.",
    required: true,
    type: "tel",
    autoComplete: "tel",
    placeholder: "09171234567",
  },
];

const AFFILIATION_FIELDS: TextFieldConfig[] = [
  { name: "parishName", label: "Parish", required: true, wide: true },
  { name: "parishAddress", label: "Parish address", required: true, wide: true },
  { name: "organizationName", label: "Organization", wide: true },
];

const defaultValues: WalkInFormValues = {
  title: "" as WalkInFormValues["title"],
  firstName: "",
  middleName: "",
  surname: "",
  email: "",
  mobile: "",
  archdiocese: "",
  archdioceseOther: "",
  parishName: "",
  parishAddress: "",
  organizationName: "",
  day1Session: "",
  day2Session: "",
};

function fieldIds(name: string) {
  const id = `walk-in-${name}`;
  return { id, labelId: `${id}-label`, messageId: `${id}-message` };
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

export default function WalkInForm({ counts }: { counts: WalkInSessionCounts }) {
  const router = useRouter();
  const [registeredName, setRegisteredName] = React.useState<string | null>(null);
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);

  const form = useForm<WalkInFormValues>({
    resolver: zodResolver(walkInSchema),
    defaultValues,
  });
  const archdiocese = useWatch({ control: form.control, name: "archdiocese" });

  const startOver = React.useCallback(() => {
    form.reset(defaultValues);
    setRegisteredName(null);
    window.scrollTo({ top: 0 });
  }, [form]);

  React.useEffect(() => {
    if (!registeredName) {
      return;
    }

    successHeadingRef.current?.focus({ preventScroll: true });
    const timeout = window.setTimeout(startOver, RESET_AFTER_MS);
    return () => window.clearTimeout(timeout);
  }, [registeredName, startOver]);

  const onSubmit = async (values: WalkInFormValues) => {
    try {
      const response = await fetch("/api/walk-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { ok: boolean; reason?: string; error?: string };

      if (!response.ok || !result.ok) {
        if (result.reason === "day1_full" || result.reason === "day2_full") {
          const field = result.reason === "day1_full" ? "day1Session" : "day2Session";
          form.setValue(field, "");
          form.setError(field, { message: "This session just filled up. Please choose another." });
          // Re-render the page so the session that filled up is grayed out.
          router.refresh();
        }

        throw new Error(result.error || "Unable to submit your registration.");
      }

      setRegisteredName([values.title, values.firstName, values.surname].join(" "));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your registration.");
    }
  };

  const onInvalid = () => {
    toast.error("Please complete all required fields before submitting.");
  };

  const renderTextField = (config: TextFieldConfig) => (
    <FormField
      key={config.name}
      control={form.control}
      name={config.name}
      render={({ field, fieldState }) => {
        const ids = fieldIds(field.name);

        return (
          <FormItem className={cn(config.wide && "md:col-span-2")}>
            <FormLabel htmlFor={ids.id}>
              {config.label} {config.required && <RequiredMark />}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id={ids.id}
                type={config.type ?? "text"}
                autoComplete={config.autoComplete}
                placeholder={config.placeholder}
                aria-required={config.required || undefined}
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

  const renderSessionField = (
    name: "day1Session" | "day2Session",
    title: string,
    options: ReadonlyArray<{ value: string; label: string; speaker: string }>,
    sessionCounts: Record<string, number>,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const ids = fieldIds(field.name);

        return (
          <FormItem>
            <FormLabel id={ids.labelId}>
              {title} <RequiredMark />
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-labelledby={ids.labelId}
                aria-describedby={describedBy(fieldState.error && ids.messageId)}
                aria-required="true"
                className="grid gap-3"
              >
                {options.map((option, index) => {
                  const full = isSessionFull(sessionCounts, option.value, counts.limit);
                  const optionId = `${ids.id}-${option.value}`;

                  return (
                    <label key={option.value} htmlFor={optionId} className={SESSION_CARD_CLASS}>
                      <RadioGroupItem
                        ref={index === 0 ? field.ref : undefined}
                        id={optionId}
                        value={option.value}
                        disabled={full}
                        className={cn("mt-0.5 border-slate-500", FOCUS_RING)}
                      />
                      <span className="space-y-1 text-sm">
                        <span className="block font-medium text-slate-800">
                          {option.label}
                          {full && (
                            <span className="ml-2 rounded-full bg-slate-300 px-2 py-0.5 text-xs font-semibold text-slate-700">
                              Full
                            </span>
                          )}
                        </span>
                        <span className="block text-slate-600">{option.speaker}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage id={ids.messageId} />
          </FormItem>
        );
      }}
    />
  );

  if (registeredName) {
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
          Thank you, {registeredName}!
        </h2>
        <p className="text-sm text-slate-600">
          Your registration has been recorded. Please proceed to the cashier to pay and have your
          registration verified.
        </p>
        <Button type="button" size="lg" onClick={startOver}>
          Register another guest
        </Button>
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
        <p className="text-sm text-slate-600">
          Fields marked with <RequiredMark /> are required.
        </p>

        <SectionCard id="walk-in-personal" title="Personal information">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => {
                const ids = fieldIds(field.name);

                return (
                  <FormItem className="md:col-span-2">
                    <FormLabel htmlFor={ids.id}>
                      Title <RequiredMark />
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          ref={field.ref}
                          id={ids.id}
                          aria-required="true"
                          aria-describedby={describedBy(fieldState.error && ids.messageId)}
                          className={cn("w-full", FIELD_CLASS)}
                        >
                          <SelectValue placeholder="Select your title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titleOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id={ids.messageId} />
                  </FormItem>
                );
              }}
            />
            {NAME_FIELDS.map(renderTextField)}
            {CONTACT_FIELDS.map(renderTextField)}
          </div>
        </SectionCard>

        <SectionCard id="walk-in-affiliation" title="Parish and organization">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="archdiocese"
              render={({ field, fieldState }) => {
                const ids = fieldIds(field.name);

                return (
                  <FormItem className="md:col-span-2">
                    <FormLabel htmlFor={ids.id}>
                      Arch/diocese <RequiredMark />
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          ref={field.ref}
                          id={ids.id}
                          aria-required="true"
                          aria-describedby={describedBy(fieldState.error && ids.messageId)}
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
                    <FormMessage id={ids.messageId} />
                  </FormItem>
                );
              }}
            />
            {archdiocese === "Others" && (
              <FormField
                control={form.control}
                name="archdioceseOther"
                render={({ field, fieldState }) => {
                  const ids = fieldIds(field.name);

                  return (
                    <FormItem className="md:col-span-2">
                      <FormLabel htmlFor={ids.id}>
                        Specify your arch/diocese <RequiredMark />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={ids.id}
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
            )}
            {AFFILIATION_FIELDS.map(renderTextField)}
          </div>
        </SectionCard>

        <SectionCard id="walk-in-breakout" title="Breakout sessions">
          <p className="text-sm text-slate-600">
            Each session is limited to {counts.limit} participants. Grayed-out sessions are already full.
          </p>
          {renderSessionField("day1Session", "Day 1 breakout session", day1Options, counts.day1Counts)}
          {renderSessionField("day2Session", "Day 2 breakout session", day2Options, counts.day2Counts)}
        </SectionCard>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-busy={form.formState.isSubmitting || undefined}
            className="focus-visible:ring-2 focus-visible:ring-[#1a2e5a] focus-visible:ring-offset-2"
          >
            {form.formState.isSubmitting ? "Submitting…" : "Submit registration"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
