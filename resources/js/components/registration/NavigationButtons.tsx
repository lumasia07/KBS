import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
    currentStep: number;
    totalSteps: number;
    onPrevStep: () => void;
    onNextStep: () => void;
    onSubmit: () => void;
    processing: boolean;
}

export default function NavigationButtons({
    currentStep,
    totalSteps,
    onPrevStep,
    onNextStep,
    onSubmit,
    processing
}: NavigationButtonsProps) {
    return (
        <div className="flex justify-between pt-6 border-t border-slate-200">
            {currentStep > 1 && (
                <Button
                    type="button"
                    onClick={onPrevStep}
                    className="bg-white border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
            )}
            {currentStep < totalSteps ? (
                <Button
                    type="button"
                    onClick={onNextStep}
                    className="bg-[#FFD700] hover:bg-[#F4C430] text-[#003366] font-bold px-8 py-3 rounded-lg ml-auto shadow-sm hover:shadow-md transition-all duration-200"
                >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <Button
                    type="submit"
                    onClick={onSubmit}
                    disabled={processing}
                    className="bg-[#FFD700] hover:bg-[#F4C430] text-[#003366] font-bold px-8 py-3 rounded-lg ml-auto shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Submitting...' : 'Submit Registration'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}
        </div>
    );
}