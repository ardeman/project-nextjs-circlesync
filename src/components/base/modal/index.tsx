'use client'

import { useMediaQuery } from 'usehooks-ts'

import { Button } from '@/components/base'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui'
import { cn } from '@/utils'

import { TProps } from './type'

export const Modal = (props: TProps) => {
  const { open, setOpen, children, title, description } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader className={title || description ? '' : 'hidden'}>
            <DialogTitle className={title ? '' : 'hidden'}>{title}</DialogTitle>
            <DialogDescription className={description ? '' : 'hidden'}>
              {description}
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerContent className="rounded-t-lg">
        <DrawerHeader
          className={cn(title || description ? '' : 'hidden', 'text-left')}
        >
          <DrawerTitle className={title ? '' : 'hidden'}>{title}</DrawerTitle>
          <DrawerDescription className={description ? '' : 'hidden'}>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
