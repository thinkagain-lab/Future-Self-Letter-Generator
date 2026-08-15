# Future-Self Letter Generator

### Complete Product + Technical Specification (v1.0)

  

## 1. Product Vision

  

A beautiful, emotional web app that lets users share their current situation, fears, goals, or a difficult decision and receive a warm, wise, deeply personal letter written from the perspective of their future self (5 or 10 years ahead).

  

The letter should feel premium, hopeful, grounded, and highly personal — not generic AI fluff. Users should feel seen and motivated after reading it.

  

**Core Value Proposition**  

“Receive a letter from the version of you who already made it through this chapter.”

  

**Emotional Positioning**  

Premium • Intimate • Motivational • Gift-worthy

  

---

  

## 2. Target Users

  

- People facing major life decisions (career change, relationship, moving, starting a business)

- Anyone feeling stuck, anxious, or low-motivation

- Personal development enthusiasts

- People who gift meaningful digital experiences

- Journaling / self-reflection crowd

  

---

  

## 3. Core User Flow (MVP)

  

1. User lands on a calm, beautiful homepage with clear emotional headline.

2. Clicks “Write me a letter from my future self”.

3. Fills a clean multi-step or single-page form:

   - Current situation / what’s going on right now (required, textarea)

   - Biggest fears or worries (required)

   - Goals or what you hope for (required)

   - Specific decision you’re facing (optional)

   - Time horizon: 5 years or 10 years (required)

   - Tone preference: Warm & Encouraging / Wise & Grounded / Honest & Realistic / Loving & Soft (default: Warm & Encouraging)

4. Clicks “Generate Letter”.

5. Sees a loading state with a thoughtful message (“Your future self is writing…”).

6. Receives a beautifully formatted letter (with name if provided, date from the future, signature).

7. Options:

   - Regenerate (with same inputs)

   - Generate alternative version

   - Copy text

   - Download as clean PDF / .txt

   - Save to account (if logged in)

   - Share privately or gift

  

---

  

## 4. Feature Breakdown

  

### MVP (Ship in 1 day)

- [x] Beautiful landing page

- [x] Letter generation form

- [x] Groq-powered letter generation (streaming preferred)

- [x] Clean letter display with typography that feels premium

- [x] Copy + Download as text

- [x] Basic rate limiting (free users: 2 letters / day)

- [x] Mobile responsive

- [x] Dark / light mode support

  

### Phase 1.5 (Very soon after)

- User accounts (Clerk or Supabase Auth)

- Save letter history

- Generate multiple versions of the same letter

- PDF export with nice styling

- One-click “Gift this letter” (shareable private link)

  

### Later

- Custom future date

- Voice input

- Letter templates / different “future selves” (ambitious, peaceful, successful entrepreneur, etc.)

- Stripe subscription + one-time packs

  

---

  

## 5. Recommended Tech Stack

  

- **Framework**: Next.js 15 (App Router) + TypeScript

- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion (subtle animations)

- **AI**: Groq SDK (`llama-3.3-70b-versatile` for quality, fallback to `llama-3.1-8b-instant`)

- **Auth**: Clerk (fastest) or Supabase Auth

- **Database**: Supabase (Postgres) or Prisma + Neon/Supabase

- **Payments**: Stripe (Checkout + Customer Portal)

- **PDF**: `@react-pdf/renderer` or `html2pdf.js` / `jspdf`

- **Deployment**: Vercel

- **Rate Limiting**: Simple IP + user-based (Upstash Redis recommended later)

  

Keep everything as simple and modular as possible.

  

---

  

## 6. Database Schema (Supabase / Prisma)

  

```prisma

model User {

  id        String   @id @default(cuid())

  clerkId   String   @unique

  email     String?

  createdAt DateTime @default(now())

  letters   Letter[]

}

  

model Letter {

  id              String   @id @default(cuid())

  userId          String?

  user            User?    @relation(fields: [userId], references: [id])

  currentSituation String

  fears           String

  goals           String

  decision        String?

  timeHorizon     Int      // 5 or 10

  tone            String

  letterContent   String

  createdAt       DateTime @default(now())

}

```

  

---

  

## 7. AI Prompt Engineering (Critical)

  

### System Prompt (use this exactly as base)

  

