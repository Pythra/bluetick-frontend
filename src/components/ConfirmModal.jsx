import { useEffect, useRef } from 'react';
import './ConfirmModal.css';

function ConfirmModal({
  title = 'Please confirm',
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confirmRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div className="app-confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className={`app-confirm-dialog app-confirm-dialog--${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="app-confirm-title"
        aria-describedby="app-confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="app-confirm-accent" aria-hidden="true" />
        <h2 id="app-confirm-title" className="app-confirm-title">
          {title}
        </h2>
        {message ? (
          <p id="app-confirm-message" className="app-confirm-message">
            {message}
          </p>
        ) : null}
        <div className="app-confirm-actions">
          <button type="button" className="app-confirm-btn app-confirm-btn--ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="app-confirm-btn app-confirm-btn--primary"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
