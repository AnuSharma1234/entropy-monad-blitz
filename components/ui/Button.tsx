"use client";

import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-green disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-mono clip-path-polygon",
  {
    variants: {
      variant: {
        default:
          "bg-neon-green text-black hover:bg-[#00CC6A] border border-transparent shadow-[0_0_15px_rgba(0,255,136,0.5)]",
        outline:
          "border border-neon-green text-neon-green hover:bg-neon-green/10 shadow-[0_0_5px_rgba(0,255,136,0.3)]",
        ghost: "hover:bg-white/5 text-gray-300 hover:text-white",
        danger:
          "bg-error/10 text-error border border-error/50 hover:bg-error/20",
        link: "text-neon-green underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, asChild, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
