// Welcome page with homepage components
import { Head } from '@inertiajs/react';

import { Hero } from '@/components/homepage/Hero';
import { FeaturesGrid } from '@/components/homepage/feautresGrid';
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
            <Hero />
            <HowItWorks />
            <FeaturesGrid />
            <Footer />
        </>
    );
}
