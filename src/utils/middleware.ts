import { User } from 'firebase/auth'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { authPages, protectedPages } from '@/configs'

import { extractPathSegment } from './parser'

type TProps = {
  push: (href: string, options?: NavigateOptions) => void
  pathname: string
  user?: User | null
}

export function middleware(props: TProps) {
  const { push, pathname, user } = props
  const extractedPath = extractPathSegment(pathname)

  if (protectedPages.has(extractedPath) && !user) {
    const url = '/auth'
    return push(url)
  }

  if (authPages.has(extractedPath) && user) {
    const url = '/dashboard'
    return push(url)
  }
}
