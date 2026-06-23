import './AppToast.css';

function AppToast({ message, type = 'success', onDismiss }) {
  return (
    <div className={`app-toast app-toast--${type}`} role="status" aria-live="polite">
      <span className="app-toast-message">{message}</span>
      <button type="button" className="app-toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export default AppToast;
