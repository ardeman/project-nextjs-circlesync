import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FirebaseError } from 'firebase/app'
import { signOut } from 'firebase/auth'
import { CircleUser, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import { ModeToggle, Input } from '@/components/base'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui'
import { firebaseAuth } from '@/configs'
import { firebaseAuthError } from '@/constants'
import { toast, useAuthUser, useQueryActions } from '@/hooks'
import { cn } from '@/utils'

import { userMenus } from './data'
import { Navigation } from './navigation'
import { TProps, TSearchRequest } from './type'
import { schema } from './validation'

export const Navbar = (props: TProps) => {
  const { className } = props
  const { push } = useRouter()
  const { data: userData } = useAuthUser()
  const { invalidateQueries: invalidateUser } = useQueryActions(['auth-user'])
  const formMethods = useForm<TSearchRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: '',
    },
  })
  const { handleSubmit } = formMethods
  const onSubmit = handleSubmit(async (data) => {
    toast({
      title: 'Search',
      description: <pre>{JSON.stringify(data, null, 2)}</pre>,
    })
  })
  const handleLogout = () => {
    mutateLogout()
    push('/')
  }

  const { mutate: mutateLogout } = useMutation({
    mutationFn: () => signOut(firebaseAuth),
    onSuccess: () => {
      invalidateUser()
    },
    onError: (error: unknown) => {
      let message = String(error)
      if (error instanceof FirebaseError) {
        message =
          firebaseAuthError.find((item) => item.code === error.code)?.message ||
          error.message
      }
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <header
      className={cn(
        'bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6',
        className
      )}
    >
      <Navigation className="hidden flex-col md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6" />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Navigation className="grid" />
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <FormProvider {...formMethods}>
          <form
            onSubmit={onSubmit}
            className="ml-auto"
          >
            <Input
              autoFocus
              name="query"
              type="search"
              placeholder="Search"
              inputClassName="sm:w-[300px] md:w-[200px] lg:w-[300px]"
              leftNode={({ className }) => <Search className={className} />}
            />
          </form>
        </FormProvider>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {userData?.displayName || userData?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userMenus.map((menu, index) => (
              <Link
                key={index}
                href={menu.href}
                target={menu.href.startsWith('http') ? '_blank' : undefined}
              >
                <DropdownMenuItem>{menu.name}</DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
