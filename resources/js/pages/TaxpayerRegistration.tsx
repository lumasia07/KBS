import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import CompanyDetailsStep from '@/components/registration/CompanyDetailsStep';
import LocationDetailsStep from '@/components/registration/LocationDetailsStep';
import LegalRepresentativeStep from '@/components/registration/LegalRepresentativeStep';
import ReviewSubmitStep from '@/components/registration/ReviewSubmitStep';
import StepIndicator from '@/components/registration/StepIndicator';
import NavigationButtons from '@/components/registration/NavigationButtons';
import { useI18nStore } from '@/stores/useI18nStore';

interface LegalForm { id: number; name: string; code?: string; }
interface Sector { id: number; name: string; }
interface CompanySize { id: number; category: string; }
interface District { id: number; name: string; }
interface Commune { id: number; name: string; district_id: number; }
interface Quartier { id: number; name: string; commune_id: number; }

interface Props {
    legalForms: LegalForm[];
    sectors: Sector[];
    companySizes: CompanySize[];
    districts: District[];
    communes: Commune[];
    quartiers: Quartier[];
}

// Map form fields to their step number
const fieldToStepMap: Record<string, number> = {
    tax_identification_number: 1,
    rccm_number: 1,
    company_name: 1,
    legal_form_id: 1,
    sector_id: 1,
    email: 1,
    phone_number: 1,
    company_size_id: 1,
    district_id: 2,
    commune_id: 2,
    quartier_id: 2,
    avenue: 2,
    physical_address: 2,
    legal_representative_name: 3,
    legal_representative_email: 3,
    legal_representative_phone: 3,
    legal_representative_id_number: 3,
};

// Map field keys to translation keys used under registration.fields.*
const fieldLabels: Record<string, string> = {

    tax_identification_number: 'tin',
    rccm_number: 'rccm',
    company_name: 'companyName',
    legal_form_id: 'legalForm',
    sector_id: 'sector',
    email: 'companyEmail',
    phone_number: 'companyPhone',
    company_size_id: 'size',
    district_id: 'district',
    commune_id: 'commune',
    quartier_id: 'quartier',
    avenue: 'avenue',
    physical_address: 'address',
    legal_representative_name: 'repName',
    legal_representative_email: 'repEmail',
    legal_representative_phone: 'repPhone',
    legal_representative_id_number: 'repId',
};

