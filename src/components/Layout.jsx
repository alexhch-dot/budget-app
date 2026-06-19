import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '◧' },
  { to: '/transactions', label: 'Transactions', icon: '☰' },
  { to: '/settings', label: 'Paramètres', icon: '⚙' },
]

function navLinkClass({ isActive }) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-accent-light text-accent' : 'text-app-text hover:bg-gray-100',
  ].join(' ')
}

function bottomNavLinkClass({ isActive }) {
  return [
    'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium',
    isActive ? 'text-accent' : 'text-gray-500',
  ].join(' ')
}

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-app-bg">
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white p-4 md:flex md:flex-col">
        <div className="mb-6 px-2 text-lg font-semibold text-gray-900">Budget</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <span className="text-lg font-semibold text-gray-900">Budget</span>
        </header>

        <main className="flex-1 px-4 py-6 pb-20 md:px-8 md:pb-6">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 flex border-t border-gray-200 bg-white md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={bottomNavLinkClass}>
              <span aria-hidden="true" className="text-base">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
