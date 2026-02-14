import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white hover:bg-white/15 border border-white/[0.08]",
        primary: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20",
        success: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20",
        destructive: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20",
        ghost: "text-white/60 hover:text-white hover:bg-white/[0.05]",
        outline: "border border-white/[0.1] text-white/70 hover:bg-white/[0.05] hover:text-white",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2 text-[11px]",
        lg: "h-10 px-5",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
