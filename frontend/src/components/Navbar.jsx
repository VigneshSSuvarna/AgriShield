import { BrandLeafMark } from './BotanicalIcons'

function Navbar({ page, setPage }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'detection', label: 'Detect Disease' },
    { id: 'diseases', label: 'Disease Library' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">

        <button
          type="button"
          onClick={() => setPage('home')}
          className="flex items-center gap-2.5 rounded py-1 text-left transition-colors duration-200 hover:text-accent"
        >
          <span className="text-accent">
            <BrandLeafMark className="h-6 w-6" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            AgriShield
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-4 sm:gap-7">
          {links.map(link => (
            <button
              key={link.id}
              type="button"
              onClick={() => setPage(link.id)}
              aria-current={page === link.id ? 'page' : undefined}
              className={`border-b-2 py-1.5 text-sm font-medium transition-colors duration-200 ${
                page === link.id
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-muted hover:border-rule-strong hover:text-ink'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

      </nav>
    </header>
  )
}

export default Navbar
