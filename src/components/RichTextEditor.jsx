import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { normalizeEditorHtml } from '../utils/richHtml';
import './RichTextEditor.css';

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
];

const modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'font',
  'size',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'script',
  'list',
  'bullet',
  'indent',
  'align',
  'blockquote',
  'code-block',
  'link',
  'image',
];

function positionPickerMenu(label, options) {
  const rect = label.getBoundingClientRect();
  const menuWidth = options.offsetWidth || 160;
  const menuHeight = options.offsetHeight || 220;
  const padding = 12;

  let left = rect.left;
  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - menuWidth - padding;
  }
  left = Math.max(padding, left);

  let top = rect.bottom + 6;
  if (top + menuHeight > window.innerHeight - padding) {
    top = Math.max(padding, rect.top - menuHeight - 6);
  }

  Object.assign(options.style, {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '10050',
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    minWidth: `${Math.max(rect.width, 120)}px`,
  });
}

function clearPickerMenuStyles(options) {
  options.removeAttribute('style');
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 220,
  enableHtmlSource = false,
}) {
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);
  const [mode, setMode] = useState('visual');
  const [htmlDraft, setHtmlDraft] = useState(value || '');

  useEffect(() => {
    if (mode === 'html') return;
    setHtmlDraft(value || '');
  }, [value, mode]);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root || mode !== 'visual') return undefined;

    const syncOpenPickers = () => {
      root.querySelectorAll('.ql-toolbar .ql-picker.ql-expanded').forEach((picker) => {
        const label = picker.querySelector('.ql-picker-label');
        const options = picker.querySelector('.ql-picker-options');
        if (label && options) {
          positionPickerMenu(label, options);
        }
      });

      root.querySelectorAll('.ql-toolbar .ql-picker:not(.ql-expanded) .ql-picker-options').forEach(
        clearPickerMenuStyles
      );
    };

    const scheduleSync = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        syncOpenPickers();
      });
    };

    const toolbar = root.querySelector('.ql-toolbar');
    if (!toolbar) return undefined;

    const observer = new MutationObserver((mutations) => {
      const pickerToggled = mutations.some((mutation) => {
        if (mutation.attributeName !== 'class') return false;
        const target = mutation.target;
        return target instanceof Element && target.classList.contains('ql-picker');
      });
      if (pickerToggled) {
        scheduleSync();
      }
    });

    observer.observe(toolbar, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class'],
    });

    const onReposition = () => scheduleSync();

    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
      root.querySelectorAll('.ql-toolbar .ql-picker-options').forEach(clearPickerMenuStyles);
    };
  }, [mode]);

  const switchToHtml = () => {
    setHtmlDraft(value || '');
    setMode('html');
  };

  const switchToVisual = () => {
    const normalized = normalizeEditorHtml(htmlDraft);
    onChange(normalized);
    setMode('visual');
  };

  const handleHtmlChange = (event) => {
    const next = event.target.value;
    setHtmlDraft(next);
    onChange(next);
  };

  return (
    <div
      ref={wrapperRef}
      className={`pro-rich-editor${enableHtmlSource ? ' has-html-mode' : ''}`}
      style={{ '--editor-min-height': `${minHeight}px` }}
    >
      {enableHtmlSource ? (
        <div className="pro-rich-editor-mode-bar">
          <button
            type="button"
            className={`pro-rich-editor-mode-btn${mode === 'visual' ? ' is-active' : ''}`}
            onClick={() => {
              if (mode === 'html') switchToVisual();
            }}
          >
            Visual
          </button>
          <button
            type="button"
            className={`pro-rich-editor-mode-btn${mode === 'html' ? ' is-active' : ''}`}
            onClick={() => {
              if (mode === 'visual') switchToHtml();
            }}
          >
            HTML
          </button>
          {mode === 'html' ? (
            <span className="pro-rich-editor-mode-hint">
              Paste or edit raw HTML. Switch to Visual to preview formatting.
            </span>
          ) : null}
        </div>
      ) : null}

      {mode === 'html' ? (
        <textarea
          className="pro-rich-editor-html-source"
          value={htmlDraft}
          onChange={handleHtmlChange}
          onBlur={() => {
            const normalized = normalizeEditorHtml(htmlDraft);
            if (normalized !== htmlDraft) {
              setHtmlDraft(normalized);
              onChange(normalized);
            }
          }}
          placeholder={placeholder || 'Paste or write HTML here...'}
          spellCheck={false}
          style={{ minHeight: `${minHeight}px` }}
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
        />
      )}
    </div>
  );
}

export default RichTextEditor;
