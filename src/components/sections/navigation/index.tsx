import { Package2 } from 'lucide-react'
import Link from 'next/link'

import { metadata } from '@/data'
import { cn } from '@/utils'

import { TProps } from './type'

export const Navigation = (props: TProps) => {
  const { className } = props
  return (
    <nav className={cn('gap-6 text-lg font-medium', className)}>
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">{metadata.title?.toString()}</span>
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
