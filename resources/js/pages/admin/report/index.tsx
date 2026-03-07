import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    CreditCard,
    Receipt,
    Clock,
    FileSpreadsheet,
    FileBarChart,
    Printer,
    Eye
} from "lucide-react";

const ReportIndex = ({ paymentMethods, taxpayers }) => {
    const [selectedReport, setSelectedReport] = useState('payments');
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get, processing } = useForm({
        report_type: 'payments',
        date_from: '',
        date_to: '',
        status: '',
        payment_method_id: '',
        taxpayer_id: '',
        format: 'pdf' // pdf, excel, csv
    });

    const reportTypes = [
        { id: 'payments', name: 'Payments Report', icon: CreditCard, description: 'Detailed payment transactions with filters' },
        { id: 'orders', name: 'Orders Report', icon: Receipt, description: 'Complete order history and status' },
        { id: 'taxpayers', name: 'Taxpayers Report', icon: Users, description: 'Taxpayer registration and activity' },
        { id: 'revenue', name: 'Revenue Summary', icon: TrendingUp, description: 'Daily/Monthly revenue analytics' },
        { id: 'aging', name: 'Aging Report', icon: Clock, description: 'Outstanding payments by age' },
        { id: 'tax-types', name: 'Tax Types Summary', icon: PieChart, description: 'Breakdown by tax category' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
    ];

    const generateReport = (e) => {
        e.preventDefault();
        // get(route('reports.generate'), {
        //     preserveState: true,
        //     preserveScroll: true,
        // });
    };

    const downloadReport = (format) => {
        setData('format', format);
        // get(route('reports.download', { ...data, format }), {
        //     preserveState: true,
        // });
    };

    const previewReport = () => {
        // get(route('reports.preview', data), {
        //     preserveState: true,
        //     preserveScroll: true,
        // });
    };

    const quickReports = [
        { name: 'Today\'s Payments', icon: Calendar, route: 'reports.today' },
        { name: 'This Month Revenue', icon: BarChart3, route: 'reports.monthly' },
        { name: 'Top Taxpayers', icon: TrendingUp, route: 'reports.top-taxpayers' },
        { name: 'Overdue Payments', icon: Clock, route: 'reports.overdue' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Reports', href: '/admin/reports' }]}>
            <Head title="Reports Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports</h1>
                        <p className="text-slate-500 text-sm mt-1">Generate and download system reports.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Filter className="h-4 w-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <button
                            onClick={previewReport}
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Eye className="h-4 w-4" />
                            Preview Report
                        </button>
                    </div>
                </div>

                {/* Quick Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickReports.map((report) => (
                        <Link
                            key={report.name}
                            // href={route(report.route)}
                            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group"
                        >
                            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-100">
                                <report.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">{report.name}</h3>
                                <p className="text-xs text-slate-500">Click to view</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Main Report Generator */}
                <div className="rounded-lg bg-white shadow-sm border border-slate-200">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900">Generate Custom Report</h2>
                        <p className="text-sm text-slate-500">Select report type and apply filters to generate</p>
                    </div>

                    {/* Report Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {reportTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setSelectedReport(type.id);
                                        setData('report_type', type.id);
                                    }}
                                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${selectedReport === type.id
                                            ? 'border-indigo-200 bg-indigo-50 ring-2 ring-indigo-100'
                                            : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`rounded-lg p-2 ${selectedReport === type.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-medium ${selectedReport === type.id ? 'text-indigo-700' : 'text-slate-900'
                                            }`}>
                                            {type.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters Section */}
                    {showFilters && (
                        <div className="border-t border-slate-200 p-6 bg-slate-50/50">
                            <form onSubmit={generateReport} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Date Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Date From
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Date To
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Payment Method Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Payment Method
                                        </label>
                                        <select
                                            value={data.payment_method_id}
                                            onChange={e => setData('payment_method_id', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="">All Methods</option>
                                            {paymentMethods?.map(method => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Taxpayer Filter */}
                                    <div className="md:col-span-2 lg:col-span-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Taxpayer (Optional)
                                        </label>
                                        <select
                                            value={data.taxpayer_id}
                                            onChange={e => setData('taxpayer_id', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="">All Taxpayers</option>
                                            {taxpayers?.map(taxpayer => (
                                                <option key={taxpayer.id} value={taxpayer.id}>
                                                    {taxpayer.name} - {taxpayer.tax_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t border-slate-200 p-6 flex flex-wrap gap-3 justify-end">
                        <div className="flex gap-2 mr-auto">
                            <button
                                onClick={() => downloadReport('pdf')}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <FileText className="h-4 w-4" />
                                PDF
                            </button>
                            <button
                                onClick={() => downloadReport('excel')}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Excel
                            </button>
                            <button
                                onClick={() => downloadReport('csv')}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <FileBarChart className="h-4 w-4" />
                                CSV
                            </button>
                        </div>
                        <button
                            onClick={previewReport}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </button>
                        <button
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Payments Report - March 2024</p>
                                        <p className="text-xs text-slate-500">Generated 2 hours ago • PDF • 2.4 MB</p>
                                    </div>
                                </div>
                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ReportIndex;