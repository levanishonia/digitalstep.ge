import { ArrowLeft } from 'lucide-react'
import { localePath, type Locale } from '../i18n'

const copy = {
  ka: { title: 'გვერდი ვერ მოიძებნა', text: 'ბმული არასწორია ან ეს გვერდი აღარ არსებობს.', back: 'მთავარ გვერდზე დაბრუნება' },
  en: { title: 'Page not found', text: 'The link is invalid or this page no longer exists.', back: 'Return home' },
} as const

/** A consistent, localized terminal state for unknown client-side routes. */
export function NotFoundPage({ locale }: { locale: Locale }) {
  const c = copy[locale]
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <span aria-hidden="true">404</span>
      <h1 id="not-found-title">{c.title}</h1>
      <p>{c.text}</p>
      <a href={localePath(locale, '/')}><ArrowLeft aria-hidden="true" />{c.back}</a>
    </section>
  )
}
