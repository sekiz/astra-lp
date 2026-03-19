import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Privacy' })
  return {
    title: t('title'),
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Privacy' })

  return (
    <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">{t('title')}</h1>
      <p className="mb-8 leading-relaxed">{t('intro')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">{t('dataCollectedTitle')}</h2>
        <p className="whitespace-pre-line leading-relaxed">{t('dataCollectedItems')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">{t('retentionTitle')}</h2>
        <p className="leading-relaxed">{t('retentionBody')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">{t('rightsTitle')}</h2>
        <p className="leading-relaxed">{t('rightsBody')}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">{t('contactTitle')}</h2>
        <p className="leading-relaxed">{t('contactBody')}</p>
      </section>

      <p className="text-sm mt-12">{t('lastUpdated')}</p>
    </main>
  )
}
