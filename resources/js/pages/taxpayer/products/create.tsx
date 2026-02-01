import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    Save
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

interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    unit_type: string;
    requires_health_certificate: boolean;
}

interface Props {
    availableProducts: Product[];
}

export default function TaxpayerProductsCreate({ availableProducts = [] }: Props) {
    const [selectedCategory, setSelectedCategory] = useState('');

    // Extract unique categories from available products
    const categories = Array.from(new Set(availableProducts.map(p => p.category))).sort();

    // Filter products based on selected category
    const filteredProducts = availableProducts.filter(p => {
        return selectedCategory ? p.category === selectedCategory : true;
    });

    const form = useForm({
        product_id: '',
        health_certificate_number: '',
        health_certificate_expiry: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!selectedCategory) {
            toast.error('Please select a product category');
            return;
        }

        if (!form.data.product_id) {
            toast.error('Please select a product');
            return;
        }

        form.post('/taxpayer/products', {
            onSuccess: () => {
                toast.success('Product added successfully! Redirecting...');
                setTimeout(() => {
                    router.visit('/taxpayer/products');
                }, 1500);
            },
            onError: () => {
                toast.error('Failed to add product. Please check the inputs.');
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
                            <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
                            <p className="text-sm text-slate-500">Register a new product to your catalogue</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Product Selection Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                                    1. Product Details
                                </h3>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                form.setData('product_id', ''); // Reset product on category change
                                            }}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                        >
                                            <option value="">-- Select a Category --</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat} className="capitalize">{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Product */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Product <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.data.product_id}
                                            onChange={(e) => form.setData('product_id', e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors disabled:bg-slate-100 disabled:text-slate-400"
                                            required
                                            disabled={!selectedCategory}
                                        >
                                            <option value="">
                                                {selectedCategory ? 'select a product...' : 'Select a category first...'}
                                            </option>
                                            {filteredProducts.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} ({product.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                                    2. Authorization (Optional)
                                </h3>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#003366] mt-0.5" />
                                        <p className="text-sm text-slate-600">
                                            If this product requires a health certificate or specific authorization, please enter the details below. Otherwise, you can leave these fields blank.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Health Certificate Number
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
                                            Certificate Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.health_certificate_expiry}
                                            onChange={(e) => form.setData('health_certificate_expiry', e.target.value)}
                                            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Internal Notes
                                    </label>
                                    <textarea
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                        rows={4}
                                        placeholder="Add any internal reference notes for this product..."
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
                                    {form.processing ? 'Adding to Catalogue...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
