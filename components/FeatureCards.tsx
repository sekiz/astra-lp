"use client";

import React from "react";
import { SpotlightCard } from "./ui/spotlight-card";
import { Shield, Code2, Network } from "lucide-react";

interface Card {
  title: string;
  body: string;
  meta?: string;
  status?: string;
}

interface FeatureCardsProps {
  cards: [Card, Card, Card];
}

const config = [
  {
    Icon: Shield,
    iconClass: "text-[var(--color-accent)]",
    iconBg: "bg-[var(--color-bg-primary)] border-[var(--color-accent)]/20",
    spotlightColor: "rgba(99, 102, 241, 0.18)",
  },
  {
    Icon: Code2,
    iconClass: "text-emerald-400",
    iconBg: "bg-emerald-950/40 border-emerald-800/30",
    spotlightColor: "rgba(52, 211, 153, 0.15)",
  },
  {
    Icon: Network,
    iconClass: "text-purple-400",
    iconBg: "bg-purple-950/40 border-purple-800/30",
    spotlightColor: "rgba(168, 85, 247, 0.18)",
  },
];

export function FeatureCards({ cards }: FeatureCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const { Icon, iconClass, iconBg, spotlightColor } = config[i];
        return (
          <SpotlightCard
            key={i}
            spotlightColor={spotlightColor}
            className="p-6 h-full flex flex-col gap-5"
          >
            {/* Icon row */}
            <div className="flex items-start justify-between">
              <div
                className={`h-11 w-11 flex items-center justify-center rounded-lg border ${iconBg}`}
              >
                <Icon size={22} className={iconClass} aria-hidden="true" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-[var(--color-text-primary)] font-semibold text-base tracking-tight mb-2">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {card.body}
              </p>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
