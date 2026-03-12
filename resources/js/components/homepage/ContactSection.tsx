import { MapPin, Phone, Facebook, Globe, ArrowRight } from 'lucide-react'
import React from 'react'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useI18nStore } from '@/stores/useI18nStore'

export function ContactSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const { t } = useI18nStore()

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background - deep purple to navy gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d1b3e] to-[#003366]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_60%)]" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-[#FFD700] to-violet-500" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('contact.ctaTitle')}
          </h2>
          <p className="text-lg text-blue-200/70 max-w-2xl mx-auto mb-8">
            {t('contact.ctaSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/taxpayer/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-amber-500 text-[#003366] font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {t('contact.ctaButton')}
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              {t('contact.learnMore')}
            </a>
          </div>
        </div>

        {/* Contact Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          {/* Address Card */}
          <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{t('contact.addressTitle')}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">
                  {t('contact.addressValue')}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
                <Phone className="w-6 h-6 text-[#003366]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{t('contact.phoneTitle')}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed">
                  {t('contact.phoneValue')}
                </p>
              </div>
            </div>
          </div>

          {/* Social Card */}
          <div className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{t('contact.socialTitle')}</h3>
                <div className="flex gap-3 mt-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61578184618259"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://www.rcekin.cd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-violet-600 transition-all duration-300 hover:scale-110"
                  >
                    <Globe className="w-5 h-5 text-white" />
                  </a>
                </div>
                <p className="text-blue-200/50 text-xs mt-3">
                  {t('contact.socialHint')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
