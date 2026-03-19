'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '../i18n/navigation'

const COOKIE_KEY = 'astra_cookie_accepted'

export function CookieNotice() {
  const t = useTranslations('CookieNotice')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY)
    if (!accepted) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      data-section="cookie-notice"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-4 px-6 py-3 bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]"
    >
      <p className="text-xs text-[var(--color-text-muted)] flex-1">
        {t('text')}
      </p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Link
          href="/privacy"
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] underline transition-colors"
        >
          {t('learnMore')}
        </Link>
        <button
          type="button"
          data-action="accept"
          onClick={accept}
          className="text-xs px-3 py-1.5 rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-colors cursor-pointer"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
