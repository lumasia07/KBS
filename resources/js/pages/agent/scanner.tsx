import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    Camera,
    Loader2,
    QrCode,
    RotateCcw,
    ScanLine,
    Search,
    ShieldCheck,
    ShieldX,
    Upload,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { useI18nStore } from '@/stores/useI18nStore';

type VerifyResult = {
    found: boolean;
    result: string;
    valid?: boolean;
    stamp?: {
        serial_number: string;
        status: string;
        verification_count: number;
        last_verification_at: string | null;
        product: { name: string } | null;
        taxpayer: { company_name: string } | null;
        stamp_type: { name: string } | null;
        production_date: string | null;
        expiry_date: string | null;
    } | null;
};

type BarcodeDetectorShape = {
    detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorStatic = {
    new (options?: { formats?: string[] }): BarcodeDetectorShape;
};

declare global {
    interface Window {
        BarcodeDetector?: BarcodeDetectorStatic;
    }
}

const getResultTone = (result: VerifyResult | null) => {
    switch (result?.result) {
        case 'valid':
            return {
                icon: ShieldCheck,
                card: 'border-emerald-200 bg-emerald-50',
                text: 'text-emerald-700',
            };
        case 'expired':
        case 'not_activated':
            return {
                icon: AlertTriangle,
                card: 'border-amber-200 bg-amber-50',
                text: 'text-amber-700',
            };
        case 'counterfeit':
        case 'reported_lost':
        case 'invalid':
            return {
                icon: ShieldX,
                card: 'border-red-200 bg-red-50',
                text: 'text-red-700',
            };
        default:
            return {
                icon: Search,
                card: 'border-slate-200 bg-slate-50',
                text: 'text-slate-700',
            };
    }
};

export default function AgentScanner() {
    const { t } = useI18nStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const scanTimerRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [serial, setSerial] = useState('');
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [scanSupported, setScanSupported] = useState(false);
    const [result, setResult] = useState<VerifyResult | null>(null);

    useEffect(() => {
        setScanSupported(typeof window !== 'undefined' && typeof window.BarcodeDetector !== 'undefined');
        return () => {
            if (scanTimerRef.current) {
                window.clearInterval(scanTimerRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const verifySerial = async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return;
        }

        setSerial(trimmed);
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(`/api/verify/${encodeURIComponent(trimmed)}`);
            if (!response.ok) {
                setResult({ found: false, result: 'not_found', stamp: null });
                return;
            }

            const data = await response.json();
            setResult(data);
        } catch {
            setResult({ found: false, result: 'error', stamp: null });
        } finally {
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (scanTimerRef.current) {
            window.clearInterval(scanTimerRef.current);
            scanTimerRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const startCamera = async () => {
        if (!scanSupported) {
            setCameraError(t('agent.scanner.unsupported'));
            return;
        }

        stopCamera();
        setCameraError('');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false,
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);

            if (!window.BarcodeDetector) {
                setCameraError(t('agent.scanner.unsupported'));
                return;
            }

            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });

            scanTimerRef.current = window.setInterval(async () => {
                if (!videoRef.current || loading) {
                    return;
                }
                try {
                    const codes = await detector.detect(videoRef.current);
                    const rawValue = codes[0]?.rawValue;
                    if (rawValue) {
                        stopCamera();
                        void verifySerial(rawValue);
                    }
                } catch {
                    // ignore intermittent detector frame errors
                }
            }, 700);
        } catch {
            setCameraError(t('agent.scanner.cameraDenied'));
        }
    };

    const handleManualVerify = async (event: FormEvent) => {
        event.preventDefault();
        await verifySerial(serial);
    };

    const handleImageScan = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (!scanSupported || !window.BarcodeDetector) {
            setCameraError(t('agent.scanner.unsupported'));
            return;
        }

        try {
            const bitmap = await createImageBitmap(file);
            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const codes = await detector.detect(bitmap);
            const rawValue = codes[0]?.rawValue;
            if (rawValue) {
                await verifySerial(rawValue);
            } else {
                setCameraError(t('agent.scanner.noCodeFound'));
            }
        } catch {
            setCameraError(t('agent.scanner.imageScanFailed'));
        } finally {
            event.target.value = '';
        }
    };

    const tone = useMemo(() => getResultTone(result), [result]);
    const ToneIcon = tone.icon;

    return (
        <AppLayout breadcrumbs={[{ title: t('agent.scanner.breadcrumb'), href: '/agent/scanner' }]}>
            <Head title={t('agent.scanner.headTitle')} />

            <div className="flex h-full flex-1 flex-col gap-4 bg-slate-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:gap-6 sm:p-6 sm:pb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('agent.scanner.title')}</h1>
                    <p className="text-sm text-slate-500">{t('agent.scanner.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">{t('agent.scanner.liveScanner')}</h2>
                                <p className="text-sm text-slate-500">{t('agent.scanner.liveScannerHint')}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('agent.scanner.scanImage')}
                                </Button>
                                <Button type="button" className="w-full sm:w-auto" onClick={cameraActive ? stopCamera : startCamera}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    {cameraActive ? t('agent.scanner.stopCamera') : t('agent.scanner.startCamera')}
                                </Button>
                            </div>
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageScan} />

                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                            <div className="relative aspect-video w-full">
                                <video ref={videoRef} className="h-full w-full object-cover" muted playsInline autoPlay />
                                {!cameraActive && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-white">
                                        <QrCode className="h-12 w-12 text-slate-300" />
                                        <p className="px-4 text-center text-sm text-slate-300">{t('agent.scanner.cameraIdle')}</p>
                                    </div>
                                )}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="h-44 w-44 rounded-3xl border-2 border-emerald-400/70 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)] sm:h-56 sm:w-56" />
                                </div>
                            </div>
                        </div>

                        {cameraError && <p className="mt-3 text-sm text-red-600">{cameraError}</p>}
                        {!scanSupported && <p className="mt-3 text-sm text-amber-600">{t('agent.scanner.unsupported')}</p>}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">{t('agent.scanner.manualVerify')}</h2>
                            <p className="mt-1 text-sm text-slate-500">{t('agent.scanner.manualVerifyHint')}</p>
                            <form className="mt-4 space-y-3" onSubmit={handleManualVerify}>
                                <Input
                                    value={serial}
                                    onChange={(event) => setSerial(event.target.value)}
                                    placeholder={t('agent.scanner.serialPlaceholder')}
                                />
                                <Button type="submit" className="w-full" disabled={loading || !serial.trim()}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                                    {t('agent.scanner.verifyButton')}
                                </Button>
                            </form>
                        </div>

                        <div className={`rounded-2xl border p-6 shadow-sm ${tone.card}`}>
                            <div className="flex items-start gap-3">
                                <div className={`rounded-full bg-white p-2 ${tone.text}`}>
                                    <ToneIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className={`text-lg font-semibold ${tone.text}`}>{t(`agent.scanner.states.${result?.result || 'idle'}.title`)}</h2>
                                    <p className="mt-1 text-sm text-slate-600">{t(`agent.scanner.states.${result?.result || 'idle'}.description`)}</p>
                                </div>
                            </div>

                            {result?.stamp && (
                                <div className="mt-5 space-y-3 rounded-xl bg-white/80 p-4 text-sm text-slate-700">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-slate-500">{t('agent.scanner.serialNumber')}</span>
                                        <span className="font-mono font-semibold text-slate-900">{result.stamp.serial_number}</span>
                                    </div>
                                    {result.stamp.product && (
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-slate-500">{t('agent.scanner.product')}</span>
                                            <span className="font-medium text-slate-900">{result.stamp.product.name}</span>
                                        </div>
                                    )}
                                    {result.stamp.taxpayer && (
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-slate-500">{t('agent.scanner.taxpayer')}</span>
                                            <span className="font-medium text-slate-900">{result.stamp.taxpayer.company_name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-slate-500">{t('agent.scanner.verificationCount')}</span>
                                        <span className="font-medium text-slate-900">{result.stamp.verification_count}</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <Button type="button" variant="outline" onClick={() => { setResult(null); setSerial(''); setCameraError(''); }}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    {t('agent.scanner.reset')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
