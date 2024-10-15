import { Package2 } from 'lucide-react'
import Link from 'next/link'

import { TProps } from './type'

export const Navigation = (props: TProps) => {
  const { className } = props
  return (
    <nav className={className}>
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        href="#"
        className="text-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
      <Link
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Orders
      </Link>
      <Link
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Products
      </Link>
      <Link
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Customers
      </Link>
      <Link
        href="#"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Analytics
      </Link>
    </nav>
  )
}
