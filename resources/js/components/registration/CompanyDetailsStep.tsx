import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';

interface CompanyDetailsStepProps {
    data: {
        tax_identification_number: string;
        rccm_number: string;
        company_name: string;
        legal_form_id: string;
        sector_id: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function CompanyDetailsStep({ data, setData, errors }: CompanyDetailsStepProps) {
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
                <div className="md:col-span-2">
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
                    <Label htmlFor="legal_form_id" className="text-sm font-medium text-slate-600">Legal Form</Label>
                    <Select value={data.legal_form_id} onValueChange={(value) => setData('legal_form_id', value)}>
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select legal form" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-[#003366] text-slate-900">
                            <SelectItem value="1">Sole Proprietorship</SelectItem>
                            <SelectItem value="2">Partnership</SelectItem>
                            <SelectItem value="3">Corporation</SelectItem>
                            <SelectItem value="4">Limited Liability Company</SelectItem>
                            <SelectItem value="5">Non-Profit Organization</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.legal_form_id} />
                </div>
                <div>
                    <Label htmlFor="sector_id" className="text-sm font-medium text-slate-600">Business Sector</Label>
                    <Select value={data.sector_id} onValueChange={(value) => setData('sector_id', value)}>
                        <SelectTrigger className="border-2 border-[#003366] focus:border-[#003366] focus:ring-[#003366] mt-1 text-slate-900">
                            <SelectValue placeholder="Select business sector" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-[#003366] text-slate-900">
                            <SelectItem value="1">Manufacturing</SelectItem>
                            <SelectItem value="2">Services</SelectItem>
                            <SelectItem value="3">Retail & Trade</SelectItem>
                            <SelectItem value="4">Agriculture</SelectItem>
                            <SelectItem value="5">Construction</SelectItem>
                            <SelectItem value="6">Technology</SelectItem>
                            <SelectItem value="7">Healthcare</SelectItem>
                            <SelectItem value="8">Education</SelectItem>
                            <SelectItem value="9">Transportation</SelectItem>
                            <SelectItem value="10">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.sector_id} />
                </div>
            </div>
        </div>
    );
}