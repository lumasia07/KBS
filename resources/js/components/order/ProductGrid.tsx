import { useEffect } from 'react';
import { Search, Loader2, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from './ProductCard';
import { useOrderStore } from '@/stores/useOrderStore';

export function ProductGrid() {
    const {
        productsLoading,
        selectedCategory,
        searchQuery,
        fetchProducts,
        setCategory,
        setSearchQuery,
        getFilteredProducts,
        getCategories,
    } = useOrderStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = getFilteredProducts();
    const categories = getCategories();

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search products by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 py-3 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === null
                            ? 'bg-[#003366] text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-[#003366] hover:text-[#003366]'
                        }`}
                >
                    All Products
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                ? 'bg-[#003366] text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#003366] hover:text-[#003366]'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 text-[#003366] animate-spin mb-4" />
                    <p className="text-slate-500">Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Package className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Found</h3>
                    <p className="text-slate-500 text-sm">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'No products available in this category'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Results Summary */}
            {!productsLoading && filteredProducts.length > 0 && (
                <div className="text-center text-sm text-slate-500">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    {selectedCategory && ` in ${selectedCategory}`}
                </div>
            )}
        </div>
    );
}
