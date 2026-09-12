# protpure-web — notes for AI coding agents

Next.js 16 + Payload CMS 3 + Postgres. See README.md for architecture, scripts and deployment.

- Payload skill: `.claude/skills/payload/SKILL.md` (collections, fields, hooks, access).
- Schema change workflow: edit `src/collections/*` → `pnpm generate:types` → `pnpm migrate:create` → commit migration.
- Data access goes through `src/lib/data.ts` (cached, tag-revalidated). Never call `getPayload` directly in pages.
- Rendering is on-demand (`force-dynamic` in `src/app/(frontend)/layout.tsx`); do not add `generateStaticParams` — Docker builds have no DB.
- Product field `availability` (not `status`: that name collides with Payload's draft `_status` enum in Postgres).
- Media URLs must go through `mediaUrl()` (Payload emits absolute URLs; `next/image` needs same-origin paths).
- Any new content surface should be reflected in `src/lib/markdown.ts` (AI/markdown views), `src/lib/public-api.ts` and the MCP tools in `src/app/mcp/route.ts`.
- Checks before committing: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
- Parallel branches sharing the local Postgres: run dev with `PAYLOAD_DB_PUSH=false` unless your branch changes the schema (schema push drops tables your branch does not know about).
