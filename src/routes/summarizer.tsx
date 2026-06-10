import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  PageHeader,
  ToolCard,
  CopyButton,
  RegenerateButton,
  MarkdownOutput,
} from "@/components/tool-ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { summarizeMeeting } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workplace AI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function go() {
    if (notes.trim().length < 10) {
      toast.error("Please paste meeting notes (at least 10 characters).");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await run({ data: { notes } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        icon={<FileText className="h-6 w-6 text-primary-foreground" />}
        title="Meeting Notes Summarizer"
        description="Turn long notes into a clean summary, key decisions, action items, and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ToolCard className="lg:col-span-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            rows={16}
            placeholder="Paste your raw meeting notes or transcript…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={go} disabled={loading} className="btn-primary-gradient mt-4 w-full">
            {loading ? "Summarizing…" : "Summarize"}
          </Button>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Structured summary</h2>
            {output && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Preview" : "Edit"}
                </Button>
                <RegenerateButton onClick={go} loading={loading} />
                <CopyButton text={output} />
              </div>
            )}
          </div>
          {output ? (
            editing ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <MarkdownOutput text={output} />
            )
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </ToolCard>
      </div>
    </DashboardShell>
  );
}
