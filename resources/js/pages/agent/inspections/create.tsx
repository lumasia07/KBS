import { useEffect, useMemo, useState } from 'react';
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
import { ArrowLeft, Save, Loader2, ClipboardCheck, AlertTriangle, Search, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useI18nStore } from '@/stores/useI18nStore';

interface Taxpayer {
    id: string;
    company_name: string;
    physical_address: string;
    tax_identification_number: string;
    email?: string;
}

interface Props {
    taxpayers: Taxpayer[];
}

interface UploadedPhoto {
    previewUrl: string;
    serverPath: string;
}

interface UploadedDocument {
    name: string;
    serverPath: string;
}

const compressImageFile = async (file: File): Promise<File> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });

    const maxWidth = 1600;
    const maxHeight = 1600;
    let width = image.width;
    let height = image.height;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas unavailable');
    }
    ctx.drawImage(image, 0, 0, width, height);

    const compressedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Compression failed'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg', 0.72);
    });

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return new File([compressedBlob], `${baseName}.jpg`, { type: 'image/jpeg' });
};

export default function CreateInspection({ taxpayers = [] }: Props) {
    const { t } = useI18nStore();
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [uploadingDocuments, setUploadingDocuments] = useState(false);
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [taxpayerSearch, setTaxpayerSearch] = useState('');
    const [searchingTaxpayers, setSearchingTaxpayers] = useState(false);
    const [searchResults, setSearchResults] = useState<Taxpayer[]>(taxpayers);
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
        offence_severity: '',
        latitude: '',
        longitude: '',
    });

    const locallyFilteredTaxpayers = useMemo(() => {
        const q = taxpayerSearch.trim().toLowerCase();
        if (!q) {
            return taxpayers;
        }

        return taxpayers.filter((tp) => {
            const company = (tp.company_name || '').toLowerCase();
            const nif = (tp.tax_identification_number || '').toLowerCase();
            const email = (tp.email || '').toLowerCase();
            return company.includes(q) || nif.includes(q) || email.includes(q);
        });
    }, [taxpayerSearch, taxpayers]);

    useEffect(() => {
        const q = taxpayerSearch.trim();

        if (q.length < 2) {
            setSearchResults(locallyFilteredTaxpayers);
            setSearchingTaxpayers(false);
            return;
        }

        let cancelled = false;
        const timer = setTimeout(async () => {
            setSearchingTaxpayers(true);
            try {
                const response = await axios.get('/agent/taxpayers/search', { params: { q } });
                if (!cancelled) {
                    setSearchResults(response.data?.taxpayers ?? []);
                }
            } catch {
                if (!cancelled) {
                    setSearchResults([]);
                }
            } finally {
                if (!cancelled) {
                    setSearchingTaxpayers(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [locallyFilteredTaxpayers, taxpayerSearch]);

    const safeTotal = Math.max(0, formData.total_items_checked || 0);
    const safeCompliant = Math.max(0, formData.compliant_items || 0);
    const safeNonCompliant = Math.max(0, formData.non_compliant_items || 0);
    const safeCounterfeit = Math.max(0, formData.counterfeit_items || 0);
    const checkedSum = safeCompliant + safeNonCompliant;
    const hasCountMismatch = checkedSum > safeTotal;
    const hasCounterfeitMismatch = safeCounterfeit > safeNonCompliant;
    const complianceRateValue = safeTotal > 0
        ? Math.max(0, Math.min(100, (Math.min(safeCompliant, safeTotal) / safeTotal) * 100))
        : 0;
    const complianceRate = complianceRateValue.toFixed(1);

    const handleTaxpayerSelect = (taxpayerId: string) => {
        const taxpayer = [...searchResults, ...taxpayers].find(t => t.id === taxpayerId);
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
            toast.error(t('agent.create.errorBusinessRequired'));
            return;
        }
        if (formData.total_items_checked < 1) {
            toast.error(t('agent.create.errorItemsRequired'));
            return;
        }
        if (hasCountMismatch) {
            toast.error(t('agent.create.errorCountMismatch'));
            return;
        }
        if (hasCounterfeitMismatch) {
            toast.error(t('agent.create.errorCounterfeitMismatch'));
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                photos_paths: photos.map((photo) => photo.serverPath),
                documents_paths: documents.map((document) => document.serverPath),
                latitude: formData.latitude ? Number(formData.latitude) : undefined,
                longitude: formData.longitude ? Number(formData.longitude) : undefined,
                offence_severity: formData.offence_declared ? (formData.offence_severity || undefined) : undefined,
            };

            await axios.post('/agent/inspections', payload);
            toast.success(t('agent.create.successSaved'));
            router.visit('/agent/inspections');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('agent.create.errorFailed'));
        } finally {
            setLoading(false);
        }
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t('agent.create.locationNotSupported'));
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: String(position.coords.latitude),
                    longitude: String(position.coords.longitude),
                }));
                toast.success(t('agent.create.locationCaptured'));
                setLocating(false);
            },
            () => {
                toast.error(t('agent.create.locationFailed'));
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handlePhotoPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) {
            return;
        }

        setUploadingPhotos(true);
        try {
            const compressedFiles: File[] = [];
            for (const file of files) {
                try {
                    const compressed = await compressImageFile(file);
                    compressedFiles.push(compressed);
                } catch {
                    toast.error(`${t('agent.create.uploadPhotoFailed')} (${file.name})`);
                }
            }

            if (compressedFiles.length === 0) {
                return;
            }

            const previewUrls = compressedFiles.map((file) => URL.createObjectURL(file));

            const form = new FormData();
            compressedFiles.forEach((file) => {
                form.append('photos[]', file);
            });

            const response = await axios.post('/agent/inspections/upload-photos', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploaded = response.data?.photos ?? [];
            if (uploaded.length === 0) {
                previewUrls.forEach((url: string) => URL.revokeObjectURL(url));
                toast.error(t('agent.create.uploadPhotoFailed'));
            } else {
                const mapped: UploadedPhoto[] = uploaded.map((item: { url: string; path: string }, index: number) => ({
                    previewUrl: previewUrls[index] ?? item.url,
                    serverPath: item.path,
                }));
                setPhotos((prev) => [...prev, ...mapped]);
            }
        } catch {
            toast.error(t('agent.create.uploadPhotoFailed'));
        } finally {
            setUploadingPhotos(false);
            event.target.value = '';
        }
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => {
            const selected = prev[index];
            if (selected?.previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(selected.previewUrl);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleDocumentPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) {
            return;
        }

        setUploadingDocuments(true);
        try {
            const form = new FormData();
            files.forEach((file) => {
                form.append('documents[]', file);
            });

            const response = await axios.post('/agent/inspections/upload-documents', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploaded = response.data?.documents ?? [];
            if (uploaded.length === 0) {
                toast.error(t('agent.create.uploadDocumentFailed'));
            } else {
                const mapped: UploadedDocument[] = uploaded.map((item: { url: string; path: string; name?: string }, index: number) => ({
                    serverPath: item.path,
                    name: item.name || files[index]?.name || `document-${index + 1}`,
                }));
                setDocuments((prev) => [...prev, ...mapped]);
            }
        } catch {
            toast.error(t('agent.create.uploadDocumentFailed'));
        } finally {
            setUploadingDocuments(false);
            event.target.value = '';
        }
    };

    const removeDocument = (index: number) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: t('agent.inspections.breadcrumb'), href: '/agent/inspections' },
            { title: t('agent.create.breadcrumbNew'), href: '/agent/inspections/create' }
        ]}>
            <Head title={t('agent.create.headTitle')} />

            <div className="flex h-full flex-1 flex-col gap-4 bg-slate-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:gap-6 sm:p-6 sm:pb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/agent/inspections">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{t('agent.create.title')}</h1>
                        <p className="text-slate-500 text-sm">{t('agent.create.subtitle')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Info */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                {t('agent.create.businessInfo')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label>{t('agent.create.selectTaxpayer')}</Label>
                                    <div className="relative mt-1 mb-2">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            className="pl-9"
                                            value={taxpayerSearch}
                                            onChange={(e) => setTaxpayerSearch(e.target.value)}
                                            placeholder={t('agent.create.searchTaxpayerInput')}
                                        />
                                    </div>
                                    <Select value={formData.taxpayer_id} onValueChange={handleTaxpayerSelect}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder={t('agent.create.searchTaxpayer')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {searchingTaxpayers && (
                                                <div className="px-3 py-2 text-sm text-slate-500 flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" /> {t('agent.create.searchingTaxpayers')}
                                                </div>
                                            )}
                                            {!searchingTaxpayers && searchResults.length === 0 && (
                                                <div className="px-3 py-2 text-sm text-slate-500">
                                                    {t('agent.create.noTaxpayerFound')}
                                                </div>
                                            )}
                                            {searchResults.map((tp) => (
                                                <SelectItem key={tp.id} value={tp.id}>
                                                    {tp.company_name} ({tp.tax_identification_number})
                                                    {tp.email ? ` - ${tp.email}` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>{t('agent.create.businessName')}</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.business_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                                        placeholder={t('agent.create.businessNamePlaceholder')}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.locationAddress')}</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.location_address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location_address: e.target.value }))}
                                        placeholder={t('agent.create.locationPlaceholder')}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.inspectionType')}</Label>
                                    <Select value={formData.control_type} onValueChange={(v) => setFormData(prev => ({ ...prev, control_type: v }))}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="routine">{t('agent.create.routine')}</SelectItem>
                                            <SelectItem value="random">{t('agent.create.random')}</SelectItem>
                                            <SelectItem value="targeted">{t('agent.create.followUp')}</SelectItem>
                                            <SelectItem value="complaint_based">{t('agent.create.complaintBased')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <Label>{t('agent.create.latitude')}</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                                        placeholder="-4.325"
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.longitude')}</Label>
                                    <Input
                                        className="mt-1"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                                        placeholder="15.322"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button type="button" variant="outline" className="w-full" onClick={useCurrentLocation} disabled={locating}>
                                        {locating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        {t('agent.create.useCurrentLocation')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Data */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('agent.create.complianceData')}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>{t('agent.create.totalItemsChecked')}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.total_items_checked}
                                        onChange={(e) => setFormData(prev => ({ ...prev, total_items_checked: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.compliantItems')}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.compliant_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, compliant_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.nonCompliantItems')}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.non_compliant_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, non_compliant_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <Label>{t('agent.create.counterfeitItems')}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="mt-1"
                                        value={formData.counterfeit_items}
                                        onChange={(e) => setFormData(prev => ({ ...prev, counterfeit_items: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{t('agent.create.complianceRecorded')}</span>
                                    <span className={`font-semibold ${hasCountMismatch ? 'text-red-600' : 'text-slate-800'}`}>
                                        {checkedSum}/{safeTotal}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className={`h-full ${complianceRateValue >= 80 ? 'bg-emerald-500' : complianceRateValue >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${complianceRateValue}%` }}
                                    />
                                </div>
                                {hasCountMismatch && (
                                    <p className="text-xs text-red-600">{t('agent.create.errorCountMismatch')}</p>
                                )}
                                {hasCounterfeitMismatch && (
                                    <p className="text-xs text-red-600">{t('agent.create.errorCounterfeitMismatch')}</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <Label>{t('agent.create.observationsLabel')}</Label>
                                <Textarea
                                    className="mt-1"
                                    placeholder={t('agent.create.observationsPlaceholder')}
                                    value={formData.observations}
                                    onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                                />
                            </div>
                            <div className="mt-4">
                                <Label>{t('agent.create.recommendations')}</Label>
                                <Textarea
                                    className="mt-1"
                                    placeholder={t('agent.create.recommendationsPlaceholder')}
                                    value={formData.recommendations}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                                />
                            </div>

                            <div className="mt-4">
                                <Label>{t('agent.create.photosEvidence')}</Label>
                                <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <p className="text-xs text-slate-500">{t('agent.create.photosPickerHint')}</p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoPick}
                                        disabled={uploadingPhotos}
                                    />
                                    {uploadingPhotos && (
                                        <div className="text-sm text-blue-600 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> {t('agent.create.uploadingPhotos')}
                                        </div>
                                    )}
                                    {photos.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {photos.map((photo, index) => (
                                                <div key={`${photo.serverPath}-${index}`} className="relative rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                    <img src={photo.previewUrl} alt={`evidence-${index + 1}`} className="h-24 w-full object-cover" />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute right-1 top-1 h-6 w-6"
                                                        onClick={() => removePhoto(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label>{t('agent.create.documentsEvidence')}</Label>
                                <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <p className="text-xs text-slate-500">{t('agent.create.documentsPickerHint')}</p>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                                        multiple
                                        onChange={handleDocumentPick}
                                        disabled={uploadingDocuments}
                                    />
                                    {uploadingDocuments && (
                                        <div className="text-sm text-blue-600 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> {t('agent.create.uploadingDocuments')}
                                        </div>
                                    )}
                                    {documents.length > 0 && (
                                        <div className="space-y-2">
                                            {documents.map((document, index) => (
                                                <div key={`${document.serverPath}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                                                    <span className="text-sm text-slate-700 truncate max-w-[80%]">
                                                        {document.name}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        className="h-6 w-6"
                                                        onClick={() => removeDocument(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                    {t('agent.create.declareOffence')}
                                </Label>
                            </div>
                            {formData.offence_declared && (
                                <div className="space-y-4 border-t pt-4">
                                    <div>
                                        <Label>{t('agent.create.offenceDescription')}</Label>
                                        <Textarea
                                            className="mt-1"
                                            placeholder={t('agent.create.offencePlaceholder')}
                                            value={formData.offence_description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, offence_description: e.target.value }))}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <Label>{t('agent.create.proposedFine')}</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="mt-1"
                                            value={formData.proposed_fine}
                                            onChange={(e) => setFormData(prev => ({ ...prev, proposed_fine: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <Label>{t('agent.create.offenceSeverity')}</Label>
                                        <Select value={formData.offence_severity} onValueChange={(v) => setFormData(prev => ({ ...prev, offence_severity: v }))}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder={t('agent.create.offenceSeverityPlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minor">{t('agent.create.severityMinor')}</SelectItem>
                                                <SelectItem value="moderate">{t('agent.create.severityModerate')}</SelectItem>
                                                <SelectItem value="severe">{t('agent.create.severitySevere')}</SelectItem>
                                                <SelectItem value="critical">{t('agent.create.severityCritical')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-20">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('agent.create.summary')}</h2>
                            <div className="space-y-4">
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-500">{t('agent.create.complianceRate')}</p>
                                    <p className={`text-4xl font-bold ${parseFloat(complianceRate) >= 80 ? 'text-emerald-600' :
                                            parseFloat(complianceRate) >= 50 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                        {complianceRate}%
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-emerald-50 p-2 rounded text-center">
                                        <p className="text-emerald-600 font-bold">{formData.compliant_items}</p>
                                        <p className="text-xs text-emerald-700">{t('agent.create.compliant')}</p>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded text-center">
                                        <p className="text-red-600 font-bold">{formData.non_compliant_items}</p>
                                        <p className="text-xs text-red-700">{t('agent.create.nonCompliant')}</p>
                                    </div>
                                </div>
                                {formData.counterfeit_items > 0 && (
                                    <div className="bg-red-100 border border-red-200 p-3 rounded-lg text-center">
                                        <p className="text-red-800 font-bold">{formData.counterfeit_items} {t('agent.create.counterfeitItems')}</p>
                                    </div>
                                )}
                                {formData.offence_declared && (
                                    <div className="bg-red-100 border border-red-200 p-3 rounded-lg">
                                        <p className="text-red-800 font-bold flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> {t('agent.create.offenceDeclared')}
                                        </p>
                                        {formData.proposed_fine > 0 && (
                                            <p className="text-sm text-red-700 mt-1">
                                                {t('agent.create.fine')} {formData.proposed_fine.toLocaleString()} FC
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                {t('agent.create.saveInspection')}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
