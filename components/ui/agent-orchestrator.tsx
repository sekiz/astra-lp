"use client";

import React from "react";
import { motion } from "motion/react";
import { BrainIcon, ZapIcon, SparklesIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AgentOrchestratorProps {
  className?: string;
  labels?: {
    memory: string;
    agents: string;
    apps: string;
    realtime: string;
  };
}

// ── Pulsing ring ──────────────────────────────────────────────────────────────

const PulseRing = ({ size, delay, offset }: { size: number; delay: number; offset: number }) => (
  <motion.div
    className="absolute rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.03]"
    style={{ width: size, height: size, bottom: -offset }}
    animate={{ scale: [0.98, 1.02, 0.98, 1, 1, 1] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
  />
);

// ── Astra Spark Logo (inline SVG) ────────────────────────────────────────────

const AstraSparkMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2 L18.5 12 L28 10 L19.5 16 L28 22 L18.5 20 L16 30 L13.5 20 L4 22 L12.5 16 L4 10 L13.5 12 Z" fill="currentColor" opacity="0.95"/>
    <path d="M16 9 L17.5 14.5 L23 13.5 L18.5 16 L23 18.5 L17.5 17.5 L16 23 L14.5 17.5 L9 18.5 L13.5 16 L9 13.5 L14.5 14.5 Z" fill="currentColor" opacity="0.45"/>
  </svg>
);

// ── The four value pillars ────────────────────────────────────────────────────


const badgeX = [14, 60, 108, 150];
const badgeWidth = [34, 34, 34, 42];

// ── Main Component ────────────────────────────────────────────────────────────

export const AgentOrchestrator = ({
  className,
  labels = { memory: "MEMORY", agents: "AGENTS", apps: "APPS", realtime: "REALTIME" },
}: AgentOrchestratorProps) => {
  const pillars = [
    { label: labels.memory,   delay: "0s",  cx: 31  },
    { label: labels.agents,   delay: "1s",  cx: 77  },
    { label: labels.apps,     delay: "2s",  cx: 125 },
    { label: labels.realtime, delay: "3s",  cx: 171 },
  ];
  return (
    <div
      className={cn(
        "relative flex h-[350px] w-full max-w-[520px] flex-col items-center",
        className
      )}
    >
      {/* ── SVG path lines + travelling lights ──────────────────────────── */}
      <svg
        className="h-full w-full text-[var(--color-border)]"
        viewBox="0 0 200 100"
      >
        {/* Static connector lines */}
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.4"
          strokeDasharray="100 100"
          pathLength="100"
        >
          <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10" />
          <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10" />
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        </g>

        {/* Travelling indigo light balls */}
        {pillars.map((_, n) => (
          <g key={n} mask={`url(#db-mask-${n + 1})`}>
            <circle
              className={`database db-light-${n + 1}`}
              cx="0"
              cy="0"
              r="12"
              fill="url(#db-blue-grad)"
              style={{ animationDelay: pillars[n].delay }}
            />
          </g>
        ))}

        {/* Pillar badge buttons */}
        <g fill="none">
          {pillars.map((pillar, i) => (
            <g key={pillar.label}>
              {/* Badge background */}
              <rect
                fill="#111111"
                stroke="#2a2a2a"
                strokeWidth="0.3"
                x={badgeX[i]}
                y="4"
                width={badgeWidth[i]}
                height="11"
                rx="5.5"
              />
              {/* Centered label — white, bold */}
              <text
                x={pillar.cx}
                y="11.6"
                fill="#ffffff"
                stroke="none"
                fontSize="4.2"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing="0.5"
              >
                {pillar.label}
              </text>
            </g>
          ))}
        </g>

        {/* Path masks for light animation */}
        <defs>
          <mask id="db-mask-1">
            <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 25" strokeWidth="0.5" stroke="white" />
          </mask>
          <mask id="db-mask-2">
            <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 25" strokeWidth="0.5" stroke="white" />
          </mask>
          <mask id="db-mask-3">
            <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 25" strokeWidth="0.5" stroke="white" />
          </mask>
          <mask id="db-mask-4">
            <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 25" strokeWidth="0.5" stroke="white" />
          </mask>
          {/* Indigo gradient for travelling light */}
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      {/* ── Main Core Box ─────────────────────────────────────────────────── */}
      <div className="absolute bottom-10 flex w-full flex-col items-center">
        {/* Outer ambient glow */}
        <div className="absolute -bottom-4 h-[100px] w-[62%] rounded-lg bg-[var(--color-accent)]/20" />

        {/* Title pill */}
        <div className="absolute -top-4 z-20 flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2.5 py-1.5">
          <SparklesIcon className="size-3 text-[var(--color-accent)]" />
          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium tracking-wide">
            AI-native OS core
          </span>
        </div>

        {/* CORE circle — Astra spark logo */}
        <div className="absolute -bottom-8 z-30 grid h-[64px] w-[64px] place-items-center rounded-full border border-[var(--color-accent)]/40 bg-[#0a0a0f] shadow-lg shadow-[var(--color-accent)]/20 overflow-hidden">
          <img src="/astra.svg" alt="Astra Core" className="w-[50%] h-[50%] object-center rounded-sm" />
        </div>

        {/* Box content */}
        <div className="relative z-10 flex h-[180px] w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#080810] shadow-2xl shadow-black/70">

          {/* Context badges — concrete, differentiated */}
          <div className="absolute bottom-8 left-8 z-10 flex h-7 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 text-[10px]">
            <ZapIcon className="size-3 text-emerald-400" />
            <span className="text-[var(--color-text-secondary)] font-mono">research-agent · 1.2ms</span>
          </div>
          <div className="absolute right-8 z-10 hidden sm:flex h-7 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 text-[10px]">
            <BrainIcon className="size-3 text-blue-400" />
            <span className="text-[var(--color-text-secondary)] font-mono">memory-store · 128k ctx</span>
          </div>

          {/* Pulsing rings */}
          <PulseRing size={100} offset={56}  delay={0}   />
          <PulseRing size={145} offset={80}  delay={0.5} />
          <PulseRing size={190} offset={100} delay={1}   />
          <PulseRing size={235} offset={120} delay={1.5} />
        </div>
      </div>
    </div>
  );
};

export default AgentOrchestrator;
