import { getTranslations } from 'next-intl/server'
import { CTAButton } from './CTAButton'

type Props = {
  locale: string
}

export async function FinalCTASection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'FinalCTA' })

  return (
    <section
      data-section="final-cta"
      className="relative px-6 py-32 overflow-hidden flex justify-center w-full"
    >
      {/* Background ambient glow matching Astra aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[500px] bg-[var(--color-accent)] opacity-[0.06] blur-[120px] pointer-events-none rounded-full" />
      
      {/* The glowing border wrapper */}
      <div className="relative w-full max-w-4xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-[var(--color-border)] via-[var(--color-border)] to-transparent group">
        
        {/* Inner Box */}
        <div className="relative h-full w-full bg-[#030305] rounded-3xl flex flex-col items-center justify-center p-10 md:p-20 text-center overflow-hidden">
          
          {/* Subtle noise and radial grid overlay representing 'core processing' */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--color-accent)]/5 to-transparent blur-3xl pointer-events-none" />

          {/* Spark Logo at top-center */}
          <div className="mb-8 w-14 h-14 rounded-3xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] shadow-xl flex items-center justify-center relative z-10 group-hover:border-[var(--color-accent)]/50 transition-colors duration-500 overflow-hidden">
            <img src="/astra.svg" alt="Astra Core" className="w-[45%] h-[45%] object-center rounded-sm group-hover:scale-110 transition-transform duration-500" />
          </div>

          <h2 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-[var(--color-text-secondary)] tracking-tight mb-6 max-w-2xl leading-[1.15]">
            {t('headline')}
          </h2>
          
          <p className="relative z-10 text-base md:text-xl text-white opacity-90 mb-10 max-w-xl font-medium tracking-wide">
            {t('scarcity')}
          </p>
          
          <div className="relative z-10">
            {/* 
              Kutunun premium hissini tamamlamak icin 
              CTAButton'i disaridan cagirirken uzerinde herhangi
              bir global islem yapmiyor sadece pozisyonluyor
            */}
            <CTAButton namespace="FinalCTA" />
          </div>
        </div>
      </div>
    </section>
  )
}
