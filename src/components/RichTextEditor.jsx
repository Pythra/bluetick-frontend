import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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

function RichTextEditor({ value, onChange, placeholder, minHeight = 220 }) {
  const wrapperRef = useRef(null);
  const portalStateRef = useRef({ picker: null, options: null });
  const rafRef = useRef(null);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return undefined;

    const releasePortal = () => {
      const { picker, options } = portalStateRef.current;
      if (!picker || !options) return;

      if (options.parentElement === document.body) {
        picker.appendChild(options);
      }
      options.classList.remove('ql-picker-options--portal');
      options.removeAttribute('style');
      portalStateRef.current = { picker: null, options: null };
    };

    const syncPickerPortal = () => {
      const expanded = root.querySelector('.ql-toolbar .ql-picker.ql-expanded');

      if (!expanded) {
        releasePortal();
        return;
      }

      const label = expanded.querySelector('.ql-picker-label');
      if (!label) {
        releasePortal();
        return;
      }

      const { picker: activePicker, options: activeOptions } = portalStateRef.current;

      // Menu already portaled for this picker — only reposition (avoids blink loop)
      if (
        activePicker === expanded &&
        activeOptions &&
        activeOptions.classList.contains('ql-picker-options--portal') &&
        activeOptions.parentElement === document.body
      ) {
        positionPickerMenu(label, activeOptions);
        return;
      }

      let options = expanded.querySelector('.ql-picker-options');
      if (!options) {
        return;
      }

      if (activePicker !== expanded) {
        releasePortal();
      }

      options.classList.add('ql-picker-options--portal');
      if (options.parentElement !== document.body) {
        document.body.appendChild(options);
      }
      portalStateRef.current = { picker: expanded, options };
      positionPickerMenu(label, options);
    };

    const scheduleSync = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        syncPickerPortal();
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

    const onReposition = () => {
      const { picker, options } = portalStateRef.current;
      if (!picker || !options || options.parentElement !== document.body) return;
      const label = picker.querySelector('.ql-picker-label');
      if (label) positionPickerMenu(label, options);
    };

    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
      releasePortal();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pro-rich-editor"
      style={{ '--editor-min-height': `${minHeight}px` }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

export default RichTextEditor;
