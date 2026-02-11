import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Package,
    Plus,
    Trash2,
    Edit3,
    Search,
    FileCheck,
    Calendar,
    AlertCircle,
    CheckCircle2,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import { useTaxpayerProductStore, type Product } from '@/stores/taxpayer-product-store';
import AppLayout from '@/layouts/app-layout';

interface Props {
    myProducts: Product[];
}

export default function TaxpayerProductsIndex({ myProducts = [] }: Props) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/taxpayer/dashboard',
        },
        {
            title: 'My Products',
            href: '/taxpayer/products',
        },
    ];

    // Zustand Store
    const { products, setProducts, removeProduct, updateProduct } = useTaxpayerProductStore();

    // Sync props to store
    useEffect(() => {
        setProducts(myProducts);
    }, [myProducts]);

    // Form for editing product
    const editForm = useForm({
        health_certificate_number: '',
        health_certificate_expiry: '',
        notes: '',
        status: 'active',
    });

    const handleEditProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        // Optimistic update could go here, but since it's a modal, waiting for success is safer/better UX
        editForm.patch(`/taxpayer/products/${selectedProduct.id}`, {
            onSuccess: () => {
                toast.success('Product updated successfully!');

                // Update store logic if needed (though Inertia usually reloads props)
                updateProduct(selectedProduct.id, {
                    health_certificate_number: editForm.data.health_certificate_number,
                    health_certificate_expiry: editForm.data.health_certificate_expiry,
                    notes: editForm.data.notes,
                    status: editForm.data.status as any,
                });

                setShowEditModal(false);
                setSelectedProduct(null);
            },
            onError: () => {
                toast.error('Failed to update product');
            }
        });
    };

    const handleRemoveProduct = (productId: number) => {
        if (!confirm('Are you sure you want to remove this product from your catalogue?')) return;

        // Optimistic Update
        removeProduct(productId);
        toast.info('Product removed');

        router.delete(`/taxpayer/products/${productId}`, {
            onSuccess: () => {
                // Success confirms our optimistic update
                toast.success('Product removed permanently');
            },
            onError: () => {
                toast.error('Failed to remove product. Reloading...');
                router.reload();
            }
        });
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        editForm.setData({
            health_certificate_number: product.health_certificate_number || '',
            health_certificate_expiry: product.health_certificate_expiry || '',
            notes: product.notes || '',
            status: product.status || 'active',
        });
        setShowEditModal(true);
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'suspended': return 'bg-amber-100 text-amber-700';
            case 'expired': return 'bg-slate-100 text-slate-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Products" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Product Catalogue</h1>
                        <p className="text-sm text-slate-500">Manage products registered under your enterprise</p>
                    </div>
                    <Link
                        href="/taxpayer/products/create"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-gradient-to-br from-[#003366] to-[#002244] rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Total Products</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Active Products</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/70">Pending Approval</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.status === 'pending').length}</p>
                            </div>
                            <FileCheck className="w-8 h-8 text-white/30" />
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Registered Products</h2>
                    </div>

                    {products.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 mb-2">No products yet</h3>
                            <p className="text-sm text-slate-400 mb-4">Add products to your catalogue to start ordering stamps.</p>
                            <Link
                                href="/taxpayer/products/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Product
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Product</th>
                                        <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Category</th>
                                        <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Certificate</th>
                                        <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Status</th>
                                        <th className="text-left text-sm font-medium text-slate-500 px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                                    <p className="text-xs text-slate-500">{product.code}</p>
                                                    <p className="text-xs text-slate-400 capitalize">{product.unit_type}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                    {(typeof product.category === 'object' && product.category !== null ? String((product.category as any).name || '') : String(product.category || '')) || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.certificate_path ? (
                                                    <a
                                                        href={product.certificate_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-[#003366] hover:underline"
                                                    >
                                                        <FileCheck className="w-4 h-4" />
                                                        <span className="text-xs">View Cert</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No file</span>
                                                )}
                                                {product.health_certificate_number && (
                                                    <p className="text-xs text-slate-500 mt-1">#{product.health_certificate_number}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
                                                        {product.status}
                                                    </span>
                                                    {product.status === 'rejected' && product.rejection_reason && (
                                                        <span className="text-xs text-red-600 max-w-[150px] truncate" title={product.rejection_reason}>
                                                            {product.rejection_reason}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-1.5 text-slate-400 hover:text-[#003366] hover:bg-[#003366]/10 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveProduct(product.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Product Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Edit Product</h3>
                                <p className="text-sm text-slate-500">{selectedProduct.name}</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditProduct} className="p-6 space-y-4">
                            {/* Health Certificate */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Health Certificate #</label>
                                    <input
                                        type="text"
                                        value={editForm.data.health_certificate_number}
                                        onChange={(e) => editForm.setData('health_certificate_number', e.target.value)}
                                        placeholder="HC-12345"
                                        className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={editForm.data.health_certificate_expiry}
                                        onChange={(e) => editForm.setData('health_certificate_expiry', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                                <textarea
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Any additional notes..."
                                    className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-1 px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
