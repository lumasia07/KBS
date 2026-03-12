import { Target, Users, Clock, Building2, ShieldCheck } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useI18nStore } from '@/stores/useI18nStore'

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [hasStarted, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export function StatsSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)
  const { t } = useI18nStore()

  const stats = [
    {
      value: 15,
      label: t('stats.categories'),
      description: t('stats.categoriesDesc'),
      icon: Target,
      gradient: 'from-violet-500 to-purple-600',
      bgGlow: 'bg-violet-500/20',
    },
    {
      value: 500,
      suffix: '+',
      label: t('stats.agents'),
      description: t('stats.agentsDesc'),
      icon: Users,
      gradient: 'from-amber-400 to-yellow-500',
      bgGlow: 'bg-amber-400/20',
    },
    {
      value: 15,
      label: t('stats.months'),
      description: t('stats.monthsDesc'),
      icon: Clock,
      gradient: 'from-emerald-400 to-teal-500',
      bgGlow: 'bg-emerald-400/20',
    },
    {
      value: 100,
      suffix: '+',
      label: t('stats.companies'),
      description: t('stats.companiesDesc'),
      icon: Building2,
      gradient: 'from-blue-400 to-indigo-500',
      bgGlow: 'bg-blue-400/20',
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d1b3e] to-[#003366]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,215,0,0.08),transparent_50%)]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-[#FFD700] to-violet-500" />
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className={`text-center max-w-4xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-violet-300 uppercase tracking-wider">
              {t('stats.missionBadge')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {t('stats.missionTitle')}
          </h2>
          <p className="text-lg text-blue-200/80 leading-relaxed max-w-3xl mx-auto">
            {t('stats.missionDescription')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-1 text-center">
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl ${stat.bgGlow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix && <span className="text-amber-400">{stat.suffix}</span>}
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-blue-200/60">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
