import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface LegalForm { id: number; name: string; code?: string; }
interface Sector { id: number; name: string; }

interface CompanySize { id: number; category: string; }

interface CompanyDetailsStepProps {
    data: {
        tax_identification_number: string;
        rccm_number: string;
        company_name: string;
        email: string;
        phone_number: string;
        legal_form_id: string;
        sector_id: string;
        company_size_id: string;
    };
    legalForms: LegalForm[];
    sectors: Sector[];
    companySizes: CompanySize[];
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function CompanyDetailsStep({ data, setData, errors, legalForms, sectors, companySizes }: CompanyDetailsStepProps) {
    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="tax_identification_number" className="text-sm font-medium text-slate-600">Tax Identification Number</Label>
                    <Input
                        id="tax_identification_number"
                        type="text"
                        value={data.tax_identification_number}
                        onChange={(e) => setData('tax_identification_number', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter TIN"
                    />
                    <InputError message={errors.tax_identification_number} />
                </div>
                <div>
                    <Label htmlFor="rccm_number" className="text-sm font-medium text-slate-600">RCCM Number</Label>
                    <Input
                        id="rccm_number"
                        type="text"
                        value={data.rccm_number}
                        onChange={(e) => setData('rccm_number', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter RCCM number"
                    />
                    <InputError message={errors.rccm_number} />
                </div>
                <div>
                    <Label htmlFor="company_name" className="text-sm font-medium text-slate-600">Company Name</Label>
                    <Input
                        id="company_name"
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter full company name"
                    />
                    <InputError message={errors.company_name} />
                </div>
                <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-600">Company Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter company email"
                    />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <Label htmlFor="phone_number" className="text-sm font-medium text-slate-600">Company Phone</Label>
                    <Input
                        id="phone_number"
                        type="tel"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        required
                        className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900"
                        placeholder="Enter company phone"
                    />
                    <InputError message={errors.phone_number} />
                </div>
                <div>
                    <Label htmlFor="legal_form_id" className="text-sm font-medium text-slate-600">Legal Form</Label>
                    <Select value={data.legal_form_id?.toString()} onValueChange={(value) => setData('legal_form_id', value)}>
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select legal form" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {legalForms.map((form) => (
                                <SelectItem key={form.id} value={form.id.toString()}>
                                    {form.name} {form.code ? `(${form.code})` : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.legal_form_id} />
                </div>
                <div>
                    <Label htmlFor="sector_id" className="text-sm font-medium text-slate-600">Business Sector</Label>
                    <Select value={data.sector_id?.toString()} onValueChange={(value) => setData('sector_id', value)}>
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select business sector" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {sectors.map((sector) => (
                                <SelectItem key={sector.id} value={sector.id.toString()}>
                                    {sector.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.sector_id} />
                </div>
                <div>
                    <Label htmlFor="company_size_id" className="text-sm font-medium text-slate-600">Company Size</Label>
                    <Select value={data.company_size_id?.toString()} onValueChange={(value) => setData('company_size_id', value)}>
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white border-2 border-[#003366] rounded-lg text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 [&_[data-radix-select-item]]:cursor-pointer [&_[data-radix-select-item]]:py-2.5 [&_[data-radix-select-item]]:px-3 [&_[data-radix-select-item]]:transition-all [&_[data-radix-select-item]]:duration-150 [&_[data-radix-select-item]:hover]:bg-[#003366]/10 [&_[data-radix-select-item][data-highlighted]]:bg-[#003366] [&_[data-radix-select-item][data-highlighted]]:text-white [&_[data-radix-select-item]:focus]:outline-none">
                            {companySizes.map((size) => (
                                <SelectItem key={size.id} value={size.id.toString()}>
                                    {size.category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.company_size_id} />
                </div>
            </div>
        </div>
    );
}