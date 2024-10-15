import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { metadata } from '@/data'
import { cn } from '@/utils'

import { navs } from './data'
import { TProps } from './type'

export const Navigation = (props: TProps) => {
  const { className } = props
  const pathname = usePathname()
  return (
    <nav className={cn('gap-6 text-lg font-medium', className)}>
      <Link
        href="#"
        className="flex items-center gap-2 whitespace-nowrap text-lg font-semibold md:text-base"
      >
        <div className="relative h-6 w-6">
          <Image
            src={(metadata.icons as any)?.apple?.toString()}
            alt={metadata.title?.toString() || 'Logo'}
            sizes="24px"
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
        <span className="sr-only">{metadata.title?.toString()}</span>
      </Link>
      {navs.map((nav, index) => (
        <Link
          key={index}
          href={nav.href}
          className={cn(
            pathname === nav.href ? 'text-foreground' : 'text-muted-foreground',
            'hover:text-foreground whitespace-nowrap transition-colors'
          )}
        >
          {nav.name}
        </Link>
      ))}
    </nav>
  )
}
