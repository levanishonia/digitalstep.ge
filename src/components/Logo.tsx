export function Logo({ label = 'Digital Step' }: { label?: string }) {
  return (
    <a className="logo" href="#main" aria-label={label}>
      <span className="logo-mark" aria-hidden="true"><span /></span>
      <span className="logo-name">Digital <strong>Step</strong></span>
    </a>
  )
}
