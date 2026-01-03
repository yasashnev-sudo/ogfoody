import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-base font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
