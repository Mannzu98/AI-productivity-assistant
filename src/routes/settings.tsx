import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Sparkles, Mail, FileText, CalendarClock, MessageSquare } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader, ToolCard } from "@/components/tool-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Workplace AI" }] }),
  component: Page,
});

function Page() {
  return (
    <DashboardShell>
      <PageHeader
        icon={<SettingsIcon className="h-6 w-6 text-primary-foreground" />}
        title="Settings & About"
        description="About this workspace and the AI tools you have access to."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ToolCard>
          <h2 className="text-lg font-semibold">About Workplace AI</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Workplace AI is a productivity suite that automates routine work tasks using
            Lovable AI. All requests are processed securely server-side — your API key is never
            exposed to the browser.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">Model</dt>
              <dd className="mt-1 font-medium">Gemini 3 Flash</dd>
            </div>
            <div className="rounded-lg border border-border p-3">
              <dt className="text-xs text-muted-foreground">Provider</dt>
              <dd className="mt-1 font-medium">Lovable AI Gateway</dd>
            </div>
          </dl>
        </ToolCard>

        <ToolCard>
          <h2 className="text-lg font-semibold">Included tools</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { icon: Mail, label: "Smart Email Generator" },
              { icon: FileText, label: "Meeting Notes Summarizer" },
              { icon: CalendarClock, label: "AI Task Planner" },
              { icon: Sparkles, label: "Research Assistant" },
              { icon: MessageSquare, label: "AI Chatbot" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-primary" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </ToolCard>
      </div>
    </DashboardShell>
  );
}
