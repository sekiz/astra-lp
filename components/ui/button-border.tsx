"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const ButtonBorder = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn("relative overflow-hidden group bg-transparent hover:bg-transparent border-0 px-6 py-6", className)}
        {...props}
      >
        <div
          className={cn(
            "-inset-px pointer-events-none absolute rounded-[inherit] border border-transparent border-inset [mask-clip:padding-box,border-box]",
            "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
          )}
        >
          <motion.div
            className={cn(
              "absolute aspect-square bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400 opacity-80"
            )}
            animate={{
              offsetDistance: ["0%", "100%"],
            }}
            style={{
              width: "100%", /* changed for full span around the shape */
              offsetPath: `rect(0 auto auto 0 round 6px)`,
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4,
              ease: "linear",
            }}
          />
        </div>

        {/* Inner background to cover anything underneath and provide border framing */}
        <div className="absolute inset-[1px] rounded-[inherit] bg-[var(--color-bg-surface)] group-hover:bg-[var(--color-bg-elevated)] transition-colors z-0" />
        
        <span className="relative z-10 font-semibold tracking-wide text-[var(--color-text-primary)] flex items-center gap-2">
          {children}
        </span>
      </Button>
    );
  }
);
ButtonBorder.displayName = "ButtonBorder";
