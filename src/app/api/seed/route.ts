import { timingSafeEqual } from 'crypto'
import { getPayloadClient } from '@/lib/data'
import { runSeed } from '@/seed/run'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One-off content seeding for a fresh production database (Docker images don't ship the CLI).
 * Enabled only while SEED_TOKEN is set:  curl -X POST https://protpure.com/api/seed -H "x-seed-token: $SEED_TOKEN"
 * Remove SEED_TOKEN from the environment afterwards.
 */
export async function POST(req: Request) {
  const expected = process.env.SEED_TOKEN
  const given = req.headers.get('x-seed-token') ?? ''
  if (!expected || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return new Response('Not found', { status: 404 })
  }
  const reset = new URL(req.url).searchParams.get('reset') === '1'
  const payload = await getPayloadClient()
  try {
    const result = await runSeed(payload, { reset })
    return Response.json({ ok: true, ...result })
  } catch (err) {
    payload.logger.error({ err, msg: '[seed] failed' })
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
