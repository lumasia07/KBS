import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/stores/useOrderStore';

export function OrderCart() {
    const {
        cartItems,
        cartOpen,
        setCartOpen,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartTax,
        getCartGrandTotal,
        setStep,
    } = useOrderStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleProceedToCheckout = () => {
        setCartOpen(false);
        setStep('review');
    };

    if (!cartOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={() => setCartOpen(false)}
            />

            {/* Cart Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-[#003366] to-[#0052A3]">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                        <div>
                            <h2 className="text-lg font-bold text-white">Your Cart</h2>
                            <p className="text-sm text-white/70">
                                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Add some products to get started
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setCartOpen(false)}
                                className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
                            >
                                Browse Products
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.product.id}
                                className="bg-slate-50 rounded-xl p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {item.product.code} • {item.packaging_type}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(
                                                    item.product.id,
                                                    item.quantity - 100
                                                )
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366] transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-16 text-center font-medium text-slate-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateCartQuantity(
                                                    item.product.id,
                                                    item.quantity + 100
                                                )
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-[#003366] hover:text-[#003366] transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">
                                            {formatPrice(item.unit_price)} CDF × {item.quantity}
                                        </p>
                                        <p className="font-bold text-[#003366]">
                                            {formatPrice(item.subtotal)} CDF
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer with Totals */}
                {cartItems.length > 0 && (
                    <div className="border-t border-slate-200 p-6 space-y-4 bg-slate-50">
                        {/* Totals */}
                        <div className="space-y-2">
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
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                                <span className="text-slate-900">Grand Total</span>
                                <span className="text-[#003366]">
                                    {formatPrice(getCartGrandTotal())} CDF
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={handleProceedToCheckout}
                                className="w-full bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white py-3 rounded-xl font-medium"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <button
                                onClick={clearCart}
                                className="w-full py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
