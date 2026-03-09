import { usePage } from '@inertiajs/react';
import { Globe, LayoutGrid, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useI18nStore } from '@/stores/useI18nStore';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const { t, language, setLanguage } = useI18nStore();
    const userType = auth?.user?.user_type as string | undefined;
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const portalName = userType === 'taxpayer'
        ? t('taxpayer.portalName')
        : userType === 'control_agent'
            ? t('common.agentPortal') || 'Agent Portal'
            : t('common.adminPortal') || 'Admin Portal';

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-[#003366] text-white">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 hover:text-white" />
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-semibold">{portalName}</span>
                </div>
            </div>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
                <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white text-sm font-medium"
                >
                    <Globe className="w-4 h-4" />
                    <span className="uppercase text-xs">{language}</span>
                </button>

                {isLangOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                        <button
                            onClick={() => { setLanguage('fr'); setIsLangOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${language === 'fr' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}
                        >
                            {t('globe.french')} {language === 'fr' && <Check className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${language === 'en' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}
                        >
                            {t('globe.english')} {language === 'en' && <Check className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
