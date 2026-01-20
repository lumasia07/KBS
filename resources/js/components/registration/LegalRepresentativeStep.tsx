import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface LegalRepresentativeStepProps {
    data: {
        legal_representative_name: string;
        legal_representative_email: string;
        legal_representative_phone: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function LegalRepresentativeStep({ data, setData, errors }: LegalRepresentativeStepProps) {
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Legal Representative</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Label htmlFor="legal_representative_name" className="text-sm font-medium text-slate-600">Full Name</Label>
                    <Input
                        id="legal_representative_name"
                        type="text"
                        value={data.legal_representative_name}
                        onChange={(e) => setData('legal_representative_name', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter full legal representative name"
                    />
                    <InputError message={errors.legal_representative_name} />
                </div>
                <div>
                    <Label htmlFor="legal_representative_email" className="text-sm font-medium text-slate-600">Email Address</Label>
                    <Input
                        id="legal_representative_email"
                        type="email"
                        value={data.legal_representative_email}
                        onChange={(e) => setData('legal_representative_email', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter email address"
                    />
                    <InputError message={errors.legal_representative_email} />
                </div>
                <div>
                    <Label htmlFor="legal_representative_phone" className="text-sm font-medium text-slate-600">Phone Number</Label>
                    <Input
                        id="legal_representative_phone"
                        type="tel"
                        value={data.legal_representative_phone}
                        onChange={(e) => setData('legal_representative_phone', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter phone number"
                    />
                    <InputError message={errors.legal_representative_phone} />
                </div>
            </div>
        </div>
    );
}