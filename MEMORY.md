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
- v5 visual direction (Sep 2026): **Deep Field** with Clean Room data details — `design/BUILD-BRIEF.md` is the spec, `design/concepts/deep-field/` the boards. Codex Astra (`codex exec -m gpt-6-astra`) is the design lane (concepts, design QA); Claude agents implement.
- Paid sample kits only, never "free samples" (copy, FAQ, llms.txt, MCP). The RFQ basket (`src/components/rfq/*`, `src/lib/rfq.ts`) is the primary conversion path.
- Content stays CMS-driven: new sections are blocks in `src/blocks/config.ts` + seed in `src/seed/data/*`; placeholders are CMS slots (editor-only in draft mode), never hard-coded copy.

---

## Lessons

- A product with a null category crashed the homepage; null-safe counts belong in render paths (`RenderBlocks.tsx`).
- WSL→Windows browser needs `allowedDevOrigins` for localhost access during local dev.
- Paths under `/home/adi/...` are on the VPS, not the laptop — do not look for production `.env` in WSL.
- Next dev keeps `unstable_cache` data in `.next/dev/cache/fetch-cache` across restarts: after `pnpm seed` from another process, delete it and restart the dev server or pages show stale content.
- Dev schema push drops tables other branches created: parallel agents run on their own DB clone (`pg_dump protpure | psql <clone>` inside the `db` container) or with `PAYLOAD_DB_PUSH=false`.
- Payload `update` on a group keeps array fields it is not told about — the seed must send `badges: []` explicitly to clear them.
- The site uses `scroll-behavior: smooth`; Playwright scroll loops need `scrollTo({ behavior: 'instant' })` or `.reveal` sections stay invisible in full-page captures.
- ESLint must ignore `.claude/` (agent worktrees) and `design/` (concept boards) or `pnpm lint` in the main checkout never finishes.

---

## Notes

Update this file when a permanent decision, lesson, or recurring issue appears.

Do not use it as a changelog. Day-to-day ops stay in the vault project note.
