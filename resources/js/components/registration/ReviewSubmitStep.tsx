import React from 'react';

interface ReviewSubmitStepProps {
    data: {
        tax_identification_number: string;
        rccm_number: string;
        company_name: string;
        email: string;
        phone_number: string;
        legal_form_id: string;
        sector_id: string;
        district_id: string;
        commune_id: string;
        quartier_id: string;
        avenue: string;
        physical_address: string;
        legal_representative_name: string;
        legal_representative_email: string;
        legal_representative_phone: string;
        legal_representative_id_number: string;
        company_size_id: string;
    };
    lookups?: {
        legalForms: { id: number; name: string; }[];
        sectors: { id: number; name: string; }[];
        companySizes: { id: number; name: string; }[];
        districts: { id: number; name: string; }[];
        communes: { id: number; name: string; }[];
        quartiers: { id: number; name: string; }[];
    };
}

export default function ReviewSubmitStep({ data, lookups }: ReviewSubmitStepProps) {
    const getLookupName = (list: { id: number; name: string; }[] | undefined, id: string) => {
        if (!list || !id) return id;
        const item = list.find(l => l.id.toString() === id.toString());
        return item ? item.name : id;
    };

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-6">Review & Submit</h2>

            <div className="space-y-6">
                {/* Company Details */}
                <div>
                    <h3 className="text-lg font-medium text-[#003366] border-b border-slate-200 pb-2 mb-3">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-500">Tax ID Number</span>
                            <span className="font-medium text-slate-900">{data.tax_identification_number}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">RCCM Number</span>
                            <span className="font-medium text-slate-900">{data.rccm_number}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="block text-slate-500">Company Name</span>
                            <span className="font-medium text-slate-900">{data.company_name}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Company Email</span>
                            <span className="font-medium text-slate-900">{data.email}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Company Phone</span>
                            <span className="font-medium text-slate-900">{data.phone_number}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Legal Form</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.legalForms, data.legal_form_id)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Business Sector</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.sectors, data.sector_id)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Company Size</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.companySizes, data.company_size_id)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Location Details */}
                <div>
                    <h3 className="text-lg font-medium text-[#003366] border-b border-slate-200 pb-2 mb-3">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-slate-500">District</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.districts, data.district_id)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Commune</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.communes, data.commune_id)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Quartier</span>
                            <span className="font-medium text-slate-900">
                                {getLookupName(lookups?.quartiers, data.quartier_id)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Avenue</span>
                            <span className="font-medium text-slate-900">{data.avenue}</span>
                        </div>
                        <div className="md:col-span-2">
                            <span className="block text-slate-500">Physical Address</span>
                            <span className="font-medium text-slate-900">{data.physical_address}</span>
                        </div>
                    </div>
                </div>

                {/* Legal Representative */}
                <div>
                    <h3 className="text-lg font-medium text-[#003366] border-b border-slate-200 pb-2 mb-3">Legal Representative</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="md:col-span-2">
                            <span className="block text-slate-500">Full Name</span>
                            <span className="font-medium text-slate-900">{data.legal_representative_name}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Email Address</span>
                            <span className="font-medium text-slate-900">{data.legal_representative_email}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">Phone Number</span>
                            <span className="font-medium text-slate-900">{data.legal_representative_phone}</span>
                        </div>
                        <div>
                            <span className="block text-slate-500">ID Number</span>
                            <span className="font-medium text-slate-900">{data.legal_representative_id_number}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded border border-blue-100 text-sm text-blue-800">
                    <p>Please review all information carefully before submitting. Once submitted, your application will be pending verification.</p>
                </div>
            </div>
        </div>
    );
}