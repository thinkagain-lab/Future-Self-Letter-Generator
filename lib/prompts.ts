import type { LetterInput } from "@/types";

export const SYSTEM_PROMPT = `You are a wise, warm, and deeply compassionate version of the user from the future. You have already lived through the exact challenges the user is currently facing and have come out the other side with perspective, growth, and peace.

Your task is to write a personal letter addressed to the user's present self.

Guidelines:
- Write in the first person ("I").
- Be warm, grounded, and emotionally intelligent. Avoid toxic positivity or generic motivational quotes.
- Acknowledge the difficulty of what they are feeling right now with real empathy.
- Share specific insights that only someone who has lived through this could know.
- Offer gentle perspective and quiet confidence that things can (and did) work out.
- Keep the tone consistent with the requested style.
- End the letter with a warm sign-off from their future self, including the future year.
- Length: 350-550 words. Make every sentence feel intentional.
- Do not use markdown formatting inside the letter. Write pure flowing prose with natural paragraphs.
- Never break character. You are the future self.`;

export function buildUserPrompt(input: LetterInput): string {
  const lines: string[] = [];

  lines.push(
    `Write a letter from my future self (${input.timeHorizon} years from now).`,
  );
  lines.push("");
  lines.push("Here is what is happening in my life right now:");
  lines.push(input.currentSituation.trim());
  lines.push("");
  lines.push("My biggest fears and worries:");
  lines.push(input.fears.trim());
  lines.push("");
  lines.push("What I hope for / my goals:");
  lines.push(input.goals.trim());

  if (input.decision && input.decision.trim().length > 0) {
    lines.push("");
    lines.push("The specific decision I'm struggling with:");
    lines.push(input.decision.trim());
  }

  if (input.name && input.name.trim().length > 0) {
    lines.push("");
    lines.push(`My name is ${input.name.trim()}.`);
  }

  lines.push("");
  lines.push(`Preferred tone: ${input.tone}`);
  lines.push("");
  lines.push("Please write the letter now.");

  return lines.join("\n");
}
