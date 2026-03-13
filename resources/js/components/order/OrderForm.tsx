import { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Package,
    Truck,
    FileText,
    CreditCard,
    CheckCircle,
    MapPin,
    Upload,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrderStore } from '@/stores/useOrderStore';
import { OrderSummary } from './OrderSummary';
import { OrderConfirmation } from './OrderConfirmation';
import type { DeliveryMethod, PaymentMethod } from '@/types/order';
import { toast } from 'sonner';
import { useI18nStore } from '@/stores/useI18nStore';

const steps = [
    { id: 'review', labelKey: 'taxpayer.orders.orderForm.steps.review', icon: Package },
    { id: 'delivery', labelKey: 'taxpayer.orders.orderForm.steps.delivery', icon: Truck },
    { id: 'documents', labelKey: 'taxpayer.orders.orderForm.steps.documents', icon: FileText },
    { id: 'payment', labelKey: 'taxpayer.orders.orderForm.steps.payment', icon: CreditCard },
];

export function OrderForm() {
    const {
        currentStep,
        cartItems,
        delivery,
        paymentMethod,
        isSubmitting,
        submittedOrder,
        setStep,
        nextStep,
        prevStep,
        setDelivery,
        setDocuments,
        setPaymentMethod,
        submitOrder,
        requiresHealthCertificate,
    } = useOrderStore();

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
    const { t } = useI18nStore();

    const handleFileUpload = (field: string, file: File | null) => {
        setUploadedFiles((prev) => ({ ...prev, [field]: file }));
        if (file) {
            setDocuments({ [field]: file });
        }
    };

    const handleSubmit = async () => {
        const order = await submitOrder();
        if (order) {
            toast.success('Order submitted successfully!', {
                description: `Order ${order.order_number} is now pending verification.`,
            });
        } else {
            toast.error('Failed to submit order. Please try again.');
        }
    };

    const getCurrentStepIndex = () => {
        return steps.findIndex((s) => s.id === currentStep);
    };

    const canProceed = () => {
        switch (currentStep) {
            case 'review':
                return cartItems.length > 0;
            case 'delivery':
                if (delivery.method === 'delivery') {
                    return !!delivery.address && !!delivery.phone;
                }
                return true;
            case 'documents':
                // For now, documents are optional
                return true;
            case 'payment':
                return !!paymentMethod;
            default:
                return true;
        }
    };

    if (currentStep === 'products') {
        return null; // Products view is handled separately
    }

    if (currentStep === 'confirmation') {
        return <OrderConfirmation />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = getCurrentStepIndex() > index;

                        return (
                            <div key={step.id} className="flex-1 flex items-center">
                                <button
                                    onClick={() => isCompleted && setStep(step.id as typeof currentStep)}
                                    disabled={!isCompleted && !isActive}
                                    className={`flex flex-col items-center gap-2 p-2 transition-colors ${isCompleted ? 'cursor-pointer' : ''
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                                                ? 'bg-emerald-500 text-white'
                                                : isActive
                                                    ? 'bg-[#003366] text-white shadow-lg'
                                                    : 'bg-slate-200 text-slate-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <StepIcon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${isActive ? 'text-[#003366]' : 'text-slate-500'
                                            }`}
                                    >
                                        {t(step.labelKey)}
                                    </span>
                                </button>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        {/* Review Step */}
                        {currentStep === 'review' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">
                                    {t('taxpayer.orders.orderForm.reviewTitle')}
                                </h2>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.product.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-slate-900">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    {item.product.code} • {item.quantity}{' '}
                                                    {item.product.unit_type}(s) •{' '}
                                                    {item.packaging_type}
                                                </p>
                                            </div>
                                            <span className="font-bold text-[#003366]">
                                                {new Intl.NumberFormat('fr-CD').format(
                                                    item.subtotal
                                                )}{' '}
                                                FC
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Step */}
                        {currentStep === 'delivery' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">
                                    {t('taxpayer.orders.orderForm.deliveryTitle')}
                                </h2>

                                {/* Delivery Method Selection */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button
                                        onClick={() => setDelivery({ method: 'pickup' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${delivery.method === 'pickup'
                                                ? 'border-[#003366] bg-[#003366]/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <MapPin
                                            className={`w-8 h-8 mx-auto mb-2 ${delivery.method === 'pickup'
                                                    ? 'text-[#003366]'
                                                    : 'text-slate-400'
                                                }`}
                                        />
                                        <p
                                            className={`font-semibold ${delivery.method === 'pickup'
                                                    ? 'text-[#003366]'
                                                    : 'text-slate-900'
                                                }`}
                                        >
                                            {t('taxpayer.orders.orderForm.pickup')}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('taxpayer.orders.orderForm.pickupDesc')}
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => setDelivery({ method: 'delivery' })}
                                        className={`p-4 rounded-xl border-2 transition-all ${delivery.method === 'delivery'
                                                ? 'border-[#003366] bg-[#003366]/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <Truck
                                            className={`w-8 h-8 mx-auto mb-2 ${delivery.method === 'delivery'
                                                    ? 'text-[#003366]'
                                                    : 'text-slate-400'
                                                }`}
                                        />
                                        <p
                                            className={`font-semibold ${delivery.method === 'delivery'
                                                    ? 'text-[#003366]'
                                                    : 'text-slate-900'
                                                }`}
                                        >
                                            {t('taxpayer.orders.orderForm.delivery')}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('taxpayer.orders.orderForm.deliveryDesc')}
                                        </p>
                                    </button>
                                </div>

                                {/* Delivery Address Form */}
                                {delivery.method === 'delivery' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="address">{t('taxpayer.orders.orderForm.deliveryAddress')}</Label>
                                            <Input
                                                id="address"
                                                value={delivery.address || ''}
                                                onChange={(e) =>
                                                    setDelivery({ address: e.target.value })
                                                }
                                                placeholder={t('taxpayer.orders.orderForm.deliveryAddressPlaceholder')}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city">{t('taxpayer.orders.orderForm.city')}</Label>
                                                <Input
                                                    id="city"
                                                    value={delivery.city || ''}
                                                    onChange={(e) =>
                                                        setDelivery({ city: e.target.value })
                                                    }
                                                    placeholder={t('taxpayer.orders.orderForm.city')}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="province">{t('taxpayer.orders.orderForm.province')}</Label>
                                                <Input
                                                    id="province"
                                                    value={delivery.province || ''}
                                                    onChange={(e) =>
                                                        setDelivery({ province: e.target.value })
                                                    }
                                                    placeholder={t('taxpayer.orders.orderForm.province')}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">{t('taxpayer.orders.orderForm.phone')}</Label>
                                            <Input
                                                id="phone"
                                                value={delivery.phone || ''}
                                                onChange={(e) =>
                                                    setDelivery({ phone: e.target.value })
                                                }
                                                placeholder="+243 ..."
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="notes">{t('taxpayer.orders.orderForm.deliveryNotes')}</Label>
                                            <Input
                                                id="notes"
                                                value={delivery.notes || ''}
                                                onChange={(e) =>
                                                    setDelivery({ notes: e.target.value })
                                                }
                                                placeholder={t('taxpayer.orders.orderForm.deliveryNotesPlaceholder')}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                )}

                                {delivery.method === 'pickup' && (
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-slate-900 mb-2">
                                            {t('taxpayer.orders.orderForm.pickupLocation')}
                                        </h4>
                                        <p className="text-sm text-slate-600">
                                            RCEKIN Headquarters
                                            <br />
                                            Boulevard du 30 Juin
                                            <br />
                                            Kinshasa, DR Congo
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {t('taxpayer.orders.orderForm.pickupHours')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Documents Step */}
                        {currentStep === 'documents' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">
                                    {t('taxpayer.orders.orderForm.documentsTitle')}
                                </h2>
                                <p className="text-sm text-slate-500 mb-6">
                                    {t('taxpayer.orders.orderForm.documentsSubtitle')}
                                </p>

                                <div className="space-y-4">
                                    {/* Import Declaration */}
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-[#003366] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">
                                                    {t('taxpayer.orders.orderForm.importDeclaration')}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {t('taxpayer.orders.orderForm.importDeclarationDesc')}
                                                </p>
                                            </div>
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleFileUpload(
                                                            'import_declaration',
                                                            e.target.files?.[0] || null
                                                        )
                                                    }
                                                    accept=".pdf,.jpg,.png"
                                                />
                                                <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    {uploadedFiles['import_declaration']
                                                        ? t('taxpayer.orders.orderForm.change')
                                                        : t('taxpayer.orders.orderForm.upload')}
                                                </span>
                                            </label>
                                        </div>
                                        {uploadedFiles['import_declaration'] && (
                                            <p className="text-xs text-emerald-600 mt-2">
                                                ✓ {uploadedFiles['import_declaration'].name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Health Certificate (if required) */}
                                    {requiresHealthCertificate() && (
                                        <div className="border-2 border-dashed border-amber-200 bg-amber-50 rounded-xl p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-amber-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">
                                                        {t('taxpayer.orders.orderForm.healthCertificate')}
                                                    </p>
                                                    <p className="text-xs text-amber-700">
                                                        {t('taxpayer.orders.orderForm.healthCertificateDesc')}
                                                    </p>
                                                </div>
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleFileUpload(
                                                                'health_certificate',
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        accept=".pdf,.jpg,.png"
                                                    />
                                                    <span className="px-4 py-2 bg-amber-200 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors inline-flex items-center gap-2">
                                                        <Upload className="w-4 h-4" />
                                                        {uploadedFiles['health_certificate']
                                                            ? t('taxpayer.orders.orderForm.change')
                                                            : t('taxpayer.orders.orderForm.upload')}
                                                    </span>
                                                </label>
                                            </div>
                                            {uploadedFiles['health_certificate'] && (
                                                <p className="text-xs text-emerald-600 mt-2">
                                                    ✓ {uploadedFiles['health_certificate'].name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Certificate of Conformity */}
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-[#003366] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">
                                                    {t('taxpayer.orders.orderForm.certOfConformity')}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {t('taxpayer.orders.orderForm.certOfConformityDesc')}
                                                </p>
                                            </div>
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleFileUpload(
                                                            'certificate_of_conformity',
                                                            e.target.files?.[0] || null
                                                        )
                                                    }
                                                    accept=".pdf,.jpg,.png"
                                                />
                                                <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    {uploadedFiles['certificate_of_conformity']
                                                        ? t('taxpayer.orders.orderForm.change')
                                                        : t('taxpayer.orders.orderForm.upload')}
                                                </span>
                                            </label>
                                        </div>
                                        {uploadedFiles['certificate_of_conformity'] && (
                                            <p className="text-xs text-emerald-600 mt-2">
                                                ✓ {uploadedFiles['certificate_of_conformity'].name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Step */}
                        {currentStep === 'payment' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">
                                    {t('taxpayer.orders.orderForm.selectPaymentMethod')}
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        {
                                            id: 'mobile_money',
                                            labelKey: 'taxpayer.orders.orderForm.mobileMoney',
                                            descKey: 'taxpayer.orders.orderForm.mobileMoneyDesc',
                                            icon: '📱',
                                        },
                                        {
                                            id: 'bank_transfer',
                                            labelKey: 'taxpayer.orders.orderForm.bankTransfer',
                                            descKey: 'taxpayer.orders.orderForm.bankTransferDesc',
                                            icon: '🏦',
                                        },
                                        {
                                            id: 'cash',
                                            labelKey: 'taxpayer.orders.orderForm.cashPayment',
                                            descKey: 'taxpayer.orders.orderForm.cashPaymentDesc',
                                            icon: '💵',
                                        },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() =>
                                                setPaymentMethod(method.id as PaymentMethod)
                                            }
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${paymentMethod === method.id
                                                    ? 'border-[#003366] bg-[#003366]/5'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <span className="text-3xl">{method.icon}</span>
                                            <div className="flex-1">
                                                <p
                                                    className={`font-semibold ${paymentMethod === method.id
                                                            ? 'text-[#003366]'
                                                            : 'text-slate-900'
                                                        }`}
                                                >
                                                    {t(method.labelKey)}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {t(method.descKey)}
                                                </p>
                                            </div>
                                            {paymentMethod === method.id && (
                                                <CheckCircle className="w-6 h-6 text-[#003366]" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-semibold">{t('taxpayer.orders.orderForm.paymentNote')}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="border-slate-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('taxpayer.orders.orderForm.back')}
                        </Button>

                        {currentStep === 'payment' ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={!canProceed() || isSubmitting}
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t('taxpayer.orders.orderForm.submitting')}
                                    </>
                                ) : (
                                    <>
                                        {t('taxpayer.orders.orderForm.submit')}
                                        <CheckCircle className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="bg-gradient-to-r from-[#003366] to-[#0052A3] hover:from-[#002244] hover:to-[#003366] text-white"
                            >
                                {t('taxpayer.orders.orderForm.continue')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
