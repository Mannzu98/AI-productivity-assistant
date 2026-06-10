import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { researchTopic } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Workplace AI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function go() {
    if (topic.trim().length < 3) {
      toast.error("Please enter a topic or question.");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await run({ data: { topic } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        icon={<Sparkles className="h-6 w-6 text-primary-foreground" />}
        title="AI Research Assistant"
        description="Get a concise summary, key insights, and recommendations on any topic."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ToolCard className="lg:col-span-2">
          <Label htmlFor="topic">Topic or question</Label>
          <Input
            id="topic"
            placeholder="e.g. Best practices for async standups"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
          <Button onClick={go} disabled={loading} className="btn-primary-gradient mt-4 w-full">
            {loading ? "Researching…" : "Research"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Tip: be specific. "Pros and cons of OKRs for small startups" works better than "OKRs".
          </p>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Research brief</h2>
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
                rows={22}
                className="font-mono text-sm"
              />
            ) : (
              <MarkdownOutput text={output} />
            )
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your research brief will appear here.
            </div>
          )}
        </ToolCard>
      </div>
    </DashboardShell>
  );
}
