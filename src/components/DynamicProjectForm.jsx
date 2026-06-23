import { useState } from 'react';
import Button from './Button';
import { useToast } from '../contexts/ToastContext';
import { getFormSchema } from '../data/projectOnboardingForms';

function emptyValues(fields) {
  const values = {};
  fields.forEach((field) => {
    if (field.type === 'checkbox') {
      values[field.id] = false;
    } else if (field.type === 'files') {
      values[field.id] = [];
    } else {
      values[field.id] = '';
    }
  });
  return values;
}

function DynamicProjectForm({
  formType,
  taskLabel,
  itemId,
  orderId,
  apiUrl,
  authFetch,
  initialValues,
  onSuccess,
  onCancel,
}) {
  const schema = getFormSchema(formType);
  const { showToast } = useToast();
  const [values, setValues] = useState(() => ({
    ...emptyValues(schema.fields),
    ...(initialValues || {}),
  }));
  const [uploadingField, setUploadingField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field.id]: value }));
  };

  const uploadFile = async (field, file) => {
    const body = new FormData();
    body.append('file', file);
    body.append('orderId', orderId);
    body.append('fieldId', field.id);

    const response = await authFetch(`${apiUrl}/api/orders/project-upload`, {
      method: 'POST',
      body,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Upload failed');
    }
    return { url: data.url, fileName: data.fileName };
  };

  const handleFileChange = async (field, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploadingField(field.id);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadFile(field, file));
      }
      if (field.type === 'files') {
        setValues((prev) => ({
          ...prev,
          [field.id]: [...(prev[field.id] || []), ...uploaded],
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          [field.id]: uploaded[0],
        }));
      }
    } catch (uploadError) {
      const message = uploadError.message || 'File upload failed';
      setError(message);
      showToast({ message, type: 'error' });
    } finally {
      setUploadingField('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    for (const field of schema.fields) {
      if (!field.required) continue;
      const value = values[field.id];
      if (field.type === 'checkbox') continue;
      if (field.type === 'file' || field.type === 'files') {
        const hasFile =
          field.type === 'files'
            ? Array.isArray(value) && value.length > 0
            : value && (value.url || value.fileName);
        if (!hasFile && !String(value || '').trim()) {
          setError(`${field.label} is required`);
          return;
        }
        continue;
      }
      if (!String(value || '').trim()) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload =
        formType === 'client_profile'
          ? { orderId, formType, clientProfile: values }
          : { orderId, formType, itemId, formData: values };

      const response = await authFetch(`${apiUrl}/api/orders/project-submission`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to save project details');
      }
      showToast({ message: data.message || 'Saved successfully.', type: 'success' });
      onSuccess?.(data);
    } catch (submitError) {
      const message = submitError.message || 'Submission failed';
      setError(message);
      showToast({ message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="project-onboarding-form" onSubmit={handleSubmit}>
      <header className="project-onboarding-form-head">
        <h2>{schema.title}</h2>
        {taskLabel && taskLabel !== schema.title ? (
          <p className="project-onboarding-form-service">{taskLabel}</p>
        ) : null}
        {schema.description ? <p>{schema.description}</p> : null}
      </header>

      {schema.fields.map((field) => (
        <div key={field.id} className="project-onboarding-field">
          <label htmlFor={field.id}>
            {field.label}
            {field.required ? <span className="project-onboarding-required"> *</span> : null}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              rows={4}
              value={values[field.id] || ''}
              placeholder={field.placeholder || ''}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          ) : null}

          {field.type === 'checkbox' ? (
            <label className="project-onboarding-checkbox">
              <input
                type="checkbox"
                checked={!!values[field.id]}
                onChange={(e) => handleChange(field, e.target.checked)}
              />
              <span>Yes</span>
            </label>
          ) : null}

          {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
            <input
              id={field.id}
              type={field.type}
              value={values[field.id] || ''}
              placeholder={field.placeholder || ''}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          ) : null}

          {field.type === 'file' || field.type === 'files' ? (
            <div className="project-onboarding-file">
              <input
                type="file"
                multiple={field.type === 'files'}
                accept="image/*,.pdf,.doc,.docx,.zip"
                onChange={(e) => handleFileChange(field, e.target.files)}
              />
              {uploadingField === field.id ? (
                <span className="project-onboarding-uploading">Uploading…</span>
              ) : null}
              {field.type === 'file' && values[field.id]?.fileName ? (
                <span className="project-onboarding-file-name">{values[field.id].fileName}</span>
              ) : null}
              {field.type === 'files' && Array.isArray(values[field.id]) && values[field.id].length > 0 ? (
                <ul className="project-onboarding-file-list">
                  {values[field.id].map((file) => (
                    <li key={file.url}>{file.fileName}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}

      {error ? <p className="project-onboarding-error" role="alert">{error}</p> : null}

      <div className="project-onboarding-form-actions">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Back to checklist
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting || !!uploadingField}>
          {isSubmitting ? 'Saving…' : 'Save & continue'}
        </Button>
      </div>
    </form>
  );
}

export default DynamicProjectForm;
