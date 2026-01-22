import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

import { home } from '@/routes';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col">
                {/* Logo positioned at top left */}
                <div className="px-6 pt-4 pb-2">
                    <Link href={home()}>
                        <img
                            src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                            alt="Kinshasa Bureau of Standards Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 py-8">
                    <div className="w-full max-w-md">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-black mb-2">{title}</h1>
                            <p className="text-base text-[#003366]">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Side - Industry Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                {/* Industry background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/industry.jpg')" }}
                ></div>

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/70 via-[#003366]/50 to-[#002244]/60"></div>

                {/* Golden accent overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent"></div>

                {/* Decorative text */}
                <div className="absolute bottom-12 left-12 right-12 z-10">
                    <p className="text-white text-2xl font-bold mb-2">
                        Kinshasa Bureau of Standards
                    </p>
                    <p className="text-white/80 text-base">
                        Official Stamping System for Enterprises
                    </p>
                </div>
            </div>
        </div>
    );
}



