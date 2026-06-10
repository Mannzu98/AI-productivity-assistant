import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Info } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block sticky top-0 h-screen">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <AppSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="text-sm font-semibold">Workplace AI</div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        <footer className="border-t border-border/60 bg-muted/30 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p>
              <span className="font-semibold text-foreground">Responsible AI:</span> Outputs are AI-generated and may
              contain inaccuracies or bias. Always review and edit before sending, sharing, or acting on them. Do not
              submit confidential, personal, or sensitive information.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
