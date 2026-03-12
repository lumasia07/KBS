// Welcome page with homepage components
import { Head } from '@inertiajs/react';

import { Header } from '@/components/homepage/Header';
import { Hero } from '@/components/homepage/Hero';
import { AboutSection } from '@/components/homepage/AboutSection';
import { StatsSection } from '@/components/homepage/StatsSection';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { ContactSection } from '@/components/homepage/ContactSection';
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
            <AboutSection />
            <StatsSection />
            <HowItWorks />
            <ContactSection />
            <Footer />
        </>
    );
}
