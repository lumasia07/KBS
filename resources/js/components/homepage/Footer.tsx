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
import { useI18nStore } from '@/stores/useI18nStore';

export function Footer() {
  const [email, setEmail] = useState('')
  const { t, language, setLanguage } = useI18nStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic
    console.log('Subscribed:', email)
    setEmail('')
  }

  const quickLinks = [
    { label: t('footer.quickLinks.stampRegistration'), href: '#', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: t('footer.quickLinks.taxCalculator'), href: '#', icon: <FileText className="w-4 h-4" /> },
    { label: t('footer.quickLinks.feeSchedule'), href: '#', icon: <Download className="w-4 h-4" /> },
    { label: t('footer.quickLinks.verifyDoc'), href: '#', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: t('footer.quickLinks.agentPortal'), href: '#', icon: <Building2 className="w-4 h-4" /> },
    { label: t('footer.quickLinks.liveSupport'), href: '#', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  const contactInfo = [
    { icon: <MapPin className="w-5 h-5" />, text: t('footer.contact.address') },
    { icon: <Phone className="w-5 h-5" />, text: t('footer.contact.phone') },
    { icon: <Mail className="w-5 h-5" />, text: t('footer.contact.email') },
    { icon: <Clock className="w-5 h-5" />, text: t('footer.contact.hours') },
  ]

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
  ]

  const services = [
    { label: t('footer.services.items.stampRegistration'), href: '#' },
    { label: t('footer.services.items.complianceVerification'), href: '#' },
    { label: t('footer.services.items.businessLicensing'), href: '#' },
    { label: t('footer.services.items.taxPayment'), href: '#' },
    { label: t('footer.services.items.documentAuth'), href: '#' },
    { label: t('footer.services.items.regulatoryUpdates'), href: '#' },
  ]

  const resources = [
    { label: t('footer.resources.items.helpCenter'), href: '#' },
    { label: t('footer.resources.items.documentation'), href: '#' },
    { label: t('footer.resources.items.apiAccess'), href: '#' },
    { label: t('footer.resources.items.systemStatus'), href: '#' },
    { label: t('footer.resources.items.security'), href: '#' },
    { label: t('footer.resources.items.fraudReport'), href: '#' },
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
                      src="/KBS_logo.png"
                      alt="Kinshasa Bureau of Standards Logo"
                      className="relative h-16 w-auto"
                    />
                  </div> */}
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {t('footer.about.title')}
                    </h2>
                    <p className="text-lg text-blue-200 font-medium">
                      {t('footer.about.subtitle')}
                    </p>
                  </div>
                </div>

                <p className="text-blue-100 text-sm leading-relaxed">
                  {t('footer.about.description')}
                </p>

                {/* Newsletter Subscription */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-3">
                    {t('footer.newsletter.title')}
                  </h4>
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('footer.newsletter.placeholder') as string}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all placeholder:text-blue-300"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#003366] font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        {t('footer.newsletter.button')}
                      </button>
                    </div>
                    <p className="text-xs text-blue-300">
                      {t('footer.newsletter.hint')}
                    </p>
                  </form>
                </div>
              </div>

              {/* Services & Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-amber-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    {t('footer.services.title')}
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
                    {t('footer.resources.title')}
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
                  {t('footer.contact.title')}
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
                    {t('footer.social.title')}
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
                    <button onClick={() => setLanguage('fr')} className={`text-sm ${language === 'fr' ? 'text-white' : 'text-blue-300'} hover:text-white transition-colors`}>
                      Français
                    </button>
                    <span className="text-blue-300">|</span>
                    <button onClick={() => setLanguage('en')} className={`text-sm ${language === 'en' ? 'text-white' : 'text-blue-300'} hover:text-white transition-colors`}>
                      English
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-blue-300">
                      {t('footer.bottom.systemStatus')}: <span className="text-green-400 font-medium">{t('footer.bottom.operational')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    {t('footer.bottom.privacyPolicy')}
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    {t('footer.bottom.termsOfService')}
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    {t('footer.bottom.accessibility')}
                  </a>
                  <a href="#" className="text-blue-300 hover:text-white hover:scale-105 transition-all">
                    {t('footer.bottom.cookiePolicy')}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-blue-300">
                  {(t('footer.bottom.copyright') as string).replace('{year}', new Date().getFullYear().toString())}
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