export default function TaxpayerRegistration({
    legalForms,
    sectors,
    companySizes,
    districts,
    communes,
    quartiers
}: Props) {
    const { t } = useI18nStore();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        // Step 1: Company Details
        tax_identification_number: '',
        rccm_number: '',
        company_name: '',
        legal_form_id: '',
        sector_id: '',
        email: '',
        phone_number: '',
        company_size_id: '',

        // Step 2: Location
        district_id: '',
        commune_id: '',
        quartier_id: '',
        avenue: '',
        physical_address: '',

        // Step 3: Legal Representative
        legal_representative_name: '',
        legal_representative_email: '',
        legal_representative_phone: '',
        legal_representative_id_number: '',
    });

    // Display validation errors when they change
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const errorCount = Object.keys(errors).length;
            const errorsByStep: Record<number, string[]> = {};

            // Group errors by step
            Object.keys(errors).forEach((field) => {
                const step = fieldToStepMap[field] || 1;
                if (!errorsByStep[step]) {
                    errorsByStep[step] = [];
                }
                const translationKey = fieldLabels[field] || field;
                errorsByStep[step].push(t(`registration.fields.${translationKey}`) as string || field);
            });

            // Find the first step with errors
            const firstStepWithError = Math.min(...Object.keys(errorsByStep).map(Number));

            // Navigate to the first step with errors
            if (firstStepWithError && firstStepWithError !== currentStep) {
                setCurrentStep(firstStepWithError);
            }

            // Show detailed toast with error summary
            toast.error(
                <div className="space-y-2">
                    <div className="font-semibold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {t('registration.validationErrors').toString().replace('{count}', errorCount.toString())}
                    </div>
                    {Object.entries(errorsByStep).map(([step, fields]) => (
                        <div key={step} className="text-sm">
                            <span className="font-medium">{t('registration.errorStep').toString().replace('{step}', step)}:</span> {fields.join(', ')}
                        </div>
                    ))}
                </div>,
                { duration: 8000 }
            );
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        post('/taxpayer/register', {
            onSuccess: () => {
                toast.success(
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {t('registration.success')}
                    </div>
                );
            },
            onError: (formErrors) => {
                // Errors are handled by the useEffect above
            }
        });
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!data.tax_identification_number || !data.rccm_number || !data.company_name || !data.email || !data.phone_number || !data.legal_form_id || !data.sector_id || !data.company_size_id) {
                    return false;
                }
                return true;
            case 2:
                if (!data.district_id || !data.commune_id || !data.quartier_id || !data.physical_address) {
                    return false;
                }
                return true;
            case 3:
                if (!data.legal_representative_name || !data.legal_representative_email || !data.legal_representative_phone || !data.legal_representative_id_number) {
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const getMissingFieldsForStep = (step: number): string[] => {
        const missing: string[] = [];
        const stepFields: Record<number, string[]> = {
            1: ['tax_identification_number', 'rccm_number', 'company_name', 'email', 'phone_number', 'legal_form_id', 'sector_id', 'company_size_id'],
            2: ['district_id', 'commune_id', 'quartier_id', 'physical_address'],
            3: ['legal_representative_name', 'legal_representative_email', 'legal_representative_phone', 'legal_representative_id_number'],
        };

        const fields = stepFields[step] || [];
        fields.forEach((field) => {
            if (!data[field as keyof typeof data]) {
                const translationKey = fieldLabels[field] || field;
                missing.push(t(`registration.fields.${translationKey}`) as string || field);
            }
        });

        return missing;
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                setCurrentStep(currentStep + 1);
            } else {
                const missingFields = getMissingFieldsForStep(currentStep);
                toast.error(
                    <div className="space-y-1">
                        <div className="font-semibold">{t('registration.fillOptions')}</div>
                        <ul className="list-disc list-inside text-sm">
                            {missingFields.map((field) => (
                                <li key={field}>{field}</li>
                            ))}
                        </ul>
                    </div>,
                    { duration: 5000 }
                );
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const steps = [
        { id: 1, title: t('registration.steps.company.title'), description: t('registration.steps.company.description') },
        { id: 2, title: t('registration.steps.location.title'), description: t('registration.steps.location.description') },
        { id: 3, title: t('registration.steps.legalRoot.title'), description: t('registration.steps.legalRoot.description') },
        { id: 4, title: t('registration.steps.review.title'), description: t('registration.steps.review.description') },
    ];

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <CompanyDetailsStep
                        data={{
                            tax_identification_number: data.tax_identification_number,
                            rccm_number: data.rccm_number,
                            company_name: data.company_name,
                            email: data.email,
                            phone_number: data.phone_number,
                            legal_form_id: data.legal_form_id,
                            sector_id: data.sector_id,
                            company_size_id: data.company_size_id,
                        }}
                        legalForms={legalForms}
                        sectors={sectors}
                        companySizes={companySizes}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <LocationDetailsStep
                        data={{
                            district_id: data.district_id,
                            commune_id: data.commune_id,
                            quartier_id: data.quartier_id,
                            avenue: data.avenue,
                            physical_address: data.physical_address,
                        }}
                        districts={districts}
                        communes={communes}
                        quartiers={quartiers}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <LegalRepresentativeStep
                        data={{
                            legal_representative_name: data.legal_representative_name,
                            legal_representative_email: data.legal_representative_email,
                            legal_representative_phone: data.legal_representative_phone,
                            legal_representative_id_number: data.legal_representative_id_number,
                        }}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 4:
                return (
                    <ReviewSubmitStep
                        data={{
                            tax_identification_number: data.tax_identification_number,
                            rccm_number: data.rccm_number,
                            company_name: data.company_name,
                            email: data.email,
                            phone_number: data.phone_number,
                            legal_form_id: data.legal_form_id,
                            sector_id: data.sector_id,
                            company_size_id: data.company_size_id,
                            district_id: data.district_id,
                            commune_id: data.commune_id,
                            quartier_id: data.quartier_id,
                            avenue: data.avenue,
                            physical_address: data.physical_address,
                            legal_representative_name: data.legal_representative_name,
                            legal_representative_email: data.legal_representative_email,
                            legal_representative_phone: data.legal_representative_phone,
                            legal_representative_id_number: data.legal_representative_id_number,
                        }}
                        lookups={{
                            legalForms,
                            sectors,
                            companySizes,
                            districts,
                            communes,
                            quartiers
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
            <Head title={t('registration.title') as string} />
            <Toaster richColors position="top-right" />

            {/* Homepage Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Main Title */}
                    <div className="my-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-3">{t('registration.title')}</h1>
                        <p className="text-base md:text-lg text-slate-600">{t('registration.subtitle')}</p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator steps={steps} currentStep={currentStep} />

                    {/* Validation Error Summary Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-800">{t('registration.fillOptions')}</h3>
                                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                                        {Object.entries(errors).map(([field, message]) => {
                                            const translationKey = fieldLabels[field] || field;
                                            return (
                                                <li key={field} className="flex items-start gap-2">
                                                    <span className="font-medium">{t(`registration.fields.${translationKey}`) as string || field}:</span>
                                                    <span>{message}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        {renderCurrentStep()}

                        {/* Navigation Buttons */}
                        <NavigationButtons
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            onPrevStep={prevStep}
                            onNextStep={nextStep}
                            onSubmit={() => handleSubmit(new Event('submit') as any)}
                            processing={processing}
                        />
                    </form>

                    {/* Login link */}
                    <div className="text-center text-sm text-slate-600 mt-8 mb-12">
                        {t('registration.alreadyAccount')}{' '}
                        <Link
                            href="/login"
                            className="text-[#003366] font-semibold hover:text-[#002244] hover:underline transition-colors"
                        >
                            {t('registration.login')}
                        </Link>
                    </div>
                </div>
            </main>

            {/* Homepage Footer */}
            <Footer />
        </div>
    );
}
