'use client'

import { useWaitlist } from './WaitlistProvider'

type Props = {
  homeLabel: string
  featuresLabel: string
  whyLabel: string
  ctaLabel: string
}

export function HeaderNav({ homeLabel, featuresLabel, whyLabel, ctaLabel }: Props) {
  const { setOpen } = useWaitlist()

  const handleScroll = (selector: string) => {
    if (selector === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const target = document.querySelector(`[data-section="${selector}"]`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="hidden lg:flex items-center gap-8 ml-8">
      <button 
        type="button" 
        onClick={() => handleScroll('home')} 
        className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors border-none bg-transparent cursor-pointer"
      >
        {homeLabel}
      </button>
      <button 
        type="button" 
        onClick={() => handleScroll('features')} 
        className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors border-none bg-transparent cursor-pointer"
      >
        {featuresLabel}
      </button>
      <button 
        type="button" 
        onClick={() => handleScroll('why-astra')} 
        className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-white transition-colors border-none bg-transparent cursor-pointer"
      >
        {whyLabel}
      </button>
      
      {/* Vurgulu CTA Butonu */}
      <button 
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-bold text-white bg-[var(--color-bg-elevated)] hover:bg-[var(--color-accent)] border border-[var(--color-accent)]/80 hover:border-transparent rounded-full px-5 py-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] cursor-pointer tracking-wide"
      >
        {ctaLabel}
      </button>
    </nav>
  )
}
