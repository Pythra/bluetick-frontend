import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './RichTextEditor.css';

const toolbarOptions = [
  [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
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

function RichTextEditor({ value, onChange, placeholder, minHeight = 220 }) {
  return (
    <div className="pro-rich-editor" style={{ '--editor-min-height': `${minHeight}px` }}>
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
