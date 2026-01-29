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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-30" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-amber-50 rounded-full border border-blue-100/50 mb-6">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-[#003366] tracking-wide">Core Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-slate-900">Simplify Compliance with</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-blue-600">Digital Efficiency</span>
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
              {/* Background Glow */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              {/* Main Card */}
              <div className="relative h-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                  <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center shadow-lg border border-slate-200/50">
                    <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-lg`}>
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
                <div className="mt-8 pt-6 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#003366] group-hover:text-blue-700 transition-colors">
                    <span>Explore feature</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hover Indicator */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-3/4 transition-all duration-500`} />
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="px-3 py-1.5 bg-gradient-to-r from-[#FFD700] to-amber-400 text-[#003366] text-xs font-bold rounded-full shadow-lg transform rotate-3">
                  NEW
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 pt-12 border-t border-slate-200/50">
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