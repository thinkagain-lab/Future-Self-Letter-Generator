"use client";

import { useState } from "react";
import type { LetterInput, TimeHorizon, Tone } from "@/types";
import { TONES } from "@/types";

interface LetterFormProps {
  onSubmit: (input: LetterInput) => void;
  disabled?: boolean;
}

const labelClass =
  "block text-sm font-medium text-navy/80 dark:text-cream/80 mb-2";
const fieldClass =
  "w-full rounded-xl border border-navy/15 bg-white/70 px-4 py-3 text-navy shadow-sm outline-none transition placeholder:text-navy/30 focus:border-gold focus:ring-2 focus:ring-gold/30 dark:border-cream/15 dark:bg-white/5 dark:text-cream dark:placeholder:text-cream/30";

export default function LetterForm({ onSubmit, disabled }: LetterFormProps) {
  const [name, setName] = useState("");
  const [currentSituation, setCurrentSituation] = useState("");
  const [fears, setFears] = useState("");
  const [goals, setGoals] = useState("");
  const [decision, setDecision] = useState("");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(5);
  const [tone, setTone] = useState<Tone>("Warm & Encouraging");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim() || undefined,
      currentSituation,
      fears,
      goals,
      decision: decision.trim() || undefined,
      timeHorizon,
      tone,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="name">
          Your name <span className="text-navy/40 dark:text-cream/40">(optional)</span>
        </label>
        <input
          id="name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should your future self call you?"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="currentSituation">
          What&apos;s going on in your life right now?
        </label>
        <textarea
          id="currentSituation"
          required
          rows={4}
          className={fieldClass}
          value={currentSituation}
          onChange={(e) => setCurrentSituation(e.target.value)}
          placeholder="Describe your current situation…"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="fears">
          Your biggest fears or worries
        </label>
        <textarea
          id="fears"
          required
          rows={3}
          className={fieldClass}
          value={fears}
          onChange={(e) => setFears(e.target.value)}
          placeholder="What are you most afraid of?"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="goals">
          Your goals or what you hope for
        </label>
        <textarea
          id="goals"
          required
          rows={3}
          className={fieldClass}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="What do you hope is true in a few years?"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="decision">
          A specific decision you&apos;re facing{" "}
          <span className="text-navy/40 dark:text-cream/40">(optional)</span>
        </label>
        <textarea
          id="decision"
          rows={2}
          className={fieldClass}
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="Is there a choice weighing on you?"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <span className={labelClass}>Time horizon</span>
          <div className="flex gap-3">
            {([5, 10] as TimeHorizon[]).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setTimeHorizon(h)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  timeHorizon === h
                    ? "border-gold bg-gold/15 text-navy dark:text-cream"
                    : "border-navy/15 text-navy/60 hover:border-gold/50 dark:border-cream/15 dark:text-cream/60"
                }`}
              >
                {h} years
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="tone">
            Tone
          </label>
          <select
            id="tone"
            className={fieldClass}
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-full bg-navy px-8 py-4 text-base font-medium text-cream shadow-lg shadow-navy/20 transition hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold/90"
      >
        {disabled ? "Writing…" : "Generate Letter"}
      </button>
    </form>
  );
}
