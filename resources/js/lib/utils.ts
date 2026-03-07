import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const formatCurrency = (amount: number): string => {
    // Use USD as base currency but replace the symbol with FC
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Use USD as base since FC might not be in all browsers
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('$', 'FC ');
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};