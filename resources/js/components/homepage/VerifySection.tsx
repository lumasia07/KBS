import { Search, ShieldCheck, ShieldX, AlertTriangle, Loader2, QrCode } from 'lucide-react'
import React, { useState } from 'react'

import { useI18nStore } from '@/stores/useI18nStore'

interface VerifyResult {
    found: boolean
    result: string
    valid?: boolean
    stamp?: {
        serial_number: string
        status: string
        verification_count: number
        last_verification_at: string | null
        product: { name: string } | null
        taxpayer: { company_name: string } | null
        stamp_type: { name: string } | null
        production_date: string | null
        expiry_date: string | null
    } | null
}

export function VerifySection() {
    const { t } = useI18nStore()
    const [serial, setSerial] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<VerifyResult | null>(null)
    const [searched, setSearched] = useState(false)

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = serial.trim()
        if (!trimmed) return

        setLoading(true)
        setResult(null)
        setSearched(true)

        try {
            const res = await fetch(`/api/verify/${encodeURIComponent(trimmed)}`)
            if (res.ok) {
                const data = await res.json()
                setResult(data)
            } else {
                setResult({ found: false, result: 'not_found', stamp: null })
            }
        } catch {
            setResult({ found: false, result: 'error', stamp: null })
        } finally {
            setLoading(false)
        }
    }

    const resultConfig = result
        ? (() => {
              switch (result.result) {
                  case 'valid':
                      return {
                          icon: <ShieldCheck className="w-8 h-8" />,
                          bg: 'from-emerald-500 to-emerald-600',
                          border: 'border-emerald-200',
                          iconBg: 'bg-emerald-100 text-emerald-600',
                          title: t('verifySection.result.validTitle'),
                          subtitle: t('verifySection.result.validSubtitle'),
                          badge: 'bg-emerald-100 text-emerald-700',
                          badgeText: t('verifySection.result.authentic'),
                      }
                  case 'expired':
                      return {
                          icon: <AlertTriangle className="w-8 h-8" />,
                          bg: 'from-amber-500 to-amber-600',
                          border: 'border-amber-200',
                          iconBg: 'bg-amber-100 text-amber-600',
                          title: t('verifySection.result.expiredTitle'),
                          subtitle: t('verifySection.result.expiredSubtitle'),
                          badge: 'bg-amber-100 text-amber-700',
                          badgeText: t('verifySection.result.expired'),
                      }
                  case 'not_activated':
                      return {
                          icon: <AlertTriangle className="w-8 h-8" />,
                          bg: 'from-amber-500 to-amber-600',
                          border: 'border-amber-200',
                          iconBg: 'bg-amber-100 text-amber-600',
                          title: t('verifySection.result.notActivatedTitle'),
                          subtitle: t('verifySection.result.notActivatedSubtitle'),
                          badge: 'bg-amber-100 text-amber-700',
                          badgeText: t('verifySection.result.notActivated'),
                      }
                  case 'reported_lost':
                  case 'counterfeit':
                      return {
                          icon: <ShieldX className="w-8 h-8" />,
                          bg: 'from-red-500 to-red-600',
                          border: 'border-red-200',
                          iconBg: 'bg-red-100 text-red-600',
                          title: t('verifySection.result.invalidTitle'),
                          subtitle: t('verifySection.result.invalidSubtitle'),
                          badge: 'bg-red-100 text-red-700',
                          badgeText: t('verifySection.result.invalid'),
                      }
                  case 'not_found':
                  default:
                      return {
                          icon: <ShieldX className="w-8 h-8" />,
                          bg: 'from-slate-500 to-slate-600',
                          border: 'border-slate-200',
                          iconBg: 'bg-slate-100 text-slate-600',
                          title: t('verifySection.result.notFoundTitle'),
                          subtitle: t('verifySection.result.notFoundSubtitle'),
                          badge: 'bg-slate-100 text-slate-700',
                          badgeText: t('verifySection.result.notFound'),
                      }
              }
          })()
        : null

    return (
        <section id="verify" className="relative py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,51,102,0.03),transparent_70%)]" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 mb-6">
                        <QrCode className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700 uppercase tracking-wider">
                            {t('verifySection.badge')}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        {t('verifySection.title')}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('verifySection.subtitle')}
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleVerify} className="max-w-2xl mx-auto mb-10">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={serial}
                                onChange={(e) => setSerial(e.target.value)}
                                placeholder={t('verifySection.placeholder')}
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-lg font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all"
                                maxLength={100}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !serial.trim()}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#003366] to-[#1a0a2e] hover:from-[#1a0a2e] hover:to-[#003366] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ShieldCheck className="w-5 h-5" />
                            )}
                            {t('verifySection.button')}
                        </button>
                    </div>
                </form>

                {/* Result */}
                {loading && (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-[#003366] mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">{t('verifySection.checking')}</p>
                    </div>
                )}

                {!loading && searched && result && resultConfig && (
                    <div className="max-w-2xl mx-auto animate-[fadeInUp_0.4s_ease-out]">
                        <div className={`bg-white rounded-2xl shadow-xl border ${resultConfig.border} overflow-hidden`}>
                            {/* Status header */}
                            <div className={`bg-gradient-to-r ${resultConfig.bg} px-6 py-5 flex items-center gap-4`}>
                                <div className="p-2 bg-white/20 rounded-full text-white">
                                    {resultConfig.icon}
                                </div>
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">{resultConfig.title}</h3>
                                    <p className="text-sm opacity-90">{resultConfig.subtitle}</p>
                                </div>
                            </div>

                            {/* Details */}
                            {result.found && result.stamp && (
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-500">
                                            {t('verifySection.result.serialNumber')}
                                        </span>
                                        <span className="font-mono font-bold text-[#003366] text-lg">
                                            {result.stamp.serial_number}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                        <span className="text-sm font-medium text-slate-500">
                                            {t('verifySection.result.status')}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${resultConfig.badge}`}>
                                            {resultConfig.badgeText}
                                        </span>
                                    </div>

                                    {result.stamp.product && (
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <span className="text-sm font-medium text-slate-500">
                                                {t('verifySection.result.product')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {result.stamp.product.name}
                                            </span>
                                        </div>
                                    )}

                                    {result.stamp.taxpayer && (
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <span className="text-sm font-medium text-slate-500">
                                                {t('verifySection.result.taxpayer')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {result.stamp.taxpayer.company_name}
                                            </span>
                                        </div>
                                    )}

                                    {result.stamp.stamp_type && (
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <span className="text-sm font-medium text-slate-500">
                                                {t('verifySection.result.type')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {result.stamp.stamp_type.name}
                                            </span>
                                        </div>
                                    )}

                                    {result.stamp.production_date && (
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <span className="text-sm font-medium text-slate-500">
                                                {t('verifySection.result.productionDate')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {new Date(result.stamp.production_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {result.stamp.expiry_date && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-500">
                                                {t('verifySection.result.expiryDate')}
                                            </span>
                                            <span className="font-semibold text-slate-800">
                                                {new Date(result.stamp.expiry_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100 text-center">
                                        <p className="text-xs text-slate-400">
                                            {t('verifySection.result.scanCount')}: {result.stamp.verification_count ?? 1}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Not found body */}
                            {!result.found && (
                                <div className="p-6 text-center">
                                    <p className="text-slate-600 leading-relaxed">
                                        {t('verifySection.result.notFoundBody')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Info note */}
                {!searched && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 text-left">
                            <ShieldCheck className="w-5 h-5 text-[#003366] flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {t('verifySection.info')}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    )
}
