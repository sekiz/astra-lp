import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'always',
  localeDetection: true,
})
