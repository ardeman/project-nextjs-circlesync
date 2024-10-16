import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { settings } from './data'

export const Sidebar = () => {
  const pathname = usePathname()
  return (
    <nav
      className="text-muted-foreground grid gap-4 text-sm"
      x-chunk="dashboard-04-chunk-0"
    >
      {settings.map((setting) => (
        <Link
          key={setting.name}
          href={setting.href}
          className={
            pathname === setting.href ? 'text-primary font-semibold' : ''
          }
        >
          {setting.name}
        </Link>
      ))}
    </nav>
  )
}
