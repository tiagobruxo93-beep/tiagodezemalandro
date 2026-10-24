import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-sans text-sm font-medium tracking-wide transition-[background-color,color,box-shadow,transform,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
        forward:
          "bg-primary text-primary-foreground uppercase tracking-[0.14em] text-[11px] font-semibold shadow-glow hover:brightness-110",
        gold:
          "bg-secondary text-secondary-foreground uppercase tracking-[0.14em] text-[11px] font-semibold hover:brightness-105",
        outline:
          "border border-secondary/50 bg-transparent text-foreground hover:border-secondary hover:bg-secondary/10",
        hairline:
          "border border-secondary/30 bg-card/60 text-secondary hover:border-secondary/70 hover:bg-secondary/10 hover:text-foreground",
        secondary:
          "bg-secondary/15 text-secondary hover:bg-secondary/25",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "text-secondary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
        whatsapp:
          "bg-[hsl(152_46%_30%)] text-primary-foreground hover:bg-[hsl(152_46%_34%)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-[13px]",
        xl: "h-14 px-10 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
