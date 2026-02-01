import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface District { id: number; name: string; }
interface Commune { id: number; name: string; district_id: number; }
interface Quartier { id: number; name: string; commune_id: number; }

interface LocationDetailsStepProps {
    data: {
        district_id: string;
        commune_id: string;
        quartier_id: string;
        avenue: string;
        physical_address: string;
    };
    districts: District[];
    communes: Commune[];
    quartiers: Quartier[];
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function LocationDetailsStep({ data, setData, errors, districts, communes, quartiers }: LocationDetailsStepProps) {
    const filteredCommunes = useMemo(() => {
        if (!data.district_id) return [];
        return communes.filter(c => c.district_id === parseInt(data.district_id));
    }, [data.district_id, communes]);

    const filteredQuartiers = useMemo(() => {
        if (!data.commune_id) return [];
        return quartiers.filter(q => q.commune_id === parseInt(data.commune_id));
    }, [data.commune_id, quartiers]);

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="district_id" className="text-sm font-medium text-slate-600">District</Label>
                    <Select
                        value={data.district_id?.toString()}
                        onValueChange={(value) => {
                            setData('district_id', value);
                            setData('commune_id', ''); // Reset child fields
                            setData('quartier_id', '');
                        }}
                    >
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {districts.map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.district_id} />
                </div>
                <div>
                    <Label htmlFor="commune_id" className="text-sm font-medium text-slate-600">Commune</Label>
                    <Select
                        value={data.commune_id?.toString()}
                        onValueChange={(value) => {
                            setData('commune_id', value);
                            setData('quartier_id', '');
                        }}
                        disabled={!data.district_id}
                    >
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select commune" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {filteredCommunes.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.commune_id} />
                </div>
                <div>
                    <Label htmlFor="quartier_id" className="text-sm font-medium text-slate-600">Quartier</Label>
                    <Select
                        value={data.quartier_id?.toString()}
                        onValueChange={(value) => setData('quartier_id', value)}
                        disabled={!data.commune_id}
                    >
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select quartier" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {filteredQuartiers.map((q) => (
                                <SelectItem key={q.id} value={q.id.toString()}>{q.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.quartier_id} />
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