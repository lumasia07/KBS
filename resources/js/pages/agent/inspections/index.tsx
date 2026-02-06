import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    Plus,
    ClipboardCheck,
    CheckCircle,
    Clock,
    Calendar,
    MapPin
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from 'axios';
import { toast } from 'sonner';

interface Inspection {
    id: string;
    control_number: string;
    business: string;
    business_name: string;
    location_address: string;
    control_date: string;
    control_type: string;
    status: string;
    total_items_checked: number;
    compliant_items: number;
    non_compliant_items: number;
    compliance_rate: string;
    observations: string;
}

interface Stats {
    total: number;
    today: number;
    completed: number;
    pending: number;
}

interface Props {
    stats: Stats;
}

export default function AgentInspectionsIndex({ stats = { total: 0, today: 0, completed: 0, pending: 0 } }: Props) {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const fetchInspections = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/agent/inspections', {
                params: {
                    draw: Date.now(),
                    start: (page - 1) * 10,
                    length: 10,
                    search: { value: search, regex: false }
                },
                headers: { 'Accept': 'application/json' }
            });
            setInspections(response.data.data);
            setTotalRecords(response.data.recordsTotal);
        } catch (error) {
            console.error('Failed to fetch inspections', error);
            toast.error('Failed to load inspections');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => fetchInspections(), 300);
        return () => clearTimeout(timeout);
    }, [page, search]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'requires_followup': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const totalPages = Math.ceil(totalRecords / 10);

    const statCards = [
        { label: 'Total Inspections', value: stats.total, icon: ClipboardCheck, bgColor: '#1e40af' },
        { label: "Today's", value: stats.today, icon: Calendar, bgColor: '#059669' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, bgColor: '#7c3aed' },
        { label: 'In Progress', value: stats.pending, icon: Clock, bgColor: '#d97706' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Inspections', href: '/agent/inspections' }]}>
            <Head title="My Inspections" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Inspections</h1>
                        <p className="text-slate-500 text-sm mt-1">View and manage your field inspections.</p>
                    </div>
                    <Link href="/agent/inspections/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" /> New Inspection
                        </Button>
                    </Link>
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

                {/* Search Bar */}
                <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="font-medium text-slate-900">Inspection History</div>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search inspections..."
                            className="pl-9 bg-slate-50"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-600">Control #</TableHead>
                                <TableHead className="font-semibold text-slate-600">Business</TableHead>
                                <TableHead className="font-semibold text-slate-600">Date</TableHead>
                                <TableHead className="font-semibold text-slate-600">Type</TableHead>
                                <TableHead className="font-semibold text-slate-600">Compliance</TableHead>
                                <TableHead className="font-semibold text-slate-600">Status</TableHead>
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
                            ) : inspections.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                        No inspections found. Start a new inspection!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                inspections.map((insp) => (
                                    <TableRow key={insp.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-mono font-medium text-slate-700">{insp.control_number}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-slate-700">{insp.business || insp.business_name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />{insp.location_address}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{formatDate(insp.control_date)}</TableCell>
                                        <TableCell className="text-slate-600 capitalize">{insp.control_type?.replace('_', ' ')}</TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${parseFloat(insp.compliance_rate) >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                    parseFloat(insp.compliance_rate) >= 50 ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {insp.compliance_rate}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusColor(insp.status)} font-medium`}>
                                                {insp.status?.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedInspection(insp); setDetailsOpen(true); }}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {totalRecords > 0 && (
                        <div className="flex items-center justify-between p-4 border-t border-slate-100">
                            <div className="text-sm text-slate-500">
                                Showing {Math.min((page - 1) * 10 + 1, totalRecords)} to {Math.min(page * 10, totalRecords)} of {totalRecords}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                    <DialogContent className="sm:max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle>Inspection #{selectedInspection?.control_number}</DialogTitle>
                            <DialogDescription>Inspection details and compliance report</DialogDescription>
                        </DialogHeader>
                        {selectedInspection && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                    <span className="text-slate-500 text-xs">Business</span>
                                    <p className="font-medium">{selectedInspection.business || selectedInspection.business_name}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Location</span>
                                    <p className="font-medium">{selectedInspection.location_address}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Items Checked</span>
                                    <p className="font-medium">{selectedInspection.total_items_checked}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Compliant</span>
                                    <p className="font-medium text-emerald-600">{selectedInspection.compliant_items}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Non-Compliant</span>
                                    <p className="font-medium text-red-600">{selectedInspection.non_compliant_items}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-xs">Compliance Rate</span>
                                    <p className="font-bold text-lg">{selectedInspection.compliance_rate}</p>
                                </div>
                                {selectedInspection.observations && (
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs">Observations</span>
                                        <p className="text-sm">{selectedInspection.observations}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
