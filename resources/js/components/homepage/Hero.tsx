import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle,
  Zap,
  Globe,
  Award
} from 'lucide-react'

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    { icon: <ShieldCheck className="w-4 h-4" />, text: "Regulatory Compliance", color: "text-emerald-400" },
    { icon: <Award className="w-4 h-4" />, text: "Quality Standards", color: "text-blue-400" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "Product Verification", color: "text-amber-400" },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="relative overflow-hidden min-h-[600px] flex items-center py-16">
        {/* Background with sophisticated dark gradient overlay - REQURIED TO STAY */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(0, 20, 40, 0.9) 0%,
                rgba(0, 30, 60, 0.8) 50%,
                rgba(0, 20, 40, 0.9) 100%
              ),
              url('/industry.jpg')
            `,
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8">


            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
                Transform Compliance with{' '}
                <span className="text-amber-400">
                  Digital Stamping
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Join Kinshasa's premier digital transformation initiative. Experience secure,
                automated compliance management that accelerates business growth while ensuring
                regulatory excellence.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.visit('/login')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold bg-[#003366] hover:bg-blue-800 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Enter Digital Portal
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
              </button>

              <button
                onClick={() => router.visit('/taxpayer/register')}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold bg-amber-400 hover:bg-amber-500 text-[#003366] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Register Your Business
                </span>
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-[fadeInUp_0.5s_ease-out]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </>
  )
}