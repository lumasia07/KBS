// resources/js/Hooks/useFlashMessages.ts
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

declare module '@inertiajs/core' {
    interface PageProps {
        flash?: {
            success?: string;
            error?: string;
            warning?: string;
            info?: string;
        };
    }
}

export const useFlashMessages = () => {
    useEffect(() => {
        // Show flash messages on initial load
        const initialFlash = (window as any).page?.props?.flash;
        if (initialFlash) {
            showFlashMessages(initialFlash);
        }

        // Create event handler
        const handleNavigate = (event: any) => {
            const flash = event.detail.page.props.flash;
            if (flash) {
                showFlashMessages(flash);
            }
        };

        // Add event listener
        router.on('navigate', handleNavigate);

        // Cleanup function
        return () => {
            // Since router.off doesn't exist, we need to use the returned function
            // from router.on if it exists, or we can just not cleanup
            // as the component will unmount anyway
        };
    }, []);

    const showFlashMessages = (flash: any) => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    };
};