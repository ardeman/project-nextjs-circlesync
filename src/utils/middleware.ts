import { User } from 'firebase/auth'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { authPages, protectedPages } from '@/configs'

import { extractPathSegment } from './parser'

type TProps = {
  push: (href: string, options?: NavigateOptions) => void
  pathname: string
  user: User | null
  loading: boolean
}

export function middleware(props: TProps) {
  const { push, pathname, user, loading } = props
  const extractedPath = extractPathSegment(pathname)

  if (protectedPages.has(extractedPath) && !user && !loading) {
    const url = '/'
    return push(url)
  }

  if (authPages.has(extractedPath) && user && !loading) {
    const url = '/'
    return push(url)
  }
}
