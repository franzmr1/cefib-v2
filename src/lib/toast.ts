/**
 * Toast Helper - Notificaciones consistentes
 * Version: v1.0
 * Autor: Franz (@franzmr1)
 */

import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
    });
  },

  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      icon: '⏳',
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  custom: (message: string, icon?: string) => {
    toast(message, {
      icon: icon || '💡',
    });
  },
};