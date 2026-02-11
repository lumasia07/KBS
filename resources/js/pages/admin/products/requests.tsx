import { useState } from 'react';
import { Head, router } from '@inertiajs/react'; // ensure router is imported
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
import {
    Loader2,
    Eye,
    CheckCircle,
    XCircle,
    FileCheck,
    AlertCircle,
    Package
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface ProductRequest {
    id: number;
    taxpayer: {
        id: number;
        company_name: string;
        tin: string;
    };
    product: {
        id: number;
        code: string;
        name: string;
        category: string;
        unit_type: string;
        stamp_price: number | null;
    };
    date: string;
    certificate_path: string | null;
    status: string;
}

interface Props {
    requests: ProductRequest[];
}

export default function AdminProductRequests({ requests = [] }: Props) {
    console.log('AdminProductRequests requests:', requests);
    const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [stampPrice, setStampPrice] = useState<string>('');

    const handleView = (request: ProductRequest) => {
        setSelectedRequest(request);
        setStampPrice(request.product.stamp_price ? String(request.product.stamp_price) : '');
        setDetailsOpen(true);
    };

    const confirmApprove = () => {
        if (!selectedRequest) return;
        setProcessingId(selectedRequest.id);

        router.post(`/admin/products/requests/${selectedRequest.id}/approve`, {
            stamp_price: stampPrice
        }, {
            onSuccess: () => {
                toast.success('Product approved successfully');
                setDetailsOpen(false);
                setProcessingId(null);
            },
            onError: () => {
                toast.error('Failed to approve product');
                setProcessingId(null);
            }
        });
    };

    const confirmReject = () => {
        if (!selectedRequest) return;
        setProcessingId(selectedRequest.id);

        router.patch(`/admin/products/requests/${selectedRequest.id}/reject`, { rejection_reason: rejectionReason }, {
            onSuccess: () => {
                toast.success('Product rejected');
                setRejectOpen(false);
                setDetailsOpen(false);
                setRejectionReason('');
                setProcessingId(null);
            },
            onError: () => {
                toast.error('Failed to reject product');
                setProcessingId(null);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Product Requests', href: '/admin/products/requests' }]}>
            <Head title="Product Requests" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Requests</h1>
                        <p className="text-slate-500 text-sm mt-1">Review and approve new product registrations from taxpayers.</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-600">Taxpayer</TableHead>
                                <TableHead className="font-semibold text-slate-600">Product</TableHead>
                                <TableHead className="font-semibold text-slate-600">Category</TableHead>
                                <TableHead className="font-semibold text-slate-600">Price</TableHead>
                                <TableHead className="font-semibold text-slate-600">Date</TableHead>
                                <TableHead className="font-semibold text-slate-600">Certificate</TableHead>
                                <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No pending product requests.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="font-medium text-slate-900">{req.taxpayer.company_name}</div>
                                            <div className="text-xs text-slate-500">{req.taxpayer.tin}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-slate-900">{req.product.name}</div>
                                            <div className="text-xs text-slate-500">{req.product.code}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal capitalize">
                                                {typeof req.product.category === 'object' && req.product.category !== null ? String((req.product.category as any).name || '') : String(req.product.category || '')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-slate-700">
                                                {Number(req.product.stamp_price).toLocaleString()} CDF
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize">Per {req.product.unit_type}</div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            {req.date}
                                        </TableCell>
                                        <TableCell>
                                            {req.certificate_path ? (
                                                <a
                                                    href={req.certificate_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <FileCheck className="w-4 h-4" /> View
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Missing
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleView(req)}
                                                className="gap-2"
                                            >
                                                Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Details Modal */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="sm:max-w-2xl bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Package className="h-6 w-6 text-blue-600" />
                                Product Approval Request
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Review product details and certificate before approving.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="grid grid-cols-2 gap-6 py-4">
                                <div className="space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Taxpayer Information</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Company Name</p>
                                        <p className="font-medium text-slate-900">{selectedRequest.taxpayer.company_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Tax ID (TIN)</p>
                                        <p className="font-mono text-slate-700">{selectedRequest.taxpayer.tin}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 col-span-2 md:col-span-1">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">Product Details</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Product Name</p>
                                        <p className="font-medium text-slate-900">{selectedRequest.product.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-500">Category</p>
                                        <p className="font-medium text-slate-700 capitalize">
                                            {selectedRequest.product.category && typeof selectedRequest.product.category === 'object'
                                                ? String((selectedRequest.product.category as any).name || 'Uncategorized')
                                                : String(selectedRequest.product.category || 'Uncategorized')}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-500">Unit Type</p>
                                            <p className="font-medium text-slate-700 capitalize">{selectedRequest.product.unit_type}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 pt-2">
                                        <label className="text-sm text-slate-500 block mb-1">Set Stamp Price <span className='text-red-500'>*</span></label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={stampPrice}
                                                onChange={(e) => setStampPrice(e.target.value)}
                                            />
                                            <span className="absolute right-3 top-2.5 text-sm text-slate-500">CDF</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Price per {selectedRequest.product.unit_type} unit.</p>
                                    </div>
                                </div>

                                <div className="space-y-4 col-span-2 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Certificate Document</h3>
                                            <p className="text-sm text-slate-500">Uploaded proof of authorization.</p>
                                        </div>
                                        {selectedRequest.certificate_path ? (
                                            <a
                                                href={selectedRequest.certificate_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                                            >
                                                <FileCheck className="w-4 h-4" />
                                                View Document
                                            </a>
                                        ) : (
                                            <Badge variant="destructive" className="flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Not Uploaded
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={confirmApprove}
                                disabled={!!processingId || !stampPrice}
                            >
                                {processingId === selectedRequest?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                Approve Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogContent className="sm:max-w-md bg-white text-slate-900">
                        <DialogHeader>
                            <DialogTitle>Reject Product Request</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for rejection. This will be visible to the taxpayer.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Rejection Reason</Label>
                                <Textarea
                                    placeholder="e.g. Invalid certificate, Incorrect pricing..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason || !!processingId}>
                                {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Confirm Rejection
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
