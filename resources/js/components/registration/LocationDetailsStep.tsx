import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface LocationDetailsStepProps {
    data: {
        district: string;
        commune: string;
        quartier: string;
        avenue: string;
        physical_address: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function LocationDetailsStep({ data, setData, errors }: LocationDetailsStepProps) {
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="district" className="text-sm font-medium text-slate-600">District</Label>
                    <Input
                        id="district"
                        type="text"
                        value={data.district}
                        onChange={(e) => setData('district', e.target.value)}
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter district"
                    />
                    <InputError message={errors.district} />
                </div>
                <div>
                    <Label htmlFor="commune" className="text-sm font-medium text-slate-600">Commune</Label>
                    <Input
                        id="commune"
                        type="text"
                        value={data.commune}
                        onChange={(e) => setData('commune', e.target.value)}
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter commune"
                    />
                    <InputError message={errors.commune} />
                </div>
                <div>
                    <Label htmlFor="quartier" className="text-sm font-medium text-slate-600">Quartier</Label>
                    <Input
                        id="quartier"
                        type="text"
                        value={data.quartier}
                        onChange={(e) => setData('quartier', e.target.value)}
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter quartier"
                    />
                    <InputError message={errors.quartier} />
                </div>
                <div>
                    <Label htmlFor="avenue" className="text-sm font-medium text-slate-600">Avenue/Street</Label>
                    <Input
                        id="avenue"
                        type="text"
                        value={data.avenue}
                        onChange={(e) => setData('avenue', e.target.value)}
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter avenue or street name"
                    />
                    <InputError message={errors.avenue} />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="physical_address" className="text-sm font-medium text-slate-600">Complete Physical Address</Label>
                    <Input
                        id="physical_address"
                        type="text"
                        value={data.physical_address}
                        onChange={(e) => setData('physical_address', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter complete address with building number, etc."
                    />
                    <InputError message={errors.physical_address} />
                </div>
            </div>
        </div>
    );
}