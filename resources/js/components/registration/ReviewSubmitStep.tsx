import React from 'react';

interface ReviewSubmitStepProps {
    data: {
        tax_identification_number: string;
        rccm_number: string;
        company_name: string;
        legal_form_id: string;
        sector_id: string;
        district: string;
        commune: string;
        quartier: string;
        avenue: string;
        physical_address: string;
        legal_representative_name: string;
        legal_representative_email: string;
        legal_representative_phone: string;
        email: string;
    };
}

export default function ReviewSubmitStep({ data }: ReviewSubmitStepProps) {
    const getLegalFormText = (id: string) => {
        switch (id) {
            case '1': return 'Sole Proprietorship';
            case '2': return 'Partnership';
            case '3': return 'Corporation';
            case '4': return 'Limited Liability Company';
            case '5': return 'Non-Profit Organization';
            default: return 'Not selected';
        }
    };

    const getSectorText = (id: string) => {
        switch (id) {
            case '1': return 'Manufacturing';
            case '2': return 'Services';
            case '3': return 'Retail & Trade';
            case '4': return 'Agriculture';
            case '5': return 'Construction';
            case '6': return 'Technology';
            case '7': return 'Healthcare';
            case '8': return 'Education';
            case '9': return 'Transportation';
            case '10': return 'Other';
            default: return 'Not selected';
        }
    };

    return (
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-black mb-4">Review Your Information</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-black mb-3">Company Details</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-purple-600 font-medium">TIN:</span>
                                <span className="text-black ml-2">{data.tax_identification_number}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">RCCM:</span>
                                <span className="text-black ml-2">{data.rccm_number}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Company:</span>
                                <span className="text-black ml-2">{data.company_name}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Legal Form:</span>
                                <span className="text-black ml-2">{getLegalFormText(data.legal_form_id)}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Sector:</span>
                                <span className="text-black ml-2">{getSectorText(data.sector_id)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-black mb-3">Location</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-purple-600 font-medium">District:</span>
                                <span className="text-black ml-2">{data.district || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Commune:</span>
                                <span className="text-black ml-2">{data.commune || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Quartier:</span>
                                <span className="text-black ml-2">{data.quartier || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Avenue:</span>
                                <span className="text-black ml-2">{data.avenue || 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Address:</span>
                                <span className="text-black ml-2">{data.physical_address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 md:col-span-2">
                        <h3 className="font-semibold text-black mb-3">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-purple-600 font-medium">Representative:</span>
                                <span className="text-black ml-2">{data.legal_representative_name}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Email:</span>
                                <span className="text-black ml-2">{data.legal_representative_email}</span>
                            </div>
                            <div>
                                <span className="text-purple-600 font-medium">Phone:</span>
                                <span className="text-black ml-2">{data.legal_representative_phone}</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-purple-600 font-medium">Account Email:</span>
                                <span className="text-black ml-2">{data.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        By submitting this registration, you agree to comply with all regulations set by the Kinshasa Bureau of Standards.
                        Your application will be reviewed and you will be notified of the approval status via email.
                    </p>
                </div>
            </div>
        </div>
    );
}