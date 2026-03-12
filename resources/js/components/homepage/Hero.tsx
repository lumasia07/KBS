import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle,
  Zap,
  Globe,
  Award
} from 'lucide-react'
import { useI18nStore } from '@/stores/useI18nStore';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useI18nStore();

  const features = [
    { icon: <ShieldCheck className="w-4 h-4" />, text: t('hero.features.compliance'), color: "text-violet-400" },
    { icon: <Award className="w-4 h-4" />, text: t('hero.features.standards'), color: "text-amber-400" },
    { icon: <CheckCircle className="w-4 h-4" />, text: t('hero.features.verification'), color: "text-emerald-400" },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative overflow-hidden min-h-[600px] flex items-center py-16">
        {/* Background with sophisticated dark gradient overlay - REQURIED TO STAY */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `
              linear-gradient(
                135deg,
                rgba(26, 10, 46, 0.92) 0%,
                rgba(13, 27, 62, 0.88) 40%,
                rgba(0, 51, 102, 0.9) 100%
              ),
              url('/industry.jpg')
            `,
          }}
        ></div>
        {/* Purple radial glow */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.06),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8">


            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-violet-300 uppercase tracking-wider">{t('hero.badge')}</span>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
                {t('hero.titlePrefix')}{' '}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <p className="text-xl text-blue-200/80 leading-relaxed max-w-xl">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.visit('/login')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold bg-gradient-to-r from-[#003366] to-[#1a0a2e] hover:from-[#1a0a2e] hover:to-[#003366] text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {t('hero.enterPortal')}
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
              </button>

              <button
                onClick={() => router.visit('/taxpayer/register')}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold bg-amber-400 hover:bg-amber-500 text-[#003366] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t('hero.registerBusiness')}
                </span>
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-[fadeInUp_0.5s_ease-out]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-2 rounded-lg bg-white/5 border border-violet-500/10 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </>
  )
}