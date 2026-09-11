# AGENTS

This repository follows the Ermyn OS architecture.

Ops/knowledge SoR: private GitHub `arka97/vault` (especially `projects/protpure-web.md`).
Platform doctrine: `arka97/ermyn-os`.

## Preferred Executor

Primary:
- Claude Code

Secondary:
- Codex

Additional:
- Cursor CLI (`agent`)
- OpenCode / Antigravity when useful

Always-on router (prod-sin-01):
- Hermes Agent — loops/cron, not the coding harness for this app.
  See vault `ops/robustness.md` before inventing platform work.

---

## Engineering Principles

- Architecture before implementation.
- Verify before configure (`pnpm`, `--version`, a page that loads).
- Prefer simplicity.
- Documentation is part of the product.
- Git is the source of truth.
- Never commit secrets (`.env` stays local / VPS only).
- One dirty tree per agent — use git worktrees.

---

## Stack (this repo)

- Next.js + Payload CMS 3 + Postgres
- Package manager: `pnpm` (see `packageManager` in `package.json`)
- Local site: `http://127.0.0.1:3001` (not `:3000` — that is Dokploy tunnel)
- Local admin: `http://127.0.0.1:3001/admin`
- DB: `docker compose up -d db` (Postgres on `:5432`)
- Dev helper: `protpure-dev` / `systemctl --user start protpure-dev`

Open in Cursor via **Remote-WSL** only (`cursor-win ~/projects/protpure-web`).

---

## Coding Standards

- Keep functions small; prefer readability.
- Explain non-obvious decisions.
- Avoid unnecessary abstractions.
- Update `MEMORY.md` for permanent decisions/lessons; vault project note for ops detail.
- Do not put secrets in git, vault notes, or chat.

---

## Before every task

Understand the request.

Check `MEMORY.md`, vault `projects/protpure-web.md`, and existing code.

Implement the smallest correct solution.

Verify (typecheck/tests or the affected page).

Commit.
