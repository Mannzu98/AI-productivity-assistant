import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { DashboardShell } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/tool-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workplace AI" }] }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  async function submit() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessage({ text });
    inputRef.current?.focus();
  }

  return (
    <DashboardShell>
      <PageHeader
        icon={<MessageSquare className="h-6 w-6 text-primary-foreground" />}
        title="AI Chatbot"
        description="Your always-on assistant for work questions, drafts, and brainstorms."
      />

      <div className="card-surface flex h-[calc(100vh-14rem)] min-h-[480px] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl btn-primary-gradient">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">How can I help you today?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask anything — drafting, planning, summarizing, or quick research.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
                {[
                  "Draft a 1:1 agenda",
                  "Summarize this Slack thread",
                  "Pros and cons of remote work",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                        {text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="flex gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full btn-primary-gradient text-xs font-bold">
                      AI
                    </div>
                    <div className="prose-output min-w-0 flex-1">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full btn-primary-gradient text-xs font-bold">
                    AI
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="border-t border-border bg-card/60 p-3 sm:p-4"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit();
                }
              }}
              placeholder="Ask anything about your work…"
              rows={1}
              className="max-h-40 min-h-[44px] resize-none"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary-gradient h-11 w-11 shrink-0 p-0"
              aria-label="Send"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
