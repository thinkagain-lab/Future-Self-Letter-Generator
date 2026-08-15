"use client";

import { useState } from "react";
import Link from "next/link";
import LetterForm from "@/components/LetterForm";
import LetterDisplay from "@/components/LetterDisplay";
import LetterSkeleton from "@/components/LetterSkeleton";
import type { GenerateResponse, LetterInput } from "@/types";

type Status = "form" | "loading" | "done" | "error";

export default function GeneratePage() {
  const [status, setStatus] = useState<Status>("form");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [lastInput, setLastInput] = useState<LetterInput | null>(null);

  async function generate(input: LetterInput) {
    setLastInput(input);
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setResult(data as GenerateResponse);
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-navy/50 transition hover:text-gold dark:text-cream/50"
        >
          ← Back home
        </Link>

        {(status === "form" || status === "error") && (
          <div className="mt-6">
            <h1 className="font-serif text-3xl font-medium text-navy sm:text-4xl dark:text-cream">
              Tell your future self what&apos;s going on
            </h1>
            <p className="mt-3 text-navy/60 dark:text-cream/60">
              Be honest and specific — the more real you are, the more the letter
              will feel like it&apos;s truly from you.
            </p>

            {status === "error" && (
              <div className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="mt-8">
              <LetterForm onSubmit={generate} disabled={false} />
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="mt-16">
            <LetterSkeleton />
          </div>
        )}
      </div>

      {status === "done" && result && (
        <div className="mx-auto mt-10 max-w-3xl">
          <LetterDisplay
            letter={result.letter}
            futureYear={result.futureYear}
            usedFallback={result.usedFallback}
            onRegenerate={() => lastInput && generate(lastInput)}
            onStartOver={() => {
              setStatus("form");
              setResult(null);
            }}
          />
        </div>
      )}
    </main>
  );
}
