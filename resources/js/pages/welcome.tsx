// Welcome page with homepage components
import { Head } from '@inertiajs/react';

import { Header } from '@/components/homepage/Header';
import { Hero } from '@/components/homepage/Hero';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Footer } from '@/components/homepage/Footer';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title="Kinshasa Bureau of Standards" />
            <Header />
            <Hero />
            <HowItWorks />
            <Footer />
        </>
    );
}