```

You are a wise, warm, and deeply compassionate version of the user from the future. You have already lived through the exact challenges the user is currently facing and have come out the other side with perspective, growth, and peace.

  

Your task is to write a personal letter addressed to the user’s present self.

  

Guidelines:

- Write in the first person (“I”).

- Be warm, grounded, and emotionally intelligent. Avoid toxic positivity or generic motivational quotes.

- Acknowledge the difficulty of what they are feeling right now with real empathy.

- Share specific insights that only someone who has lived through this could know.

- Offer gentle perspective and quiet confidence that things can (and did) work out.

- Keep the tone consistent with the requested style.

- End the letter with a warm sign-off from their future self, including the future year.

- Length: 350–550 words. Make every sentence feel intentional.

- Do not use markdown formatting inside the letter. Write pure flowing prose with natural paragraphs.

- Never break character. You are the future self.

```

  

### User Prompt Template

  

```

Write a letter from my future self ({{timeHorizon}} years from now).

  

Here is what is happening in my life right now:

{{currentSituation}}

  

My biggest fears and worries:

{{fears}}

  

What I hope for / my goals:

{{goals}}

  

{{#if decision}}

The specific decision I’m struggling with:

{{decision}}

{{/if}}

  

Preferred tone: {{tone}}

  

Please write the letter now.

```

  

---

  

## 8. UI / UX Guidelines

  

- Color palette: Soft, calm, premium (deep navy, warm cream, soft sage, gentle gold accents)

- Typography: Elegant serif for the letter body (e.g. Newsreader, Lora, or Playfair Display), clean sans for UI

- Letter should feel like a real letter: generous line height, good max-width (65–70ch), subtle paper-like background or soft shadow

- Loading state: Elegant, slow, emotional (“Your future self is taking a quiet moment to write to you…”)

- Success state: The letter fades in beautifully

- Make the experience feel intimate and special — this is not a productivity tool, it’s an emotional product

  

---

  

## 9. Monetization (Simple & Effective)

  

**Free Tier**

- 2 letters per day

- Basic download (txt)

- Watermark on PDF (optional)

  

**Pro – $9/month or $79/year**

- Unlimited letters

- Full letter history

- Multiple versions

- Beautiful PDF export

- Priority generation

- Gift links

  

**One-time options**

- “Premium Letter Pack” – 10 high-quality letters for $12

- Gift a letter – $7

  

Use Stripe Checkout + Customer Portal.

  

---

  

## 10. File Structure Recommendation

  

```

/app

  /page.tsx                 → Landing

  /generate/page.tsx        → Form + generation

  /letter/[id]/page.tsx     → View saved letter

  /api/generate/route.ts    → Groq generation endpoint

  /api/stripe/...

/components

  LetterForm.tsx

  LetterDisplay.tsx

  LetterSkeleton.tsx

  Pricing.tsx

/lib

  groq.ts

  prompts.ts

  rate-limit.ts

/types

  index.ts

```

  

---

  

## 11. Key Implementation Notes for Cursor

  

- Use streaming with Groq for better UX (`stream: true`)

- Always validate and sanitize user inputs

- Store the original inputs + generated letter

- Add simple abuse protection (rate limit by IP even for free users)

- Make the letter generation endpoint a Server Action or Route Handler

- Prioritize mobile experience — many people will use this late at night on their phone

- Keep the emotional quality of the output extremely high (prompt quality > model size)

  

---

  

## 12. Success Metrics (Early)

  

- % of users who generate a second letter

- Time spent reading the letter

- Conversion to paid (target 4–8% of engaged users)

- Organic shares / “I gifted this” actions

  

---

  

## 13. Cursor Starter Prompt

  

Copy and paste this into Cursor after adding this file to your project:

  

```

I have created a complete product specification in the file FUTURE_SELF_LETTER_GENERATOR.md.

  

Please read the entire file carefully.

  

Now act as a senior full-stack engineer and product-minded developer.

  

Build the complete MVP of the Future-Self Letter Generator according to the specification.

  

Start by:

1. Setting up a clean Next.js 15 + TypeScript + Tailwind + shadcn/ui project structure

2. Implementing the core generation flow (form → Groq → beautiful letter display)

3. Using the exact system prompt and user prompt template provided in the spec

4. Making the UI calm, premium, and emotionally resonant

5. Adding basic free-tier rate limiting (2 letters per day per IP)

  

Focus only on the MVP first. Make the code clean, modular, and well-structured so we can easily add auth, saving, PDF, and Stripe later.

  

Begin by creating the project structure and the main generation page.

```

```