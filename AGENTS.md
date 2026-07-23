# AniVerse — Agent Convention

This file defines the protocol that all AI agents (including cron agents, coding agents, and review agents) must follow when working on this project.

---

## 1. Git Protocol

### 1.1 Before Starting Work
- Always run `git pull --ff-only origin main` to ensure you're working from the latest state.
- Work only from the `main` branch as a base. Never start work from a stale branch.

### 1.2 Branch Naming
- All feature/change branches **must** follow the pattern:
  ```
  feat/aniverse-{short-description}
  ```
  Example: `feat/aniverse-add-character-api`, `feat/aniverse-fix-upload-validation`
- Use kebab-case for the description. Keep it concise (2–5 words).

### 1.3 No Direct Pushes to `main`
- Direct pushes to the `main` branch are **strictly forbidden**.
- All changes must go through the Pull Request workflow below.

### 1.4 Commits
- Write clear, descriptive commit messages. Prefix with scope if applicable (e.g., `feat:`, `fix:`, `refactor:`).
- Keep commits atomic — one logical change per commit.

---

## 2. Pull Request Workflow

### 2.1 Always Create a PR
- Every change must be submitted as a Pull Request to `main`.
- Branch → push → create PR. Never merge locally.

### 2.2 PR Description
- The PR description must include:
  - **What** was changed (summary of the work)
  - **Why** it was changed (motivation / context)
  - **How to test** (manual or automated steps)
  - **Environment variables** affected, if any
- Use GitHub-flavored markdown.

### 2.3 QA Review
- After creating the PR, you **must wait** for a human QA review before merging.
- Do not squash-merge until explicit approval is given.
- If changes are requested, address them and re-request review.

### 2.4 Squash-Merge
- Merging must be done via **squash-merge** only (to keep `main` history clean).
- The squash commit message should summarize the entire PR clearly.

---

## 3. Code Style & Structure

### 3.1 TypeScript Strict Mode
- The project uses TypeScript with `"strict": true` in `tsconfig.json`.
- All code must compile without errors under strict mode.
- Avoid `any` wherever possible. Use `unknown` + type narrowing if the type is uncertain.

### 3.2 Source Directory
- All application source code lives under `src/`.
- **Never** create `.ts` / `.tsx` files outside `src/` (except config files like `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, etc.).
- Use `@/` path alias (maps to `src/`) for imports within the app. See `tsconfig.json` paths.

### 3.3 Framework
- This is a **Next.js 16** project. Read `node_modules/next/dist/docs/` for any breaking changes before writing code.
- Styling uses **Tailwind CSS v4** with `@tailwindcss/postcss`.
- Database ORM is **Prisma v7** (schema in `prisma/schema.prisma`, generated client in `src/generated/prisma/`).

### 3.4 Linting & Formatting
- Run `npm run lint` (ESLint) before pushing. Fix all warnings.
- Code formatting follows Prettier conventions (see `prettier` in devDependencies).
- Use `prettier-plugin-tailwindcss` for class sorting.

---

## 4. Agent Chain Protocol

### 4.1 Context Handoff
- Each agent **must** read the diffs of all PRs created by previous agents before starting its own work.
- This ensures agents are aware of what changed, what patterns were established, and what remains to be done.
- Run: `git fetch origin && git log origin/main --oneline -20` or use the GitHub API to list recent PRs.

### 4.2 Reporting
- Every agent **must** output a clear summary of:
  1. **What was done** — files changed, logic added/removed
  2. **Why it was done** — motivation and context
  3. **Any issues encountered** — merge conflicts, API limitations, edge cases
  4. **Next steps** — what the next agent (or human) should tackle
- The summary must be posted as a comment on the PR (if applicable) and included in the agent's final response.

---

## 5. Environment Variables

The following environment variables are required. Copy `.env` (which is in `.gitignore`) to populate locally.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma PostgreSQL connection string |

Additional variables may be required as features are added (e.g., `AUTH_SECRET`, `STRIPE_SECRET_KEY`, `UPLOADTHING_TOKEN`). Document any new variables you introduce in your PR description.

---

## 6. Cron & Automation Agents

- Cron agents operate via the `.cron/git_helper.sh` script.
- They must read `AGENTS.md` (this file) before executing any automated workflow.
- They must respect the same branch naming, PR, and review conventions as interactive agents.
- They must output a structured summary at the end of each run.
