/**
 *   pnpm seed            # upsert everything (safe to re-run)
 *   pnpm seed --reset    # delete seeded collections first, then seed
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { runSeed } from './run'

// Top-level await: `payload run` imports this module and exits once the import settles.
try {
  const payload = await getPayload({ config })
  const result = await runSeed(payload, { reset: process.argv.includes('--reset') })
  payload.logger.info({ msg: '[seed] summary', ...result })
  process.exit(0)
} catch (err) {
  console.error(err)
  process.exit(1)
}
