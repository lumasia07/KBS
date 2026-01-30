import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ShoppingCart, History, FileText, ArrowLeft } from 'lucide-react';
import { Toaster } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ProductGrid, OrderCart, OrderForm } from '@/components/order';
import { useOrderStore } from '@/stores/useOrderStore';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Taxpayer Portal',
        href: '/taxpayer/dashboard',
    },
    {
        title: 'Place Order',
        href: '/taxpayer/order',
    },
];

export default function TaxpayerOrder() {
    const {
        currentStep,
        cartItems,
        cartOpen,
        setCartOpen,
        setStep,
        fetchProducts,
        fetchOrderHistory,
        getCartGrandTotal,
    } = useOrderStore();

    useEffect(() => {
        fetchProducts();
        fetchOrderHistory();
    }, [fetchProducts, fetchOrderHistory]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const isCheckoutFlow = currentStep !== 'products' && currentStep !== 'confirmation';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Place Order - Taxpayer Portal" />
            <Toaster richColors position="top-right" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {isCheckoutFlow && (
                            <Button
                                variant="ghost"
                                onClick={() => setStep('products')}
                                className="text-slate-500 hover:text-slate-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Products
                            </Button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {currentStep === 'products'
                                    ? 'Order Stamps'
                                    : currentStep === 'confirmation'
                                        ? 'Order Complete'
                                        : 'Checkout'}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {currentStep === 'products'
                                    ? 'Browse and add products to your cart'
                                    : currentStep === 'confirmation'
                                        ? 'Your order has been submitted'
                                        : 'Complete your order details'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {currentStep === 'products' && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366]"
                            >
                                <History className="w-4 h-4 mr-2" />
                                Order History
                            </Button>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366]"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                My Documents
                            </Button>
                            <Button
                                onClick={() => setCartOpen(true)}
                                className="bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white relative"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Cart
                                {cartItems.length > 0 && (
                                    <>
                                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                            {cartItems.length}
                                        </span>
                                        <span className="ml-2 hidden sm:inline text-xs opacity-80">
                                            ({formatPrice(getCartGrandTotal())} CDF)
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                {currentStep === 'products' ? (
                    <ProductGrid />
                ) : (
                    <OrderForm />
                )}
            </div>

            {/* Cart Sidebar */}
            <OrderCart />
        </AppLayout>
    );
}
