import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AppToast from '../components/AppToast';
import ConfirmModal from '../components/ConfirmModal';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const useConfirm = () => {
  const { confirm } = useToast();
  return confirm;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const timerRef = useRef(null);
  const confirmResolverRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    ({ message, type = 'success', duration = 3200 }) => {
      if (!message) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({ message, type, id: Date.now() });

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          setToast(null);
          timerRef.current = null;
        }, duration);
      }
    },
    []
  );

  const closeConfirm = useCallback((result) => {
    confirmResolverRef.current?.(result);
    confirmResolverRef.current = null;
    setConfirmState(null);
  }, []);

  const confirm = useCallback(
    ({
      title = 'Please confirm',
      message = '',
      confirmLabel = 'Yes',
      cancelLabel = 'Cancel',
      tone = 'default',
    }) =>
      new Promise((resolve) => {
        confirmResolverRef.current = resolve;
        setConfirmState({
          title,
          message,
          confirmLabel,
          cancelLabel,
          tone,
          id: Date.now(),
        });
      }),
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast, confirm }}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <>
              {confirmState ? (
                <ConfirmModal
                  key={confirmState.id}
                  title={confirmState.title}
                  message={confirmState.message}
                  confirmLabel={confirmState.confirmLabel}
                  cancelLabel={confirmState.cancelLabel}
                  tone={confirmState.tone}
                  onConfirm={() => closeConfirm(true)}
                  onCancel={() => closeConfirm(false)}
                />
              ) : null}
              {toast ? (
                <AppToast
                  key={toast.id}
                  message={toast.message}
                  type={toast.type}
                  onDismiss={hideToast}
                />
              ) : null}
            </>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
};

export default ToastContext;
