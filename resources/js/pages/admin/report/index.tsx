import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    Users,
    CreditCard,
    ShoppingCart,
    FileSpreadsheet,
    FileBarChart,
    Eye,
    X,
    Loader2
} from "lucide-react";

interface Taxpayer {
    id: string;
    company_name: string;
    tax_identification_number: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    code: string;
}

interface Props {
    taxpayers: Taxpayer[];
    paymentMethods: PaymentMethod[];
    filters: any;
}

export default function ReportIndex({ taxpayers, paymentMethods }: Props) {
    const [selectedReport, setSelectedReport] = useState('payments');
    const [showFilters, setShowFilters] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData } = useForm({
        report_type: 'payments',
        date_from: '',
        date_to: '',
        status: '',
        payment_method_id: '',
        taxpayer_id: '',
        format: 'pdf'
    });

    const reportTypes = [
        {
            id: 'payments',
            name: 'Payments Report',
            icon: CreditCard,
            description: 'Payment transactions with filters'
        },
        {
            id: 'orders',
            name: 'Orders Report',
            icon: ShoppingCart,
            description: 'Stamp orders history'
        },
        {
            id: 'taxpayers',
            name: 'Taxpayers Report',
            icon: Users,
            description: 'Taxpayer registration data'
        },
    ];

    const statusOptions = {
        payments: [
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' },
        ],
        orders: [
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
        ],
        taxpayers: [
            { value: '', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
        ]
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/reports/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                setPreviewData(result.data);
                setShowPreview(true);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = (format: string) => {
        const params = new URLSearchParams({ ...data, format });
        window.open(`/admin/reports/download?${params}`, '_blank');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/admin/reports' }]}>
            <Head title="Reports" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                        <p className="text-sm text-gray-500">Generate and download system reports</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Report Type Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {reportTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedReport === type.id;

                        return (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setSelectedReport(type.id);
                                    setData('report_type', type.id);
                                    setData('status', '');
                                }}
                                className={`rounded-lg border p-4 text-left transition-all ${isSelected
                                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className={`mb-2 inline-flex rounded-lg p-2 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-900'
                                    }`}>
                                    {type.name}
                                </h3>
                                <p className="text-xs text-gray-500">{type.description}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    value={data.date_from}
                                    onChange={e => setData('date_from', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    value={data.date_to}
                                    onChange={e => setData('date_to', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm"
                                >
                                    {(statusOptions[selectedReport as keyof typeof statusOptions] || statusOptions.payments).map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedReport === 'payments' && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Payment Method
                                    </label>
                                    <select
                                        value={data.payment_method_id}
                                        onChange={e => setData('payment_method_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="">All Methods</option>
                                        {paymentMethods.map(method => (
                                            <option key={method.id} value={method.id}>
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {(selectedReport === 'payments' || selectedReport === 'orders') && (
                                <div className="md:col-span-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Taxpayer
                                    </label>
                                    <select
                                        value={data.taxpayer_id}
                                        onChange={e => setData('taxpayer_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-sm"
                                    >
                                        <option value="">All Taxpayers</option>
                                        {taxpayers.map(taxpayer => (
                                            <option key={taxpayer.id} value={taxpayer.id}>
                                                {taxpayer.company_name} - {taxpayer.tax_identification_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => downloadReport('pdf')}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <FileText className="h-4 w-4" />
                            PDF
                        </button>
                        <button
                            onClick={() => downloadReport('excel')}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel
                        </button>
                        <button
                            onClick={() => downloadReport('csv')}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <FileBarChart className="h-4 w-4" />
                            CSV
                        </button>
                    </div>
                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4" />
                                Preview
                            </>
                        )}
                    </button>
                </div>

                {/* Preview Modal */}
                {showPreview && previewData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white">
                            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report Preview
                                </h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="max-h-[calc(90vh-120px)] overflow-auto p-4">
                                {/* Summary Cards */}
                                {previewData.summary && (
                                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                                        {selectedReport === 'payments' && (
                                            <>
                                                <div className="rounded-lg bg-blue-50 p-4">
                                                    <p className="text-sm text-blue-600">Total Payments</p>
                                                    <p className="text-xl font-bold text-blue-700">
                                                        {previewData.summary.total_payments}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-green-50 p-4">
                                                    <p className="text-sm text-green-600">Grand Total</p>
                                                    <p className="text-xl font-bold text-green-700">
                                                        {formatCurrency(previewData.summary.grand_total)}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        {selectedReport === 'orders' && (
                                            <>
                                                <div className="rounded-lg bg-blue-50 p-4">
                                                    <p className="text-sm text-blue-600">Total Orders</p>
                                                    <p className="text-xl font-bold text-blue-700">
                                                        {previewData.summary.total_orders}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-green-50 p-4">
                                                    <p className="text-sm text-green-600">Total Quantity</p>
                                                    <p className="text-xl font-bold text-green-700">
                                                        {previewData.summary.total_quantity}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-purple-50 p-4">
                                                    <p className="text-sm text-purple-600">Grand Total</p>
                                                    <p className="text-xl font-bold text-purple-700">
                                                        {formatCurrency(previewData.summary.grand_total)}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        {selectedReport === 'taxpayers' && (
                                            <div className="rounded-lg bg-blue-50 p-4">
                                                <p className="text-sm text-blue-600">Total Taxpayers</p>
                                                <p className="text-xl font-bold text-blue-700">
                                                    {previewData.summary.total_taxpayers}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Data Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            {selectedReport === 'payments' && (
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Invoice</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Taxpayer</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Method</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                                                </tr>
                                            )}
                                            {selectedReport === 'orders' && (
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Order #</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Taxpayer</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                                                </tr>
                                            )}
                                            {selectedReport === 'taxpayers' && (
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">TIN</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Company</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Legal Form</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sector</th>
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reg Date</th>
                                                </tr>
                                            )}
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {previewData.records?.map((record: any, index: number) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    {selectedReport === 'payments' && (
                                                        <>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {new Date(record.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.invoice_number}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.taxpayer?.company_name || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.paymentMethod?.name || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm">
                                                                {formatCurrency(record.amount)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-medium">
                                                                {formatCurrency(record.total_amount)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-center">
                                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${record.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {record.status}
                                                                </span>
                                                            </td>
                                                        </>
                                                    )}
                                                    {selectedReport === 'orders' && (
                                                        <>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.order_number}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {new Date(record.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.taxpayer?.company_name || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm">
                                                                {record.quantity}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-right text-sm font-medium">
                                                                {formatCurrency(record.grand_total)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-center">
                                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${record.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                        record.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                                                            record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {record.status.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                        </>
                                                    )}
                                                    {selectedReport === 'taxpayers' && (
                                                        <>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.tax_identification_number}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.company_name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.legal_form?.name || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {record.sector?.name || 'N/A'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-center">
                                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${record.registration_status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                        record.registration_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {record.registration_status}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-2 text-sm">
                                                                {new Date(record.created_at).toLocaleDateString()}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 p-4">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => downloadReport('pdf')}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}