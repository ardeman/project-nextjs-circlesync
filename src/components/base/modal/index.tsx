'use client'

import { useMediaQuery } from 'usehooks-ts'

import { Button } from '@/components/base'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  const {
    open,
    setOpen,
    children,
    title,
    description,
    onClose,
    handleConfirm,
    variant = 'default',
  } = props
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleClose = () => {
    setOpen(false)
    if (onClose) {
      onClose() // Call onClose when the modal is closed
    }
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) handleClose() // Trigger handleClose when closing
        }}
      >
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader className={title || description ? '' : 'hidden'}>
            <DialogTitle className={title ? '' : 'hidden'}>{title}</DialogTitle>
            <DialogDescription className={description ? '' : 'hidden'}>
              {description}
            </DialogDescription>
          </DialogHeader>
          {children}
          {handleConfirm && (
            <DialogFooter>
              <Button
                variant={variant}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) handleClose() // Trigger handleClose when closing
      }}
    >
      <DrawerContent className="max-h-[80dvh] rounded-t-lg">
        <div className="overflow-y-auto">
          <DrawerHeader
            className={cn(title || description ? '' : 'hidden', 'text-left')}
          >
            <DrawerTitle className={title ? '' : 'hidden'}>{title}</DrawerTitle>
            <DrawerDescription className={description ? '' : 'hidden'}>
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">{children}</div>
          <DrawerFooter className="pt-2">
            {handleConfirm && (
              <Button
                variant="default"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
