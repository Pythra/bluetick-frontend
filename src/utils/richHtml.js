/** Shared helpers for Quill / rich HTML content (editor, preview, API). */

export const EMPTY_QUILL_HTML = '<p><br></p>';

export function hasMeaningfulHtml(html = '') {
  const stripped = (html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > 0;
}

export function sanitizeRichHtml(html = '') {
  if (!html || typeof html !== 'string') return '';

  let out = html.trim();
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '');
  out = out.replace(/<object\b[\s\S]*?<\/object>/gi, '');
  out = out.replace(/<embed\b[^>]*\/?>/gi, '');
  out = out.replace(/\s(on\w+)\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+)/gi, '');
  out = out.replace(/(\s)(href|src)\s*=\s*["']?\s*javascript:/gi, '$1$2="#"');
  return out;
}

/** Pull content from a full HTML document pasted into the HTML editor. */
export function extractEditableHtml(html = '') {
  const trimmed = (html || '').trim();
  if (!trimmed) return '';

  const bodyMatch = trimmed.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    return sanitizeRichHtml(bodyMatch[1].trim());
  }

  return sanitizeRichHtml(
    trimmed
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<head\b[\s\S]*?<\/head>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '')
      .trim()
  );
}

export function normalizeEditorHtml(html = '') {
  const cleaned = extractEditableHtml(html);
  if (!hasMeaningfulHtml(cleaned)) {
    return '';
  }
  return cleaned;
}

/** CSS for rendered Quill HTML (preview, blog body, email wrapper). */
export const RICH_HTML_CONTENT_CSS = `
.rich-html-content { color: #1e293b; font-size: 15px; line-height: 1.65; word-wrap: break-word; }
.rich-html-content p { margin: 0 0 1em; }
.rich-html-content h1, .rich-html-content h2, .rich-html-content h3, .rich-html-content h4 {
  color: #0f172a; line-height: 1.35; margin: 0 0 0.6em;
}
.rich-html-content h1 { font-size: 1.75rem; }
.rich-html-content h2 { font-size: 1.45rem; }
.rich-html-content h3 { font-size: 1.2rem; }
.rich-html-content h4 { font-size: 1.05rem; }
.rich-html-content ul, .rich-html-content ol { margin: 0 0 1em 1.25em; padding: 0; }
.rich-html-content blockquote {
  margin: 1em 0; padding: 0.5em 1em; border-left: 4px solid #93c5fd; color: #475569;
}
.rich-html-content pre, .rich-html-content pre.ql-syntax {
  background: #f1f5f9; border-radius: 8px; padding: 12px; overflow-x: auto; font-size: 13px;
}
.rich-html-content a { color: #0066ff; text-decoration: underline; }
.rich-html-content img { max-width: 100%; height: auto; border-radius: 8px; }
.rich-html-content strong { font-weight: 700; }
.rich-html-content em { font-style: italic; }
.rich-html-content .ql-align-center { text-align: center; }
.rich-html-content .ql-align-right { text-align: right; }
.rich-html-content .ql-align-justify { text-align: justify; }
.rich-html-content .ql-size-small { font-size: 0.88em; }
.rich-html-content .ql-size-large { font-size: 1.18em; }
.rich-html-content .ql-size-huge { font-size: 1.42em; }
.rich-html-content .ql-indent-1 { padding-left: 3em; }
.rich-html-content .ql-indent-2 { padding-left: 6em; }
.rich-html-content .ql-indent-3 { padding-left: 9em; }
.rich-html-content .ql-font-serif { font-family: Georgia, 'Times New Roman', serif; }
.rich-html-content .ql-font-monospace { font-family: Monaco, 'Courier New', monospace; }
`;
