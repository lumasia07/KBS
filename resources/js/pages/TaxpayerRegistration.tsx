import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CompanyDetailsStep from '@/components/registration/CompanyDetailsStep';
import LocationDetailsStep from '@/components/registration/LocationDetailsStep';
import LegalRepresentativeStep from '@/components/registration/LegalRepresentativeStep';
import ReviewSubmitStep from '@/components/registration/ReviewSubmitStep';
import StepIndicator from '@/components/registration/StepIndicator';
import NavigationButtons from '@/components/registration/NavigationButtons';

export default function TaxpayerRegistration() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const { data, setData, post, processing, errors } = useForm({
        // Step 1: Company Details
        tax_identification_number: '',
        rccm_number: '',
        company_name: '',
        legal_form_id: '',
        sector_id: '',

        // Step 2: Location
        district: '',
        commune: '',
        quartier: '',
        avenue: '',
        physical_address: '',

        // Step 3: Legal Representative
        legal_representative_name: '',
        legal_representative_email: '',
        legal_representative_phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/taxpayer/register');
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const steps = [
        { id: 1, title: 'Company Details', description: 'Business information' },
        { id: 2, title: 'Location', description: 'Business location' },
        { id: 3, title: 'Legal Representative', description: 'Contact details' },
        { id: 4, title: 'Review & Submit', description: 'Confirm registration' },
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
                            legal_form_id: data.legal_form_id,
                            sector_id: data.sector_id,
                        }}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <LocationDetailsStep
                        data={{
                            district: data.district,
                            commune: data.commune,
                            quartier: data.quartier,
                            avenue: data.avenue,
                            physical_address: data.physical_address,
                        }}
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
                            legal_form_id: data.legal_form_id,
                            sector_id: data.sector_id,
                            district: data.district,
                            commune: data.commune,
                            quartier: data.quartier,
                            avenue: data.avenue,
                            physical_address: data.physical_address,
                            legal_representative_name: data.legal_representative_name,
                            legal_representative_email: data.legal_representative_email,
                            legal_representative_phone: data.legal_representative_phone,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            <Head title="Taxpayer Registration" />

            {/* Left Side - Registration Form */}
            <div className="w-full lg:w-3/5 flex flex-col">
                {/* Logo positioned at top left */}
                <div className="px-6 pt-4 pb-2">
                    <Link href="/">
                        <img
                            src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                            alt="Kinshasa Bureau of Standards Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                <div className="flex-1 px-6 py-6 lg:px-12 overflow-y-auto">
                    {/* Main Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-black mb-2">Taxpayer Registration</h1>
                        <p className="text-base text-[#003366]">Register your business with the Kinshasa Bureau of Standards</p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator steps={steps} currentStep={currentStep} />

                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        {renderCurrentStep()}

                        {/* Navigation Buttons */}
                        <NavigationButtons
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            onPrevStep={prevStep}
                            onNextStep={nextStep}
                            onSubmit={handleSubmit}
                            processing={processing}
                        />
                    </form>

                    {/* Login link */}
                    <div className="text-center text-sm text-slate-600 mt-8 pb-6">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-[#003366] font-semibold hover:text-[#002244] hover:underline"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Industry Image (Desktop only) */}
            <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
                {/* Industry background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/industry.jpg')" }}
                ></div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/70 via-[#003366]/50 to-[#002244]/60"></div>

                {/* Golden accent overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent"></div>

                {/* Decorative content */}
                <div className="absolute bottom-12 left-8 right-8 z-10">
                    <p className="text-white text-2xl font-bold mb-2">
                        Join the KBS System
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Register your enterprise and gain access to the official stamping system for compliance and verification.
                    </p>
                </div>
            </div>
        </div>
    );
}
