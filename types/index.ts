export type TimeHorizon = 5 | 10;

export type Tone =
  | "Warm & Encouraging"
  | "Wise & Grounded"
  | "Honest & Realistic"
  | "Loving & Soft";

export const TONES: Tone[] = [
  "Warm & Encouraging",
  "Wise & Grounded",
  "Honest & Realistic",
  "Loving & Soft",
];

export interface LetterInput {
  name?: string;
  currentSituation: string;
  fears: string;
  goals: string;
  decision?: string;
  timeHorizon: TimeHorizon;
  tone: Tone;
}

export interface GenerateResponse {
  letter: string;
  model: string;
  usedFallback: boolean;
  futureYear: number;
}

export interface ApiError {
  error: string;
}
