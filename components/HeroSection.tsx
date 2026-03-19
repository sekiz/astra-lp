'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Button } from './ui/button'
import { AnimatedGroup } from './ui/animated-group'
import { AgentOrchestrator } from './ui/agent-orchestrator'
import { useWaitlist } from './WaitlistProvider'
import { ButtonBorder } from './ui/button-border'

// ── Animation presets ─────────────────────────────────────────────────────────

const fadeUpVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 16 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 1.4 },
    },
  },
}

// ── Ambient background ────────────────────────────────────────────────────────

function AmbientBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Radial glow center */}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
      />
      {/* Top-left sweep */}
      <div
        className="hidden lg:block absolute -left-32 -top-32 w-[30rem] h-[60rem] -rotate-45 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-48"
        style={{ background: 'linear-gradient(to top, var(--color-bg-primary), transparent)' }}
      />
    </div>
  )
}

// ── HeroSection ───────────────────────────────────────────────────────────────

export function HeroSection() {
  const t = useTranslations('Hero')
  const { setOpen } = useWaitlist()

  return (
    <section
      data-section="hero"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
    >
      <AmbientBg />

      <div className="mx-auto max-w-5xl w-full pt-24 pb-10">
        <AnimatedGroup variants={fadeUpVariants} className="flex flex-col items-center">
          {/* Badge */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group mb-8 flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-1.5 shadow-md shadow-black/20 transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-elevated)]"
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-[var(--color-text-secondary)]">{t('scarcity')}</span>
            <span className="block h-4 w-px bg-[var(--color-border)]" />
            <div className="size-5 overflow-hidden rounded-full bg-[var(--color-bg-primary)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--color-bg-surface)]">
              <div className="flex w-10 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                <ArrowRight className="shrink-0 size-5 p-1 text-[var(--color-text-muted)]" />
                <ArrowRight className="shrink-0 size-5 p-1 text-[var(--color-accent)]" />
              </div>
            </div>
          </button>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 max-w-4xl text-balance">
            {t('headline')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-10 leading-relaxed text-balance">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-0.5">
              <ButtonBorder
                onClick={() => setOpen(true)}
                className="rounded-xl px-4 py-6 text-base font-semibold gap-2 border-none ring-0 w-full"
              >
                <span className="relative z-10 flex gap-2 items-center text-white">
                  {t('ctaButton')}
                  <ArrowRight size={16} />
                </span>
              </ButtonBorder>
            </div>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-xl px-6 text-base"
              onClick={() => {
                document.querySelector('[data-section="features"]')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('secondaryCta')}
            </Button>
          </div>
        </AnimatedGroup>

        {/* Agent Orchestrator visual — animated in after headline */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.6, type: 'spring' as const, bounce: 0.2 }}
          className="relative mt-12 flex justify-center"
        >
          {/* Bottom gradient — blends into next section */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg-primary))' }}
          />
          <AgentOrchestrator className="mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
