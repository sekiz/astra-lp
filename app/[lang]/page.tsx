import { FeaturesSection } from '../../components/FeaturesSection'
import { WhyAstraSection } from '../../components/WhyAstraSection'
import { FinalCTASection } from '../../components/FinalCTASection'
import { HeroSection } from '../../components/HeroSection'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params

  return (
    <main>
      {/* ── Hero Section (animated) ────────────────────────────────────── */}
      <HeroSection />

      {/* ── Features Section ──────────────────────────────────────────── */}
      <FeaturesSection locale={lang} />

      {/* ── Why Astra OS? Section ─────────────────────────────────────── */}
      <WhyAstraSection locale={lang} />

      {/* ── Final CTA Section ─────────────────────────────────────────── */}
      <FinalCTASection locale={lang} />
    </main>
  )
}
