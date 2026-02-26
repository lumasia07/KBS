import { UserPlus, FileText, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react'
import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { router } from '@inertiajs/react'

import { useI18nStore } from '@/stores/useI18nStore'

// We will construct the steps array inside the component so we have access to the `t` function

export function HowItWorks() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const { t } = useI18nStore()

  const steps = [
    {
      id: '01',
      title: t('howItWorks.steps.step1.title'),
      description: t('howItWorks.steps.step1.description'),
      icon: UserPlus,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
      alt: 'Business registration process',
      benefits: [
        t('howItWorks.steps.step1.benefits.0'),
        t('howItWorks.steps.step1.benefits.1'),
        t('howItWorks.steps.step1.benefits.2')
      ]
    },
    {
      id: '02',
      title: t('howItWorks.steps.step2.title'),
      description: t('howItWorks.steps.step2.description'),
      icon: FileText,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
      alt: 'Ordering process',
      benefits: [
        t('howItWorks.steps.step2.benefits.0'),
        t('howItWorks.steps.step2.benefits.1'),
        t('howItWorks.steps.step2.benefits.2')
      ]
    },
    {
      id: '03',
      title: t('howItWorks.steps.step3.title'),
      description: t('howItWorks.steps.step3.description'),
      icon: CreditCard,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
      alt: 'Payment processing',
      benefits: [
        t('howItWorks.steps.step3.benefits.0'),
        t('howItWorks.steps.step3.benefits.1'),
        t('howItWorks.steps.step3.benefits.2')
      ]
    },
    {
      id: '04',
      title: t('howItWorks.steps.step4.title'),
      description: t('howItWorks.steps.step4.description'),
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
      alt: 'Verification process',
      benefits: [
        t('howItWorks.steps.step4.benefits.0'),
        t('howItWorks.steps.step4.benefits.1'),
        t('howItWorks.steps.step4.benefits.2')
      ]
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-slate-900">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${isReversed ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* Image Side - index 0: left, index 1: right */}
                <div
                  className={`w-full md:w-1/2 relative group ${isVisible
                    ? (isReversed ? 'animate-fade-in-right' : 'animate-fade-in-left')
                    : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-blue-600/5 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-2 duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 aspect-[4/3]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Number Badge */}
                    <div className="absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-white/50">
                      <span className="text-2xl font-bold text-[#003366]">{step.id}</span>
                    </div>
                  </div>
                </div>

                {/* Text Side - index 0: right, index 1: left */}
                <div
                  className={`w-full md:w-1/2 space-y-6 ${isVisible
                    ? (isReversed ? 'animate-fade-in-left' : 'animate-fade-in-right')
                    : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150 + 200}ms` }}
                >
                  <div className="inline-flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-[#003366]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" strokeWidth={2.5} />
                        <span className="text-sm font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className={`mt-24 text-center ${isVisible ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
          <button
            onClick={() => router.visit('/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#003366] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {t('howItWorks.cta')}
          </button>
        </div>
      </div>
    </section>
  )
}