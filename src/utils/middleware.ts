import { User } from 'firebase/auth'
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { authPages, protectedPages } from '@/configs'

import { extractPathSegment } from './parser'

type TProps = {
  push: (href: string, options?: NavigateOptions) => void
  pathname: string
  userData?: User | null
}

export const middleware = (props: TProps) => {
  const { push, pathname, userData } = props
  const extractedPath = extractPathSegment(pathname)

  if (protectedPages.has(extractedPath) && !userData) {
    const url = '/auth'
    return push(url)
  }

  if (authPages.has(extractedPath) && userData) {
    const url = '/dashboard'
    return push(url)
  }
}
