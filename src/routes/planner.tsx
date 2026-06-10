import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { planSchedule } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workplace AI" }] }),
  component: Page,
});

function Page() {
  const run = useServerFn(planSchedule);
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState<"day" | "week">("day");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function go() {
    if (tasks.trim().length < 5) {
      toast.error("Please add at least one task.");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await run({ data: { tasks, timeframe, hoursPerDay } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <PageHeader
        icon={<CalendarClock className="h-6 w-6 text-primary-foreground" />}
        title="AI Task Planner"
        description="Drop in your tasks — get a prioritized, time-blocked schedule."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <ToolCard className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tasks">Your tasks</Label>
              <Textarea
                id="tasks"
                rows={10}
                placeholder={"One per line:\n- Finish Q3 report (urgent)\n- Review PRs\n- 1:1 with Sara"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Timeframe</Label>
                <Select value={timeframe} onValueChange={(v) => setTimeframe(v as "day" | "week")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hours">Hours / day</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={16}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value) || 8)}
                />
              </div>
            </div>
            <Button onClick={go} disabled={loading} className="btn-primary-gradient w-full">
              {loading ? "Planning…" : "Build Schedule"}
            </Button>
          </div>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Your schedule</h2>
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
              Your prioritized schedule will appear here.
            </div>
          )}
        </ToolCard>
      </div>
    </DashboardShell>
  );
}
