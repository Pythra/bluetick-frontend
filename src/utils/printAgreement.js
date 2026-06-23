export const AGREEMENT_PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #0f172a;
    padding: 12mm 14mm;
  }

  .agreement-branded {
    background: #fff !important;
    padding: 0 !important;
  }

  .agreement-a4-sheet {
    width: 100% !important;
    max-width: none !important;
    min-height: auto !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
  }

  .agreement-a4-watermark {
    opacity: 0.07 !important;
  }

  .agreement-terms-details > summary {
    display: none !important;
  }

  .agreement-terms-details .agreement-terms-body,
  .agreement-terms-details[open] .agreement-terms-body {
    display: block !important;
  }

  img {
    max-width: 100%;
  }
`;

export function extractPrintableAgreement(renderedHtml) {
  if (!renderedHtml || typeof renderedHtml !== 'string') {
    return null;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderedHtml, 'text/html');
    const styles = Array.from(doc.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');
    const bodyHtml = doc.body?.innerHTML?.trim();

    if (bodyHtml) {
      return { styles, bodyHtml };
    }
  } catch {
    /* fall through */
  }

  return {
    styles: '',
    bodyHtml: renderedHtml,
  };
}

export function printAgreementContent({ bodyHtml, styles = '', title = 'Service Agreement' }) {
  if (!bodyHtml || typeof bodyHtml !== 'string') {
    return false;
  }

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    return false;
  }

  const safeTitle = String(title).replace(/[<>]/g, '');

  win.document.open();
  win.document.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${safeTitle}</title><style>${styles}${AGREEMENT_PRINT_STYLES}</style></head><body>${bodyHtml}</body></html>`
  );
  win.document.close();
  win.focus();

  setTimeout(() => {
    try {
      win.print();
    } catch {
      /* ignore */
    }
  }, 250);

  return true;
}

/**
 * Print agreement HTML returned by the API (full document string).
 */
export function printAgreementHtml(renderedHtml, title = 'Service Agreement') {
  const payload = extractPrintableAgreement(renderedHtml);
  if (!payload?.bodyHtml) {
    return false;
  }

  return printAgreementContent({
    bodyHtml: payload.bodyHtml,
    styles: payload.styles,
    title,
  });
}

/**
 * Print the agreement currently rendered in an iframe (most reliable on the sign page).
 */
export function printAgreementFromIframe(iframe, title = 'Service Agreement') {
  const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
  if (!doc?.body) {
    return false;
  }

  const styles = Array.from(doc.querySelectorAll('style'))
    .map((node) => node.textContent || '')
    .join('\n');

  return printAgreementContent({
    bodyHtml: doc.body.innerHTML,
    styles,
    title,
  });
}
