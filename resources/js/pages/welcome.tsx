// Welcome page with homepage components
import { Head } from '@inertiajs/react';

import { Header } from '@/components/homepage/Header';
import { Hero } from '@/components/homepage/Hero';
import { AboutSection } from '@/components/homepage/AboutSection';
import { StatsSection } from '@/components/homepage/StatsSection';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { VerifySection } from '@/components/homepage/VerifySection';
import { ContactSection } from '@/components/homepage/ContactSection';
import { Footer } from '@/components/homepage/Footer';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <>
            <Head title="Regie De Controle et D'estamplillage de Kinshasa" />
            <Header />
            <Hero />
            <AboutSection />
            <StatsSection />
            <HowItWorks />
            <VerifySection />
            <ContactSection />
            <Footer />
        </>
    );
}
