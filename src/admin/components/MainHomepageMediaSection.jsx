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

import {
  MAIN_SITE_HERO_VIDEO,
  MAIN_SITE_SERVICE_VIDEO_SLOTS,
} from '../../data/mainSiteVideoSlots';

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

const PARTNER_SECTION_SLOTS = [
  { key: 'partnerWithUsImage', label: 'Desktop background (wide screens)' },
  { key: 'partnerWithUsMobileImage', label: 'Mobile background (640px and below)' },
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

  const uploadServiceVideo = async (slot, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ videoUploads: { [`serviceVideos.${slot}`]: dataUrl } });
  };

  const uploadHeroVideo = async (file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ videoUploads: { heroVideo: dataUrl } });
  };

  const removeHeroVideo = async () => {
    await saveMedia({ heroVideo: null });
  };

  const removeServiceVideo = async (slot) => {
    await saveMedia({ serviceVideos: { [slot]: null } });
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

  const uploadPartnerSectionImage = async (slot, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ imageUploads: { [slot]: dataUrl } });
  };

  const removePartnerSectionImage = async (slot) => {
    await saveMedia({ [slot]: null });
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

  const addClientLogo = async () => {
    const next = [
      ...(media?.clientLogos || []),
      { id: `client-${Date.now()}`, name: 'Client', imageUrl: null },
    ];
    await saveMedia({ clientLogos: next });
  };

  const uploadClientLogo = async (index, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ imageUploads: { [`clientLogos.${index}`]: dataUrl } });
  };

  const removeClientLogo = async (index) => {
    const next = (media?.clientLogos || []).filter((_, i) => i !== index);
    await saveMedia({ clientLogos: next });
  };

  const updateClientLogoName = async (index, name) => {
    const logos = [...(media?.clientLogos || [])];
    if (!logos[index]) return;
    logos[index] = { ...logos[index], name };
    await saveMedia({ clientLogos: logos });
  };

  const addCelebrityLogo = async () => {
    const next = [
      ...(media?.celebrityLogos || []),
      { id: `celebrity-${Date.now()}`, name: 'Celebrity', imageUrl: null },
    ];
    await saveMedia({ celebrityLogos: next });
  };

  const uploadCelebrityLogo = async (index, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveMedia({ imageUploads: { [`celebrityLogos.${index}`]: dataUrl } });
  };

  const removeCelebrityLogo = async (index) => {
    const next = (media?.celebrityLogos || []).filter((_, i) => i !== index);
    await saveMedia({ celebrityLogos: next });
  };

  const updateCelebrityLogoName = async (index, name) => {
    const logos = [...(media?.celebrityLogos || [])];
    if (!logos[index]) return;
    logos[index] = { ...logos[index], name };
    await saveMedia({ celebrityLogos: logos });
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
      if (!item.imageUrl) return;
      merged[index] = { ...item, imageUrl: null };
      await saveMedia({ publicationCategoryLogos: { [categoryId]: merged } });
      return;
    }

    const next = merged.filter((_, i) => i !== index);
    await saveMedia({ publicationCategoryLogos: { [categoryId]: next } });
  };

  const carouselLogos = media?.publicationCarouselLogos || [];
  const clientLogos = media?.clientLogos || [];
  const celebrityLogos = media?.celebrityLogos || [];

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

      {view === 'celebrity-logos' ? (
        <>
          <div className="adm-panel-head-row" style={{ marginBottom: 12 }}>
            <p className="pdash-panel-lead" style={{ margin: 0 }}>
              Photos in the &quot;Notable Celebrities We&apos;ve Worked With&quot; marquee on the main site homepage.
            </p>
            <button type="button" className="adm-btn adm-btn-ghost" disabled={saving} onClick={addCelebrityLogo}>
              Add celebrity
            </button>
          </div>
          {!celebrityLogos.length ? (
            <div className="adm-empty">
              <p>No celebrity photos saved yet. Existing celebrities will seed automatically on deploy.</p>
            </div>
          ) : (
            <div className="adm-media-grid">
              {celebrityLogos.map((celebrity, index) => (
                <article key={celebrity.id || index} className="adm-media-card">
                  <input
                    className="adm-input"
                    value={celebrity.name || ''}
                    placeholder="Celebrity name"
                    disabled={saving}
                    onChange={(event) =>
                      setMedia((prev) => {
                        const next = { ...prev };
                        next.celebrityLogos = [...next.celebrityLogos];
                        next.celebrityLogos[index] = {
                          ...next.celebrityLogos[index],
                          name: event.target.value,
                        };
                        return next;
                      })
                    }
                    onBlur={async (event) => updateCelebrityLogoName(index, event.target.value)}
                  />
                  <div className="adm-media-preview adm-media-preview--portrait">
                    {celebrity.imageUrl ? (
                      <img src={celebrity.imageUrl} alt={celebrity.name} />
                    ) : (
                      <span>No photo uploaded</span>
                    )}
                  </div>
                  <div className="adm-btn-group">
                    <label className="adm-btn adm-btn-ghost">
                      {celebrity.imageUrl ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={saving}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          uploadCelebrityLogo(index, file);
                          event.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost danger"
                      disabled={saving}
                      onClick={() => removeCelebrityLogo(index)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : null}

      {view === 'client-logos' ? (
        <>
          <div className="adm-panel-head-row" style={{ marginBottom: 12 }}>
            <p className="pdash-panel-lead" style={{ margin: 0 }}>
              Logos shown in the &quot;Some of our Clients&quot; section across the main site.
            </p>
            <button type="button" className="adm-btn adm-btn-ghost" disabled={saving} onClick={addClientLogo}>
              Add client logo
            </button>
          </div>
          {!clientLogos.length ? (
            <div className="adm-empty">
              <p>No client logos saved yet. Add logos to replace the default clients image.</p>
            </div>
          ) : (
            <div className="adm-media-grid">
              {clientLogos.map((logo, index) => (
                <article key={logo.id || index} className="adm-media-card">
                  <input
                    className="adm-input"
                    value={logo.name || ''}
                    placeholder="Client name"
                    disabled={saving}
                    onChange={(event) =>
                      setMedia((prev) => {
                        const next = { ...prev };
                        next.clientLogos = [...next.clientLogos];
                        next.clientLogos[index] = {
                          ...next.clientLogos[index],
                          name: event.target.value,
                        };
                        return next;
                      })
                    }
                    onBlur={async (event) => updateClientLogoName(index, event.target.value)}
                  />
                  <div className="adm-media-preview adm-media-preview--logo">
                    {logo.imageUrl ? (
                      <img src={logo.imageUrl} alt={logo.name} />
                    ) : (
                      <span>No logo uploaded</span>
                    )}
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
                          uploadClientLogo(index, file);
                          event.target.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost danger"
                      disabled={saving}
                      onClick={() => removeClientLogo(index)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : null}

      {view === 'videos' ? (
        <>
          <div className="adm-media-stack">
            <section className="adm-media-category">
              <h3>{MAIN_SITE_HERO_VIDEO.label}</h3>
              <p className="pdash-panel-lead">
                Background video on the main Bluetick homepage hero section.
              </p>
              <article className="adm-media-card adm-media-card--wide">
                <div className="adm-media-preview adm-media-preview--video">
                  {media?.heroVideo ? (
                    <video src={media.heroVideo} controls playsInline preload="metadata" />
                  ) : (
                    <span>No video saved — the bundled default plays on the site</span>
                  )}
                </div>
                <div className="adm-btn-group">
                  <label className="adm-btn adm-btn-ghost">
                    {media?.heroVideo ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      hidden
                      disabled={saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        uploadHeroVideo(file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {media?.heroVideo ? (
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost danger"
                      disabled={saving}
                      onClick={removeHeroVideo}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </article>
            </section>

            <section className="adm-media-category">
              <h3>Service detail page videos</h3>
              <p className="pdash-panel-lead">
                Hero videos on service detail pages. If no video is uploaded, the page shows the
                service background image instead.
              </p>
              <div className="adm-media-grid">
                {MAIN_SITE_SERVICE_VIDEO_SLOTS.map((slot) => {
                  const currentUrl = media?.serviceVideos?.[slot.key] || null;
                  const posterUrl = media?.serviceImages?.[slot.imageSlot] || null;
                  return (
                    <article key={slot.key} className="adm-media-card">
                      <h3>{slot.label}</h3>
                      <div className="adm-media-preview adm-media-preview--video">
                        {currentUrl ? (
                          <video
                            src={currentUrl}
                            poster={posterUrl || undefined}
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <span>No video — image poster used on site</span>
                        )}
                      </div>
                      <div className="adm-btn-group">
                        <label className="adm-btn adm-btn-ghost">
                          {currentUrl ? 'Replace' : 'Upload'}
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            hidden
                            disabled={saving}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              uploadServiceVideo(slot.key, file);
                              event.target.value = '';
                            }}
                          />
                        </label>
                        {currentUrl ? (
                          <button
                            type="button"
                            className="adm-btn adm-btn-ghost danger"
                            disabled={saving}
                            onClick={() => removeServiceVideo(slot.key)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </>
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

      {view === 'partner-section' ? (
        <>
          <p className="pdash-panel-lead" style={{ marginBottom: 12 }}>
            Background images for the &quot;Partner With Industry Leaders&quot; section on the main site homepage.
          </p>
          <div className="adm-media-grid">
            {PARTNER_SECTION_SLOTS.map((slot) => {
              const currentUrl = media?.[slot.key] || null;
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
                          uploadPartnerSectionImage(slot.key, file);
                          event.target.value = '';
                        }}
                      />
                    </label>
                    {currentUrl ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost danger"
                        disabled={saving}
                        onClick={() => removePartnerSectionImage(slot.key)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </>
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
            return (
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
                  {categoryLogos.map((logo, index) => {
                    const isCatalog = isCatalogPublicationPlatform(categoryId, logo.name);
                    return (
                      <article key={logo.id || `${categoryId}-${index}`} className="adm-media-card">
                        <input
                          className="adm-input"
                          value={logo.name || ''}
                          readOnly={isCatalog}
                          disabled={saving || isCatalog}
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
                        <div className="adm-media-preview adm-media-preview--logo">
                          {logo.imageUrl ? (
                            <img src={logo.imageUrl} alt={logo.name} />
                          ) : (
                            <span>No logo uploaded</span>
                          )}
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
                          <button
                            type="button"
                            className="adm-btn adm-btn-ghost danger"
                            disabled={saving}
                            onClick={() => removeCategoryLogo(categoryId, index)}
                          >
                            Delete
                          </button>
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
