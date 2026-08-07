export function Logo({ label = 'Digital Step', href = '#main' }: { label?: string; href?: string }) {
  return (
    <a className="logo" href={href} aria-label={label}>
      <span className="logo-mark" aria-hidden="true"><span /></span>
      <span className="logo-name">Digital <strong>Step</strong></span>
    </a>
  )
}
