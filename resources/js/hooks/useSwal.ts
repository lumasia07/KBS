import Swal from 'sweetalert2';

interface SwalOptions {
    title?: string;
    text?: string;
    html?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    reverseButtons?: boolean;
    timer?: number;
    showDenyButton?: boolean;
    denyButtonText?: string;
    onConfirm?: () => void;
    onDeny?: () => void;
    onCancel?: () => void;
}

export const useSwal = () => {
    const showAlert = (options: SwalOptions) => {
        return Swal.fire({
            title: options.title || 'Notification',
            text: options.text,
            html: options.html,
            icon: options.icon || 'info',
            showConfirmButton: options.showConfirmButton ?? true,
            showCancelButton: options.showCancelButton ?? false,
            showDenyButton: options.showDenyButton ?? false,
            confirmButtonText: options.confirmButtonText || 'OK',
            cancelButtonText: options.cancelButtonText || 'Cancel',
            denyButtonText: options.denyButtonText || 'No',
            confirmButtonColor: options.confirmButtonColor || '#3085d6',
            cancelButtonColor: options.cancelButtonColor || '#d33',
            reverseButtons: options.reverseButtons ?? true,
            timer: options.timer,
        }).then((result) => {
            if (result.isConfirmed && options.onConfirm) {
                options.onConfirm();
            }
            if (result.isDenied && options.onDeny) {
                options.onDeny();
            }
            if (result.isDismissed && options.onCancel) {
                options.onCancel();
            }
        });
    };

    const showConfirm = (options: SwalOptions) => {
        return showAlert({
            ...options,
            showCancelButton: true,
            confirmButtonText: options.confirmButtonText || 'Yes',
            cancelButtonText: options.cancelButtonText || 'No',
            icon: options.icon || 'question',
        });
    };

    const showSuccess = (message: string, title?: string) => {
        return showAlert({
            title: title || 'Success',
            text: message,
            icon: 'success',
        });
    };

    const showError = (message: string, title?: string) => {
        return showAlert({
            title: title || 'Error',
            text: message,
            icon: 'error',
        });
    };

    const showWarning = (message: string, title?: string) => {
        return showAlert({
            title: title || 'Warning',
            text: message,
            icon: 'warning',
        });
    };

    const showInfo = (message: string, title?: string) => {
        return showAlert({
            title: title || 'Information',
            text: message,
            icon: 'info',
        });
    };

    const showLoading = (message?: string) => {
        return Swal.fire({
            title: message || 'Processing...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    const closeLoading = () => {
        Swal.close();
    };

    return {
        showAlert,
        showConfirm,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        closeLoading,
    };
};