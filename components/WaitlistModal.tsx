'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useWaitlist } from './WaitlistProvider'
import { ButtonBorder } from './ui/button-border'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string
  lastName: string
  email: string
  q1: string
  q1OtherText: string
  q2: string
  q3: string
  q4: string
  q4OtherText: string
  consent: boolean
}

interface Errors {
  firstName?: string
  lastName?: string
  email?: string
  q1?: string
  q1OtherText?: string
  q2?: string
  q3?: string
  q4?: string
  q4OtherText?: string
  consent?: string
  submit?: string
}

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  q1: '',
  q1OtherText: '',
  q2: '',
  q3: '',
  q4: '',
  q4OtherText: '',
  consent: false,
}

const TOTAL_STEPS = 3

// ─── RadioGroup (module-level — prevents remount/freeze on every keystroke) ───

interface RadioGroupProps {
  name: string
  options: string[]
  selected: string
  onSelect: (val: string) => void
  error?: string
  otherLabel?: string
  otherText?: string
  onOtherText?: (val: string) => void
  otherPlaceholder?: string
  otherTextError?: string
}

function RadioGroup({
  name,
  options,
  selected,
  onSelect,
  error,
  otherLabel,
  otherText = '',
  onOtherText,
  otherPlaceholder = '',
  otherTextError,
}: RadioGroupProps) {
  return (
    <div>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
              selected === opt
                ? 'border-[var(--color-accent)] bg-[var(--color-bg-surface)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(opt)}
              className="accent-[var(--color-accent)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">{opt}</span>
          </label>
        ))}
      </div>

      {otherLabel && selected === otherLabel && (
        <div className="mt-2" style={{ animation: 'fadeIn 0.15s ease-out' }}>
          <input
            type="text"
            name={`${name}OtherText`}
            value={otherText}
            onChange={(e) => onOtherText?.(e.target.value)}
            placeholder={otherPlaceholder}
            className={`w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-primary)] border ${
              otherTextError ? 'border-red-500' : 'border-[var(--color-border)]'
            } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm`}
          />
          {otherTextError && <p data-error className="text-xs text-red-400 mt-1">{otherTextError}</p>}
        </div>
      )}

      {error && <p data-error className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

// ─── PrivacyModal ─────────────────────────────────────────────────────────────
// Renders on top of WaitlistModal (z-60 vs z-50). Waitlist state is unaffected.

interface PrivacyModalProps {
  locale: string
  onClose: () => void
}

function PrivacyModal({ locale, onClose }: PrivacyModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden"
        style={{ height: '80vh', animation: 'fadeIn 0.15s ease-out' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close privacy policy"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X size={18} />
        </button>
        <iframe
          src={`/${locale}/privacy`}
          title="Privacy Policy"
          className="w-full h-full rounded-2xl"
          style={{ border: 'none', colorScheme: 'dark' }}
        />
      </div>
    </div>
  )
}

// ─── WaitlistModal ────────────────────────────────────────────────────────────

export function WaitlistModal() {
  const { open, setOpen } = useWaitlist()
  const t = useTranslations('Waitlist')
  const locale = useLocale()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  // ── Close helpers ──────────────────────────────────────────────────────────
  // close() just hides the modal — form state is PRESERVED so user resumes
  const close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  // resetAndClose() is called only after successful submission
  const resetAndClose = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setForm(INITIAL_FORM)
      setErrors({})
      setSubmitting(false)
      setSuccess(false)
    }, 300)
  }, [setOpen])

  useEffect(() => {
    if (!open || privacyOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, privacyOpen, close])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const otherLabelQ1 = t('q1Option5')
  const otherLabelQ4 = t('q4Option4')
  const otherPlaceholder = t('otherInputPlaceholder')

  // ── Validators ─────────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = t('errorRequired')
    if (!form.lastName.trim()) e.lastName = t('errorRequired')
    if (!form.email.trim()) {
      e.email = t('errorRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t('errorEmail')
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = (): boolean => {
    const e: Errors = {}
    if (!form.q1) e.q1 = t('errorRequired')
    if (form.q1 === otherLabelQ1 && !form.q1OtherText.trim()) e.q1OtherText = t('errorRequired')
    if (!form.q2) e.q2 = t('errorRequired')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = (): boolean => {
    const e: Errors = {}
    if (!form.q3) e.q3 = t('errorRequired')
    if (!form.q4) e.q4 = t('errorRequired')
    if (form.q4 === otherLabelQ4 && !form.q4OtherText.trim()) e.q4OtherText = t('errorRequired')
    if (!form.consent) e.consent = t('errorConsent')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === 1 && validateStep1()) { setStep(2); setErrors({}) }
    else if (step === 2 && validateStep2()) { setStep(3); setErrors({}) }
  }

  const handleBack = () => { setStep((s) => s - 1); setErrors({}) }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/${locale}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setSuccess(true)
    } catch {
      setErrors({ submit: t('submitError') })
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = (err?: string) =>
    `w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-primary)] border ${
      err ? 'border-red-500' : 'border-[var(--color-border)]'
    } text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm`

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Waitlist Modal (z-50) ── */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) close() }}
      >
        <div
          data-modal="waitlist"
          className="relative w-full max-w-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <button type="button" onClick={close} aria-label="Close"
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <X size={20} />
          </button>

          {/* ── Success ── */}
          {success ? (
            <div data-screen="success" className="text-center py-8">
              <CheckCircle size={48} className="text-[var(--color-accent)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">{t('successTitle')}</h2>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">{t('successBody')}</p>
              <button type="button" onClick={resetAndClose}
                className="px-6 py-2.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold text-sm transition-colors cursor-pointer">
                {t('successClose')}
              </button>
            </div>
          ) : (
            <>
              {/* Header + progress dots */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{t('title')}</h2>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono tabular-nums">{step} / {TOTAL_STEPS}</span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: i + 1 <= step ? 'var(--color-accent)' : 'var(--color-border)' }} />
                  ))}
                </div>
              </div>

              {/* ── Step 1: Identity ── */}
              {step === 1 && (
                <div data-step="1">
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">{t('step1Title')}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{t('firstNameLabel')}</label>
                      <input type="text" name="firstName" value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        placeholder={t('firstNamePlaceholder')} className={inputCls(errors.firstName)} />
                      {errors.firstName && <p data-error className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{t('lastNameLabel')}</label>
                      <input type="text" name="lastName" value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        placeholder={t('lastNamePlaceholder')} className={inputCls(errors.lastName)} />
                      {errors.lastName && <p data-error className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">{t('emailLabel')}</label>
                      <input type="email" name="email" value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder={t('emailPlaceholder')} className={inputCls(errors.email)} />
                      {errors.email && <p data-error className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <ButtonBorder type="button" data-action="continue" onClick={handleNext}
                    className="mt-6 w-full py-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-white group">
                    <span className="relative z-10 flex gap-2 items-center justify-center font-semibold text-sm">
                      {t('continueButton')}
                    </span>
                  </ButtonBorder>
                </div>
              )}

              {/* ── Step 2: Q1 (Other) + Q2 ── */}
              {step === 2 && (
                <div data-step="2">
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">{t('step2Subtitle')}</p>
                  <div className="space-y-6">
                    <div data-question>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">{t('q1Label')}</p>
                      <RadioGroup
                        name="q1"
                        options={[t('q1Option1'), t('q1Option2'), t('q1Option3'), t('q1Option4'), t('q1Option5')]}
                        selected={form.q1}
                        onSelect={(val) => setForm((f) => ({ ...f, q1: val, q1OtherText: '' }))}
                        error={errors.q1}
                        otherLabel={otherLabelQ1}
                        otherText={form.q1OtherText}
                        onOtherText={(val) => setForm((f) => ({ ...f, q1OtherText: val }))}
                        otherPlaceholder={otherPlaceholder}
                        otherTextError={errors.q1OtherText}
                      />
                    </div>
                    <div data-question>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">{t('q2Label')}</p>
                      <RadioGroup
                        name="q2"
                        options={[t('q2Option1'), t('q2Option2'), t('q2Option3')]}
                        selected={form.q2}
                        onSelect={(val) => setForm((f) => ({ ...f, q2: val }))}
                        error={errors.q2}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" data-action="back" onClick={handleBack}
                      className="flex-1 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] text-sm font-medium transition-colors cursor-pointer">
                      {t('backButton')}
                    </button>
                    <ButtonBorder type="button" data-action="continue" onClick={handleNext}
                      className="flex-[2] py-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-white group">
                      <span className="relative z-10 flex gap-2 items-center justify-center font-semibold text-sm">
                        {t('continueButton')}
                      </span>
                    </ButtonBorder>
                  </div>
                </div>
              )}

              {/* ── Step 3: Q3 + Q4 (Other) + GDPR ── */}
              {step === 3 && (
                <div data-step="3">
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">{t('step2Subtitle')}</p>
                  <div className="space-y-6">
                    <div data-question>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">{t('q3Label')}</p>
                      <RadioGroup
                        name="q3"
                        options={[t('q3Option1'), t('q3Option2'), t('q3Option3')]}
                        selected={form.q3}
                        onSelect={(val) => setForm((f) => ({ ...f, q3: val }))}
                        error={errors.q3}
                      />
                    </div>
                    <div data-question>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">{t('q4Label')}</p>
                      <RadioGroup
                        name="q4"
                        options={[t('q4Option1'), t('q4Option2'), t('q4Option3'), t('q4Option4')]}
                        selected={form.q4}
                        onSelect={(val) => setForm((f) => ({ ...f, q4: val, q4OtherText: '' }))}
                        error={errors.q4}
                        otherLabel={otherLabelQ4}
                        otherText={form.q4OtherText}
                        onOtherText={(val) => setForm((f) => ({ ...f, q4OtherText: val }))}
                        otherPlaceholder={otherPlaceholder}
                        otherTextError={errors.q4OtherText}
                      />
                    </div>

                    {/* GDPR consent */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="consent" checked={form.consent}
                          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                          className="mt-0.5 accent-[var(--color-accent)] flex-shrink-0" />
                        <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                          {t('consentLabel')}{' '}
                          <button
                            type="button"
                            onClick={() => setPrivacyOpen(true)}
                            className="text-[var(--color-accent)] hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                          >
                            {t('consentPrivacyLink')}
                          </button>.
                        </span>
                      </label>
                      {errors.consent && <p data-error className="text-xs text-red-400 mt-1">{errors.consent}</p>}
                    </div>

                    {errors.submit && <p data-error className="text-xs text-red-400 text-center">{errors.submit}</p>}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="button" data-action="back" onClick={handleBack}
                      className="flex-1 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] text-sm font-medium transition-colors cursor-pointer">
                      {t('backButton')}
                    </button>
                    <ButtonBorder type="button" data-action="submit" onClick={handleSubmit} disabled={submitting}
                      className="flex-[2] py-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:text-white group disabled:opacity-60">
                      <span className="relative z-10 flex gap-2 items-center justify-center font-semibold text-sm">
                        {submitting ? '…' : t('submitButton')}
                      </span>
                    </ButtonBorder>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Privacy Modal (z-60, on top of waitlist) ── */}
      {privacyOpen && (
        <PrivacyModal
          locale={locale}
          onClose={() => setPrivacyOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
