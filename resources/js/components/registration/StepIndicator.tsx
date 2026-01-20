import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
    steps: Array<{
        id: number;
        title: string;
        description: string;
    }>;
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            step.id <= currentStep
                                ? 'bg-[#FFD700] border-[#FFD700] text-[#003366]'
                                : 'border-slate-300 text-slate-400'
                        }`}>
                            {step.id < currentStep ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-semibold">{step.id}</span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 ${
                                step.id < currentStep ? 'bg-[#FFD700]' : 'bg-slate-300'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}