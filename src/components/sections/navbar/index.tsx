'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleUser, Menu, Search } from 'lucide-react'
import Image from 'next/image'
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
import { toast, useLogout, useUserData } from '@/hooks'
import { cn } from '@/utils'

import { userMenus } from './data'
import { Navigation } from './navigation'
import { TProps, TSearchRequest } from './type'
import { schema } from './validation'

export const Navbar = (props: TProps) => {
  const { className } = props
  const { push } = useRouter()
  const { data: userData } = useUserData()
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

  const { mutate: mutateLogout } = useLogout()

  return (
    <header
      className={cn(
        'border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 w-full items-center gap-4 border-b px-4 backdrop-blur md:px-6',
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
              {userData?.photoURL ? (
                <Image
                  src={userData.photoURL}
                  alt={userData.displayName}
                  width={40}
                  height={40}
                  className="select-none rounded-full"
                />
              ) : (
                <CircleUser className="h-5 w-5" />
              )}
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
