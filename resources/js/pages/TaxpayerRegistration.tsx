import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CompanyDetailsStep from '@/components/registration/CompanyDetailsStep';
import LocationDetailsStep from '@/components/registration/LocationDetailsStep';
import LegalRepresentativeStep from '@/components/registration/LegalRepresentativeStep';
import AccountSetupStep from '@/components/registration/AccountSetupStep';
import ReviewSubmitStep from '@/components/registration/ReviewSubmitStep';
import StepIndicator from '@/components/registration/StepIndicator';
import NavigationButtons from '@/components/registration/NavigationButtons';

export default function TaxpayerRegistration() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

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

        // Step 4: Account Setup
        email: '',
        password: '',
        password_confirmation: '',
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
        { id: 2, title: 'Location', description: 'Business location details' },
        { id: 3, title: 'Legal Representative', description: 'Representative details' },
        { id: 4, title: 'Account Setup', description: 'Create your account' },
        { id: 5, title: 'Review & Submit', description: 'Confirm and register' },
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
                    <AccountSetupStep
                        data={{
                            email: data.email,
                            password: data.password,
                            password_confirmation: data.password_confirmation,
                        }}
                        setData={setData}
                        errors={errors}
                    />
                );
            case 5:
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
                            email: data.email,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white relative">
            <Head title="Taxpayer Registration" />

            {/* Logo positioned at top left */}
            <div className="absolute top-4 left-4 z-10">
                <img
                    src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                    alt="Kinshasa Bureau of Standards Logo"
                    className="h-12 w-auto"
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-12 sm:px-6 lg:px-8">

                {/* Main Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black mb-4">Taxpayer Registration</h1>
                    <p className="text-lg text-[#003366]">Register your business with the Kinshasa Bureau of Standards</p>
                </div>

                {/* Step Indicator */}
                <StepIndicator steps={steps} currentStep={currentStep} />

                <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>
        </div>
    );
}