import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOrderStore } from '@/stores/useOrderStore';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function OrderHistory() {
    const {
        orderHistory,
        ordersLoading,
        fetchOrderHistory,
        tableParams,
        setTableParam,
        totalRecords
    } = useOrderStore();

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchOrderHistory();
    }, [fetchOrderHistory]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleViewDetails = (order: any) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200';
            case 'pending':
            case 'submitted':
                return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
            default:
                return 'bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200';
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTableParam('search', e.target.value);
        setTableParam('page', 1);
    };

    const totalPages = Math.ceil(totalRecords / tableParams.pageSize);

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm flex-1">
                    <Loader2 className={`absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 ${ordersLoading ? 'animate-spin' : 'hidden'}`} />
                    {!ordersLoading && <div className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500">🔍</div>}
                    <input
                        type="text"
                        placeholder="Search by order number or product..."
                        className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-4 text-sm outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]"
                        value={tableParams.search}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Number</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    {ordersLoading ? 'Loading...' : 'No orders found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            orderHistory.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-slate-900">
                                        {order.order_number}
                                    </TableCell>
                                    <TableCell>
                                        {order.product?.name || (order as any).product_name || 'Unknown Product'}
                                    </TableCell>
                                    <TableCell>{order.quantity.toLocaleString()}</TableCell>
                                    <TableCell>{formatCurrency(order.grand_total)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {order.created_at}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-[#003366]"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination footer */}
            {totalRecords > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing {Math.min(((tableParams.page - 1) * tableParams.pageSize) + 1, totalRecords)} to {Math.min(tableParams.page * tableParams.pageSize, totalRecords)} of {totalRecords} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTableParam('page', tableParams.page - 1)}
                            disabled={tableParams.page === 1 || ordersLoading}
                        >
                            <span className="sr-only">Previous</span>
                            &larr;
                        </Button>
                        <div className="text-sm font-medium">
                            Page {tableParams.page} of {Math.max(1, totalPages)}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTableParam('page', tableParams.page + 1)}
                            disabled={tableParams.page >= totalPages || ordersLoading}
                        >
                            <span className="sr-only">Next</span>
                            &rarr;
                        </Button>
                    </div>
                </div>
            )}

            {/* View Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Review complete information for Order #{selectedOrder?.order_number}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-500">Product</Label>
                                    <div className="font-medium">{selectedOrder.product?.name || selectedOrder.product_name}</div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                                        {selectedOrder.status.toUpperCase().replace('_', ' ')}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Packaging</Label>
                                    <div className="capitalize">{selectedOrder.packaging_type}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Quantity</Label>
                                    <div>{selectedOrder.quantity.toLocaleString()}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Grand Total</Label>
                                    <div className="font-bold text-lg">
                                        {formatCurrency(selectedOrder.grand_total)}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-slate-500">Delivery Address</Label>
                                    <div>{selectedOrder.delivery_method === 'pickup' ? 'Store Pickup' : selectedOrder.delivery_address}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Payment Method</Label>
                                    <div className="capitalize">{selectedOrder.payment_method?.replace('_', ' ')}</div>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Date Placed</Label>
                                    <div>{selectedOrder.created_at}</div>
                                </div>
                                {selectedOrder.rejection_reason && (
                                    <div className="col-span-2 bg-red-50 p-3 rounded-md border border-red-100">
                                        <Label className="text-red-600 font-semibold mb-1 block">Rejection Reason</Label>
                                        <div className="text-red-700 text-sm">{selectedOrder.rejection_reason}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
