import { UserCheck, FileCheck, CreditCard, ArrowRight } from 'lucide-react'
import React from 'react'

const features = [
  {
    title: 'Taxpayer Registration',
    description:
      'Digital registration for Assujettis with automated verification workflows. Create your secure profile in minutes.',
    icon: UserCheck,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Stamp Ordering',
    description:
      'Secure ordering and tracking of revenue stamps directly through the portal. Real-time inventory management.',
    icon: FileCheck,
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    title: 'Smart Payments',
    description:
      'Integrated Note de Perception generation with bank and mobile money compatibility. Instant payment reconciliation.',
    icon: CreditCard,
    color: 'bg-emerald-50 text-emerald-700',
  },
]
export function FeaturesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#003366] font-semibold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">
            Core Capabilities
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            A Unified Platform for Revenue Compliance
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Modernizing the way Kinshasa manages standards, revenue collection,
            and compliance through secure digital infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200"
            >
              <div
                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="flex items-center text-[#003366] font-semibold text-sm group-hover:translate-x-1 transition-transform cursor-pointer">
                Learn more <ArrowRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
