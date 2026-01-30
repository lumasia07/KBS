import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
    ChevronDown,
    Menu,
    X,
    Search,
    User,
    Shield,
    FileText,
    Building,
    Lock,
    LogIn,
    Sparkles
} from 'lucide-react'

interface DropdownItem {
    label: string
    href: string
    description?: string
    icon?: React.ReactNode
}

interface NavItemProps {
    label: string
    href?: string
    hasDropdown?: boolean
    dropdownItems?: DropdownItem[]
}

function NavItem({ label, href, hasDropdown, dropdownItems }: NavItemProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleInteraction = (open: boolean) => {
        if (hasDropdown) {
            setIsAnimating(true)
            setIsOpen(open)
            if (!open) {
                setTimeout(() => {
                    setIsAnimating(false)
                }, 150)
            }
        }
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => handleInteraction(true)}
            onMouseLeave={() => handleInteraction(false)}
            onFocus={() => handleInteraction(true)}
            onBlur={() => handleInteraction(false)}
        >
            <a
                href={href || '#'}
                className="group flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-slate-700 hover:text-[#003366] transition-all duration-300"
            >
                <span className="relative">
                    {label}
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFD700] to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </span>
                {hasDropdown && (
                    <ChevronDown
                        className={`w-3 h-3 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#003366]' : 'text-slate-500'}`}
                    />
                )}
            </a>

            {/* Dropdown Menu */}
            {hasDropdown && dropdownItems && (
                <div
                    className={`absolute top-full left-1/2 transform -translate-x-1/2 pt-3 transition-all duration-300 ease-out ${isOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-4 pointer-events-none'
                        }`}
                >
                    <div className="relative">
                        {/* Arrow tip */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
                            <div className="w-4 h-4 bg-white rotate-45 transform origin-center border-t border-l border-slate-200 shadow-sm"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden min-w-[280px] backdrop-blur-xl bg-white/95">
                            {/* Gradient header */}
                            <div className="h-1.5 bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFD700]"></div>

                            <div className="p-3">
                                {dropdownItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-white transition-all duration-300 group/item border border-transparent hover:border-amber-100"
                                        style={{
                                            animationDelay: isOpen ? `${index * 30}ms` : '0ms',
                                            animation: isOpen ? 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
                                        }}
                                    >
                                        {item.icon && (
                                            <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-amber-50 to-blue-50 group-hover/item:from-amber-100 group-hover/item:to-blue-100 transition-colors">
                                                {item.icon}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800 group-hover/item:text-[#003366] transition-colors">
                                                {item.label}
                                            </div>
                                            {item.description && (
                                                <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-slate-400 transform -rotate-90 group-hover/item:text-amber-500 transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const servicesDropdown: DropdownItem[] = [
        {
            label: 'Stamp Registration',
            href: '#',
            description: 'Register for official stamps',
            icon: <FileText className="w-4 h-4" />
        },
        {
            label: 'Compliance Certificates',
            href: '#',
            description: 'Request compliance documents',
            icon: <Shield className="w-4 h-4" />
        },
        {
            label: 'Verification Services',
            href: '#',
            description: 'Verify document authenticity',
            icon: <Lock className="w-4 h-4" />
        },
        {
            label: 'Business Licensing',
            href: '#',
            description: 'Apply for business licenses',
            icon: <Building className="w-4 h-4" />
        },
    ]

    const portalsDropdown: DropdownItem[] = [
        {
            label: 'Taxpayer Portal',
            href: '/login',
            description: 'Access your taxpayer account',
            icon: <User className="w-4 h-4" />
        },
        {
            label: 'Agent Portal',
            href: '/agent/login',
            description: 'For verification agents',
            icon: <Shield className="w-4 h-4" />
        },
        {
            label: 'Admin Portal',
            href: '/portal/login',
            description: 'Administrative access',
            icon: <Lock className="w-4 h-4" />
        },
    ]

    return (
        <>
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-lg py-2'
                : 'bg-white/90 backdrop-blur-lg py-3'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                className="group flex items-center gap-3"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-amber-400 rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                    <img
                                        src="https://cdn.magicpatterns.com/uploads/nRbgAZNugWHkS5qXQRobNd/image.png"
                                        alt="Kinshasa Bureau of Standards Logo"
                                        className="relative h-10 w-auto transition-all duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            <div className="flex items-center gap-1">
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
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="ml-6 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <Search className="w-5 h-5 text-slate-600" />
                            </button>

                            {/* Sign In Button */}
                            <div className="ml-4">
                                <button
                                    onClick={() => router.visit('/login')}
                                    className="group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-amber-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                                    <div className="relative flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-[#003366] to-[#004488] hover:from-[#004488] hover:to-[#003366] px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <Search className="w-5 h-5 text-slate-600" />
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6 text-slate-700" />
                                ) : (
                                    <Menu className="w-6 h-6 text-slate-700" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="py-4 animate-slideDown">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search for services, documents, or help..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className={`lg:hidden transition-all duration-500 ease-out ${isMobileMenuOpen
                        ? 'max-h-[500px] opacity-100 visible'
                        : 'max-h-0 opacity-0 invisible'
                        }`}>
                        <div className="py-6 space-y-2 border-t border-slate-100 mt-2">
                            <a
                                href="/"
                                className="block px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium"
                            >
                                Home
                            </a>

                            <div className="px-4 py-3">
                                <div className="text-sm font-semibold text-slate-400 mb-2">Services</div>
                                <div className="space-y-2">
                                    {servicesDropdown.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600"
                                        >
                                            {item.icon}
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-xs text-slate-500">{item.description}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3">
                                <div className="text-sm font-semibold text-slate-400 mb-2">Portals</div>
                                <div className="space-y-2">
                                    {portalsDropdown.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-600"
                                        >
                                            {item.icon}
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-xs text-slate-500">{item.description}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <a
                                href="#"
                                className="block px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium"
                            >
                                Verify
                            </a>
                            <a
                                href="#"
                                className="block px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium"
                            >
                                Contact
                            </a>
                            <a
                                href="#"
                                className="block px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 font-medium"
                            >
                                FAQ
                            </a>

                            <div className="pt-4 px-4">
                                <button
                                    onClick={() => router.visit('/login')}
                                    className="w-full text-sm font-bold text-white bg-gradient-to-r from-[#003366] to-[#004488] hover:from-[#004488] hover:to-[#003366] px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md"
                                >
                                    Sign In to Portal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="h-16"></div>
        </>
    )
}