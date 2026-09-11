import { getCertifications, getTeam } from '@/lib/data'
import { JsonLd, organizationJsonLd } from '@/lib/jsonld'
import type { SiteSetting } from '@/payload-types'

/**
 * Organization + WebSite structured data for the root layout. Fetches the team (founder) and the
 * certifications (credentials) from the cached data layer so `organizationJsonLd` itself stays pure.
 */
export async function OrganizationJsonLd({ settings }: { settings: SiteSetting }) {
  const [team, certifications] = await Promise.all([getTeam(), getCertifications()])
  return <JsonLd data={organizationJsonLd(settings, { team, certifications })} />
}
