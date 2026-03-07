import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, FileText, Truck, Download, Printer, Landmark } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { useSwal } from '@/Hooks/useSwal';
import { useFlashMessages } from '@/Hooks/useFlashMessages';

interface TaxpayerInfo {
    id: string;
    tax_identification_number: string;
    company_name: string;
    legal_form_id: number;
    trade_register_number: string | null;
    trade_register_issue_date: string | null;
    sector_id: number;
    company_size_id: number;
    physical_address: string;
    district_id: number;
    commune_id: number;
    quartier_id: number;
    avenue: string;
    number: string;
    plot_number: string;
    email: string;
    phone_number: string;
    alternate_phone: string | null;
    legal_representative_name: string;
    legal_representative_email: string;
    legal_representative_phone: string;
    legal_representative_id_number: string;
    registration_status: string;
}

interface StampOrder {
    id: string;
    order_number: string;
    taxpayer_id: string;
    product_id: number;
    product?: {
        name: string;
        code: string;
    };
    stamp_type_id: number;
    stamp_type?: {
        name: string;
    };
    quantity: number;
    packaging_type: string;
    unit_price: string;
    total_amount: string;
    tax_amount: string;
    penalty_amount: string;
    grand_total: string;
    status: string;
    payment_reference: string | null;
    payment_date: string | null;
    payment_method: string;
    payment_provider: string | null;
    delivery_method: string;
    delivery_address: string | null;
    estimated_delivery_date: string | null;
    actual_delivery_date: string | null;
    delivery_confirmation_code: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    order: StampOrder;
    taxpayerInfo: TaxpayerInfo;
}

const paymentMethods = [
    { id: "mobile_money", name: "Mobile Money", providers: ["M-PESA", "Airtel Money", "Orange Money"] },
    { id: "card", name: "Bank Card", providers: ["Visa", "Mastercard"] },
    { id: "bank_transfer", name: "Bank Transfer", providers: ["All Banks"] },
];

