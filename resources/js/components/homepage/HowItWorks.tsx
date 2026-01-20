import { UserPlus, FileText, CreditCard, ShieldCheck } from 'lucide-react'
import React from 'react'
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
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            A simple, transparent process designed to ensure compliance and
            streamline operations for all stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10 transform translate-y-4"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-[#003366] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold text-slate-100 select-none">
                  {step.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
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
