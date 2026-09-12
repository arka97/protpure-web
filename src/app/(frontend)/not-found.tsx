import { StatusPage } from '@/components/StatusPage'

export default function NotFound() {
  return <StatusPage tone="plain" eyebrow="404" heading="Nothing *here.*" text="The page may have moved, or the address has a typo. The catalogue and the technical team are one click away." links={[{ href: '/products', label: 'Browse the catalogue', appearance: 'primary' }, { href: '/contact', label: 'Contact us', appearance: 'secondary' }]} />
}
