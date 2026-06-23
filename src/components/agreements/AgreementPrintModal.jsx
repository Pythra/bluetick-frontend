import { useMemo, useRef } from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import { extractPrintableAgreement, printAgreementContent } from '../../utils/printAgreement';
import '../invoice/InvoiceDocument.css';
import './AgreementPrintModal.css';

export default function AgreementPrintModal({ agreement, onClose }) {
  const printRef = useRef(null);
  const payload = useMemo(
    () => extractPrintableAgreement(agreement?.renderedHtml),
    [agreement?.renderedHtml]
  );

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    printAgreementContent({
      bodyHtml: content,
      styles: payload?.styles || '',
      title: agreement?.agreementNumber || 'Service Agreement',
    });
  };

  if (!payload?.bodyHtml) {
    return null;
  }

  return (
    <div className="invoice-modal-backdrop agreement-print-backdrop" onClick={onClose} role="presentation">
      <div
        className="invoice-modal agreement-print-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label={`Agreement ${agreement?.agreementNumber || ''}`}
      >
        <div className="invoice-modal__toolbar">
          <strong>Agreement {agreement?.agreementNumber || ''}</strong>
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

        <div
          ref={printRef}
          className="invoice-modal__body agreement-print-modal__body"
          dangerouslySetInnerHTML={{ __html: payload.bodyHtml }}
        />
      </div>
    </div>
  );
}
