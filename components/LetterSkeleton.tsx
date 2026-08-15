export default function LetterSkeleton() {
  return (
    <div className="mx-auto max-w-letter animate-pulse rounded-3xl border border-navy/10 p-10 dark:border-cream/10">
      <p className="text-center font-serif text-lg italic text-navy/60 dark:text-cream/60">
        Your future self is taking a quiet moment to write to you…
      </p>
      <div className="mt-10 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-navy/10 dark:bg-cream/10"
            style={{ width: `${70 + ((i * 7) % 28)}%` }}
          />
        ))}
      </div>
    </div>
  );
}
