import { Bell, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'

export function SearchField() {
  return (
    <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
      <Search aria-hidden="true" />
      <label className="visually-hidden" htmlFor="marketplace-search">მომსახურების ძიება</label>
      <input id="marketplace-search" type="search" placeholder="მოძებნე მომსახურება..." />
      <button type="button" aria-label="ძიების ფილტრები"><SlidersHorizontal aria-hidden="true" /></button>
    </form>
  )
}

export function DesktopHeader() {
  return (
    <header className="desktop-header">
      <SearchField />
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="კალათა"><ShoppingCart aria-hidden="true" /></button>
        <button className="icon-button has-notice" type="button" aria-label="შეტყობინებები"><Bell aria-hidden="true" /></button>
        <button className="account" type="button" aria-label="ანგარიშის მენიუ">
          <span className="avatar">ნ</span><span><strong>ნიკა</strong><small>მყიდველი</small></span>
        </button>
      </div>
    </header>
  )
}
