import Groq from "groq-sdk";
import type { LetterInput } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";

const PRIMARY_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const FALLBACK_MODEL =
  process.env.GROQ_FALLBACK_MODEL ?? "llama-3.1-8b-instant";

export function hasGroqKey(): boolean {
  return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim());
}

export function futureYear(timeHorizon: number): number {
  return new Date().getFullYear() + timeHorizon;
}

export interface GeneratedLetter {
  letter: string;
  model: string;
  usedFallback: boolean;
}

/**
 * Generate a letter with Groq. Tries the primary model first and transparently
 * retries with the smaller fallback model if the primary is unavailable.
 */
export async function generateWithGroq(
  input: LetterInput,
): Promise<GeneratedLetter> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    { role: "user" as const, content: buildUserPrompt(input) },
  ];

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: unknown;

  for (const model of models) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.9,
        max_tokens: 1200,
      });
      const letter = completion.choices[0]?.message?.content?.trim();
      if (letter) {
        return { letter, model, usedFallback: model !== PRIMARY_MODEL };
      }
      lastError = new Error("Empty completion from Groq");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Groq generation failed");
}

/**
 * Deterministic, locally-composed letter used when no GROQ_API_KEY is
 * configured. Keeps the full app flow working end to end in development while
 * clearly signalling that this is a sample rather than AI-generated output.
 */
export function composeSampleLetter(input: LetterInput): string {
  const year = futureYear(input.timeHorizon);
  const greeting = input.name?.trim() ? `Dear ${input.name.trim()},` : "Dear you,";

  const decisionLine = input.decision?.trim()
    ? ` I remember the decision that kept you up at night — the one about ${input.decision
        .trim()
        .replace(/\.$/, "")}. You did make a choice, and while it was not perfect, it was brave, and it was yours.`
    : "";

  return [
    greeting,
    "",
    `I am writing to you from ${year}, ${input.timeHorizon} years down the road from where you are standing right now. I know exactly what you are carrying today, because I carried it too. When you wrote that "${truncate(
      input.currentSituation,
    )}", I felt the weight of it all over again.`,
    "",
    `You are afraid — of "${truncate(
      input.fears,
    )}" — and I will not pretend those fears were foolish. They were real, and they mattered. But I want you to know that fear was never the whole story. It was the shadow cast by how much you cared.${decisionLine}`,
    "",
    `The things you hoped for — "${truncate(
      input.goals,
    )}" — did not arrive the way you imagined. Some came slower, some came differently, and a few arrived in forms you could not have named yet. What I can tell you is that the person writing this letter is at peace in a way you cannot picture from where you sit.`,
    "",
    "So be a little gentler with yourself this week. Take the next small step, and then the one after that. You are already becoming me.",
    "",
    "With love and quiet certainty,",
    `Your future self, ${year}`,
    "",
    "— (Sample letter: set GROQ_API_KEY to receive a fully AI-written letter.)",
  ].join("\n");
}

function truncate(text: string, max = 160): string {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
}
