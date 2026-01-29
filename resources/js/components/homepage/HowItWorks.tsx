import { UserPlus, FileText, CreditCard, ShieldCheck, ArrowRight, CheckCircle, Sparkles, Clock } from 'lucide-react'
import React, { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const steps = [
  {
    id: '01',
    title: 'Register',
    description: 'Create an account as a Taxable Person (Assujetti) with your official ID.',
    icon: UserPlus,
    gradient: 'from-blue-500 to-cyan-400',
    time: '2-5 minutes',
  },
  {
    id: '02',
    title: 'Order',
    description: 'Request stamps and generate a secure Note de Perception slip.',
    icon: FileText,
    gradient: 'from-indigo-500 to-purple-400',
    time: 'Instant',
  },
  {
    id: '03',
    title: 'Pay',
    description: 'Complete payment via approved banks or mobile money channels.',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-teal-400',
    time: '1-3 minutes',
  },
  {
    id: '04',
    title: 'Verify',
    description: 'Agents scan and verify stamps in real-time using the mobile app.',
    icon: ShieldCheck,
    gradient: 'from-amber-500 to-orange-400',
    time: 'Real-time',
  },
]

export function HowItWorks() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const [activeStep, setActiveStep] = useState<number>(0)

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-slate-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-[#003366] tracking-wide uppercase bg-gradient-to-r from-amber-50 to-blue-50 px-4 py-2 rounded-full border border-amber-100/50">
              Simple Process
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-slate-900">How It </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-blue-600">Works</span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A streamlined four-step process designed for efficiency, transparency, and compliance.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Progress Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0">
            <div className={`h-1 bg-gradient-to-r from-slate-200/50 via-slate-300/50 to-slate-200/50 rounded-full transition-all duration-1000 ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}`}>
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(activeStep + 1) * 25}%` }} />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el && isVisible) {
                    el.style.animationDelay = `${index * 150}ms`
                  }
                }}
                className={`relative group ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div className={`relative h-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl border ${activeStep === index ? 'border-blue-200/50 shadow-xl' : 'border-slate-200/50 shadow-lg'} transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1`}>
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4">
                    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${activeStep === index ? 'scale-110' : ''} transition-transform duration-300`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-xl blur-md opacity-30`} />
                      <div className="relative w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg border border-slate-200/50">
                        <span className="text-lg font-bold text-slate-800">{step.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 pt-4">
                    <div className={`relative w-16 h-16 rounded-xl ${activeStep === index ? 'scale-110' : ''} transition-transform duration-500`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-xl blur-md opacity-30 group-hover:opacity-50`} />
                      <div className="relative w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg border border-slate-200/50">
                        <div className={`bg-gradient-to-br ${step.gradient} p-3 rounded-lg`}>
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#003366] transition-colors">
                        {step.title}
                      </h3>
                      {activeStep === index && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 animate-pulse" />
                      )}
                    </div>

                    <p className="text-slate-600 leading-relaxed text-sm">
                      {step.description}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        <Clock className="w-3 h-3" />
                        {step.time}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors group/btn">
                      <span>Learn more</span>
                      <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Connector - Mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <div className="w-8 h-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full" />
                    <ArrowRight className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className={`mt-16 text-center ${isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#003366] to-blue-700 hover:from-blue-700 hover:to-[#003366] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span>Start Registration</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-slate-500 mt-4">
              Average completion time: 15 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}