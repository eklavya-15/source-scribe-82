/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-pulse-subtle",
        vibrant: "bg-gradient-primary-vibrant text-primary-foreground hover:shadow-glow-vibrant hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-pulse-vibrant",
        electric: "bg-accent-electric text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-pulse-electric",
        coral: "bg-gradient-coral text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300",
        emerald: "bg-gradient-emerald text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300",
        sunset: "bg-gradient-sunset text-white hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-300 hover:animate-pulse-subtle",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95 transition-all duration-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-102 active:scale-95 transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-102 active:scale-95 transition-all duration-300",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-102 active:scale-95 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:scale-102 active:scale-95 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    
    // Ripple effect handler
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple");
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(e) => {
          handleRipple(e);
          if (props.onClick) props.onClick(e);
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
