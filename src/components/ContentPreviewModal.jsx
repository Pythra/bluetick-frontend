import { useEffect, useMemo } from 'react';
import '../pages/BlogPage.css';
import './ContentPreviewModal.css';
import './RichHtmlContent.css';
import { hasMeaningfulHtml, normalizeEditorHtml } from '../utils/richHtml';

const hasHtmlContent = (value = '') => hasMeaningfulHtml(value) || /<[^>]+>/.test(value);

function ContentPreviewModal({
  isOpen,
  onClose,
  dialogTitle = 'Preview',
  title,
  subtitle,
  category,
  author,
  contentHtml = '',
  images = [],
  notes = '',
  notesLabel = 'Additional instructions',
  emailPreview = false,
}) {
  const rawContent = useMemo(
    () => normalizeEditorHtml(contentHtml) || contentHtml || '',
    [contentHtml]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  const contentIsHtml = hasHtmlContent(rawContent);
  const plainParagraphs = contentIsHtml
    ? []
    : rawContent
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);

  return (
    <div
      className="content-preview-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-preview-dialog-title"
    >
      <div className="content-preview-panel" onClick={(event) => event.stopPropagation()}>
        <header className="content-preview-header">
          <h2 id="content-preview-dialog-title">{dialogTitle}</h2>
          <button type="button" className="content-preview-close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="content-preview-scroll">
          <article className="blog-article content-preview-article">
            {category ? <span className="blog-card-category">{category}</span> : null}
            <h1>{title || 'Untitled'}</h1>
            {subtitle ? <p className="content-preview-subtitle">{subtitle}</p> : null}
            {author ? (
              <div className="blog-article-meta">
                <span>{author}</span>
                <span>Preview</span>
              </div>
            ) : null}

            {images.length > 0 ? (
              <div className="blog-article-images">
                {images.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${title || 'Preview'} visual ${index + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}

            <div className={`blog-article-body${emailPreview ? ' email-preview-body' : ''}`}>
              {contentIsHtml ? (
                <div
                  className="rich-html-content"
                  dangerouslySetInnerHTML={{ __html: rawContent }}
                />
              ) : plainParagraphs.length > 0 ? (
                plainParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p className="content-preview-empty">No body content yet.</p>
              )}
            </div>

            {notes?.trim() ? (
              <section className="content-preview-notes">
                <h3>{notesLabel}</h3>
                <p>{notes.trim()}</p>
              </section>
            ) : null}
          </article>
        </div>
      </div>
    </div>
  );
}

export default ContentPreviewModal;