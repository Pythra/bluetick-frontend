/**
 * Open a print dialog for agreement HTML returned by the API.
 * The API returns a full HTML document — do not wrap it in another document.
 */
export function printAgreementHtml(renderedHtml, title = 'Service Agreement') {
  if (!renderedHtml || typeof renderedHtml !== 'string') {
    return false;
  }

  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) {
    return false;
  }

  const isFullDocument = /<!DOCTYPE/i.test(renderedHtml) || /<html[\s>]/i.test(renderedHtml);

  printWindow.document.open();
  if (isFullDocument) {
    printWindow.document.write(renderedHtml);
  } else {
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body>${renderedHtml}</body>
</html>`);
  }
  printWindow.document.close();

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      /* ignore */
    }
  };

  printWindow.addEventListener('load', triggerPrint);
  setTimeout(triggerPrint, 600);

  return true;
}
