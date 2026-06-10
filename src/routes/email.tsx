import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader, ToolCard, CopyButton, RegenerateButton } from "@/components/tool-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workplace AI" }] }),
  component: EmailPage,
});

type Tone = "formal" | "friendly" | "persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function go() {
    if (!topic.trim() || !recipient.trim()) {
      toast.error("Please fill in recipient and topic");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { topic, recipient, tone } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        icon={<Mail className="h-6 w-6 text-primary-foreground" />}
        title="Smart Email Generator"
        description="Draft a professional email in any tone — edit and copy in one click."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ToolCard className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. My manager, a new client, the design team"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="topic">Topic / what you want to say</Label>
              <Textarea
                id="topic"
                rows={6}
                placeholder="Project update, requesting time off, follow-up after meeting…"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={go} disabled={loading} className="btn-primary-gradient w-full">
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Generated email</h2>
            {output && (
              <div className="flex gap-2">
                <RegenerateButton onClick={go} loading={loading} />
                <CopyButton text={output} />
              </div>
            )}
          </div>
          {output ? (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={18}
              className="font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Your email will appear here.
            </div>
          )}
        </ToolCard>
      </div>
    </DashboardShell>
  );
}
