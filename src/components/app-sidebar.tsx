import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Sparkles,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/summarizer", label: "Notes Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Sparkles },
  { to: "/chat", label: "Chatbot", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl btn-primary-gradient">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight text-sidebar-foreground">Workplace AI</div>
          <div className="text-[11px] text-muted-foreground">Productivity Suite</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-card p-3 text-xs text-muted-foreground">
        <div className="font-semibold text-foreground">Powered by Lovable AI</div>
        <p className="mt-1 leading-relaxed">Smart workflows, drafts, and summaries — all in one place.</p>
      </div>
    </aside>
  );
}
