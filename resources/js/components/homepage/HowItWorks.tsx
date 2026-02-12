import { UserPlus, FileText, CreditCard, ShieldCheck } from 'lucide-react'
import React from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { router } from '@inertiajs/react'

const steps = [
  {
    id: '01',
    title: 'Register Your Business',
    description: 'Create your secure account as a Taxable Person (Assujetti). Simply upload your official ID and business registration documents to get verified instantly.',
    icon: UserPlus,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
    alt: 'Business registration process',
    benefits: [
      'Instant digital identity verification',
      'Secure document upload & storage',
      'Official Assujetti tax status'
    ]
  },
  {
    id: '02',
    title: 'Order Revenue Stamps',
    description: 'Select your required stamps and quantity. Our system automatically calculates duties and generates a secure Note de Perception slip for your records.',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
    alt: 'Ordering process',
    benefits: [
      'Automated duty calculation',
      'Bulk ordering capabilities',
      'Instant Note de Perception generation'
    ]
  },
  {
    id: '03',
    title: 'Secure Payment',
    description: 'Complete your transaction seamlessly using approved banking partners or mobile money services. Receive instant confirmation and digital receipts.',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
    alt: 'Payment processing',
    benefits: [
      'Bank & Mobile Money integration',
      'Immediate payment confirmation',
      'Traceable digital receipts'
    ]
  },
  {
    id: '04',
    title: 'Verify & Track',
    description: 'Track your order status in real-time. Upon delivery, stamps can be instantly verified using our secure mobile application.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2672&q=80',
    alt: 'Verification process',
    benefits: [
      'Real-time authenticity check',
      'Anti-counterfeit protection',
      'Integrated mobile app verification'
    ]
  },
]

export function HowItWorks() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1)

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-slate-900">
            Product Standardization & Compliance
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our streamlined workflow ensures rapid compliance, product standardization, and efficient revenue collection through four integrated steps.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${isReversed ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* Image Side - index 0: left, index 1: right */}
                <div
                  className={`w-full md:w-1/2 relative group ${isVisible
                      ? (isReversed ? 'animate-fade-in-right' : 'animate-fade-in-left')
                      : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-blue-600/5 rounded-2xl transform rotate-3 transition-transform group-hover:rotate-2 duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 aspect-[4/3]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Number Badge */}
                    <div className="absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center border border-white/50">
                      <span className="text-2xl font-bold text-[#003366]">{step.id}</span>
                    </div>
                  </div>
                </div>

                {/* Text Side - index 0: right, index 1: left */}
                <div
                  className={`w-full md:w-1/2 space-y-6 ${isVisible
                      ? (isReversed ? 'animate-fade-in-left' : 'animate-fade-in-right')
                      : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 150 + 200}ms` }}
                >
                  <div className="inline-flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-[#003366]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className={`mt-24 text-center ${isVisible ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
          <button
            onClick={() => router.visit('/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#003366] hover:bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Your Registration
          </button>
        </div>
      </div>
    </section>
  )
}