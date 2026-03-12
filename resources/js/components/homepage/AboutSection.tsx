import { Quote, ArrowRight, Download } from 'lucide-react'
import React from 'react'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useI18nStore } from '@/stores/useI18nStore'

export function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const { t } = useI18nStore()

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-white">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-violet-500 to-[#FFD700]" />

      {/* Decorative background shapes */}
      <div className="absolute top-16 right-0 w-96 h-96 rounded-full bg-violet-50 blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-amber-50 blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Quote and description */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            {/* Decorative quote */}
            <div className="relative">
              <Quote className="w-16 h-16 text-violet-200 absolute -top-4 -left-4 rotate-180" />
              <div className="pl-12 pt-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                  {t('about.title')}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t('about.description')}
                </p>
              </div>
            </div>

            {/* Key points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-12">
              {['regulation', 'control', 'traceability', 'security'].map((key, index) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border border-violet-100/50 hover:border-violet-200 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mt-2 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      {t(`about.points.${key}.title`)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {t(`about.points.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pl-12 pt-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#1a0a2e] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('about.learnMore')}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-violet-200 text-violet-700 font-semibold rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                {t('about.downloadArrete')}
              </a>
            </div>
          </div>

          {/* Right side - Visual element */}
          <div className={`relative ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
            <div className="relative">
              {/* Background card */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-violet-100 to-amber-50 transform rotate-3" />

              {/* Main card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <div className="bg-gradient-to-br from-[#1a0a2e] via-[#0d1b3e] to-[#003366] p-10 text-center">
                  {/* Logo area */}
                  <div className="mb-8">
                    <img
                      src="/KBS_logo.png"
                      alt="RCEKIN Logo"
                      className="h-24 w-auto mx-auto opacity-90"
                    />
                  </div>

                  {/* Organization name */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    RCEKIN
                  </h3>
                  <p className="text-violet-300 text-sm font-medium mb-8 max-w-xs mx-auto">
                    {t('about.fullName')}
                  </p>

                  {/* Stamp visual */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-amber-400/50 flex items-center justify-center mx-auto">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl">
                        <span className="text-[#003366] font-bold text-xs text-center leading-tight px-2">
                          {t('about.stampLabel')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrêté reference */}
                  <div className="mt-8 px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <p className="text-xs text-blue-200/70">
                      {t('about.arreteRef')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
