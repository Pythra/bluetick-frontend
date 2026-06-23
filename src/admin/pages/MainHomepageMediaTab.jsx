import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import {
  DEFAULT_PUBLICATION_CAROUSEL_LOGOS,
  PUBLICATION_CATEGORY_LABELS,
  resolvePublicationCarouselLogo,
} from '../../data/defaultPublicationLogos';

const SERVICE_SLOTS = [
  { key: 'appDevelopmentImage', label: 'App Development' },
  { key: 'websiteServicesImage', label: 'Website Development' },
  { key: 'socialMediaImage', label: 'Social Media Services' },
  { key: 'musicStreamingImage', label: 'Music Streaming Verification' },
  { key: 'tiktokArtistImage', label: 'TikTok Artist Services' },
  { key: 'publicationImage', label: 'Publication & PR Services' },
  { key: 'instagramImage', label: 'Instagram Blog Promotion' },
  { key: 'wikipediaImage', label: 'Wikipedia Page Services' },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MainHomepageMediaTab({ apiUrl, adminToken }) {
  const { showToast } = useToast();
  const [view, setView] = useState('services');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/admin/homepage-media`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load homepage media');
      }
      setMedia(data.media);
    } catch (error) {
      showToast({ message: error.message || 'Failed to load homepage media', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiUrl, showToast]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const saveMedia = async (payload) => {
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/admin/homepage-media`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save homepage media');
      }
      setMedia(data.media);
      showToast({ message: 'Homepage media updated', type: 'success' });
    } catch (error) {
      showToast({ message: error.message || 'Failed to save homepage media', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const uploadServiceImage = async (slot, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ imageUploads: { [`serviceImages.${slot}`]: dataUrl } });
  };

  const uploadCarouselLogo = async (index, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ imageUploads: { [`publicationCarouselLogos.${index}`]: dataUrl } });
  };

  const uploadCategoryLogo = async (categoryId, index, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({
      imageUploads: { [`publicationCategoryLogos.${categoryId}.${index}`]: dataUrl },
    });
  };

  const resetServiceImage = async (slot) => {
    await saveMedia({ serviceImages: { [slot]: null } });
  };

  const addCategoryLogo = async (categoryId) => {
    const next = {
      ...(media?.publicationCategoryLogos || {}),
      [categoryId]: [
        ...(media?.publicationCategoryLogos?.[categoryId] || []),
        { id: `logo-${Date.now()}`, name: 'New outlet', imageUrl: null },
      ],
    };
    await saveMedia({ publicationCategoryLogos: next });
  };

  const updateCategoryLogoName = async (categoryId, index, name) => {
    const logos = [...(media?.publicationCategoryLogos?.[categoryId] || [])];
    logos[index] = { ...logos[index], name };
    await saveMedia({
      publicationCategoryLogos: {
        ...(media?.publicationCategoryLogos || {}),
        [categoryId]: logos,
      },
    });
  };

  const removeCategoryLogo = async (categoryId, index) => {
    const logos = (media?.publicationCategoryLogos?.[categoryId] || []).filter((_, i) => i !== index);
    await saveMedia({
      publicationCategoryLogos: {
        ...(media?.publicationCategoryLogos || {}),
        [categoryId]: logos,
      },
    });
  };

  const carouselLogos = media?.publicationCarouselLogos?.length
    ? media.publicationCarouselLogos
    : DEFAULT_PUBLICATION_CAROUSEL_LOGOS.map(({ id, name }) => ({ id, name, imageUrl: null }));

  return (
    <div className="adm-panel">
      <div className="adm-panel-head-row">
        <div>
          <h2 className="adm-panel-title">Homepage media</h2>
          <p className="adm-panel-lead">
            Manage homepage service backgrounds, publication carousel logos, and category sliding logos for the main
            Bluetick site only.
          </p>
        </div>
        <div className="adm-btn-group">
          <button
            type="button"
            className={`adm-btn ${view === 'services' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView('services')}
          >
            Service images
          </button>
          <button
            type="button"
            className={`adm-btn ${view === 'carousel' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView('carousel')}
          >
            Publication logos
          </button>
          <button
            type="button"
            className={`adm-btn ${view === 'categories' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView('categories')}
          >
            Category sliders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="adm-empty">
          <div className="adm-spinner" />
          <p>Loading homepage media…</p>
        </div>
      ) : view === 'services' ? (
        <div className="adm-media-grid">
          {SERVICE_SLOTS.map((slot) => {
            const currentUrl = media?.serviceImages?.[slot.key] || null;
            return (
              <article key={slot.key} className="adm-media-card">
                <h3>{slot.label}</h3>
                <div className="adm-media-preview">
                  {currentUrl ? <img src={currentUrl} alt={slot.label} /> : <span>No custom image</span>}
                </div>
                <div className="adm-btn-group">
                  <label className="adm-btn adm-btn-ghost">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        uploadServiceImage(slot.key, file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {currentUrl ? (
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost danger"
                      disabled={saving}
                      onClick={() => resetServiceImage(slot.key)}
                    >
                      Reset
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : view === 'carousel' ? (
        <div className="adm-media-grid">
          {carouselLogos.map((logo, index) => {
            const preview = resolvePublicationCarouselLogo(logo);
            return (
              <article key={logo.id || index} className="adm-media-card">
                <h3>{logo.name}</h3>
                <div className="adm-media-preview adm-media-preview--logo">
                  {preview ? <img src={preview} alt={logo.name} /> : <span>No logo</span>}
                </div>
                <label className="adm-btn adm-btn-ghost">
                  Replace logo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={saving}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      uploadCarouselLogo(index, file);
                      event.target.value = '';
                    }}
                  />
                </label>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="adm-media-stack">
          {Object.entries(PUBLICATION_CATEGORY_LABELS).map(([categoryId, label]) => (
            <section key={categoryId} className="adm-media-category">
              <div className="adm-panel-head-row">
                <h3>{label}</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-ghost"
                  disabled={saving}
                  onClick={() => addCategoryLogo(categoryId)}
                >
                  Add logo
                </button>
              </div>
              <div className="adm-media-grid">
                {(media?.publicationCategoryLogos?.[categoryId] || []).map((logo, index) => (
                  <article key={logo.id || index} className="adm-media-card">
                    <input
                      className="adm-input"
                      value={logo.name || ''}
                      onChange={(event) =>
                        setMedia((prev) => {
                          const next = { ...prev };
                          next.publicationCategoryLogos = { ...next.publicationCategoryLogos };
                          next.publicationCategoryLogos[categoryId] = [...next.publicationCategoryLogos[categoryId]];
                          next.publicationCategoryLogos[categoryId][index] = {
                            ...next.publicationCategoryLogos[categoryId][index],
                            name: event.target.value,
                          };
                          return next;
                        })
                      }
                      onBlur={(event) => updateCategoryLogoName(categoryId, index, event.target.value)}
                    />
                    <div className="adm-media-preview adm-media-preview--logo">
                      {logo.imageUrl ? <img src={logo.imageUrl} alt={logo.name} /> : <span>No logo uploaded</span>}
                    </div>
                    <div className="adm-btn-group">
                      <label className="adm-btn adm-btn-ghost">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          disabled={saving}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            uploadCategoryLogo(categoryId, index, file);
                            event.target.value = '';
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost danger"
                        disabled={saving}
                        onClick={() => removeCategoryLogo(categoryId, index)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
