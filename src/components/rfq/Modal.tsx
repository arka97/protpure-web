'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Accessible modal built on the native <dialog> element: `showModal()` gives us a focus trap,
 * Escape-to-close, an inert background and focus restoration for free. Clicking the backdrop closes.
 *
 * `panelClassName` positions the panel (centered box, right-hand drawer…); the dialog element itself
 * is stretched over the viewport so backdrop clicks are easy to detect.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  panelClassName,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy?: string
  className?: string
  panelClassName?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    else if (!open && el.open) el.close()
  }, [open])

  // Lock page scroll while open (modal dialogs do not do this by themselves).
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        // Only clicks on the backdrop / empty panel area close it, never clicks inside the content.
        if (e.target === ref.current || e.target === panelRef.current) onClose()
      }}
      className={cn('fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-ink backdrop:bg-[#081f2980]', className)}
    >
      <div ref={panelRef} className={cn('pointer-events-auto', panelClassName)}>
        {open ? children : null}
      </div>
    </dialog>
  )
}
