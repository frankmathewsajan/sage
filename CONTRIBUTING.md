# Contributing to Sage

Thank you for helping build Sage — a Duolingo-style learning platform for data structures and algorithms.

## Ground rules
- Be kind and respectful (see `CODE_OF_CONDUCT.md`).
- Prefer issues before large changes; propose design/UX ideas early.
- Default to clarity and accessibility: keyboard-first, readable contrast, concise copy.

## Prerequisites
- Node.js 18+ and npm.
- Git.

## Local setup
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Lint before you push: `npm run lint`
4. Build check (CI parity): `npm run build`

## Branching and commits
- Branch naming: `feature/<short-desc>`, `fix/<short-desc>`, or `chore/<short-desc>`.
- Commits: use Conventional Commits (`feat: add lesson shell`, `fix: guard null content`). Smaller, focused commits are preferred.

## Coding standards
- Framework: Next.js App Router + React 19.
- Language: TypeScript. Prefer explicit props types; keep runtime validation close to boundaries.
- Styling: Tailwind CSS v4 utilities; extract components only when it improves readability/reuse.
- Motion: Use Motion (Framer Motion for React) for meaningful transitions. Avoid long blocking animations; keep them interruptible.
- Accessibility: ensure focus order, labels, and `aria-live` for async quiz feedback. Do not rely solely on color.
- Data/loading: handle loading and error states for all async calls.

## Testing
- Lint is required (`npm run lint`).
- Add component/integration tests when adding UX-critical flows (quizzes, streak updates, XP). Keep tests deterministic.

## Pull request checklist
- [ ] Lints pass locally.
- [ ] Includes coverage for new behaviors (tests or clear manual steps).
- [ ] No console warnings/errors in dev tools for touched surfaces.
- [ ] Accessibility considered (focus/labels/contrast/keyboard paths).
- [ ] Updated docs if behavior or APIs changed.

## Reporting bugs / requesting features
- Use GitHub issues with steps to reproduce, expected vs actual, and screenshots if UI-related.

## Release process (early)
- Main branch deploys are triggered from CI build artifacts. Keep `main` green; rebase before merging when possible.
