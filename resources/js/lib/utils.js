import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function flashMessage(params) {
    return params.props.flash_message;
}

export const deleteAction = (url, { closeModal, ...options } = {}) => {
    const defaultOptions = {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (success) => {
            const flash = flashMessage(success);
            if (flash) {
                toast[flash.type](flash.message);
            }
            if (closeModal && typeof closeModal === 'function') {
                closeModal();
            }
        },
        ...options,
    };

    router.delete(url, defaultOptions);
};

export function formatDateIndo(dateString) {
  if (!dateString) return '-'; // atau return nilai default lain
  return format(parseISO(dateString), 'dd MMMM yyyy', { locale: id });
}


export const formatToRupiah = (amount) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(amount);
};

export const STUDYPLANSTATUS = {
    PENDING: 'pending',
    REJECT: 'reject',
    APPROVED: 'approve',
};

export const STUDYPLANSTATUSVARIANT = {
    [STUDYPLANSTATUS.PENDING]: 'secondary',
    [STUDYPLANSTATUS.REJECT]: 'destructive',
    [STUDYPLANSTATUS.APPROVED]: 'success',
};

export const FEESTATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
};

export const FEESTATUSVARIANT = {
    [FEESTATUS.PENDING]: 'secondary',
    [FEESTATUS.SUCCESS]: 'success',
    [FEESTATUS.FAILED]: 'destructive',
};

export const feeCodeGenerator = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
};
