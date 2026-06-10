import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(MODEL);
}

const EmailInput = z.object({
  topic: z.string().min(1).max(2000),
  recipient: z.string().min(1).max(200),
  tone: z.enum(["formal", "friendly", "persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert business writer. Write polished, ready-to-send professional emails. Output ONLY the email (Subject line + body). No preamble, no explanations.",
      prompt: `Write a ${data.tone} email.\nRecipient: ${data.recipient}\nTopic: ${data.topic}\n\nStart with "Subject: ..." then a blank line, then the body with greeting, body paragraphs, and sign-off.`,
    });
    return { text };
  });

const SummarizeInput = z.object({ notes: z.string().min(10).max(20000) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummarizeInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You summarize meeting notes into a clean structured markdown report. Use these exact sections as H2 headings: ## Summary, ## Key Decisions, ## Action Items, ## Deadlines. Use bullet lists. If a section has nothing, write '_None identified._'",
      prompt: `Meeting notes:\n\n${data.notes}`,
    });
    return { text };
  });

const PlannerInput = z.object({
  tasks: z.string().min(5).max(5000),
  timeframe: z.enum(["day", "week"]),
  hoursPerDay: z.number().min(1).max(16),
});

export const planSchedule = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert productivity coach. Build a realistic schedule prioritizing by urgency and importance (Eisenhower matrix). Output clean markdown. Use ## headings for each day or block, then bullet items in the form '- HH:MM–HH:MM — Task name _(priority)_'. End with a short '## Notes' section with prioritization rationale.",
      prompt: `Available time: ${data.hoursPerDay} hours per day. Plan a ${data.timeframe === "day" ? "single day" : "5-day work week"}.\n\nTasks:\n${data.tasks}`,
    });
    return { text };
  });

const ResearchInput = z.object({ topic: z.string().min(3).max(1000) });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are a professional research analyst. Output concise markdown with these H2 sections: ## Summary, ## Key Insights, ## Recommendations. Be precise and professional. Use bullet points.",
      prompt: `Research topic: ${data.topic}`,
    });
    return { text };
  });
