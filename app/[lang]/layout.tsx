import type { Metadata } from 'next'
import { getTranslations, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import { WaitlistProvider } from '../../components/WaitlistProvider'
import { WaitlistModal } from '../../components/WaitlistModal'
import { CookieNotice } from '../../components/CookieNotice'
import { Link } from '../../i18n/navigation'
import { HeaderNav } from '../../components/HeaderNav'
import { FlickeringFooter } from '../../components/ui/flickering-footer'
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
  const ft = await getTranslations({ locale: lang, namespace: 'Footer' })


  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider messages={messages} locale={lang}>
          <WaitlistProvider>
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] sticky top-0 z-50 bg-[var(--color-bg-primary)]/80 backdrop-blur-md">
              <a href="/" className="flex items-center gap-2.5 group">
                <img src="/astra-logo.svg" alt="Astra OS" className="h-[28px] md:h-[40px] w-auto flex-shrink-0" />
              </a>

              {/* Center Menu */}
              <HeaderNav 
                homeLabel={ft('linkHome')} 
                featuresLabel={ft('linkFeatures')} 
                whyLabel={ft('linkWhyAstra')} 
                ctaLabel={ft('linkGetEarlyAccess')} 
              />

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </header>

            {children}

            <FlickeringFooter />

            <WaitlistModal />
            <CookieNotice />
          </WaitlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
