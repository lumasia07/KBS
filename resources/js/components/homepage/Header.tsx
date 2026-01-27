import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'

interface DropdownItem {
    label: string
    href: string
    description?: string
}

interface NavItemProps {
    label: string
    href?: string
    hasDropdown?: boolean
    dropdownItems?: DropdownItem[]
}

function NavItem({ label, href, hasDropdown, dropdownItems }: NavItemProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => hasDropdown && setIsOpen(true)}
            onMouseLeave={() => hasDropdown && setIsOpen(false)}
        >
            <a
                href={href || '#'}
                className="group flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#003366] transition-colors py-2"
            >
                <span className="relative">
                    {label}
                    {/* Animated underline */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300 ease-out"></span>
                </span>
                {hasDropdown && (
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </a>

            {/* Dropdown Menu */}
            {hasDropdown && dropdownItems && (
                <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-300 ease-out ${isOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                        }`}
                >
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200/80 overflow-hidden min-w-[240px]">
                        {/* Golden accent bar at top */}
                        <div className="h-1 bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFD700]"></div>

                        <div className="p-2">
                            {dropdownItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="block px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 group/item"
                                    style={{
                                        animationDelay: isOpen ? `${index * 50}ms` : '0ms',
                                        animation: isOpen ? 'fadeSlideIn 0.3s ease-out forwards' : 'none'
                                    }}
                                >
                                    <div className="text-sm font-medium text-slate-800 group-hover/item:text-[#003366] transition-colors">
                                        {item.label}
                                    </div>
                                    {item.description && (
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {item.description}
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Header() {
    const servicesDropdown: DropdownItem[] = [
        { label: 'Stamp Registration', href: '#', description: 'Register for official stamps' },
        { label: 'Compliance Certificates', href: '#', description: 'Request compliance documents' },
        { label: 'Verification Services', href: '#', description: 'Verify authenticity' },
        { label: 'Business Licensing', href: '#', description: 'Apply for licenses' },
    ]

    const portalsDropdown: DropdownItem[] = [
        { label: 'Taxpayer Portal', href: '/login', description: 'Access your taxpayer account' },
        { label: 'Agent Portal', href: '/agent/login', description: 'For verification agents' },
        { label: 'Admin Portal', href: '/portal/login', description: 'Administrative access' },
    ]

    return (
        <>
            {/* Animation keyframes */}
            <style>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <a href="/">
                            <img
                                src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                                alt="Kinshasa Bureau of Standards Logo"
                                className="h-14 w-auto hover:opacity-90 transition-opacity"
                            />
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <NavItem label="Home" href="/" />
                        <NavItem
                            label="Services"
                            hasDropdown
                            dropdownItems={servicesDropdown}
                        />
                        <NavItem
                            label="Portals"
                            hasDropdown
                            dropdownItems={portalsDropdown}
                        />
                        <NavItem label="Verify" href="#" />
                        <NavItem label="Contact" href="#" />
                        <NavItem label="FAQ" href="#" />

                        <button
                            onClick={() => router.visit('/login')}
                            className="relative overflow-hidden text-sm font-bold text-[#003366] bg-[#FFD700] hover:bg-[#F4C430] px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10">Sign In</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>
            </header>
        </>
    )
}

