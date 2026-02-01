import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Eye,
    AlertTriangle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from 'sonner';

interface Order {
    id: number;
    order_number: string;
    taxpayer_name: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    tax_amount: number;
    grand_total: number;
    status: string;
    payment_method: string;
    delivery_method: string;
    delivery_address: string;
    created_at: string;
    packaging_type: string;
    updated_at: string;
    rejection_reason?: string;
}

interface TableParams {
    page: number;
    pageSize: number;
    search: string;
}

export default function AdminOrderIndex() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState<TableParams>({
        page: 1,
        pageSize: 10,
        search: ''
    });
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Modal States
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const query = {
                draw: Date.now(),
                start: (params.page - 1) * params.pageSize,
                length: params.pageSize,
                search: { value: params.search, regex: false }
            };

            const response = await axios.get('/admin/orders', {
                params: query,
                headers: { 'Accept': 'application/json' }
            });

            setOrders(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(timeout);
    }, [params.page, params.search]);

    const handleApproveClick = (order: Order) => {
        setSelectedOrder(order);
        setApproveOpen(true);
    };

    const confirmApprove = async () => {
        if (!selectedOrder) return;
        setProcessingId(selectedOrder.id);
        try {
            await axios.post(`/admin/orders/${selectedOrder.id}/approve`);
            toast.success('Order approved successfully');
            fetchOrders();
            setApproveOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve order');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectClick = (order: Order) => {
        setSelectedOrder(order);
        setRejectionReason('');
        setRejectOpen(true);
    };

    const confirmReject = async () => {
        if (!selectedOrder) return;
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setProcessingId(selectedOrder.id);
        try {
            await axios.post(`/admin/orders/${selectedOrder.id}/reject`, { reason: rejectionReason });
            toast.success('Order rejected successfully');
            fetchOrders();
            setRejectOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject order');
        } finally {
            setProcessingId(null);
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setDetailsOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'submitted':
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'cancelled':
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const totalPages = Math.ceil(totalRecords / params.pageSize);

    return (
        <AppLayout breadcrumbs={[{ title: 'Order Management', href: '/admin/orders' }]}>
            <Head title="Manage Orders" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Management</h1>
                </div>

                <div className="space-y-4">
                    {/* Controls / Filter */}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-medium text-slate-900">All Stamp Orders</div>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search taxpayer, order #..."
                                className="pl-9 bg-slate-50 border-slate-200 focus:border-blue-500"
                                value={params.search}
                                onChange={(e) => setParams(p => ({ ...p, search: e.target.value, page: 1 }))}
                            />
                        </div>
                    </div>

                    {/* Table Container - Explicit White Background */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-600">Order #</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Taxpayer</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Product</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Qty</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-medium text-slate-700">{order.order_number}</TableCell>
                                            <TableCell className="text-slate-600">{order.taxpayer_name}</TableCell>
                                            <TableCell className="text-slate-600">{order.product_name}</TableCell>
                                            <TableCell className="text-slate-600">{order.quantity.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(order.status)} font-medium`}>
                                                    {order.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm">{order.created_at}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(order.status === 'submitted' || order.status === 'pending') && (
                                                        <>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                                                                onClick={() => handleApproveClick(order)}
                                                                disabled={processingId === order.id}
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                                                                onClick={() => handleRejectClick(order)}
                                                                disabled={processingId === order.id}
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalRecords > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-slate-100">
                                <div className="text-sm text-slate-500">
                                    Showing {Math.min(((params.page - 1) * params.pageSize) + 1, totalRecords)} to {Math.min(params.page * params.pageSize, totalRecords)} of {totalRecords} entries
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
                                        disabled={params.page === 1 || loading}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
                                        disabled={params.page >= totalPages || loading}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Details Dialog */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="sm:max-w-xl bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-slate-900">Order Details</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Review complete information for Order #{selectedOrder?.order_number}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-500">Taxpayer</Label>
                                        <div className="font-medium text-slate-900">{selectedOrder.taxpayer_name}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Status</Label>
                                        <div>
                                            <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                                                {selectedOrder.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Product</Label>
                                        <div className="font-medium text-slate-900">{selectedOrder.product_name}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Packaging</Label>
                                        <div className="capitalize text-slate-900">{selectedOrder.packaging_type}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Quantity</Label>
                                        <div className="text-slate-900">{selectedOrder.quantity.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Grand Total</Label>
                                        <div className="font-bold text-lg text-slate-900">
                                            {new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF' }).format(selectedOrder.grand_total)}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-500">Delivery Address</Label>
                                        <div className="text-slate-900">{selectedOrder.delivery_method === 'pickup' ? 'Store Pickup' : selectedOrder.delivery_address}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Payment Method</Label>
                                        <div className="capitalize text-slate-900">{selectedOrder.payment_method?.replace('_', ' ')}</div>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500">Date Placed</Label>
                                        <div className="text-slate-900">{selectedOrder.created_at}</div>
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
                            <Button variant="outline" onClick={() => setDetailsOpen(false)} className="text-slate-700 border-slate-300 hover:bg-slate-50">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Approve Confirmation Dialog */}
                <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
                    <DialogContent className="bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-slate-900">Approve Order</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Are you sure you want to approve Order <b>{selectedOrder?.order_number}</b>?
                                This will move the order to Processing status.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setApproveOpen(false)} className="text-slate-700 border-slate-300 hover:bg-slate-50">Cancel</Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                onClick={confirmApprove}
                                disabled={!!processingId}
                            >
                                {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                Confirm Approval
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogContent className="bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-red-600 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Reject Order
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                You are about to reject Order <b>{selectedOrder?.order_number}</b>.
                                Please provide a reason for the taxpayer.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="reason" className="mb-2 block text-slate-700">Rejection Reason</Label>
                            <textarea
                                id="reason"
                                className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900"
                                placeholder="e.g., Invalid Import Declaration document..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRejectOpen(false)} className="text-slate-700 border-slate-300 hover:bg-slate-50">Cancel</Button>
                            <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white border-0"
                                onClick={confirmReject}
                                disabled={!!processingId}
                            >
                                {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                Reject Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
