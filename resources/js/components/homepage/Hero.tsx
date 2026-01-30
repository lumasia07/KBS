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
    { icon: <ShieldCheck className="w-4 h-4" />, text: "Military-Grade Security", color: "text-emerald-400" },
    { icon: <Lock className="w-4 h-4" />, text: "256-bit Encryption", color: "text-blue-400" },
    { icon: <Zap className="w-4 h-4" />, text: "Instant Processing", color: "text-amber-400" },
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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="relative overflow-hidden min-h-[600px] flex items-center py-16">
        {/* Background with sophisticated dark gradient overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `
              linear-gradient(
                to right,
                rgba(0, 20, 40, 0.8) 0%,
                rgba(0, 30, 60, 0.7) 30%,
                rgba(0, 40, 80, 0.4) 60%,
                rgba(0, 30, 60, 0.5) 100%
              ),
              url('/industry.jpg')
            `,
            filter: 'contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient mesh overlay for depth */}
        <div className="absolute inset-0 z-[1]" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(0, 51, 102, 0.25) 0%, transparent 50%),
            linear-gradient(to right, rgba(0, 20, 40, 0.6) 0%, rgba(0, 30, 60, 0.4) 50%, rgba(0, 20, 40, 0.6) 100%)
          `
        }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        
        {/* Floating glow orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-full border border-white/20 animate-fadeInUp">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white tracking-wide">
                Official Government Platform
              </span>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                <span className="text-white">Transform Compliance with</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300">
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
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#003366] via-blue-700 to-[#003366] rounded-xl group-hover:from-blue-800 group-hover:via-[#003366] group-hover:to-blue-800 transition-all duration-500"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-amber-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <span className="relative text-white flex items-center gap-2">
                  Enter Digital Portal
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
              </button>

              <button
                onClick={() => router.visit('/taxpayer/register')}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Golden gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFD700] rounded-xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
                {/* Animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-[#FFD700] to-amber-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
                    animation: 'shimmer 2s infinite'
                  }}
                />
                
                <span className="relative text-[#003366] flex items-center gap-2">
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
                  className="flex items-center gap-3 animate-fadeInUp group/feature"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 group-hover/feature:border-amber-400/30 transition-all duration-300 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-white group-hover/feature:text-amber-200 transition-colors">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Certificate - Desktop only */}
        <div className="absolute right-8 bottom-8 hidden lg:block animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-[#FFD700] rounded-xl blur-xl opacity-30"></div>
            <div className="relative p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20">
              <div className="text-center space-y-3">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Verified</div>
                <div className="text-2xl font-bold text-white">Digital Certificate</div>
                <div className="text-xs text-slate-300">Blockchain Secured</div>
                <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-blue-400 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden">
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-slate-400 font-medium">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-slate-500/30 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-gradient-to-b from-amber-400 to-amber-300 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </>
  )
}