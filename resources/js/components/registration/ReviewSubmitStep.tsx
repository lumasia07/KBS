import React from 'react';
import { Building2, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useI18nStore } from '@/stores/useI18nStore';

interface ReviewSubmitStepProps {
    data: {
        tax_identification_number: string;
        rccm_number: string;
        company_name: string;
        email: string;
        phone_number: string;
        legal_form_id: string;
        sector_id: string;
        district_id: string;
        commune_id: string;
        quartier_id: string;
        avenue: string;
        physical_address: string;
        legal_representative_name: string;
        legal_representative_email: string;
        legal_representative_phone: string;
        legal_representative_id_number: string;
        company_size_id: string;
    };
    lookups?: {
        legalForms: { id: number; name: string; code?: string; }[];
        sectors: { id: number; name: string; }[];
        companySizes: { id: number; name: string; }[];
        districts: { id: number; name: string; }[];
        communes: { id: number; name: string; }[];
        quartiers: { id: number; name: string; }[];
    };
}

export default function ReviewSubmitStep({ data, lookups }: ReviewSubmitStepProps) {
    const { t } = useI18nStore();

    const getLookupName = (list: { id: number; name: string; }[] | undefined, id: string) => {
        if (!list || !id) return id;
        const item = list.find(l => l.id.toString() === id.toString());
        return item ? item.name : id;
    };

    const getLegalFormName = (id: string) => getLookupName(lookups?.legalForms, id);
    const getSectorName = (id: string) => getLookupName(lookups?.sectors, id);
    const getCompanySizeCategory = (id: string) => getLookupName(lookups?.companySizes, id);
    const getDistrictName = (id: string) => getLookupName(lookups?.districts, id);
    const getCommuneName = (id: string) => getLookupName(lookups?.communes, id);
    const getQuartierName = (id: string) => getLookupName(lookups?.quartiers, id);

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-6">{t('registration.review.title')}</h2>

            <div className="space-y-6">
                {/* Company Details */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-[#003366]" />
                        <h3 className="text-xl font-semibold text-black">{t('registration.review.companyInfo')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-slate-900">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.tin')}</p>
                            <p className="font-medium mt-1">{data.tax_identification_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.rccm')}</p>
                            <p className="font-medium mt-1">{data.rccm_number}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.companyName')}</p>
                            <p className="font-medium mt-1">{data.company_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.companyEmail')}</p>
                            <p className="font-medium mt-1">{data.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.companyPhone')}</p>
                            <p className="font-medium mt-1">{data.phone_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.legalForm')}</p>
                            <p className="font-medium mt-1">{getLegalFormName(data.legal_form_id)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.sector')}</p>
                            <p className="font-medium mt-1">{getSectorName(data.sector_id)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.size')}</p>
                            <p className="font-medium mt-1">{getCompanySizeCategory(data.company_size_id)}</p>
                        </div>
                    </div>
                </div>

                {/* Location Details */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-[#003366]" />
                        <h3 className="text-xl font-semibold text-black">{t('registration.review.locationInfo')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-slate-900">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.district')}</p>
                            <p className="font-medium mt-1">{getDistrictName(data.district_id)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.commune')}</p>
                            <p className="font-medium mt-1">{getCommuneName(data.commune_id)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.quartier')}</p>
                            <p className="font-medium mt-1">{getQuartierName(data.quartier_id)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.avenue')}</p>
                            <p className="font-medium mt-1">{data.avenue || '-'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.address')}</p>
                            <p className="font-medium mt-1">{data.physical_address}</p>
                        </div>
                    </div>
                </div>

                {/* Legal Representative */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-[#003366]" />
                        <h3 className="text-xl font-semibold text-black">{t('registration.review.representativeInfo')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-slate-900">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.repName')}</p>
                            <p className="font-medium mt-1">{data.legal_representative_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.repId')}</p>
                            <p className="font-medium mt-1">{data.legal_representative_id_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.repEmail')}</p>
                            <p className="font-medium mt-1">{data.legal_representative_email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{t('registration.fields.repPhone')}</p>
                            <p className="font-medium mt-1">{data.legal_representative_phone}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded border border-blue-100 text-sm text-blue-800">
                    <p>{t('registration.review.disclaimer')}</p>
                </div>
            </div>
        </div>
    );
}