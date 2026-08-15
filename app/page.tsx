import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-medium tracking-wide text-navy dark:text-cream">
          A quiet letter, just for you
        </span>

        <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-navy sm:text-6xl dark:text-cream">
          Receive a letter from the version of you
          <br className="hidden sm:block" />{" "}
          <span className="italic text-gold">who already made it through</span>.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy/70 dark:text-cream/70">
          Share what you&apos;re carrying right now — your fears, your hopes, the
          decision that keeps you up at night. Your future self will write back
          with warmth, perspective, and quiet confidence that things worked out.
        </p>

        <div className="mt-12">
          <Link
            href="/generate"
            className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-4 text-base font-medium text-cream shadow-lg shadow-navy/20 transition hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold/90"
          >
            Write me a letter from my future self
          </Link>
        </div>

        <p className="mt-6 text-sm text-navy/50 dark:text-cream/50">
          Free — 2 letters per day. No account required.
        </p>

        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              title: "Deeply personal",
              body: "Written from your own perspective, grounded in what you share.",
            },
            {
              title: "Emotionally honest",
              body: "No toxic positivity — real empathy for what you feel today.",
            },
            {
              title: "Gift-worthy",
              body: "A calm, premium keepsake you'll want to read again.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-navy/10 bg-white/50 p-6 text-left backdrop-blur dark:border-cream/10 dark:bg-white/5"
            >
              <h3 className="font-serif text-lg text-navy dark:text-cream">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/60 dark:text-cream/60">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
