import { CheckCircle, Package, Download, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/useOrderStore';

export function OrderConfirmation() {
    const { submittedOrder, resetOrder, getCartGrandTotal } = useOrderStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!submittedOrder) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Submitted!</h1>
                <p className="text-slate-500">
                    Your order has been successfully submitted for processing.
                </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                {/* Order Number Header */}
                <div className="bg-gradient-to-r from-[#003366] to-[#0052A3] p-6 text-center">
                    <p className="text-sm text-white/70 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-white tracking-wider">
                        {submittedOrder.order_number}
                    </p>
                </div>

                {/* Order Info */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Status</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                <Package className="w-4 h-4" />
                                Pending Verification
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Submitted On</p>
                            <p className="font-medium text-slate-900">
                                {formatDate(submittedOrder.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Delivery Method</p>
                            <p className="font-medium text-slate-900 capitalize">
                                {submittedOrder.delivery_method}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                            <p className="text-xl font-bold text-[#003366]">
                                {formatPrice(submittedOrder.grand_total)} CDF
                            </p>
                        </div>
                    </div>

                    {submittedOrder.delivery_address && (
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Delivery Address</p>
                            <p className="font-medium text-slate-900">
                                {submittedOrder.delivery_address}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#003366]" />
                    What Happens Next?
                </h3>
                <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#003366] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                            1
                        </span>
                        <div>
                            <p className="font-medium text-slate-900">Verification</p>
                            <p className="text-sm text-slate-500">
                                Our team will verify your order and documents
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#003366] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                            2
                        </span>
                        <div>
                            <p className="font-medium text-slate-900">Payment</p>
                            <p className="text-sm text-slate-500">
                                Complete payment via your selected method
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#003366] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                            3
                        </span>
                        <div>
                            <p className="font-medium text-slate-900">Delivery/Pickup</p>
                            <p className="text-sm text-slate-500">
                                Receive your stamps at your chosen location
                            </p>
                        </div>
                    </li>
                </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                </Button>
                <Button
                    onClick={resetOrder}
                    className="flex-1 bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Place Another Order
                </Button>
            </div>

            {/* Contact Support */}
            <p className="text-center text-sm text-slate-500 mt-6">
                Questions about your order?{' '}
                <a href="#" className="text-[#003366] hover:underline font-medium">
                    Contact Support
                </a>
            </p>
        </div>
    );
}
