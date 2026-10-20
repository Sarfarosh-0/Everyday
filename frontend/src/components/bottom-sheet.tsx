import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/components/use-media-query"

type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  className?: string
  children: ReactNode
  footer?: ReactNode
  onCloseAutoFocus?: (event: Event) => void
}

/** Bottom sheet below 768px, centered modal from 768px up. */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  footer,
  onCloseAutoFocus,
}: BottomSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={className}
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto">{children}</div>
          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus>
      <DrawerContent className={className} onCloseAutoFocus={onCloseAutoFocus}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{children}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  )
}
