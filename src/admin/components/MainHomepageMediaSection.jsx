import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import {
  PUBLICATION_CATEGORY_LABELS,
  resolvePublicationCarouselLogo,
} from '../../data/defaultPublicationLogos';
import {
  isCatalogPublicationPlatform,
  mergeCategoryLogosWithCatalog,
} from '../../data/publicationCategoryLogoCatalog';

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

export default function MainHomepageMediaSection({
  apiUrl,
  adminToken,
  view = 'backgrounds',
  hideHeader = false,
}) {
  const { showToast } = useToast();
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

  const getMergedCategoryLogos = (categoryId) =>
    mergeCategoryLogosWithCatalog(categoryId, media?.publicationCategoryLogos?.[categoryId]);

  const uploadCategoryLogo = async (categoryId, index, file) => {
    if (!file) return;
    const merged = getMergedCategoryLogos(categoryId);
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({
      publicationCategoryLogos: { [categoryId]: merged },
      imageUploads: { [`publicationCategoryLogos.${categoryId}.${index}`]: dataUrl },
    });
  };

  const removeServiceImage = async (slot) => {
    await saveMedia({ serviceImages: { [slot]: null } });
  };

  const addCarouselLogo = async () => {
    const next = [
      ...(media?.publicationCarouselLogos || []),
      { id: `logo-${Date.now()}`, name: 'New outlet', imageUrl: null },
    ];
    await saveMedia({ publicationCarouselLogos: next });
  };

  const removeCarouselLogo = async (index) => {
    const next = (media?.publicationCarouselLogos || []).filter((_, i) => i !== index);
    await saveMedia({ publicationCarouselLogos: next });
  };

  const addCategoryLogo = async (categoryId) => {
    const merged = getMergedCategoryLogos(categoryId);
    merged.push({ id: `logo-${Date.now()}`, name: 'New outlet', imageUrl: null });
    await saveMedia({ publicationCategoryLogos: { [categoryId]: merged } });
  };

  const updateCategoryLogoName = async (categoryId, index, name) => {
    const merged = getMergedCategoryLogos(categoryId);
    if (!merged[index] || isCatalogPublicationPlatform(categoryId, merged[index].name)) {
      return;
    }
    merged[index] = { ...merged[index], name };
    await saveMedia({
      publicationCategoryLogos: {
        ...(media?.publicationCategoryLogos || {}),
        [categoryId]: merged,
      },
    });
  };

  const removeCategoryLogo = async (categoryId, index) => {
    const merged = getMergedCategoryLogos(categoryId);
    const item = merged[index];
    if (!item) return;

    if (isCatalogPublicationPlatform(categoryId, item.name)) {
      merged[index] = { ...item, imageUrl: null };
      await saveMedia({ publicationCategoryLogos: { [categoryId]: merged } });
      return;
    }

    const next = merged.filter((_, i) => i !== index);
    await saveMedia({ publicationCategoryLogos: { [categoryId]: next } });
  };

  const carouselLogos = media?.publicationCarouselLogos || [];

  if (loading) {
    return (
      <div className="adm-empty">
        <div className="adm-spinner" />
        <p>Loading homepage media…</p>
      </div>
    );
  }

  return (
    <section className={`pdash-homepage-media${hideHeader ? ' pdash-homepage-media--embedded' : ''}`}>
      {!hideHeader ? (
        <header className="adm-panel-head-row">
          <div>
            <h2 className="adm-panel-title">Homepage images &amp; logos</h2>
            <p className="pdash-panel-lead">
              Edit service section backgrounds, publication carousel logos, and publication category logos.
            </p>
          </div>
        </header>
      ) : null}

      {view === 'backgrounds' ? (
        <div className="adm-media-grid">
          {SERVICE_SLOTS.map((slot) => {
            const currentUrl = media?.serviceImages?.[slot.key] || null;
            return (
              <article key={slot.key} className="adm-media-card">
                <h3>{slot.label}</h3>
                <div className="adm-media-preview">
                  {currentUrl ? (
                    <img src={currentUrl} alt={slot.label} />
                  ) : (
                    <span>No image saved</span>
                  )}
                </div>
                <div className="adm-btn-group">
                  <label className="adm-btn adm-btn-ghost">
                    {currentUrl ? 'Replace' : 'Upload'}
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
                      onClick={() => removeServiceImage(slot.key)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {view === 'carousel' ? (
        <>
          <div className="adm-panel-head-row" style={{ marginBottom: 12 }}>
            <p className="pdash-panel-lead" style={{ margin: 0 }}>
              Logos shown in the publication section on the homepage carousel.
            </p>
            <button type="button" className="adm-btn adm-btn-ghost" disabled={saving} onClick={addCarouselLogo}>
              Add logo
            </button>
          </div>
          {!carouselLogos.length ? (
            <div className="adm-empty">
              <p>No publication logos saved yet. Add a logo to get started.</p>
            </div>
          ) : (
            <div className="adm-media-grid">
              {carouselLogos.map((logo, index) => {
                const preview = resolvePublicationCarouselLogo(logo);
                return (
                  <article key={logo.id || index} className="adm-media-card">
                    <input
                      className="adm-input"
                      value={logo.name || ''}
                      disabled={saving}
                      onChange={(event) =>
                        setMedia((prev) => {
                          const next = { ...prev };
                          next.publicationCarouselLogos = [...next.publicationCarouselLogos];
                          next.publicationCarouselLogos[index] = {
                            ...next.publicationCarouselLogos[index],
                            name: event.target.value,
                          };
                          return next;
                        })
                      }
                      onBlur={async (event) => {
                        const logos = [...(media?.publicationCarouselLogos || [])];
                        logos[index] = { ...logos[index], name: event.target.value };
                        await saveMedia({ publicationCarouselLogos: logos });
                      }}
                    />
                    <div className="adm-media-preview adm-media-preview--logo">
                      {preview ? <img src={preview} alt={logo.name} /> : <span>No image uploaded</span>}
                    </div>
                    <div className="adm-btn-group">
                      <label className="adm-btn adm-btn-ghost">
                        {logo.imageUrl ? 'Replace' : 'Upload'}
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
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost danger"
                        disabled={saving}
                        onClick={() => removeCarouselLogo(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : null}

      {view === 'category-logos' ? (
        <div className="adm-media-stack">
          {Object.entries(PUBLICATION_CATEGORY_LABELS).map(([categoryId, label]) => {
            const categoryLogos = getMergedCategoryLogos(categoryId);
            const withImages = categoryLogos.filter((logo) => logo.imageUrl).length;
            return (
              <section key={categoryId} className="adm-media-category">
                <div className="adm-panel-head-row">
                  <div>
                    <h3>{label}</h3>
                    <p className="pdash-panel-lead" style={{ margin: '4px 0 0' }}>
                      {categoryLogos.length} platforms · {withImages} with logos uploaded
                    </p>
                  </div>
                  <button
                    type="button"
                    className="adm-btn adm-btn-ghost"
                    disabled={saving}
                    onClick={() => addCategoryLogo(categoryId)}
                  >
                    Add custom outlet
                  </button>
                </div>
                <div className="adm-media-platform-list">
                  {categoryLogos.map((logo, index) => {
                    const isCatalog = isCatalogPublicationPlatform(categoryId, logo.name);
                    return (
                      <article key={logo.id || `${categoryId}-${index}`} className="adm-media-platform-row">
                        <div className="adm-media-platform-main">
                          {isCatalog ? (
                            <strong className="adm-media-platform-name">{logo.name}</strong>
                          ) : (
                            <input
                              className="adm-input adm-media-platform-name-input"
                              value={logo.name || ''}
                              disabled={saving}
                              onChange={(event) =>
                                setMedia((prev) => {
                                  const merged = mergeCategoryLogosWithCatalog(
                                    categoryId,
                                    prev?.publicationCategoryLogos?.[categoryId]
                                  );
                                  merged[index] = { ...merged[index], name: event.target.value };
                                  const next = { ...prev };
                                  next.publicationCategoryLogos = {
                                    ...next.publicationCategoryLogos,
                                    [categoryId]: merged,
                                  };
                                  return next;
                                })
                              }
                              onBlur={(event) => updateCategoryLogoName(categoryId, index, event.target.value)}
                            />
                          )}
                          <div className="adm-media-preview adm-media-preview--logo adm-media-preview--compact">
                            {logo.imageUrl ? (
                              <img src={logo.imageUrl} alt={logo.name} />
                            ) : (
                              <span>No logo</span>
                            )}
                          </div>
                        </div>
                        <div className="adm-btn-group">
                          <label className="adm-btn adm-btn-ghost">
                            {logo.imageUrl ? 'Replace' : 'Upload'}
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
                          {logo.imageUrl ? (
                            <button
                              type="button"
                              className="adm-btn adm-btn-ghost danger"
                              disabled={saving}
                              onClick={() => removeCategoryLogo(categoryId, index)}
                            >
                              {isCatalog ? 'Remove logo' : 'Delete'}
                            </button>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
