/**
 * Toast Helper - Notificaciones consistentes
 * Version: v2.0 - Con info y warning
 * Autor:  Franz (@franzmr1)
 * Fecha: 2025-12-07
 */

import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
      duration: 3000,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
      duration: 5000,
    });
  },

  // ✅ NUEVO: Info
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
      style: {
        background: '#3b82f6',
        color:  '#fff',
      },
    });
  },

  // ✅ NUEVO: Warning
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
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
      icon:  icon || '💡',
    });
  },
};