import * as React from "react"
import { cn } from "@/client/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "whatsapp"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: "bg-whatsapp-500 text-white shadow hover:bg-whatsapp-600 active:bg-whatsapp-700",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
      outline: "border border-whatsapp-300 bg-transparent shadow-sm hover:bg-whatsapp-50 hover:text-whatsapp-700 hover:border-whatsapp-400 active:bg-whatsapp-100 text-whatsapp-700",
      secondary: "bg-whatsapp-50 text-whatsapp-800 shadow-sm hover:bg-whatsapp-100 active:bg-whatsapp-200",
      ghost: "hover:bg-whatsapp-50 hover:text-whatsapp-700 active:bg-whatsapp-100",
      link: "text-whatsapp-700 underline-offset-4 hover:underline hover:text-whatsapp-800",
      whatsapp: "bg-whatsapp-500 text-white shadow-sm hover:bg-whatsapp-600 active:bg-whatsapp-700"
    }
    
    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild) {
      // For asChild functionality, you'd need to implement Slot from Radix
      // For now, we'll just render as a button
      console.warn("asChild prop is not supported in this custom Button implementation")
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
