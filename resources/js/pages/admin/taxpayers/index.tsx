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
    Eye,
    CheckCircle,
    XCircle,
    Building2
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
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { toast } from 'sonner';

interface Taxpayer {
    id: string;
    tax_identification_number: string;
    company_name: string;
    email: string;
    phone_number: string;
    registration_status: string;
    sector_name: string;
    created_at: string;
    // Full details
    trade_register_number: string;
    physical_address: string;
    legal_representative_name: string;
    legal_representative_phone: string;
}

interface TableParams {
    page: number;
    pageSize: number;
    search: string;
}

export default function AdminTaxpayersIndex() {
    const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState<TableParams>({
        page: 1,
        pageSize: 10,
        search: ''
    });

    // Modal States
    const [selectedTaxpayer, setSelectedTaxpayer] = useState<Taxpayer | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchTaxpayers = async () => {
        setLoading(true);
        try {
            const query = {
                draw: Date.now(),
                start: (params.page - 1) * params.pageSize,
                length: params.pageSize,
                search: { value: params.search, regex: false }
            };

            const response = await axios.get('/admin/taxpayers', {
                params: query,
                headers: { 'Accept': 'application/json' }
            });

            setTaxpayers(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch taxpayers', error);
            toast.error('Failed to load taxpayers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTaxpayers();
        }, 300);
        return () => clearTimeout(timeout);
    }, [params.page, params.search]);

    const handleView = (taxpayer: Taxpayer) => {
        setSelectedTaxpayer(taxpayer);
        setDetailsOpen(true);
    };

    const confirmApprove = async () => {
        if (!selectedTaxpayer) return;
        setProcessingId(selectedTaxpayer.id);
        try {
            await axios.post(`/admin/taxpayers/${selectedTaxpayer.id}/approve`);
            toast.success('Taxpayer approved successfully');
            fetchTaxpayers();
            setDetailsOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve taxpayer');
        } finally {
            setProcessingId(null);
        }
    };

    const confirmReject = async () => {
        if (!selectedTaxpayer) return;
        setProcessingId(selectedTaxpayer.id);
        try {
            await axios.post(`/admin/taxpayers/${selectedTaxpayer.id}/reject`, { reason: rejectionReason });
            toast.success('Taxpayer rejected successfully');
            fetchTaxpayers();
            setRejectOpen(false);
            setDetailsOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject taxpayer');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const totalPages = Math.ceil(totalRecords / params.pageSize);

    return (
        <AppLayout breadcrumbs={[{ title: 'Taxpayers', href: '/admin/taxpayers' }]}>
            <Head title="Taxpayer Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Taxpayers</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage registered companies and approval status.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-medium text-slate-900">Registered Companies</div>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search Name, TIN..."
                                className="pl-9 bg-slate-50 border-slate-200 focus:border-blue-500"
                                value={params.search}
                                onChange={(e) => setParams(p => ({ ...p, search: e.target.value, page: 1 }))}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-600">Company</TableHead>
                                    <TableHead className="font-semibold text-slate-600">TIN</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Sector</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : taxpayers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                            No taxpayers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    taxpayers.map((tp) => (
                                        <TableRow key={tp.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-medium text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                        <Building2 className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{tp.company_name}</div>
                                                        <div className="text-xs text-slate-500">{tp.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600 font-mono">{tp.tax_identification_number}</TableCell>
                                            <TableCell className="text-slate-600">{tp.sector_name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(tp.registration_status)} font-medium`}>
                                                    {tp.registration_status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleView(tp)} className="h-8 w-8 text-slate-500 hover:text-blue-600">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
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
                                    <Button variant="outline" size="sm" onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))} disabled={params.page === 1 || loading}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))} disabled={params.page >= totalPages || loading}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="sm:max-w-3xl bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-blue-600" />
                                {selectedTaxpayer?.company_name}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Registration Details & Validation Status
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTaxpayer && (
                            <div className="grid grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Company Information</h3>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">Tax ID (TIN)</span>
                                            <span className="font-mono font-medium">{selectedTaxpayer.tax_identification_number}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">RCCM Number</span>
                                            <span className="font-medium">{selectedTaxpayer.trade_register_number}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">Business Sector</span>
                                            <span className="font-medium">{selectedTaxpayer.sector_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Contact & Rep</h3>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">Address</span>
                                            <span className="font-medium">{selectedTaxpayer.physical_address}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">Email / Phone</span>
                                            <span className="font-medium">{selectedTaxpayer.email} • {selectedTaxpayer.phone_number}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">Legal Representative</span>
                                            <span className="font-medium">{selectedTaxpayer.legal_representative_name} ({selectedTaxpayer.legal_representative_phone})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>

                            {selectedTaxpayer?.registration_status === 'pending' && (
                                <>
                                    <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={confirmApprove}
                                        disabled={!!processingId}
                                    >
                                        {processingId === selectedTaxpayer?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        Approve Registration
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogContent className="sm:max-w-md bg-white text-slate-900">
                        <DialogHeader>
                            <DialogTitle>Reject Registration</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for rejecting this taxpayer application.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Rejection Reason</Label>
                                <Textarea
                                    placeholder="e.g. Invalid RCCM document..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason}>
                                Confirm Reject
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
