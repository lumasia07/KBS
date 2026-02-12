import { UserCheck, FileCheck, CreditCard, ArrowRight, Zap, Shield, Clock, Users } from 'lucide-react'
import React, { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const features = [
  {
    title: 'Taxpayer Registration',
    description: 'Digital registration for Assujettis with automated verification workflows. Create your secure profile in minutes.',
    icon: UserCheck,
    gradient: 'from-blue-500 to-cyan-400',
    color: '#3B82F6',
  },
  {
    title: 'Stamp Ordering',
    description: 'Secure ordering and tracking of revenue stamps directly through the portal. Real-time inventory management.',
    icon: FileCheck,
    gradient: 'from-indigo-500 to-purple-400',
    color: '#8B5CF6',
  },
  {
    title: 'Smart Payments',
    description: 'Integrated Note de Perception generation with bank and mobile money compatibility. Instant payment reconciliation.',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-teal-400',
    color: '#10B981',
  },
]

export function FeaturesGrid() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>


          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
            Simplify Compliance with <span className="text-[#003366]">Digital Efficiency</span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Modernizing revenue collection and compliance through secure digital infrastructure designed for Kinshasa's businesses.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el && isVisible) {
                  el.style.animationDelay = `${index * 150}ms`
                }
              }}
              className={`relative group ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >

              {/* Main Card */}
              <div className="relative h-full p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="relative w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: feature.color }}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#003366] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#003366] group-hover:text-blue-700 transition-colors">
                    <span>Explore feature</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1.5 bg-amber-400 text-[#003366] text-xs font-bold rounded-full shadow-lg transform rotate-3">
                  NEW
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '99.8%', label: 'System Uptime', icon: Shield },
              { value: '5min', label: 'Avg. Processing', icon: Clock },
              { value: '256-bit', label: 'Encryption', icon: Lock },
              { value: '24/7', label: 'Support', icon: Users },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#003366] mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}