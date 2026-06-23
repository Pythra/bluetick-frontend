import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdAdd, MdClose, MdDelete } from 'react-icons/md';
import {
  PARTNER_CUSTOM_REQUESTS_DEFAULTS,
  PARTNER_CUSTOM_SERVICE_CONTENT_DEFAULTS,
  PARTNER_FAQ_DEFAULTS,
  PARTNER_IMPACT_STATS_DEFAULTS,
  PARTNER_SERVICE_SECTION_DEFAULTS,
  PARTNER_TESTIMONIALS_DEFAULTS,
} from '../../data/partnerSectionDefaults';
import { isCustomServiceId } from '../../config/partnerSiteConfig';

function bulletsToText(bullets = []) {
  return bullets.join('\n');
}

function textToBullets(value = '') {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildInitialState(editorType, sectionKey, sectionContent = {}, siteContent = {}) {
  if (editorType === 'hero') {
    return {
      tagline: siteContent.tagline || '',
      heroTitle: siteContent.heroTitle || '',
      heroDescription: siteContent.heroDescription || '',
    };
  }

  const stored = sectionContent[sectionKey] || {};

  if (editorType === 'service') {
    const defaults = isCustomServiceId(sectionKey)
      ? PARTNER_CUSTOM_SERVICE_CONTENT_DEFAULTS
      : PARTNER_SERVICE_SECTION_DEFAULTS[sectionKey] || {};
    return {
      eyebrow: stored.eyebrow ?? defaults.eyebrow ?? '',
      titleBlack: stored.titleBlack ?? defaults.titleBlack ?? '',
      titleBlue: stored.titleBlue ?? defaults.titleBlue ?? '',
      intro: stored.intro ?? defaults.intro ?? '',
      heroKicker: stored.heroKicker ?? defaults.heroKicker ?? '',
      heroTitle: stored.heroTitle ?? defaults.heroTitle ?? '',
      bulletsText: bulletsToText(stored.bullets?.length ? stored.bullets : defaults.bullets),
    };
  }

  if (editorType === 'testimonials') {
    const defaults = PARTNER_TESTIMONIALS_DEFAULTS;
    return {
      title: stored.title ?? defaults.title,
      subtitle: stored.subtitle ?? defaults.subtitle,
      sideTagline: stored.sideTagline ?? defaults.sideTagline,
      titleBlack: stored.titleBlack ?? defaults.titleBlack,
      titleBlue: stored.titleBlue ?? defaults.titleBlue,
      items: (stored.items?.length ? stored.items : defaults.items).map((item) => ({ ...item })),
    };
  }

  if (editorType === 'faq') {
    const defaults = PARTNER_FAQ_DEFAULTS;
    return {
      titleBlack: stored.titleBlack ?? defaults.titleBlack,
      titleBlue: stored.titleBlue ?? defaults.titleBlue,
      items: (stored.items?.length ? stored.items : defaults.items).map((item) => ({ ...item })),
    };
  }

  if (editorType === 'impactStats') {
    const defaults = PARTNER_IMPACT_STATS_DEFAULTS;
    return {
      items: (stored.items?.length ? stored.items : defaults.items).map((item) => ({ ...item })),
    };
  }

  if (editorType === 'customRequests') {
    const defaults = PARTNER_CUSTOM_REQUESTS_DEFAULTS;
    return {
      titleBlack: stored.titleBlack ?? defaults.titleBlack,
      titleBlue: stored.titleBlue ?? defaults.titleBlue,
      intro: stored.intro ?? defaults.intro,
      successMessage: stored.successMessage ?? defaults.successMessage,
    };
  }

  return {};
}

function serializeState(editorType, state) {
  if (editorType === 'hero') {
    return {
      contentPatch: {
        tagline: state.tagline,
        heroTitle: state.heroTitle,
        heroDescription: state.heroDescription,
      },
    };
  }

  if (editorType === 'service') {
    return {
      sectionPatch: {
        eyebrow: state.eyebrow,
        titleBlack: state.titleBlack,
        titleBlue: state.titleBlue,
        intro: state.intro,
        heroKicker: state.heroKicker,
        heroTitle: state.heroTitle,
        bullets: textToBullets(state.bulletsText),
      },
    };
  }

  if (editorType === 'testimonials' || editorType === 'faq') {
    return {
      sectionPatch: {
        ...(editorType === 'testimonials'
          ? {
              title: state.title,
              subtitle: state.subtitle,
              sideTagline: state.sideTagline,
            }
          : {}),
        titleBlack: state.titleBlack,
        titleBlue: state.titleBlue,
        items: state.items,
      },
    };
  }

  if (editorType === 'impactStats') {
    return {
      sectionPatch: {
        items: state.items,
      },
    };
  }

  if (editorType === 'customRequests') {
    return {
      sectionPatch: {
        titleBlack: state.titleBlack,
        titleBlue: state.titleBlue,
        intro: state.intro,
        successMessage: state.successMessage,
      },
    };
  }

  return {};
}

function SectionContentEditor({
  isOpen,
  sectionKey,
  editorType,
  title,
  sectionContent,
  siteContent,
  onClose,
  onSave,
}) {
  const initialState = useMemo(
    () => buildInitialState(editorType, sectionKey, sectionContent, siteContent),
    [editorType, sectionKey, sectionContent, siteContent, isOpen]
  );
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      setForm(initialState);
    }
  }, [initialState, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !editorType) {
    return null;
  }

  const listItems = Array.isArray(form.items) ? form.items : [];

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateListItem = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      items: (Array.isArray(prev.items) ? prev.items : []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addListItem = (template) => {
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), { ...template }],
    }));
  };

  const removeListItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: (Array.isArray(prev.items) ? prev.items : []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(serializeState(editorType, form));
    onClose();
  };

  const editorBody = (
    <div className="pdash-editor-backdrop" role="presentation" onClick={onClose}>
      <div
        className="pdash-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdash-editor-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pdash-editor-head">
          <div>
            <h3 id="pdash-editor-title">{title}</h3>
            <p>Edit the text that appears in this section on your homepage.</p>
          </div>
          <button type="button" className="pdash-editor-close" onClick={onClose} aria-label="Close editor">
            <MdClose />
          </button>
        </div>

        <form className="pdash-editor-form" onSubmit={handleSubmit}>
          {editorType === 'hero' ? (
            <>
              <p className="pdash-editor-note">
                Hero video or image is uploaded in the <strong>Media Library</strong> tab under <strong>Homepage Hero</strong>.
                If both are set, the hero image takes priority over the video.
              </p>
              <div className="pdash-field">
                <label>Brand tagline</label>
                <textarea rows={2} value={form.tagline || ''} onChange={(e) => updateField('tagline', e.target.value)} />
              </div>
              <div className="pdash-field">
                <label>Hero title</label>
                <textarea rows={2} value={form.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} />
              </div>
              <div className="pdash-field">
                <label>Hero description</label>
                <textarea rows={2} value={form.heroDescription || ''} onChange={(e) => updateField('heroDescription', e.target.value)} />
              </div>
            </>
          ) : null}

          {editorType === 'service' ? (
            <>
              <div className="pdash-grid-2">
                <div className="pdash-field">
                  <label>Eyebrow label</label>
                  <input value={form.eyebrow || ''} onChange={(e) => updateField('eyebrow', e.target.value)} />
                </div>
                <div className="pdash-field">
                  <label>Hero kicker</label>
                  <input value={form.heroKicker || ''} onChange={(e) => updateField('heroKicker', e.target.value)} />
                </div>
              </div>
              <div className="pdash-grid-2">
                <div className="pdash-field">
                  <label>Title — first line (gray)</label>
                  <input value={form.titleBlack || ''} onChange={(e) => updateField('titleBlack', e.target.value)} />
                </div>
                <div className="pdash-field">
                  <label>Title — accent word (brand color)</label>
                  <input value={form.titleBlue || ''} onChange={(e) => updateField('titleBlue', e.target.value)} />
                </div>
              </div>
              <div className="pdash-field">
                <label>Section introduction</label>
                <textarea rows={3} value={form.intro || ''} onChange={(e) => updateField('intro', e.target.value)} />
              </div>
              <div className="pdash-field">
                <label>Hero card title</label>
                <input value={form.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} />
              </div>
              <div className="pdash-field">
                <label>Highlight bullets (one per line)</label>
                <textarea rows={5} value={form.bulletsText || ''} onChange={(e) => updateField('bulletsText', e.target.value)} />
              </div>
            </>
          ) : null}

          {(editorType === 'testimonials' || editorType === 'faq') ? (
            <>
              {editorType === 'testimonials' ? (
                <>
                  <div className="pdash-field">
                    <label>Section title</label>
                    <input value={form.title || ''} onChange={(e) => updateField('title', e.target.value)} />
                  </div>
                  <div className="pdash-field">
                    <label>Subtitle</label>
                    <input value={form.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} />
                  </div>
                  <div className="pdash-field">
                    <label>Side tagline</label>
                    <input value={form.sideTagline || ''} onChange={(e) => updateField('sideTagline', e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="pdash-grid-2">
                  <div className="pdash-field">
                    <label>Section title — first line</label>
                    <input value={form.titleBlack || ''} onChange={(e) => updateField('titleBlack', e.target.value)} />
                  </div>
                  <div className="pdash-field">
                    <label>Section title — accent line</label>
                    <input value={form.titleBlue || ''} onChange={(e) => updateField('titleBlue', e.target.value)} />
                  </div>
                </div>
              )}
              <div className="pdash-editor-list">
                {listItems.map((item, index) => (
                  <div key={`${editorType}-${index}`} className="pdash-editor-list-item">
                    <div className="pdash-editor-list-head">
                      <strong>{editorType === 'faq' ? `Question ${index + 1}` : `Testimonial ${index + 1}`}</strong>
                      <button type="button" className="pdash-btn pdash-btn-ghost" onClick={() => removeListItem(index)}>
                        <MdDelete /> Remove
                      </button>
                    </div>
                    {editorType === 'testimonials' ? (
                      <>
                        <div className="pdash-grid-2">
                          <div className="pdash-field">
                            <label>Name</label>
                            <input value={item.name} onChange={(e) => updateListItem(index, 'name', e.target.value)} />
                          </div>
                          <div className="pdash-field">
                            <label>Time ago</label>
                            <input
                              value={item.timeAgo || ''}
                              onChange={(e) => updateListItem(index, 'timeAgo', e.target.value)}
                              placeholder="e.g. 4 months ago"
                            />
                          </div>
                        </div>
                        <div className="pdash-grid-2">
                          <div className="pdash-field">
                            <label>Role / company (fallback)</label>
                            <input value={item.role || ''} onChange={(e) => updateListItem(index, 'role', e.target.value)} />
                          </div>
                          <div className="pdash-field">
                            <label>Avatar image URL (optional)</label>
                            <input
                              value={item.avatarUrl || ''}
                              onChange={(e) => updateListItem(index, 'avatarUrl', e.target.value)}
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <div className="pdash-field">
                          <label>Testimonial text</label>
                          <textarea rows={3} value={item.content} onChange={(e) => updateListItem(index, 'content', e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pdash-field">
                          <label>Question</label>
                          <input value={item.question} onChange={(e) => updateListItem(index, 'question', e.target.value)} />
                        </div>
                        <div className="pdash-field">
                          <label>Answer</label>
                          <textarea rows={3} value={item.answer} onChange={(e) => updateListItem(index, 'answer', e.target.value)} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost pdash-editor-add"
                onClick={() =>
                  addListItem(
                    editorType === 'faq'
                      ? { question: '', answer: '' }
                      : { name: '', timeAgo: '', role: '', content: '', rating: 5 }
                  )
                }
              >
                <MdAdd /> Add {editorType === 'faq' ? 'question' : 'testimonial'}
              </button>
            </>
          ) : null}

          {editorType === 'impactStats' ? (
            <div className="pdash-editor-list">
              {listItems.map((item, index) => (
                <div key={`impact-${index}`} className="pdash-editor-list-item">
                  <div className="pdash-editor-list-head">
                    <strong>Stat {index + 1}</strong>
                    <button type="button" className="pdash-btn pdash-btn-ghost" onClick={() => removeListItem(index)}>
                      <MdDelete /> Remove
                    </button>
                  </div>
                  <div className="pdash-grid-2">
                    <div className="pdash-field">
                      <label>Value</label>
                      <input value={item.value} onChange={(e) => updateListItem(index, 'value', e.target.value)} />
                    </div>
                    <div className="pdash-field">
                      <label>Suffix (e.g. +)</label>
                      <input value={item.suffix} onChange={(e) => updateListItem(index, 'suffix', e.target.value)} />
                    </div>
                  </div>
                  <div className="pdash-field">
                    <label>Label</label>
                    <input value={item.label} onChange={(e) => updateListItem(index, 'label', e.target.value)} />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost pdash-editor-add"
                onClick={() => addListItem({ value: '', suffix: '+', label: '' })}
              >
                <MdAdd /> Add stat
              </button>
            </div>
          ) : null}

          {editorType === 'customRequests' ? (
            <>
              <div className="pdash-grid-2">
                <div className="pdash-field">
                  <label>Section title — first line</label>
                  <input value={form.titleBlack || ''} onChange={(e) => updateField('titleBlack', e.target.value)} />
                </div>
                <div className="pdash-field">
                  <label>Section title — accent line</label>
                  <input value={form.titleBlue || ''} onChange={(e) => updateField('titleBlue', e.target.value)} />
                </div>
              </div>
              <div className="pdash-field">
                <label>Introduction text</label>
                <textarea rows={3} value={form.intro || ''} onChange={(e) => updateField('intro', e.target.value)} />
              </div>
              <div className="pdash-field">
                <label>Success message (after form submit)</label>
                <textarea rows={2} value={form.successMessage || ''} onChange={(e) => updateField('successMessage', e.target.value)} />
              </div>
            </>
          ) : null}

          <div className="pdash-editor-actions">
            <button type="button" className="pdash-btn pdash-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pdash-btn pdash-btn-primary">
              Apply changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(editorBody, document.body);
}

export default SectionContentEditor;
