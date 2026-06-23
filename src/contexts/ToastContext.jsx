import { createContext, useCallback, useContext, useRef, useState } from 'react';
import AppToast from '../components/AppToast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

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

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast ? (
        <AppToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
};

export default ToastContext;
