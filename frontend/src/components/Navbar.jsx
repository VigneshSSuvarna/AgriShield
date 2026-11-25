
function Navbar({ page, setPage }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'detection', label: 'Detect Disease' },
    { id: 'diseases', label: 'Disease Library' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-3"
        >
          <span className="rounded-xl bg-emerald-100 p-2 text-2xl">
            🌱
          </span>
          <span className="text-2xl font-bold text-emerald-900">
            AgriShield
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              aria-current={page === link.id ? 'page' : undefined}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                page === link.id
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-600 hover:bg-emerald-50'
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
