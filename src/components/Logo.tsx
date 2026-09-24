import { mainLogoUrl } from '../brand'

export function Logo({ label = 'Digital Step', href = '#main' }: { label?: string; href?: string }) {
  return (
    <a className="logo" href={href} aria-label={label}>
      <img src={mainLogoUrl} alt="" />
    </a>
  )
}
