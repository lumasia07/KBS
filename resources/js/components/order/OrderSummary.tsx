import { useOrderStore } from '@/stores/useOrderStore';

export function OrderSummary() {
    const { cartItems, getCartTotal, getCartTax, getCartGrandTotal, requiresHealthCertificate } =
        useOrderStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#0052A3] p-4">
                <h3 className="text-lg font-bold text-white">Order Summary</h3>
            </div>

            {/* Items List */}
            <div className="p-4 space-y-3">
                {cartItems.map((item) => (
                    <div
                        key={item.product.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                                {item.product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {item.quantity} × {formatPrice(item.unit_price)} CDF
                            </p>
                        </div>
                        <span className="font-semibold text-slate-900 ml-4">
                            {formatPrice(item.subtotal)} CDF
                        </span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="p-4 bg-slate-50 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-900">
                        {formatPrice(getCartTotal())} CDF
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (16% VAT)</span>
                    <span className="font-medium text-slate-900">
                        {formatPrice(getCartTax())} CDF
                    </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200">
                    <span className="text-slate-900">Grand Total</span>
                    <span className="text-[#003366]">{formatPrice(getCartGrandTotal())} CDF</span>
                </div>
            </div>

            {/* Health Certificate Notice */}
            {requiresHealthCertificate() && (
                <div className="p-4 bg-amber-50 border-t border-amber-100">
                    <p className="text-sm text-amber-800">
                        <span className="font-semibold">Note:</span> One or more products in your
                        order require a valid health certificate.
                    </p>
                </div>
            )}
        </div>
    );
}
