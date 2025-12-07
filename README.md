## Sage – Duolingo for DSA

Sage is a learning platform that brings Duolingo-style spaced practice to data structures and algorithms. Built with the latest Next.js (App Router), Tailwind CSS v4, and Motion (Framer Motion for React) to deliver fast, animated learning flows.

### What we are building
- Bite-sized DSA lessons with interactive checkpoints and spaced repetition.
- Daily streaks, XP, and leveling to keep learners motivated.
- Animated transitions for lessons, quizzes, and progress feedback using Motion.
- Adaptive practice sets that ramp difficulty based on performance.
- Accessible, keyboard-friendly UI with responsive layouts from day one.

### Tech stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Motion (Framer Motion for React) for animations
- TypeScript, ESLint (Next core web vitals rules)

### Getting started
1) Install dependencies
```bash
npm install
```
2) Run dev server
```bash
npm run dev
```
3) Lint
```bash
npm run lint
```
4) Build / preview
```bash
npm run build
npm run start
```

### Project layout
- `app/` – App Router pages, layouts, and server components.
- `app/globals.css` – Base styles and Tailwind layers.
- `public/` – Static assets.
- `eslint.config.mjs` – ESLint setup (Next + TypeScript + Core Web Vitals).
- `postcss.config.mjs` – Tailwind v4 via `@tailwindcss/postcss` plugin.

### Styling guidelines (Tailwind v4)
- Prefer utility-first; extract components only when reuse/clarity demands.
- Use semantic spacing and sizing tokens; avoid magic numbers when possible.
- Keep globals lean; co-locate styles with components.
- Ensure focus states are visible; verify contrast in light/dark backgrounds.

### Motion guidelines
- Use Motion components for meaningful state changes (page/section transitions, feedback to correct/incorrect answers).
- Favor small durations (120–220ms) and easing that communicates intent (e.g., `easeOut` on enter, `easeIn` on exit).
- Avoid animation on initial load that blocks interaction; keep it interruptible.

### Accessibility
- Keyboard-first navigation for lesson flows and quizzes.
- Use `aria-live` regions for async feedback (correct/incorrect, XP gained).
- Ensure all interactive elements have discernible labels and focus rings.

### Testing (initial stance)
- Lint on every change (`npm run lint`).
- Add component tests as UI stabilizes; prefer integration-style tests over shallow snapshots.

### Roadmap (near-term)
- Lesson model and content schema.
- Practice session flow with streaks and XP.
- Animated quiz transitions (Motion).
- Theming tokens and layout shell.
- Accessibility pass (focus order, screen reader hints, color contrast).

### Contributing
See `CONTRIBUTING.md` for workflow, coding standards, and release process. Please also review `CODE_OF_CONDUCT.md` and `SECURITY.md`.

### License
This project is licensed under the MIT License (see `LICENSE`).
