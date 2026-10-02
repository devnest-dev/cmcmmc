"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmissionState = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, setState] = React.useState<SubmissionState>("idle");
  const [feedback, setFeedback] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/email/contact-us", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message ?? "We could not send your message.");
      }

      form.reset();
      formRef.current?.reset();
      setState("sent");
      setFeedback(result.message ?? "Your message was sent successfully.");
      toast.success("Message sent", {
        description: "We will reply as soon as possible.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not send your message.";

      setState("error");
      setFeedback(message);
      toast.error("Message not sent", {
        description: message,
      });
    }
  }

  const isSending = state === "sending";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Dela Cruz"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="juan@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help or what you would like to ask about."
          className="min-h-40"
          required
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We usually reply within 2 to 3 business days.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isSending}
          className="gap-2 bg-[#56aeff] text-white hover:bg-[#22959d]"
        >
          {isSending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}