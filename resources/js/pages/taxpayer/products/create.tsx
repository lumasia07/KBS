import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Save,
    Upload,
    AlertCircle,
    Plus,
    X,
    FileText,
    Calendar,
    Building2,
    Globe,
    Hash,
    FileCheck
} from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Taxpayer Portal',
        href: '/taxpayer/dashboard',
    },
    {
        title: 'My Products',
        href: '/taxpayer/products',
    },
    {
        title: 'Add Product',
        href: '/taxpayer/products/create',
    },
];

interface CertificateType {
    id: number;
    name: string;
    code: string;
    specific_requirements?: string;
}

interface Category {
    id: number;
    name: string;
    requires_certificate: boolean;
    required_certificate_types: CertificateType[];
}

interface Props {
    categories: Category[];
    unitTypes: Array<{ value: string; label: string }>;
}

interface CertificateFormData {
    type_id: string;
    certificate_number: string;
    issue_date: string;
    expiry_date: string;
    issuing_authority: string;
    issuing_country: string;
    remarks: string;
    file: File | null;
    temp_id?: string;
}

export default function TaxpayerProductsCreate({ categories = [], unitTypes = [] }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [certificates, setCertificates] = useState<CertificateFormData[]>([]);

    const form = useForm({
        name: '',
        category_id: '',
        unit_type: 'unit',
        description: '',
        notes: '',
    });

    const handleCategoryChange = (categoryId: string) => {
        form.setData('category_id', categoryId);
        const category = categories.find(c => c.id.toString() === categoryId);
        setSelectedCategory(category || null);
        setCertificates([]);
    };

    const addCertificate = () => {
        const newCertificate: CertificateFormData = {
            type_id: '',
            certificate_number: '',
            issue_date: '',
            expiry_date: '',
            issuing_authority: '',
            issuing_country: '',
            remarks: '',
            file: null,
            temp_id: Math.random().toString(36).substr(2, 9)
        };
        setCertificates([...certificates, newCertificate]);
    };

    const removeCertificate = (index: number) => {
        setCertificates(certificates.filter((_, i) => i !== index));
    };

    const updateCertificate = (index: number, field: keyof CertificateFormData, value: any) => {
        const updated = [...certificates];
        updated[index] = { ...updated[index], [field]: value };
        setCertificates(updated);
    };

    const handleFileChange = (index: number, file: File | null) => {
        updateCertificate(index, 'file', file);
    };

    const validateCertificates = (): boolean => {
        if (!selectedCategory?.requires_certificate) {
            return certificates.length === 0;
        }

        const requiredTypeIds = selectedCategory.required_certificate_types.map(ct => ct.id.toString());
        const providedTypeIds = certificates.map(c => c.type_id).filter(id => id);

        const missingRequired = requiredTypeIds.filter(id => !providedTypeIds.includes(id));

        if (missingRequired.length > 0) {
            const missingNames = selectedCategory.required_certificate_types
                .filter(ct => missingRequired.includes(ct.id.toString()))
                .map(ct => ct.name)
                .join(', ');

            toast.error(`Missing required certificates: ${missingNames}`);
            return false;
        }

        for (let i = 0; i < certificates.length; i++) {
            const cert = certificates[i];

            if (!cert.type_id) {
                toast.error(`Certificate #${i + 1}: Please select a certificate type`);
                return false;
            }

            if (!cert.issue_date) {
                toast.error(`${getCertificateTypeName(cert.type_id)}: Issue date is required`);
                return false;
            }

            if (!cert.issuing_authority) {
                toast.error(`${getCertificateTypeName(cert.type_id)}: Issuing authority is required`);
                return false;
            }

            if (!cert.file) {
                toast.error(`${getCertificateTypeName(cert.type_id)}: Certificate file is required`);
                return false;
            }

            if (cert.expiry_date && cert.issue_date) {
                const issueDate = new Date(cert.issue_date);
                const expiryDate = new Date(cert.expiry_date);
                if (expiryDate <= issueDate) {
                    toast.error(`${getCertificateTypeName(cert.type_id)}: Expiry date must be after issue date`);
                    return false;
                }
            }
        }

        return true;
    };

    const getCertificateTypeName = (typeId: string): string => {
        if (!selectedCategory) return 'Certificate';
        const certType = selectedCategory.required_certificate_types.find(ct => ct.id.toString() === typeId);
        return certType?.name || 'Certificate';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.name.trim()) {
            toast.error('Product name is required');
            return;
        }

        if (!form.data.category_id) {
            toast.error('Please select a product category');
            return;
        }

        if (!form.data.unit_type) {
            toast.error('Please select a unit type');
            return;
        }

        if (!validateCertificates()) {
            return;
        }

        // Create a plain object for the main data
        const mainData = {
            name: form.data.name,
            category_id: form.data.category_id,
            unit_type: form.data.unit_type,
            description: form.data.description || '',
            notes: form.data.notes || '',
        };

        // Create FormData
        const submitData = new FormData();

        // Add main data as JSON
        submitData.append('data', JSON.stringify(mainData));

        // Add certificates count
        submitData.append('certificates_count', certificates.length.toString());

        // Add each certificate's data as JSON and files separately
        certificates.forEach((cert, index) => {
            // Ensure empty strings are handled properly
            const certData = {
                type_id: cert.type_id,
                certificate_number: cert.certificate_number || '',
                issue_date: cert.issue_date,
                expiry_date: cert.expiry_date || '', // Will be converted to null on backend
                issuing_authority: cert.issuing_authority,
                issuing_country: cert.issuing_country || '',
                remarks: cert.remarks || '',
            };

            submitData.append(`certificates[${index}]`, JSON.stringify(certData));

            if (cert.file) {
                submitData.append(`certificate_file_${index}`, cert.file);
            }
        });

        // Log FormData for debugging
        console.log('Submitting FormData:');
        for (let pair of submitData.entries()) {
            if (pair[1] instanceof File) {
                console.log(pair[0] + ': File - ' + pair[1].name);
            } else {
                console.log(pair[0] + ': ' + pair[1]);
            }
        }

        // Use router.post
        router.post('/taxpayer/products', submitData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Product and certificates submitted for approval!');
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
                if (typeof errors === 'object') {
                    Object.entries(errors).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach(msg => toast.error(msg));
                        } else if (typeof value === 'string') {
                            toast.error(value);
                        }
                    });
                } else {
                    toast.error('Failed to submit product. Please check all inputs.');
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/taxpayer/products"
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Register New Product</h1>
                            <p className="text-sm text-slate-500">Create a new product and submit required certificates for approval</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Product Details Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                                    Product Details
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            placeholder="e.g. Mineral Water 500ml"
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.data.category_id}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                            required
                                        >
                                            <option value="">-- Select Category --</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                    {category.requires_certificate ? ' (Requires Certificates)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Unit Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Unit Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.data.unit_type}
                                            onChange={(e) => form.setData('unit_type', e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                            required
                                        >
                                            {unitTypes.map((type) => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={form.data.description}
                                            onChange={(e) => form.setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors resize-none"
                                            placeholder="Product description... (optional)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Certificates Section */}
                            {selectedCategory && selectedCategory.requires_certificate && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                                            Required Certificates
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={addCertificate}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Certificate
                                        </button>
                                    </div>

                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-amber-800">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium mb-1">Required Certificates for {selectedCategory.name}:</p>
                                            <ul className="text-sm list-disc list-inside space-y-1">
                                                {selectedCategory.required_certificate_types.map((cert) => (
                                                    <li key={cert.id}>
                                                        <span className="font-medium">{cert.name}</span>
                                                        {cert.specific_requirements && (
                                                            <span className="text-amber-700 text-xs ml-2">({cert.specific_requirements})</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Certificate Forms */}
                                    {certificates.map((cert, index) => (
                                        <div key={cert.temp_id || index} className="border border-slate-200 rounded-xl p-6 space-y-4 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeCertificate(index)}
                                                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>

                                            <h4 className="font-medium text-slate-900 pb-2 border-b border-slate-100">
                                                Certificate #{index + 1}
                                            </h4>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                {/* Certificate Type */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Certificate Type <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={cert.type_id}
                                                        onChange={(e) => updateCertificate(index, 'type_id', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                        required
                                                    >
                                                        <option value="">-- Select Type --</option>
                                                        {selectedCategory.required_certificate_types.map((type) => (
                                                            <option key={type.id} value={type.id}>{type.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Certificate Number */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Certificate Number
                                                    </label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={cert.certificate_number}
                                                            onChange={(e) => updateCertificate(index, 'certificate_number', e.target.value)}
                                                            placeholder="e.g. HC-2024-001"
                                                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Issue Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Issue Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="date"
                                                            value={cert.issue_date}
                                                            onChange={(e) => updateCertificate(index, 'issue_date', e.target.value)}
                                                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Expiry Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Expiry Date
                                                    </label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="date"
                                                            value={cert.expiry_date}
                                                            onChange={(e) => updateCertificate(index, 'expiry_date', e.target.value)}
                                                            min={cert.issue_date}
                                                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Issuing Authority */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Issuing Authority <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={cert.issuing_authority}
                                                            onChange={(e) => updateCertificate(index, 'issuing_authority', e.target.value)}
                                                            placeholder="e.g. Ministry of Health"
                                                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Issuing Country */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Issuing Country
                                                    </label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={cert.issuing_country}
                                                            onChange={(e) => updateCertificate(index, 'issuing_country', e.target.value)}
                                                            placeholder="e.g. Indonesia"
                                                            className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Certificate File */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Certificate File (PDF/Image) <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center transition-colors hover:border-[#003366] hover:bg-slate-50 group cursor-pointer relative">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            required={!cert.file}
                                                        />
                                                        <div className="flex flex-col items-center gap-2">
                                                            {cert.file ? (
                                                                <>
                                                                    <FileText className="w-8 h-8 text-[#003366]" />
                                                                    <p className="font-medium text-slate-900">{cert.file.name}</p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {(cert.file.size / 1024 / 1024).toFixed(2)} MB
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#003366]" />
                                                                    <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                                                                    <p className="text-xs text-slate-500">PDF, PNG or JPG (max. 5MB)</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remarks */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Remarks
                                                    </label>
                                                    <textarea
                                                        value={cert.remarks}
                                                        onChange={(e) => updateCertificate(index, 'remarks', e.target.value)}
                                                        rows={2}
                                                        placeholder="Any additional notes about this certificate..."
                                                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* No certificates added yet */}
                                    {certificates.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                                            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-600 font-medium">No certificates added yet</p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                Click the "Add Certificate" button to add required certificates
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Additional Notes */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
                                    Additional Information
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Notes for Administrator
                                    </label>
                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Any additional notes or special requests for the administrator..."
                                        className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                                <Link
                                    href="/taxpayer/products"
                                    className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white font-medium rounded-lg hover:bg-[#002244] transition-colors shadow-lg shadow-[#003366]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-5 h-5" />
                                    {form.processing ? 'Submitting...' : 'Submit Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}