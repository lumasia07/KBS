import { useState } from 'react';
import { Package, Plus, Minus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product, PackagingType } from '@/types/order';
import { useOrderStore } from '@/stores/useOrderStore';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

const packagingOptions: { value: PackagingType; label: string }[] = [
    { value: 'roll', label: 'Roll' },
    { value: 'sheet', label: 'Sheet' },
    { value: 'individual', label: 'Individual' },
];

export function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState(100);
    const [packaging, setPackaging] = useState<PackagingType>('roll');
    const addToCart = useOrderStore((state) => state.addToCart);
    const setCartOpen = useOrderStore((state) => state.setCartOpen);

    const handleAddToCart = () => {
        addToCart(product, quantity, packaging);
        setCartOpen(true);
        toast.success(`${product.name} added to cart`, {
            description: `${quantity} ${product.unit_type}(s) at ${product.stamp_price_per_unit} CDF each`,
        });
    };

    const incrementQuantity = () => setQuantity((q) => q + 100);
    const decrementQuantity = () => setQuantity((q) => Math.max(100, q - 100));

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Product Header with Category Badge */}
            <div className="relative bg-gradient-to-br from-[#003366] to-[#002244] p-4">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

                <div className="relative flex items-start justify-between">
                    <div className="bg-white/10 p-3 rounded-xl">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                        {product.category}
                    </Badge>
                </div>

                <div className="relative mt-4">
                    <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    <p className="text-xs text-white/70 mt-1">{product.code}</p>
                </div>
            </div>

            {/* Product Body */}
            <div className="p-4 space-y-4">
                {/* Description */}
                {product.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                )}

                {/* Health Certificate Requirement */}
                {product.requires_health_certificate ? (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">Health Certificate Required</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">No Certificate Required</span>
                    </div>
                )}

                {/* Price Display */}
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-2xl font-bold text-slate-900">
                            {formatPrice(product.stamp_price_per_unit)}
                        </span>
                        <span className="text-sm text-slate-500 ml-1">CDF/{product.unit_type}</span>
                    </div>
                </div>

                {/* Packaging Selection */}
                <div>
                    <label className="text-xs font-medium text-slate-500 mb-2 block">Packaging</label>
                    <div className="flex gap-2">
                        {packagingOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setPackaging(option.value)}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${packaging === option.value
                                        ? 'bg-[#003366] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quantity Selector */}
                <div>
                    <label className="text-xs font-medium text-slate-500 mb-2 block">Quantity</label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={decrementQuantity}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-center">
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center text-lg font-bold text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-[#003366] outline-none py-1"
                            />
                            <span className="text-xs text-slate-400">{product.unit_type}(s)</span>
                        </div>
                        <button
                            onClick={incrementQuantity}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Subtotal */}
                <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Subtotal</span>
                        <span className="text-lg font-bold text-[#003366]">
                            {formatPrice(quantity * product.stamp_price_per_unit)} CDF
                        </span>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white py-3 rounded-xl font-medium transition-all duration-300 group-hover:shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}
