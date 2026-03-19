import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export async function WhyAstraSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'WhyAstra' })

  return (
    <section
      data-section="why-astra"
      className="px-6 py-24 bg-[var(--color-bg-surface)]"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-12">
          {t('sectionTitle')}
        </h2>
        <p className="mb-6 leading-relaxed text-[var(--color-text-secondary)]">
          {t('para1')}
        </p>
        <p className="mb-6 leading-relaxed text-[var(--color-text-secondary)]">
          {t('para2')}
        </p>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          {t('para3')}
        </p>
      </div>
    </section>
  )
}
