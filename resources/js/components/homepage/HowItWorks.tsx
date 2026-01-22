import { UserPlus, FileText, CreditCard, ShieldCheck } from 'lucide-react'
import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const steps = [
  {
    id: '01',
    title: 'Register',
    description:
      'Create an account as a Taxable Person (Assujetti) with your official ID.',
    icon: UserPlus,
  },
  {
    id: '02',
    title: 'Order',
    description:
      'Request stamps and generate a secure Note de Perception slip.',
    icon: FileText,
  },
  {
    id: '03',
    title: 'Pay',
    description:
      'Complete payment via approved banks or mobile money channels.',
    icon: CreditCard,
  },
  {
    id: '04',
    title: 'Verify',
    description:
      'Agents scan and verify stamps in real-time using the mobile app.',
    icon: ShieldCheck,
  },
]

export function HowItWorks() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#003366]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="inline-block px-4 py-1.5 bg-[#FFD700]/20 text-[#003366] text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A simple, transparent process designed to ensure compliance and
            streamline operations for all stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {/* Connecting line for desktop */}
          <div className={`hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#FFD700]/50 via-[#003366]/30 to-[#FFD700]/50 ${isVisible ? 'animate-fade-in-scale delay-300' : 'opacity-0'}`}></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#FFD700]/50 transition-all duration-300 group z-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              style={{ animationDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#FFD700] to-amber-500 rounded-full flex items-center justify-center text-[#003366] font-bold text-sm shadow-lg">
                {step.id}
              </div>

              <div className="mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-blue-800 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#003366] transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


