import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ShoppingCart, History, FileText, ArrowLeft } from 'lucide-react';
import { Toaster } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ProductGrid, OrderCart, OrderForm, OrderHistory } from '@/components/order';
import { useOrderStore } from '@/stores/useOrderStore';
import { useI18nStore } from '@/stores/useI18nStore';
import type { BreadcrumbItem } from '@/types';

export default function TaxpayerOrder() {
    const { t, language } = useI18nStore();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('taxpayer.portalName'),
            href: '/taxpayer/dashboard',
        },
        {
            title: t('taxpayer.sidebar.myOrders'),
            href: '/taxpayer/order',
        },
    ];

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

    const [view, setView] = useState<'create' | 'history'>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('view') === 'history' ? 'history' : 'create';
        }
        return 'create';
    });

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
            <Head title={t('taxpayer.orders.title')} />
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
                                {t('taxpayer.orders.orderForm.back')}
                            </Button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {currentStep === 'products'
                                    ? t('taxpayer.orders.title')
                                    : currentStep === 'confirmation'
                                        ? t('taxpayer.orders.confirmationTitle')
                                        : t('taxpayer.orders.checkoutTitle')}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {currentStep === 'products'
                                    ? t('taxpayer.orders.subtitle')
                                    : currentStep === 'confirmation'
                                        ? t('taxpayer.orders.confirmationSubtitle')
                                        : t('taxpayer.orders.checkoutSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {currentStep === 'products' && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant={view === 'history' ? 'default' : 'outline'}
                                className={view === 'history' ? "bg-[#003366] text-white hover:bg-[#002244]" : "border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366]"}
                                onClick={() => setView('history')}
                            >
                                <History className="w-4 h-4 mr-2" />
                                {t('taxpayer.orders.orderHistory')}
                            </Button>
                            <Button
                                variant={view === 'create' ? 'default' : 'outline'}
                                className={view === 'create' ? "bg-[#003366] text-white hover:bg-[#002244]" : "border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366]"}
                                onClick={() => setView('create')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                {t('taxpayer.orders.newOrder')}
                            </Button>
                            <Button
                                onClick={() => setCartOpen(true)}
                                className="bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white relative"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {t('taxpayer.orders.cart.button')}
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
                {view === 'history' ? (
                    <OrderHistory />
                ) : (
                    currentStep === 'products' ? (
                        <ProductGrid />
                    ) : (
                        <OrderForm />
                    )
                )}
            </div>

            {/* Cart Sidebar */}
            <OrderCart />
        </AppLayout>
    );
}
