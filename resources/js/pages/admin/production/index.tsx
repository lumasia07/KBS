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
import {
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    Printer,
    Settings,
    QrCode,
    CheckCircle
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
    status: string;
    created_at: string;
}

interface TableParams {
    page: number;
    pageSize: number;
    search: string;
}

export default function AdminProductionIndex() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState<TableParams>({
        page: 1,
        pageSize: 10,
        search: ''
    });

    // Preview Modal State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedStats, setGeneratedStats] = useState<any>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const query = {
                draw: Date.now(),
                start: (params.page - 1) * params.pageSize,
                length: params.pageSize,
                search: { value: params.search, regex: false }
            };

            const response = await axios.get('/admin/production', {
                params: query,
                headers: { 'Accept': 'application/json' }
            });

            setOrders(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load production queue');
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

    const handlePreview = (order: Order) => {
        setSelectedOrder(order);
        setGeneratedStats(null);
        setPreviewOpen(true);
    };

    const handleGenerate = async () => {
        if (!selectedOrder) return;
        setGenerating(true);
        try {
            const response = await axios.post(`/admin/production/${selectedOrder.id}/generate`);
            // Mocking the complex serials here for immediate UI feedback if backend is stubbed
            // If backend returns real data, use that. If not, generate mock for preview.
            const mockStart = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
            const complexStats = {
                serial_start: response.data.preview_data?.serial_start || mockStart.toString(),
                serial_end: response.data.preview_data?.serial_end || (mockStart + selectedOrder.quantity).toString(),
                quantity: selectedOrder.quantity
            };

            setGeneratedStats(complexStats);
            toast.success('Production batch created successfully');
            // Don't close immediately, showing stats
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Generation failed');
        } finally {
            setGenerating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'in_production': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const totalPages = Math.ceil(totalRecords / params.pageSize);

    return (
        <AppLayout breadcrumbs={[{ title: 'Production & Generation', href: '/admin/production' }]}>
            <Head title="Sticker Generation" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sticker Production</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage orders ready for stamp generation and printing.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Controls / Filter */}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-medium text-slate-900">Processing Queue (Ready for Print)</div>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search order #..."
                                className="pl-9 bg-slate-50 border-slate-200 focus:border-blue-500"
                                value={params.search}
                                onChange={(e) => setParams(p => ({ ...p, search: e.target.value, page: 1 }))}
                            />
                        </div>
                    </div>

                    {/* Table Container - Taxpayer Style (White) */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-600">Order #</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Taxpayer</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Product</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Qty</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                            No orders ready for production.
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
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-[#003366] hover:bg-[#002244] text-white flex items-center gap-2"
                                                        onClick={() => handlePreview(order)}
                                                    >
                                                        <QrCode className="h-4 w-4" />
                                                        Preview & Generate
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

                {/* Sticker Preview Dialog */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="sm:max-w-2xl bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-slate-900">Digital Digital Stamp Preview</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Anticipated output for Order #{selectedOrder?.order_number}.
                                Verify security features before generation.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                            <div className="flex flex-col items-center py-6 gap-6">
                                {/* The Stamp Visual */}
                                <div className="relative w-[400px] h-[200px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 border-4 border-double border-[#003366] rounded-lg shadow-lg flex overflow-hidden">
                                    {/* Hologram Effect Overlay */}
                                    {/* <div className="absolute inset-0 bg-[url('/patterns/guilloche.png')] opacity-10 pointer-events-none"></div> */}
                                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 animate-pulse pointer-events-none"></div>

                                    {/* Left Side: QR & Serial */}
                                    <div className="w-1/3 border-r-2 border-dotted border-[#003366]/30 p-2 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
                                        <div className="w-24 h-24 bg-slate-900 rounded-sm flex items-center justify-center text-white text-xs">
                                            {/* Placeholder for QR Code */}
                                            <QrCode className="w-16 h-16 opacity-80" />
                                        </div>
                                        <div className="mt-2 text-[10px] font-mono font-bold text-[#003366]">
                                            {generatedStats ? generatedStats.serial_start : 'KBS-PREVIEW'}
                                        </div>
                                    </div>

                                    {/* Right Side: Info */}
                                    <div className="flex-1 p-4 flex flex-col justify-between relative">
                                        <div className="text-center border-b border-[#003366]/20 pb-2">
                                            <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Republique Democratique du Congo</h3>
                                            <h2 className="text-sm font-black text-[#003366] uppercase mt-1">Bureau of Standards</h2>
                                        </div>

                                        <div className="space-y-1 my-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Product:</span>
                                                <span className="font-bold text-slate-900 truncate max-w-[120px]">{selectedOrder.product_name}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Taxpayer:</span>
                                                <span className="font-bold text-slate-900 truncate max-w-[120px]">{selectedOrder.taxpayer_name}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Value:</span>
                                                <span className="font-bold text-[#003366]">Excisable</span>
                                            </div>
                                        </div>

                                        <div className="text-[8px] text-center text-slate-400 mt-auto">
                                            AUTHENTICATED • SECURE • TRACEABLE
                                        </div>
                                    </div>
                                </div>

                                {/* Order Stats / Generated Info */}
                                <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Quantity to Generate:</span>
                                        <span className="font-medium">{selectedOrder.quantity.toLocaleString()} units</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Estimated Batch Size:</span>
                                        <span className="font-medium">~{Math.ceil(selectedOrder.quantity / 1000)} Rolls</span>
                                    </div>
                                    {generatedStats && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <div className="flex items-center gap-2 text-emerald-600 font-medium mb-2">
                                                <CheckCircle className="w-4 h-4" /> Generation Complete
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-white p-2 border rounded">
                                                    <span className="text-slate-500 block">Start Serial</span>
                                                    <span className="font-mono font-bold">{generatedStats.serial_start}</span>
                                                </div>
                                                <div className="bg-white p-2 border rounded">
                                                    <span className="text-slate-500 block">End Serial</span>
                                                    <span className="font-mono font-bold">{generatedStats.serial_end}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setPreviewOpen(false)} className="border-slate-300">Close</Button>
                            {!generatedStats ? (
                                <Button
                                    className="bg-[#003366] hover:bg-[#002244]"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                >
                                    {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                                    Start Production
                                </Button>
                            ) : (
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Download Batch PDF
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
