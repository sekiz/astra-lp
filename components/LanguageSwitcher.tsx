'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '../i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('Nav')
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = () => {
    const nextLocale = locale === 'en' ? 'tr' : 'en'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={locale === 'en' ? t('switchLanguageLabel') : t('switchLanguageLabelAlt')}
      className="text-sm font-medium px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
    >
      {t('switchLanguage')}
    </button>
  )
}
