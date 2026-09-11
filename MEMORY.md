# MEMORY

## Repository

Protpure web (`arka97/protpure-web`)

---

## Purpose

Client storefront + Payload CMS for Protpure.

---

## Current Phase

Local WSL development ready. Public deploy blocked on a hostname (Cloudflare → Dokploy).

- Local Next/Payload on **:3001** via `protpure-dev` systemd user unit.
- Postgres via `docker compose` on **:5432**.
- Private GitHub remote in sync.
- Not yet: domain, Cloudflare edge, Dokploy production deploy, `llms.txt` / verify script / auth hardening for public.

Ops detail: vault `projects/protpure-web.md`. Open platform work: vault `ops/open-loops.md`.

---

## Permanent Decisions

- Canon checkout is WSL `/home/arka/projects/protpure-web` — not the OneDrive copy.
- Local Next listens on **:3001** so it never fights Dokploy’s `:3000` SSH tunnel.
- `pnpm` is pinned via `packageManager` in `package.json`.
- `.env` is local-only (gitignored); seed admin comes from `SEED_ADMIN_*`.
- Deploy path when a domain exists: Cloudflare Full (strict) → Dokploy + GitHub App `dokploy-arka` (not the Grok GitHub MCP PAT).

---

## Lessons

- A product with a null category crashed the homepage; null-safe counts belong in render paths (`RenderBlocks.tsx`).
- WSL→Windows browser needs `allowedDevOrigins` for localhost access during local dev.
- Paths under `/home/adi/...` are on the VPS, not the laptop — do not look for production `.env` in WSL.

---

## Notes

Update this file when a permanent decision, lesson, or recurring issue appears.

Do not use it as a changelog. Day-to-day ops stay in the vault project note.
