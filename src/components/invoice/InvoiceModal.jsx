import { useRef } from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import InvoiceDocument from './InvoiceDocument';
import { INVOICE_PRINT_STYLES } from './invoiceUtils';
import './InvoiceDocument.css';

export default function InvoiceModal({ invoice, onClose, className = '' }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${invoice.invoiceId}</title><style>${INVOICE_PRINT_STYLES}</style></head><body>${content}</body></html>`
    );
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 250);
  };

  return (
    <div className={`invoice-modal-backdrop ${className}`.trim()} onClick={onClose} role="presentation">
      <div
        className="invoice-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label={`Invoice ${invoice.invoiceId}`}
      >
        <div className="invoice-modal__toolbar">
          <strong>Invoice {invoice.invoiceId}</strong>
          <div className="invoice-modal__actions">
            <button type="button" className="invoice-modal__btn" onClick={handlePrint}>
              <MdPrint size={16} aria-hidden="true" />
              Print / Save PDF
            </button>
            <button type="button" className="invoice-modal__close" onClick={onClose} aria-label="Close">
              <MdClose size={18} />
            </button>
          </div>
        </div>

        <div ref={printRef} className="invoice-modal__body">
          <InvoiceDocument invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
