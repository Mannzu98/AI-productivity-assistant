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
import aiTechLogo from "@/assets/ai-tech-logo.png";

type NavItem = {
  to: "/" | "/email" | "/summarizer" | "/planner" | "/research" | "/chat" | "/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/summarizer", label: "Notes Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Sparkles },
  { to: "/chat", label: "Chatbot", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-5">
        <img
          src={aiTechLogo}
          alt="AI Tech logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-lg object-contain"
        />
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight text-sidebar-foreground">AI Tech</div>
          <div className="text-[11px] text-sidebar-foreground/70">Productivity Suite</div>
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
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/70">
        <div className="font-semibold text-sidebar-foreground">Powered by Lovable AI</div>
        <p className="mt-1 leading-relaxed">Smart workflows, drafts, and summaries — all in one place.</p>
      </div>
    </aside>
  );
}
