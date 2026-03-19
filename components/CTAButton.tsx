'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { useWaitlist } from './WaitlistProvider'
import { ButtonBorder } from './ui/button-border'

export function CTAButton({ namespace = 'Hero' }: { namespace?: 'Hero' | 'FinalCTA' }) {
  const t = useTranslations(namespace)
  const { setOpen } = useWaitlist()

  return (
    <ButtonBorder
      type="button"
      data-cta
      onClick={() => setOpen(true)}
      className="text-base h-12 px-8"
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
        {t('ctaButton')}
        <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
      </span>
    </ButtonBorder>
  )
}
