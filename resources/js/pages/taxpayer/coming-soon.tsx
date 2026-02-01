import { Head, Link } from '@inertiajs/react';
import { Construction, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

export default function ComingSoon() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Coming Soon', href: '#' }]}>
            <Head title="Coming Soon" />

            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 rounded-full bg-blue-50 p-6">
                    <Construction className="h-12 w-12 text-[#003366]" />
                </div>

                <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
                    Coming Soon
                </h1>

                <p className="mb-8 max-w-md text-slate-500">
                    This feature is currently under development. We're working hard to bring you the best experience possible.
                </p>

                <Button asChild className="bg-[#003366] hover:bg-[#002244]">
                    <Link href="/taxpayer/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
