import { ButtonLink } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="heading-2 mt-3">Page not found</h1>
        <p className="mt-3 text-ink-soft">The page may have moved. Try the catalog or ask us directly.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/products">Browse products</ButtonLink>
          <ButtonLink href="/contact" appearance="secondary">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
