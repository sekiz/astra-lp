import { getTranslations } from 'next-intl/server'
import { FeatureCards } from './FeatureCards'

type Props = {
  locale: string
}

export async function FeaturesSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'Features' })

  const cards: [any, any, any] = [
    {
      title: t('card1Title'),
      body: t('card1Body'),
      meta: t('card1Meta'),
      status: t('card1Status'),
    },
    {
      title: t('card2Title'),
      body: t('card2Body'),
      meta: t('card2Meta'),
      status: t('card2Status'),
    },
    {
      title: t('card3Title'),
      body: t('card3Body'),
      meta: t('card3Meta'),
      status: t('card3Status'),
    },
  ]

  return (
    <section
      data-section="features"
      className="px-6 py-24 max-w-6xl mx-auto w-full"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] text-center mb-16">
        {t('sectionTitle')}
      </h2>
      <FeatureCards cards={cards} />
    </section>
  )
}