const TaxpayerOrderCheckout = ({ order, taxpayerInfo }: Props) => {
    const [selectedMethod, setSelectedMethod] = useState(order.payment_method || "mobile_money");
    const [selectedProvider, setSelectedProvider] = useState(order.payment_provider || "");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const swal = useSwal();
    useFlashMessages(); // Initialize flash message listener

    const { data, setData, post, processing, errors } = useForm({
        payment_method: selectedMethod,
        payment_provider: selectedProvider,
        phone_number: phoneNumber,
    });

    const formatFullAddress = (taxpayer: TaxpayerInfo): string => {
        const parts = [
            taxpayer.physical_address,
            taxpayer.avenue,
            taxpayer.number ? `No. ${taxpayer.number}` : null,
            taxpayer.plot_number ? `Plot ${taxpayer.plot_number}` : null,
        ].filter(Boolean);

        return parts.join(', ') || 'Address not provided';
    };

    const handlePaymentMethodChange = (value: string) => {
        setSelectedMethod(value);
        setData("payment_method", value);
        setSelectedProvider("");

        // Show info toast when changing payment method
        if (value === 'bank_transfer') {
            toast.info('Bank transfer requires downloading and presenting invoice at the bank');
        }
    };

    const handleProviderChange = (provider: string) => {
        setSelectedProvider(provider);
        setData("payment_provider", provider);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        setData("phone_number", e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate mobile money number format
        if (selectedMethod === 'mobile_money' && phoneNumber && !phoneNumber.match(/^(\+243|0)[0-9]{9}$/)) {
            swal.showError('Please enter a valid phone number for mobile money');
            return;
        }

        swal.showConfirm({
            title: 'Confirm Payment',
            html: `
                <div style="text-align: left;">
                    <p><strong>Amount:</strong> ${formatCurrency(parseFloat(order.grand_total))}</p>
                    <p><strong>Method:</strong> ${selectedMethod}</p>
                    ${selectedMethod === 'mobile_money' ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ''}
                </div>
            `,
            icon: 'question',
            confirmButtonText: 'Yes, Proceed to Payment',
            cancelButtonText: 'Cancel',
            onConfirm: () => {
                processPayment();
            }
        });
    };

    const processPayment = () => {
        setIsProcessing(true);

        // show online payment coming soon alert
        toast.info('Online payment coming soon!');

        // // Show loading toast
        // const loadingToast = toast.loading('Processing payment...');

        // post(route("taxpayer.orders.process-payment", order.id), {
        //     onSuccess: () => {
        //         setIsProcessing(false);
        //         toast.dismiss(loadingToast);
        //         toast.success('Payment initiated successfully!');

        //         swal.showSuccess(
        //             'Your payment has been initiated. You will receive a confirmation shortly.',
        //             'Payment Initiated'
        //         );

        //         router.visit(route("taxpayer.orders.show", order.id));
        //     },
        //     onError: (errors) => {
        //         setIsProcessing(false);
        //         toast.dismiss(loadingToast);

        //         const errorMessage = Object.values(errors).join('\n');
        //         toast.error('Payment failed: ' + errorMessage);

        //         swal.showError(
        //             'Payment failed. Please try again or contact support.',
        //             'Payment Error'
        //         );
        //     },
        // });
    };

    const handleDownloadInvoice = () => {
        swal.showConfirm({
            title: 'Download Invoice',
            html: `
                <div style="text-align: left;">
                    <p>This invoice is for <strong>bank payment only</strong>.</p>
                    <p>After downloading:</p>
                    <ul style="margin-left: 20px;">
                        <li>Print the invoice</li>
                        <li>Present at any authorized bank</li>
                        <li>Make payment at the bank counter</li>
                        <li>Return with bank-stamped copy for approval</li>
                    </ul>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Yes, Download Invoice',
            cancelButtonText: 'Cancel',
            onConfirm: () => {
                setIsDownloading(true);

                const loadingToast = toast.loading('Generating invoice...');

                generateInvoiceHTML();

                setTimeout(() => {
                    setIsDownloading(false);
                    toast.dismiss(loadingToast);
                    toast.success('Invoice generated successfully');

                    swal.showInfo(
                        'Remember to present the printed invoice at the bank with your payment.',
                        'Next Steps'
                    );
                }, 1000);
            }
        });
    };

    const handleCancelOrder = () => {
        swal.showConfirm({
            title: 'Cancel Order',
            html: `
                <div style="text-align: left;">
                    <p>Are you sure you want to cancel order #${order.order_number}?</p>
                    <p style="color: #d33; font-weight: bold;">This action cannot be undone!</p>
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Yes, Cancel Order',
            cancelButtonText: 'No, Keep Order',
            confirmButtonColor: '#d33',
            onConfirm: () => {
                toast.info('Order cancelling coming soon...');

                // const loadingToast = toast.loading('Cancelling order...');

                // router.delete(route("taxpayer.orders.cancel", order.id), {
                //     onSuccess: () => {
                //         toast.dismiss(loadingToast);
                //         toast.success('Order cancelled successfully');
                //         router.visit(route("taxpayer.orders.index"));
                //     },
                //     onError: () => {
                //         toast.dismiss(loadingToast);
                //         toast.error('Failed to cancel order');
                //     }
                // });
            }
        });
    };

    const generateInvoiceHTML = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Please allow pop-ups to download the invoice');
            setIsDownloading(false);
            return;
        }

        const today = new Date().toLocaleDateString('en-US');
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US');
        const fullAddress = formatFullAddress(taxpayerInfo);

        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - Order #${order.order_number}</title>
                <meta charset="UTF-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Arial', sans-serif;
                        background: #fff;
                        color: #333;
                        line-height: 1.3;
                    }
                    .invoice {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 15px;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #0033a0;
                    }
                    .logo {
                        width: 80px;
                        height: 80px;
                        object-fit: contain;
                    }
                    .title-section {
                        flex: 1;
                    }
                    .title-section h1 {
                        color: #0033a0;
                        font-size: 20px;
                        margin-bottom: 3px;
                    }
                    .title-section h2 {
                        color: #ce1126;
                        font-size: 14px;
                        font-weight: normal;
                    }
                    .flag-colors {
                        display: flex;
                        gap: 3px;
                        margin-top: 5px;
                    }
                    .flag-blue { width: 25px; height: 6px; background: #0033a0; }
                    .flag-red { width: 25px; height: 6px; background: #ce1126; }
                    .flag-yellow { width: 25px; height: 6px; background: #f7d618; }
                    .status-badge {
                        background: #ffc107;
                        color: #333;
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: bold;
                        display: inline-block;
                    }
                    .reference-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #f5f5f5;
                        padding: 8px 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 13px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .info-box {
                        background: #f9f9f9;
                        padding: 12px;
                        border-radius: 4px;
                        border-left: 3px solid #0033a0;
                    }
                    .info-box h3 {
                        font-size: 14px;
                        margin-bottom: 8px;
                        color: #0033a0;
                    }
                    .info-row {
                        display: flex;
                        margin-bottom: 4px;
                        font-size: 12px;
                    }
                    .info-label {
                        width: 90px;
                        color: #666;
                    }
                    .info-value {
                        flex: 1;
                        font-weight: 500;
                    }
                    .order-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                        font-size: 12px;
                    }
                    .order-table th {
                        background: #0033a0;
                        color: white;
                        padding: 8px;
                        text-align: left;
                        font-weight: 500;
                    }
                    .order-table td {
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }
                    .order-table tr:last-child {
                        background: #f0f0f0;
                        font-weight: bold;
                    }
                    .amount-due {
                        background: #e6f0ff;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .amount-due .label {
                        font-weight: bold;
                        color: #ce1126;
                    }
                    .amount-due .value {
                        font-size: 22px;
                        font-weight: bold;
                        color: #0033a0;
                    }
                    .bank-details {
                        background: #fff3cd;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 12px;
                    }
                    .bank-details h3 {
                        font-size: 13px;
                        margin-bottom: 8px;
                        color: #856404;
                    }
                    .bank-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }
                    .bank-item {
                        display: flex;
                    }
                    .bank-item .label {
                        width: 80px;
                        color: #666;
                    }
                    .instructions {
                        background: #f5f5f5;
                        padding: 12px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-size: 11px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        border-top: 1px solid #ddd;
                        padding-top: 8px;
                    }
                    .print-button {
                        display: block;
                        width: 100%;
                        padding: 10px;
                        background: #0033a0;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 14px;
                        cursor: pointer;
                        margin: 10px 0;
                    }
                    @media print {
                        .print-button { display: none; }
                        body { background: white; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <img src="/KBS_logo.png" alt="ISS Logo" class="logo" onerror="this.style.display='none'">
                        <div class="title-section">
                            <h1>KINSHASA INTEGRATED STAMPING AUTHORITY</h1>
                            <h2>DEMOCRATIC REPUBLIC OF CONGO</h2>
                            <div class="flag-colors">
                                <div class="flag-blue"></div>
                                <div class="flag-red"></div>
                                <div class="flag-yellow"></div>
                            </div>
                        </div>
                    </div>

                    <div class="reference-row">
                        <div>
                            <strong>Invoice:</strong> INV-${order.order_number} | 
                            <strong>Order:</strong> ${order.order_number} | 
                            <strong>Date:</strong> ${today} | 
                            <strong>Due:</strong> ${dueDate}
                        </div>
                        <span class="status-badge">PENDING PAYMENT</span>
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <h3>TAXPAYER DETAILS</h3>
                            <div class="info-row">
                                <span class="info-label">Company:</span>
                                <span class="info-value">${taxpayerInfo.company_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">TIN:</span>
                                <span class="info-value">${taxpayerInfo.tax_identification_number}</span>
                            </div>
                            ${taxpayerInfo.trade_register_number ? `
                            <div class="info-row">
                                <span class="info-label">RCCM:</span>
                                <span class="info-value">${taxpayerInfo.trade_register_number}</span>
                            </div>
                            ` : ''}
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">${fullAddress}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">${taxpayerInfo.phone_number}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${taxpayerInfo.email}</span>
                            </div>
                        </div>

                        <div class="info-box">
                            <h3>AUTHORITY DETAILS</h3>
                            <div class="info-row">
                                <span class="info-label">Dept:</span>
                                <span class="info-value">Directorate of Stamps</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span class="info-value">30 June Blvd, Gombe</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">+243 81 555 1234</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">stamps@finance.gouv.cd</span>
                            </div>
                        </div>
                    </div>

                    <table class="order-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>${order.product?.name || 'Stamp Duty'}</strong><br>
                                    <span style="font-size: 11px; color: #666;">
                                        Type: ${order.stamp_type?.name || 'Standard'} | Pkg: ${order.packaging_type}
                                    </span>
                                </td>
                                <td>${order.quantity.toLocaleString()}</td>
                                <td>${formatCurrency(parseFloat(order.unit_price))}</td>
                                <td>${formatCurrency(parseFloat(order.total_amount))}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                                <td>${formatCurrency(parseFloat(order.total_amount))}</td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>VAT (16%):</strong></td>
                                <td>${formatCurrency(parseFloat(order.tax_amount))}</td>
                            </tr>
                            ${parseFloat(order.penalty_amount) > 0 ? `
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Penalties:</strong></td>
                                <td>${formatCurrency(parseFloat(order.penalty_amount))}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>GRAND TOTAL:</strong></td>
                                <td style="color: #ce1126;">${formatCurrency(parseFloat(order.grand_total))}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="amount-due">
                        <span class="label">AMOUNT DUE:</span>
                        <span class="value">${formatCurrency(parseFloat(order.grand_total))}</span>
                    </div>

                    <div style="font-family: monospace; background: #fff; padding: 6px 10px; border: 1px dashed #0033a0; margin-bottom: 15px; font-size: 12px; text-align: center;">
                        <strong>PAYMENT REF:</strong> ${order.order_number}-${taxpayerInfo.tax_identification_number}
                    </div>

                    ${selectedMethod === 'bank_transfer' ? `
                    <div class="bank-details">
                        <h3>🏦 BANK TRANSFER DETAILS</h3>
                        <div class="bank-grid">
                            <div class="bank-item">
                                <span class="label">Bank:</span>
                                <span><strong>Central Bank of Congo</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">Account:</span>
                                <span><strong>Kinshasa Stamping Authority</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">Acc Number:</span>
                                <span><strong>12345-67890-123456789-01</strong></span>
                            </div>
                            <div class="bank-item">
                                <span class="label">SWIFT:</span>
                                <span><strong>BCCUCDKI</strong></span>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div class="instructions">
                        <p><strong>📋 INSTRUCTIONS:</strong></p>
                        <p>1. Present this invoice at any authorized bank for payment</p>
                        <p>2. After payment, bring bank-stamped copy + required documents for approval</p>
                        <p>3. Valid for 7 days | For online payments, use portal</p>
                    </div>

                    <div class="footer">
                        <p>System-generated invoice - No signature required | Kinshasa, DRC | ${new Date().toLocaleString()}</p>
                    </div>

                    <button class="print-button" onclick="window.print()">🖨️ Print Invoice</button>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; icon: any; label: string }> = {
            payment_pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Payment Pending" },
            paid: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Paid" },
            processing: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Processing" },
            completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
            cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Cancelled" },
        };

        const statusInfo = statusMap[status] || statusMap.payment_pending;
        const Icon = statusInfo.icon;

        return (
            <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {statusInfo.label}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Checkout - Stamp Order" />

            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={`taxpayer/orders?view=history`} className="text-sm text-muted-foreground hover:text-primary">
                        ← Back to Orders
                    </Link>

                    {order.status === 'payment_pending' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancelOrder}
                        >
                            Cancel Order
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">Complete Payment</CardTitle>
                                        <CardDescription>
                                            Order #{order.order_number}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-3">Order Details</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Quantity</p>
                                                <p className="font-medium">{order.quantity.toLocaleString()} stamps</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Packaging</p>
                                                <p className="font-medium capitalize">{order.packaging_type}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Delivery Method</p>
                                                <p className="font-medium capitalize">{order.delivery_method}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Order Date</p>
                                                <p className="font-medium">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Select Payment Method</h3>

                                            <RadioGroup value={selectedMethod} onValueChange={handlePaymentMethodChange}>
                                                {paymentMethods.map((method) => (
                                                    <div key={method.id} className="flex items-start space-x-3 space-y-0">
                                                        <RadioGroupItem value={method.id} id={method.id} />
                                                        <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                                            {method.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>

                                            {selectedMethod === "mobile_money" && (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <Label htmlFor="provider">Select Provider</Label>
                                                        <RadioGroup
                                                            value={selectedProvider}
                                                            onValueChange={handleProviderChange}
                                                            className="flex flex-wrap gap-4 mt-2"
                                                        >
                                                            {paymentMethods.find(m => m.id === "mobile_money")?.providers.map((provider) => (
                                                                <div key={provider} className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={provider} id={provider} />
                                                                    <Label htmlFor={provider}>{provider}</Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            placeholder="Enter your phone number"
                                                            value={phoneNumber}
                                                            onChange={handlePhoneChange}
                                                            required={selectedMethod === "mobile_money"}
                                                        />
                                                        {errors.phone_number && (
                                                            <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedMethod === "card" && (
                                                <Alert className="mt-4">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertTitle>Card Payment</AlertTitle>
                                                    <AlertDescription>
                                                        You will be redirected to a secure payment page to enter your card details.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {selectedMethod === "bank_transfer" && (
                                                <Alert className="mt-4">
                                                    <Landmark className="h-4 w-4" />
                                                    <AlertTitle>Bank Transfer</AlertTitle>
                                                    <AlertDescription>
                                                        Download the invoice and present it at any authorized bank to make payment.
                                                        After payment, present the bank-stamped invoice at our offices for validation.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span>{formatCurrency(parseFloat(order.total_amount))}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">VAT (16%)</span>
                                                <span>{formatCurrency(parseFloat(order.tax_amount))}</span>
                                            </div>
                                            {parseFloat(order.penalty_amount) > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Penalties</span>
                                                    <span className="text-red-600">{formatCurrency(parseFloat(order.penalty_amount))}</span>
                                                </div>
                                            )}
                                            <Separator className="my-2" />
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total</span>
                                                <span>{formatCurrency(parseFloat(order.grand_total))}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full flex items-center justify-center gap-2"
                                                onClick={handleDownloadInvoice}
                                                disabled={isDownloading}
                                            >
                                                <Download className="h-4 w-4" />
                                                {isDownloading ? "Generating..." : "Download Invoice for Bank Payment"}
                                            </Button>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing || isProcessing || (selectedMethod === "mobile_money" && (!selectedProvider || !phoneNumber))}
                                            >
                                                {isProcessing ? "Processing..." : `Pay Online ${formatCurrency(parseFloat(order.grand_total))}`}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            <Card className="border-2 border-blue-200 bg-blue-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                                        <Printer className="h-5 w-5" />
                                        Bank Payment Option
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-blue-800 mb-3">
                                        Prefer to pay at the bank? Download the invoice and present it at any authorized bank branch.
                                    </p>
                                    <Button
                                        variant="default"
                                        className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                        onClick={handleDownloadInvoice}
                                        disabled={isDownloading}
                                    >
                                        <Download className="h-4 w-4" />
                                        {isDownloading ? "Generating..." : "Download Invoice"}
                                    </Button>
                                    <div className="mt-3 text-xs text-blue-600">
                                        <p>After bank payment, present the stamped invoice at the authority with required documents for approval.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Delivery Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-muted-foreground">Method:</span>{' '}
                                            <span className="font-medium capitalize">{order.delivery_method}</span>
                                        </p>
                                        {order.delivery_address && (
                                            <p>
                                                <span className="text-muted-foreground">Address:</span>{' '}
                                                <span className="font-medium">{order.delivery_address}</span>
                                            </p>
                                        )}
                                        {order.estimated_delivery_date && (
                                            <p>
                                                <span className="text-muted-foreground">Estimated Delivery:</span>{' '}
                                                <span className="font-medium">{formatDate(order.estimated_delivery_date)}</span>
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Required Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Import Declaration (if applicable)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Marketing Authorization (if applicable)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            Certificate of Conformity (if applicable)
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        If you encounter any payment issues or need assistance, please contact our support.
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={"/help"}>Contact Support</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TaxpayerOrderCheckout;