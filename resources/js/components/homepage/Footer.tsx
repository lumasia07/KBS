import React, { useState } from 'react'
import {
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  FileText,
  AlertTriangle,
  MessageSquare,
  Download,
  ArrowUpRight
} from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic
    console.log('Subscribed:', email)
    setEmail('')
  }

  const quickLinks = [
    { label: 'Stamp Registration', href: '#', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Tax Calculator', href: '#', icon: <FileText className="w-4 h-4" /> },
    { label: 'Fee Schedule', href: '#', icon: <Download className="w-4 h-4" /> },
    { label: 'Verify Document', href: '#', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Agent Portal', href: '#', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Live Support', href: '#', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  const contactInfo = [
    { icon: <MapPin className="w-5 h-5" />, text: '123 Government Avenue, Gombe, Kinshasa, DR Congo' },
    { icon: <Phone className="w-5 h-5" />, text: '+243 81 234 5678 (24/7 Support)' },
    { icon: <Mail className="w-5 h-5" />, text: 'support@standards.kinshasa.cd' },
    { icon: <Clock className="w-5 h-5" />, text: 'Mon-Fri: 8:00 AM - 6:00 PM' },
  ]

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
  ]

  const services = [
    { label: 'Stamp Registration', href: '#' },
    { label: 'Compliance Verification', href: '#' },
    { label: 'Business Licensing', href: '#' },
    { label: 'Tax Payment', href: '#' },
    { label: 'Document Authentication', href: '#' },
    { label: 'Regulatory Updates', href: '#' },
  ]

  const resources = [
    { label: 'Help Center', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'API Access', href: '#' },
    { label: 'System Status', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Fraud Report', href: '#' },
  ]

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .floating-logo {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <footer className="relative overflow-hidden">
        {/* Top gradient section */}
        <div className="bg-gradient-to-br from-[#003366] via-[#00264d] to-[#001a33] text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFD700]"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full translate-x-48 translate-y-48"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Quick Access Bar */}
            <div className="mb-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-amber-500/30"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 group-hover:from-amber-500/30 group-hover:to-amber-600/20 transition-all">
                        {link.icon}
                      </div>
                      <span className="text-sm font-medium text-center group-hover:text-amber-200 transition-colors">
                        {link.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              {/* Logo & Description */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {/* <div className="relative floating-logo">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-amber-400 rounded-full blur-xl opacity-20"></div>
                    <img
                      src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                      alt="Kinshasa Bureau of Standards Logo"
                      className="relative h-16 w-auto"
                    />
                  </div> */}
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Kinshasa Bureau
                    </h2>
                    <p className="text-lg text-blue-200 font-medium">
                      of Standards & Regulations
                    </p>
                  </div>
                </div>

                <p className="text-blue-100 text-sm leading-relaxed">
                  The official Integrated Stamping System for secure revenue collection,
                  compliance verification, and digital governance in the Democratic
                  Republic of Congo.
                </p>

                {/* Newsletter Subscription */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-3">
                    Stay Updated
                  </h4>
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all placeholder:text-blue-300"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#003366] font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        Subscribe
                      </button>
                    </div>
                    <p className="text-xs text-blue-300">
                      Receive updates on regulatory changes and system announcements
                    </p>
                  </form>
                </div>
              </div>

              {/* Services & Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Services
                  </h4>
                  <ul className="space-y-3">
                    {services.map((service, index) => (
                      <li key={index}>
                        <a
                          href={service.href}
                          className="group flex items-center gap-2 text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-1"
                        >
                          <ChevronRight className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all" />
                          <span className="text-sm">{service.label}</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.href}
                          className="group flex items-center gap-2 text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-1"
                        >
                          <ChevronRight className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all" />
                          <span className="text-sm">{resource.label}</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Contact Information
                </h4>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 group-hover:from-amber-500/30 group-hover:to-amber-600/20 transition-all">
                        {info.icon}
                      </div>
                      <span className="text-sm text-blue-100 group-hover:text-white leading-relaxed">
                        {info.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h5 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-4">
                    Connect With Us
                  </h5>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className="group relative p-3 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-blue-500/20 transition-all duration-300 hover:scale-110"
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 via-transparent to-blue-400/0 group-hover:from-amber-400/10 group-hover:to-blue-400/10 transition-all"></div>
                        <span className="relative text-blue-200 group-hover:text-white">
                          {social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-blue-300">
                      Français | English
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-blue-300">
                      System Status: <span className="text-green-400 font-medium">Operational</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    Terms of Service
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    Accessibility
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    Cookie Policy
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-blue-300">
                  © {new Date().getFullYear()} Kinshasa Bureau of Standards. All rights reserved. |
                  VAT: CD-123-456-789 | Registration: RC-KIN-2024-001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-br from-[#003366] to-[#00264d] text-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 group border border-white/10"
          aria-label="Back to top"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-amber-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <ArrowUpRight className="w-6 h-6 transform -rotate-45 relative" />
          </div>
        </button>
      </footer>
    </>
  )
}