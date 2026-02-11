import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    Save,
    Upload,
    FileText,
    AlertCircle
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

interface Props {
    categories: Record<string, string>; // id => name
    availableProducts: any[]; // Kept for compatibility but likely unused now
}

export default function TaxpayerProductsCreate({ categories = {} }: Props) {

    const form = useForm({
        name: '',
        category_id: '',
        unit_type: 'unit',
        description: '',
        certificate: null as File | null,
        health_certificate_number: '',
        health_certificate_expiry: '',
        notes: '',
    });

    const unitTypes = [
        { value: 'unit', label: 'Unit (Piece)' },
        { value: 'pack', label: 'Pack' },
        { value: 'carton', label: 'Carton' },
        { value: 'liter', label: 'Liter' },
        { value: 'kilogram', label: 'Kilogram' },
        { value: 'other', label: 'Other' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.category_id) {
            toast.error('Please select a product category');
            return;
        }

        if (!form.data.certificate) {
            toast.error('Please upload a product certificate');
            return;
        }

        form.post('/taxpayer/products', {
            forceFormData: true, // Important for file upload
            onSuccess: () => {
                toast.success('Product submitted for approval!');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to submit product. Please check the inputs.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="max-w-3xl mx-auto w-full">
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
                            <p className="text-sm text-slate-500">Create a new product and submit it for approval</p>
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
                                            onChange={(e) => form.setData('category_id', e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                            required
                                        >
                                            <option value="">-- Select Category --</option>
                                            {Object.entries(categories).map(([id, name]) => (
                                                <option key={id} value={id}>{name}</option>
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

                            {/* Documents Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                                    Documentation & Certificates
                                </h3>

                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-800">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                        Please upload the official product certificate or health authorization document. This is required for approval.
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Certificate File Upload */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Product Certificate (PDF/Image) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center transition-colors hover:border-[#003366] hover:bg-slate-50 group cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => form.setData('certificate', e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                required
                                            />
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
                                                    <Upload className="w-6 h-6 text-slate-500 group-hover:text-[#003366]" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-slate-900">
                                                        {form.data.certificate ? form.data.certificate.name : 'Click to upload or drag and drop'}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        PDF, PNG or JPG (max. 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {form.errors.certificate && (
                                            <p className="mt-2 text-sm text-red-600">{form.errors.certificate}</p>
                                        )}
                                    </div>

                                    {/* Certificate Details */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Certificate Number
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.health_certificate_number}
                                            onChange={(e) => form.setData('health_certificate_number', e.target.value)}
                                            placeholder="e.g. HC-2024-001"
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.health_certificate_expiry}
                                            onChange={(e) => form.setData('health_certificate_expiry', e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            value={form.data.notes}
                                            onChange={(e) => form.setData('notes', e.target.value)}
                                            rows={2}
                                            placeholder="Any additional notes..."
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors resize-none"
                                        />
                                    </div>
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
