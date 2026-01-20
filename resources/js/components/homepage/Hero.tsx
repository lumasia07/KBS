import React from 'react'
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import { router } from '@inertiajs/react'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pb-16 pt-8 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-yellow-50 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header / Nav */}
        <nav className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
              alt="Kinshasa Bureau of Standards Logo"
              className="h-16 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              Services
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              Verify
            </a>
             <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              Contact us
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              Support
            </a>
             <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors"
            >
              FAQ
            </a>
            <button 
              onClick={() => router.visit('/login')}
              className="text-sm font-bold text-[#003366] bg-[#FFD700] hover:bg-[#F4C430] px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Sign In
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Official Stamping System for Enterprises in{' '}
              <span className="text-[#003366]">Kinshasa</span>.
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              The official Integrated Stamping System for the Kinshasa Bureau of
              Standards (RCEKIN). Secure registration, automated payments, and
              real-time verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
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

            <div className="flex items-center gap-6 text-sm text-slate-500">
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

          {/* Right Column: DRC Map Image - Larger and Positioned Higher */}
          <div className="relative hidden lg:flex items-start justify-center -mt-12">
            <img
              src="https://cdn.magicpatterns.com/uploads/rZNg7zDhMb7WFGJJjsQmwf/kinshasa_image.png"
              alt="Democratic Republic of Congo Map"
              className="w-full h-auto max-w-2xl object-contain scale-115"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
