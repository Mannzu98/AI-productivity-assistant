import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function PageHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {icon && (
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl btn-primary-gradient">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export function ToolCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-surface p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Copy failed");
        }
      }}
    >
      {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function RegenerateButton({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={disabled || loading}>
      <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      Regenerate
    </Button>
  );
}

export function MarkdownOutput({ text }: { text: string }) {
  return (
    <div className="prose-output">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
