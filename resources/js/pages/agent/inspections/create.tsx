import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Loader2, ClipboardCheck, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Taxpayer {
    id: string;
    company_name: string;
    physical_address: string;
    tax_identification_number: string;
}

interface Props {
    taxpayers: Taxpayer[];
}

export default function CreateInspection({ taxpayers = [] }: Props) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        taxpayer_id: '',
        business_name: '',
        location_address: '',
        control_type: 'routine',
        total_items_checked: 0,
        compliant_items: 0,
        non_compliant_items: 0,
        counterfeit_items: 0,
        observations: '',
        recommendations: '',
        offence_declared: false,
        offence_description: '',
        proposed_fine: 0,
    });

    const handleTaxpayerSelect = (taxpayerId: string) => {
        const taxpayer = taxpayers.find(t => t.id === taxpayerId);
        if (taxpayer) {
            setFormData(prev => ({
                ...prev,
                taxpayer_id: taxpayerId,
                business_name: taxpayer.company_name,
                location_address: taxpayer.physical_address,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.business_name || !formData.location_address) {
            toast.error('Please fill in business name and location');
            return;
        }
        if (formData.total_items_checked < 1) {
            toast.error('Please check at least one item');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/agent/inspections', formData);
            toast.success('Inspection recorded successfully!');
            router.visit('/agent/inspections');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save inspection');
        } finally {
            setLoading(false);
        }
    };

    const complianceRate = formData.total_items_checked > 0
        ? ((formData.compliant_items / formData.total_items_checked) * 100).toFixed(1)
        : '0';

    return (
        <AppLayout breadcrumbs={[
            { title: 'Inspections', href: '/agent/inspections' },
            { title: 'New Inspection', href: '/agent/inspections/create' }
        ]}>
            <Head title="New Inspection" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                <div className="flex items-center gap-4">
                    <Link href="/agent/inspections">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Inspection</h1>
                        <p className="text-slate-500 text-sm">Record a new field inspection.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Info */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                Business Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label>Select Registered Taxpayer (Optional)</Label>
                                    <Select onValueChange={handleTaxpayerSelect}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Search or select a taxpayer..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {taxpayers.map((tp) => (
                                                <SelectItem key={tp.id} value={tp.id}>
                                                    {tp.company_name} ({tp.tax_identification_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Business Name *</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.business_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                                        placeholder="Enter business name"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Location/Address *</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.location_address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                                        placeholder="Enter location"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Inspection Type</Label>
                                    <Select value={formData.control_type} onValueChange={(v) => setFormData(prev => ({ ...prev, control_type: v }))}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="routine">Routine Inspection</SelectItem>
                                            <SelectItem value="random">Random Check</SelectItem>
                                            <SelectItem value="follow_up">Follow-up</SelectItem>
                                            <SelectItem value="complaint">Complaint-based</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Data */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Compliance Data</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Total Items Checked *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.total_items_checked}
                                        onChange={(e) => setFormData(prev => ({ ...prev, total_items_checked: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>Compliant Items</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.compliant_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, compliant_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>Non-Compliant Items</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.non_compliant_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, non_compliant_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>Counterfeit Items</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.counterfeit_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, counterfeit_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label>Observations</Label>
                                <Textarea
                                    className="mt-1"
                                    placeholder="Enter your observations..."
                                    value={formData.observations}
                                    onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                                />
                            </div>
                            <div className="mt-4">
                                <Label>Recommendations</Label>
                                <Textarea
                                    className="mt-1"
                                    placeholder="Enter recommendations..."
                                    value={formData.recommendations}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Offence Section */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Checkbox
                                    id="offence"
                                    checked={formData.offence_declared}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, offence_declared: checked as boolean }))}
                                />
                                <Label htmlFor="offence" className="text-lg font-semibold text-red-700 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Declare Offence
                                </Label>
                            </div>
                            {formData.offence_declared && (
                                <div className="space-y-4 border-t pt-4">
                                    <div>
                                        <Label>Offence Description *</Label>
                                        <Textarea
                                            className="mt-1"
                                            placeholder="Describe the offence..."
                                            value={formData.offence_description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, offence_description: e.target.value }))}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <Label>Proposed Fine (CDF)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="mt-1"
                                            value={formData.proposed_fine}
                                            onChange={(e) => setFormData(prev => ({ ...prev, proposed_fine: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
                            <div className="space-y-4">
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-500">Compliance Rate</p>
                                    <p className={`text-4xl font-bold ${parseFloat(complianceRate) >= 80 ? 'text-emerald-600' :
                                            parseFloat(complianceRate) >= 50 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                        {complianceRate}%
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-emerald-50 p-2 rounded text-center">
                                        <p className="text-emerald-600 font-bold">{formData.compliant_items}</p>
                                        <p className="text-xs text-emerald-700">Compliant</p>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded text-center">
                                        <p className="text-red-600 font-bold">{formData.non_compliant_items}</p>
                                        <p className="text-xs text-red-700">Non-Compliant</p>
                                    </div>
                                </div>
                                {formData.counterfeit_items > 0 && (
                                    <div className="bg-red-100 border border-red-200 p-3 rounded-lg text-center">
                                        <p className="text-red-800 font-bold">{formData.counterfeit_items} Counterfeit Items</p>
                                    </div>
                                )}
                                {formData.offence_declared && (
                                    <div className="bg-red-100 border border-red-200 p-3 rounded-lg">
                                        <p className="text-red-800 font-bold flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> Offence Declared
                                        </p>
                                        {formData.proposed_fine > 0 && (
                                            <p className="text-sm text-red-700 mt-1">
                                                Fine: {formData.proposed_fine.toLocaleString()} CDF
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Inspection
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
