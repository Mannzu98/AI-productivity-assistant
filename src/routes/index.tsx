import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Mail,
  FileText,
  CalendarClock,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      { name: "description", content: "Your AI workplace productivity hub." },
    ],
  }),
  component: DashboardHome,
});

const tools = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    desc: "Draft polished emails in any tone in seconds.",
    icon: Mail,
  },
  {
    to: "/summarizer" as const,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into decisions, actions, and deadlines.",
    icon: FileText,
  },
  {
    to: "/planner" as const,
    title: "AI Task Planner",
    desc: "Prioritized daily and weekly schedules from your task list.",
    icon: CalendarClock,
  },
  {
    to: "/research" as const,
    title: "Research Assistant",
    desc: "Concise summaries, insights, and recommendations on any topic.",
    icon: Sparkles,
  },
  {
    to: "/chat" as const,
    title: "AI Chatbot",
    desc: "Ask anything work-related — your always-on assistant.",
    icon: MessageSquare,
  },
];

function DashboardHome() {
  return (
    <DashboardShell>
      <section className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Workplace Productivity Assistant
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Welcome to <span className="gradient-text">AI Assistance</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Automate the busywork. Draft emails, summarize meetings, plan your week, run quick
          research, and chat with an AI built for the workplace.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="btn-primary-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            Open AI Chat <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
          >
            Draft an Email
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="group card-surface flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary-glow/20 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <div className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </DashboardShell>
  );
}
