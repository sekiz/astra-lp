"use client";

import { cn } from "@/lib/utils";
import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
  /** Optional: extra content rendered inside the card (e.g. a mini visual) */
  visual?: React.ReactNode;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-5 rounded-xl overflow-hidden transition-all duration-300 cursor-default",
            // Dark-theme border + bg using project CSS vars
            "border border-[var(--color-border)] bg-[var(--color-bg-surface)]",
            "hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg-elevated)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            item.hasPersistentHover &&
              "border-[var(--color-accent)]/30 bg-[var(--color-bg-elevated)] -translate-y-0.5"
          )}
        >
          {/* Subtle dot-grid overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[length:6px_6px]" />
          </div>

          {/* Content */}
          <div className="relative flex flex-col space-y-3 h-full">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--color-bg-primary)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/40 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider",
                    "bg-[var(--color-bg-primary)] border border-[var(--color-border)]",
                    "text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/40",
                    "transition-colors duration-300"
                  )}
                >
                  {item.status}
                </span>
              )}
            </div>

            {/* Title + description */}
            <div className="space-y-1.5">
              <h3 className="font-semibold text-[var(--color-text-primary)] text-[15px] tracking-tight leading-snug">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-[var(--color-text-muted)] font-normal">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Optional mini visual */}
            {item.visual && (
              <div className="flex-1 flex items-center justify-center py-2">
                {item.visual}
              </div>
            )}

            {/* Footer row */}
            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.cta ?? "Explore →"}
              </span>
            </div>
          </div>

          {/* Accent glow border on hover */}
          <div
            className={cn(
              "absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-[var(--color-accent)]/10 to-transparent",
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300"
            )}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
