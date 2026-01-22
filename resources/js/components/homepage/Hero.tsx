import React from 'react'
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import { router } from '@inertiajs/react'

export function Hero() {
  return (
    <div className="relative overflow-hidden pb-16 pt-24 sm:pb-24 min-h-[600px]">
      {/* Industry background image - clear and visible */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/industry.jpg')" }}
      ></div>

      {/* Yellowish overlay to match brand theme */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#FFD700]/30 via-amber-100/40 to-yellow-50/50"></div>

      {/* Light overlay for text readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white/85 via-white/60 to-transparent"></div>

      {/* Background decoration with golden accents */}
      <div className="absolute inset-0 z-[3] opacity-60">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content - now full width, positioned left */}
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
            Official Stamping System for Enterprises in{' '}
            <span className="text-[#003366]">Kinshasa</span>.
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg animate-fade-in-up delay-200">
            The official Integrated Stamping System for the Kinshasa Bureau of
            Standards (RCEKIN). Secure registration, automated payments, and
            real-time verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up delay-400">
            <button className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-[#003366] bg-[#FFD700] rounded-lg shadow-sm hover:bg-[#F4C430] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]">
              Access Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <button
              onClick={() => router.visit('/taxpayer/register')}
              className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-[#003366] rounded-lg shadow-sm hover:bg-[#002244] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
            >
              Register as Taxpayer
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500 animate-fade-in-up delay-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Gov-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Encrypted Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

