"use client";

import { useState } from "react";

interface LetterDisplayProps {
  letter: string;
  futureYear: number;
  usedFallback: boolean;
  onRegenerate: () => void;
  onStartOver: () => void;
}

export default function LetterDisplay({
  letter,
  futureYear,
  usedFallback,
  onRegenerate,
  onStartOver,
}: LetterDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `letter-from-${futureYear}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const paragraphs = letter.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <div className="animate-fade-in-up">
      <article className="paper mx-auto max-w-letter rounded-3xl border border-navy/10 px-8 py-12 shadow-xl shadow-navy/10 sm:px-14 dark:border-cream/10">
        <div className="letter-body font-serif text-lg leading-[1.85] text-navy/90 dark:text-cream/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {usedFallback && (
        <p className="mx-auto mt-4 max-w-letter text-center text-xs text-navy/45 dark:text-cream/45">
          This is a locally-composed sample. Add a GROQ_API_KEY to receive a
          fully AI-written letter.
        </p>
      )}

      <div className="mx-auto mt-8 flex max-w-letter flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-gold hover:bg-gold/10 dark:border-cream/20 dark:text-cream"
        >
          {copied ? "Copied!" : "Copy text"}
        </button>
        <button
          onClick={handleDownload}
          className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-gold hover:bg-gold/10 dark:border-cream/20 dark:text-cream"
        >
          Download .txt
        </button>
        <button
          onClick={onRegenerate}
          className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-gold hover:bg-gold/10 dark:border-cream/20 dark:text-cream"
        >
          Regenerate
        </button>
        <button
          onClick={onStartOver}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-navy-deep dark:bg-gold dark:text-navy-deep"
        >
          Write another
        </button>
      </div>
    </div>
  );
}
