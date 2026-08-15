import { NextResponse } from "next/server";
import type { GenerateResponse, LetterInput, TimeHorizon, Tone } from "@/types";
import { TONES } from "@/types";
import {
  composeSampleLetter,
  futureYear,
  generateWithGroq,
  hasGroqKey,
} from "@/lib/groq";
import { checkRateLimit, clientKeyFromHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 2000;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function parseInput(body: unknown): LetterInput | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  const currentSituation = sanitize(raw.currentSituation);
  const fears = sanitize(raw.fears);
  const goals = sanitize(raw.goals);
  const decision = sanitize(raw.decision);
  const name = sanitize(raw.name);

  if (!currentSituation) return { error: "Please describe your current situation." };
  if (!fears) return { error: "Please share your fears or worries." };
  if (!goals) return { error: "Please share your goals or hopes." };

  const horizonNum = Number(raw.timeHorizon);
  const timeHorizon: TimeHorizon = horizonNum === 10 ? 10 : 5;

  const tone: Tone = TONES.includes(raw.tone as Tone)
    ? (raw.tone as Tone)
    : "Warm & Encouraging";

  return { name, currentSituation, fears, goals, decision, timeHorizon, tone };
}

export async function POST(request: Request) {
  const rate = checkRateLimit(clientKeyFromHeaders(request.headers));
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          "You've reached the free limit of 2 letters per day. Please come back tomorrow.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON.");
  }

  const parsed = parseInput(body);
  if ("error" in parsed) {
    return badRequest(parsed.error);
  }

  const input = parsed;

  try {
    if (hasGroqKey()) {
      const result = await generateWithGroq(input);
      const payload: GenerateResponse = {
        ...result,
        futureYear: futureYear(input.timeHorizon),
      };
      return NextResponse.json(payload);
    }

    const payload: GenerateResponse = {
      letter: composeSampleLetter(input),
      model: "local-sample",
      usedFallback: true,
      futureYear: futureYear(input.timeHorizon),
    };
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Letter generation failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while writing your letter. Please try again." },
      { status: 500 },
    );
  }
}
