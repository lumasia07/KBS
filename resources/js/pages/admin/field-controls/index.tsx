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
    ShieldCheck,
    MapPin,
    Calendar,
    Users,
    AlertTriangle,
    ClipboardCheck
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
import { useI18nStore } from '@/stores/useI18nStore';

interface FieldControl {
    id: string;
    control_number: string;
    agent_name: string;
    taxpayer_name: string;
    business_name: string;
    location: string;
    location_address: string;
    control_date: string;
    control_type: string;
    status: string;
    total_items_checked: number;
    compliant_items: number;
    non_compliant_items: number;
    counterfeit_items: number;
    compliance_rate: string;
    observations: string;
    recommendations: string;
    offence_declared: boolean;
    offence_description: string;
    proposed_fine: number;
}

interface Stats {
    total: number;
    completed: number;
    in_progress: number;
    requires_followup: number;
    today: number;
    this_month: number;
}

interface Props {
    stats: Stats;
}

interface TableParams {
    page: number;
    pageSize: number;
    search: string;
}

export default function AdminFieldControlsIndex({ stats = { total: 0, completed: 0, in_progress: 0, requires_followup: 0, today: 0, this_month: 0 } }: Props) {
    const { t } = useI18nStore();
    const [controls, setControls] = useState<FieldControl[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [params, setParams] = useState<TableParams>({
        page: 1,
        pageSize: 10,
        search: ''
    });

    // Modal States
    const [selectedControl, setSelectedControl] = useState<FieldControl | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchControls = async () => {
        setLoading(true);
        try {
            const query = {
                draw: Date.now(),
                start: (params.page - 1) * params.pageSize,
                length: params.pageSize,
                search: { value: params.search, regex: false }
            };

            const response = await axios.get('/admin/field-controls', {
                params: query,
                headers: { 'Accept': 'application/json' }
            });

            setControls(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch controls', error);
            toast.error(t('admin.fieldControls.failedLoad'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchControls();
        }, 300);
        return () => clearTimeout(timeout);
    }, [params.page, params.search]);

    const handleView = (control: FieldControl) => {
        setSelectedControl(control);
        setDetailsOpen(true);
    };

    const confirmApprove = async () => {
        if (!selectedControl) return;
        setProcessingId(selectedControl.id);
        try {
            await axios.post(`/admin/field-controls/${selectedControl.id}/approve`);
            toast.success(t('admin.fieldControls.approvedSuccess'));
            fetchControls();
            setDetailsOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('admin.fieldControls.failedApprove'));
        } finally {
            setProcessingId(null);
        }
    };

    const confirmReject = async () => {
        if (!selectedControl) return;
        setProcessingId(selectedControl.id);
        try {
            await axios.post(`/admin/field-controls/${selectedControl.id}/reject`, { reason: rejectionReason });
            toast.success(t('admin.fieldControls.flaggedSuccess'));
            fetchControls();
            setRejectOpen(false);
            setDetailsOpen(false);
            setRejectionReason('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('admin.fieldControls.failedFlag'));
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'requires_followup': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalPages = Math.ceil(totalRecords / params.pageSize);

    const statCards = [
        { label: t('admin.fieldControls.totalControls'), value: stats.total, icon: ClipboardCheck, bgColor: '#1e40af' },
        { label: t('admin.fieldControls.completed'), value: stats.completed, icon: CheckCircle, bgColor: '#059669' },
        { label: t('admin.fieldControls.inProgress'), value: stats.in_progress, icon: Loader2, bgColor: '#d97706' },
        { label: t('admin.fieldControls.requiresFollowup'), value: stats.requires_followup, icon: AlertTriangle, bgColor: '#dc2626' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: t('admin.fieldControls.breadcrumb'), href: '/admin/field-controls' }]}>
            <Head title={t('admin.fieldControls.headTitle')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('admin.fieldControls.title')}</h1>
                        <p className="text-slate-500 text-sm mt-1">{t('admin.fieldControls.subtitle')}</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, idx) => (
                        <div key={idx} style={{ backgroundColor: stat.bgColor }} className="rounded-xl p-4 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <stat.icon className="h-10 w-10 text-white/30" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-medium text-slate-900">{t('admin.fieldControls.allInspections')}</div>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder={t('admin.fieldControls.searchPlaceholder')}
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
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thControl')}</TableHead>
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thAgent')}</TableHead>
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thBusiness')}</TableHead>
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thDate')}</TableHead>
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thCompliance')}</TableHead>
                                    <TableHead className="font-semibold text-slate-600">{t('admin.fieldControls.thStatus')}</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">{t('admin.fieldControls.thActions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                        </TableCell>
                                    </TableRow>
                                ) : controls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                            {t('admin.fieldControls.noControls')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    controls.map((control) => (
                                        <TableRow key={control.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-mono font-medium text-slate-700">
                                                {control.control_number}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                                        <Users className="h-3.5 w-3.5" />
                                                    </div>
                                                    {control.agent_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-700">{control.taxpayer_name || control.business_name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />{control.location || control.location_address}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {formatDate(control.control_date)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${parseFloat(control.compliance_rate) >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                    parseFloat(control.compliance_rate) >= 50 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {control.compliance_rate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(control.status)} font-medium`}>
                                                    {control.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleView(control)} className="h-8 w-8 text-slate-500 hover:text-blue-600">
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
                                    {t('admin.fieldControls.showing')} {Math.min(((params.page - 1) * params.pageSize) + 1, totalRecords)} {t('admin.fieldControls.to')} {Math.min(params.page * params.pageSize, totalRecords)} {t('admin.fieldControls.of')} {totalRecords} {t('admin.fieldControls.entries')}
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
                    <DialogContent className="sm:max-w-4xl bg-white text-slate-900 border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-blue-600" />
                                Control #{selectedControl?.control_number}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                {t('admin.fieldControls.inspectionDetails')}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedControl && (
                            <div className="grid grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">{t('admin.fieldControls.inspectionInfo')}</h3>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.agent')}</span>
                                            <span className="font-medium">{selectedControl.agent_name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.business')}</span>
                                            <span className="font-medium">{selectedControl.taxpayer_name || selectedControl.business_name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.location')}</span>
                                            <span className="font-medium">{selectedControl.location || selectedControl.location_address}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.date')}</span>
                                            <span className="font-medium">{formatDate(selectedControl.control_date)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.type')}</span>
                                            <span className="font-medium">{selectedControl.control_type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 border-b pb-2">{t('admin.fieldControls.complianceStats')}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <span className="text-slate-500 text-xs">{t('admin.fieldControls.totalChecked')}</span>
                                            <p className="font-bold text-lg">{selectedControl.total_items_checked}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-lg">
                                            <span className="text-emerald-600 text-xs">{t('admin.fieldControls.compliant')}</span>
                                            <p className="font-bold text-lg text-emerald-700">{selectedControl.compliant_items}</p>
                                        </div>
                                        <div className="bg-amber-50 p-3 rounded-lg">
                                            <span className="text-amber-600 text-xs">{t('admin.fieldControls.nonCompliant')}</span>
                                            <p className="font-bold text-lg text-amber-700">{selectedControl.non_compliant_items}</p>
                                        </div>
                                        <div className="bg-red-50 p-3 rounded-lg">
                                            <span className="text-red-600 text-xs">{t('admin.fieldControls.counterfeit')}</span>
                                            <p className="font-bold text-lg text-red-700">{selectedControl.counterfeit_items}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-slate-500 text-xs">{t('admin.fieldControls.complianceRate')}</span>
                                        <div className={`text-2xl font-bold ${parseFloat(selectedControl.compliance_rate) >= 80 ? 'text-emerald-600' :
                                            parseFloat(selectedControl.compliance_rate) >= 50 ? 'text-amber-600' :
                                                'text-red-600'
                                            }`}>
                                            {selectedControl.compliance_rate}
                                        </div>
                                    </div>
                                </div>

                                {selectedControl.observations && (
                                    <div className="col-span-2 space-y-2">
                                        <h3 className="font-semibold text-slate-900 border-b pb-2">{t('admin.fieldControls.observations')}</h3>
                                        <p className="text-sm text-slate-600">{selectedControl.observations}</p>
                                    </div>
                                )}

                                {selectedControl.offence_declared && (
                                    <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-red-800 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> {t('admin.fieldControls.offenceDeclared')}
                                        </h3>
                                        <p className="text-sm text-red-700 mt-1">{selectedControl.offence_description}</p>
                                        {selectedControl.proposed_fine > 0 && (
                                            <p className="text-sm font-medium text-red-800 mt-2">
                                                {t('admin.fieldControls.proposedFine')} ${selectedControl.proposed_fine.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                            <Button variant="outline" onClick={() => setDetailsOpen(false)}>{t('admin.fieldControls.close')}</Button>

                            {selectedControl?.status === 'completed' && (
                                <>
                                    <Button variant="destructive" onClick={() => setRejectOpen(true)}>
                                        <XCircle className="mr-2 h-4 w-4" /> {t('admin.fieldControls.flagIssue')}
                                    </Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={confirmApprove}
                                        disabled={!!processingId}
                                    >
                                        {processingId === selectedControl?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        {t('admin.fieldControls.approve')}
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
                            <DialogTitle>{t('admin.fieldControls.flagTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('admin.fieldControls.flagDesc')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>{t('admin.fieldControls.issueDescription')}</Label>
                                <Textarea
                                    placeholder={t('admin.fieldControls.issuePlaceholder')}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setRejectOpen(false)}>{t('admin.fieldControls.cancel')}</Button>
                            <Button variant="destructive" onClick={confirmReject} disabled={!rejectionReason || !!processingId}>
                                {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {t('admin.fieldControls.confirmFlag')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
