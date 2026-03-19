import type { Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' })

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        tr: '/tr',
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params
  const messages = await getMessages()

  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider messages={messages} locale={lang}>
          <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <span className="text-sm font-medium tracking-wider">ASTRA OS</span>
            <LanguageSwitcher />
          </header>

          {children}

          <footer className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] mt-auto">
            <span className="text-xs text-[var(--color-text-muted)]">© 2026 Astra OS</span>
            <LanguageSwitcher />
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
