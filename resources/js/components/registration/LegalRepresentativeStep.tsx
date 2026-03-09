import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useI18nStore } from '@/stores/useI18nStore';

interface LegalRepresentativeStepProps {
    data: {
        legal_representative_name: string;
        legal_representative_email: string;
        legal_representative_phone: string;
        legal_representative_id_number: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function LegalRepresentativeStep({ data, setData, errors }: LegalRepresentativeStepProps) {
    const { t } = useI18nStore();
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">{t('registration.steps.legalRoot.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="legal_representative_name" className="text-sm font-medium text-slate-600">
                        {t('registration.fields.repName')}
                    </Label>
                    <Input
                        id="legal_representative_name"
                        type="text"
                        value={data.legal_representative_name}
                        onChange={(e) => setData('legal_representative_name', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder={t('registration.fields.repNamePlaceholder') as string}
                    />
                    <InputError message={errors.legal_representative_name} />
                </div>
                <div>
                    <Label htmlFor="legal_representative_email" className="text-sm font-medium text-slate-600">
                        {t('registration.fields.repEmail')}
                    </Label>
                    <Input
                        id="legal_representative_email"
                        type="email"
                        value={data.legal_representative_email}
                        onChange={(e) => setData('legal_representative_email', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder={t('registration.fields.repEmailPlaceholder') as string}
                    />
                    <InputError message={errors.legal_representative_email} />
                </div>
                <div>
                    <Label htmlFor="legal_representative_phone" className="text-sm font-medium text-slate-600">
                        {t('registration.fields.repPhone')}
                    </Label>
                    <Input
                        id="legal_representative_phone"
                        type="tel"
                        value={data.legal_representative_phone}
                        onChange={(e) => setData('legal_representative_phone', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder={t('registration.fields.repPhonePlaceholder') as string}
                    />
                    <InputError message={errors.legal_representative_phone} />
                </div>
                <div>
                    <Label htmlFor="legal_representative_id_number" className="text-sm font-medium text-slate-600">
                        {t('registration.fields.repId')}
                    </Label>
                    <Input
                        id="legal_representative_id_number"
                        type="text"
                        value={data.legal_representative_id_number}
                        onChange={(e) => setData('legal_representative_id_number', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter ID number"
                    />
                    <InputError message={errors.legal_representative_id_number} />
                </div>
            </div>
        </div>
    );
}