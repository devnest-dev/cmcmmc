"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompetitionEntry } from "@/lib/competition";
import {
  createCompetitionEntryAction,
  updateCompetitionEntryAction,
  type EntryFormState,
} from "@/lib/admin/competition/actions";

const initialState: EntryFormState = { status: "idle" };

type EntryFormProps =
  | { mode: "create" }
  | { mode: "edit"; entry: CompetitionEntry };

export default function EntryForm(props: EntryFormProps) {
  const router = useRouter();
  const action = props.mode === "create" ? createCompetitionEntryAction : updateCompetitionEntryAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);
      router.push("/admin/competition");
      router.refresh();
      return;
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [router, state]);

  const entry = props.mode === "edit" ? props.entry : undefined;

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="space-y-1">
        <Label htmlFor="title">
          Title <span className="text-[#e63946]">*</span>
        </Label>
        <Input id="title" name="title" required defaultValue={entry?.title} placeholder="Entry title" disabled={isPending} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="participantName">
          Participant / team name <span className="text-[#e63946]">*</span>
        </Label>
        <Input
          id="participantName"
          name="participantName"
          required
          defaultValue={entry?.participantName}
          placeholder="e.g. St. Joseph Parish Youth Ministry"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="youtubeUrl">
          YouTube URL <span className="text-[#e63946]">*</span>
        </Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          required
          type="url"
          defaultValue={entry?.youtubeUrl}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={entry?.description}
          placeholder="Optional short description of the entry"
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : entry ? "Save changes" : "Create entry"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/competition")} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
