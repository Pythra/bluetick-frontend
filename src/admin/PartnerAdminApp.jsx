import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MdDashboard,
  MdPalette,
  MdPermMedia,
  MdLanguage,
  MdInventory2,
  MdLogout,
  MdOpenInNew,
  MdSave,
  MdRefresh,
  MdCheckCircle,
  MdAccessTime,
  MdPayments,
  MdVerified,
} from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { getOrderServiceLabel } from './utils/orderServices';
import {
  PARTNER_TEMPLATES,
  PARTNER_ASSET_FIELDS,
  PARTNER_CONTENT_FIELDS,
  PARTNER_FEATURE_TOGGLES,
} from '../config/partnerSiteConfig';
import './styles/admin.css';
import './styles/partnerDashboard.css';

const PARTNER_BASE_DOMAIN = import.meta.env.VITE_PARTNER_BASE_DOMAIN || 'bluetickgeng.com';

const STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In Progress',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: MdDashboard },
  { id: 'customize', label: 'Site Customization', icon: MdPalette },
  { id: 'media', label: 'Media Library', icon: MdPermMedia },
  { id: 'domain', label: 'Custom Domain', icon: MdLanguage },
  { id: 'orders', label: 'Orders', icon: MdInventory2 },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAmount(amount, currency = 'NGN') {
  if (amount == null) return '—';
  const symbol = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString()}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildEmptyDraft(siteConfig = {}) {
  return {
    templateId: siteConfig.templateId || 'modern',
    primaryColor: siteConfig.primaryColor || '#2563eb',
    contactPhone: siteConfig.contactPhone || '',
    contactWhatsapp: siteConfig.contactWhatsapp || '',
    contactWebsite: siteConfig.contactWebsite || '',
    customDomain: siteConfig.customDomain || '',
    content: { ...(siteConfig.content || {}) },
    features: { ...(siteConfig.features || {}) },
    assets: { ...(siteConfig.assets || {}) },
  };
}

function PartnerAdminApp({ subdomain }) {
  const { apiUrl } = useAuth();
  const tokenKey = `partnerAdminToken:${subdomain}`;

  const [token, setToken] = useState(() =>
    localStorage.getItem(tokenKey) || localStorage.getItem('adminToken')
  );
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pendingLogo, setPendingLogo] = useState(null);
  const [pendingAssets, setPendingAssets] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [domainMessage, setDomainMessage] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const handleLogout = useCallback(() => {
    const activeToken = token;
    localStorage.removeItem(tokenKey);
    if (activeToken && activeToken === localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken');
    }
    setToken(null);
    setOverview(null);
    setSiteSettings(null);
    setDraft(null);
  }, [token, tokenKey]);

  const fetchOverview = useCallback(async () => {
    if (!token) return;

    const response = await fetch(
      `${apiUrl}/api/partner-admin/overview?subdomain=${encodeURIComponent(subdomain)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return null;
      }
      throw new Error(data.error || 'Failed to load dashboard');
    }

    setOverview(data);
    return data;
  }, [apiUrl, token, subdomain, handleLogout]);

  const fetchSiteSettings = useCallback(async () => {
    if (!token) return;

    const response = await fetch(
      `${apiUrl}/api/partner-admin/site-settings?subdomain=${encodeURIComponent(subdomain)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return null;
      }
      throw new Error(data.error || 'Failed to load site settings');
    }

    setSiteSettings(data);
    setDraft(buildEmptyDraft(data.siteConfig));
    setLogoPreview(data.logoUrl || null);
    setPendingLogo(null);
    setPendingAssets({});
    return data;
  }, [apiUrl, token, subdomain, handleLogout]);

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchOverview(), fetchSiteSettings()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, fetchOverview, fetchSiteSettings]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      let response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username.trim(),
          password: loginData.password,
        }),
      });
      let data = await response.json();

      if (!response.ok) {
        response = await fetch(`${apiUrl}/api/partner-admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain, ...loginData }),
        });
        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        if (data.isMainAdmin) {
          localStorage.setItem('adminToken', data.token);
        }
      } else {
        localStorage.setItem('adminToken', data.token);
      }

      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setLoginData({ username: '', password: '' });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const updateDraft = (patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const updateDraftContent = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      content: { ...prev.content, [key]: value },
    }));
  };

  const updateDraftFeature = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }));
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Logo must be an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Logo must be under 2MB.' });
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPendingLogo(dataUrl);
    setLogoPreview(dataUrl);
  };

  const handleAssetChange = async (slot, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const field = PARTNER_ASSET_FIELDS.find((item) => item.key === slot);
    const isVideo = field?.type === 'video';

    if (isVideo && !file.type.startsWith('video/')) {
      setSaveMessage({ type: 'error', text: 'Please upload a video file (MP4, WEBM, MOV).' });
      return;
    }
    if (!isVideo && !file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Please upload an image file.' });
      return;
    }

    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setSaveMessage({
        type: 'error',
        text: isVideo ? 'Video must be under 25MB.' : 'Image must be under 5MB.',
      });
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPendingAssets((prev) => ({ ...prev, [slot]: dataUrl }));
    setDraft((prev) => ({
      ...prev,
      assets: { ...prev.assets, [slot]: dataUrl },
    }));
  };

  const handleRemoveAsset = (slot) => {
    setPendingAssets((prev) => ({ ...prev, [slot]: null }));
    setDraft((prev) => ({
      ...prev,
      assets: { ...prev.assets, [slot]: null },
    }));
  };

  const handleSaveSettings = async () => {
    if (!draft) return;

    try {
      setSaving(true);
      setSaveMessage(null);

      const assetUploads = {};
      Object.entries(pendingAssets).forEach(([slot, value]) => {
        if (value === null) {
          assetUploads[slot] = null;
        } else if (typeof value === 'string' && value.startsWith('data:')) {
          assetUploads[slot] = value;
        }
      });

      const response = await fetch(
        `${apiUrl}/api/partner-admin/site-settings?subdomain=${encodeURIComponent(subdomain)}`,
        {
          method: 'PATCH',
          headers: authHeaders,
          body: JSON.stringify({
            templateId: draft.templateId,
            primaryColor: draft.primaryColor,
            contactPhone: draft.contactPhone,
            contactWhatsapp: draft.contactWhatsapp,
            contactWebsite: draft.contactWebsite,
            customDomain: draft.customDomain,
            content: draft.content,
            features: draft.features,
            logo: pendingLogo || undefined,
            assetUploads: Object.keys(assetUploads).length ? assetUploads : undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSiteSettings(data);
      setDraft(buildEmptyDraft(data.siteConfig));
      setLogoPreview(data.logoUrl || null);
      setPendingLogo(null);
      setPendingAssets({});
      setSaveMessage({ type: 'success', text: 'Your site settings were saved successfully.' });

      document.documentElement.style.setProperty('--brand-primary', data.siteConfig.primaryColor);
      document.documentElement.style.setProperty('--brand-primary-dark', data.siteConfig.primaryColorDark);
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDomain = async () => {
    try {
      setVerifyingDomain(true);
      setDomainMessage(null);

      const response = await fetch(
        `${apiUrl}/api/partner-admin/verify-domain?subdomain=${encodeURIComponent(subdomain)}`,
        {
          method: 'POST',
          headers: authHeaders,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Domain verification failed');
      }

      setSiteSettings(data);
      setDraft(buildEmptyDraft(data.siteConfig));
      setDomainMessage({
        type: data.verification?.verified ? 'success' : 'info',
        text: data.verification?.message || 'Verification complete',
      });
    } catch (err) {
      setDomainMessage({ type: 'error', text: err.message });
    } finally {
      setVerifyingDomain(false);
    }
  };

  const brandName = overview?.branding?.brandName || siteSettings?.branding?.brandName || subdomain;
  const siteUrl = overview?.site?.siteUrl || siteSettings?.site?.siteUrl;
  const cnameTarget = `${subdomain}.${PARTNER_BASE_DOMAIN}`;

  const setupChecklist = useMemo(() => {
    const config = siteSettings?.siteConfig;
    const assets = config?.assets || {};
    return [
      { label: 'Upload your logo', done: Boolean(siteSettings?.logoUrl) },
      { label: 'Choose a site template', done: Boolean(config?.templateId) },
      { label: 'Set your brand colors', done: Boolean(config?.primaryColor) },
      { label: 'Add homepage hero video', done: Boolean(assets.heroVideo) },
      { label: 'Customize About page content', done: Boolean(config?.content?.aboutIntro) },
      { label: 'Upload app development media', done: Boolean(assets.appDevelopmentImage) },
      { label: 'Connect a custom domain', done: Boolean(config?.customDomainVerified) },
    ];
  }, [siteSettings]);

  const completionPercent = Math.round(
    (setupChecklist.filter((item) => item.done).length / setupChecklist.length) * 100
  );

  if (!token) {
    return (
      <div className="pdash-login-wrap">
        <div className="pdash-login-card">
          <div className="adm-login-badge">{subdomain.charAt(0).toUpperCase()}</div>
          <h1>Partner Dashboard</h1>
          <p className="pdash-login-sub">
            Sign in to customize and manage <strong>{subdomain}.{PARTNER_BASE_DOMAIN}</strong>
          </p>

          <form onSubmit={handleLogin}>
            <div className="adm-login-field">
              <label htmlFor="partner-username">Email / Username</label>
              <input
                id="partner-username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="adm-login-field">
              <label htmlFor="partner-password">Password</label>
              <input
                id="partner-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Your dashboard password"
                required
              />
            </div>

            {loginError && <div className="adm-login-error">{loginError}</div>}

            <button type="submit" className="pdash-btn pdash-btn-primary" style={{ width: '100%' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <>
      <div className="pdash-stats">
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdInventory2 size={22} /></div>
          <div className="pdash-stat-value">{overview?.stats?.totalOrders ?? 0}</div>
          <div className="pdash-stat-label">Total Orders</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdAccessTime size={22} /></div>
          <div className="pdash-stat-value">
            {(overview?.stats?.pending ?? 0) + (overview?.stats?.inProgress ?? 0)}
          </div>
          <div className="pdash-stat-label">In Progress</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdCheckCircle size={22} /></div>
          <div className="pdash-stat-value">{overview?.stats?.completed ?? 0}</div>
          <div className="pdash-stat-label">Completed</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdPayments size={22} /></div>
          <div className="pdash-stat-value">{formatAmount(overview?.stats?.totalRevenue)}</div>
          <div className="pdash-stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="pdash-grid-2">
        <div className="pdash-panel">
          <h2>Your Live Site</h2>
          <p className="pdash-panel-lead">
            Share this link with your audience. Orders placed here appear in your dashboard automatically.
          </p>
          {siteUrl ? (
            <a className="adm-site-url" href={siteUrl} target="_blank" rel="noopener noreferrer">
              <MdOpenInNew size={15} style={{ verticalAlign: '-2px', marginRight: 5 }} />
              {siteUrl}
            </a>
          ) : null}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <span className="pdash-badge live">Site Live</span>
            {siteSettings?.siteConfig?.customDomainVerified ? (
              <span className="pdash-badge verified"><MdVerified size={14} /> Custom domain active</span>
            ) : (
              <span className="pdash-badge pending">Subdomain active</span>
            )}
          </div>
        </div>

        <div className="pdash-panel">
          <h2>Site Setup Progress</h2>
          <p className="pdash-panel-lead">{completionPercent}% complete — finish these steps for a fully branded experience.</p>
          <div className="pdash-checklist">
            {setupChecklist.map((item) => (
              <div key={item.label} className={`pdash-check-item${item.done ? ' done' : ''}`}>
                <MdCheckCircle size={18} color={item.done ? '#047857' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderCustomize = () => {
    if (!draft) return null;

    return (
      <>
        {saveMessage ? (
          <div className={`pdash-alert ${saveMessage.type}`}>{saveMessage.text}</div>
        ) : null}

        <div className="pdash-panel">
          <h2>Brand Identity</h2>
          <p className="pdash-panel-lead">Logo, colors, and contact details shown across your white-label site.</p>
          <div className="pdash-grid-2">
            <div className="pdash-field">
              <label>Logo</label>
              <small>PNG, JPG, WEBP or SVG — max 2MB</small>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" style={{ maxWidth: 180, maxHeight: 80, objectFit: 'contain' }} />
              ) : null}
              <input type="file" accept="image/*" onChange={handleLogoChange} />
            </div>
            <div className="pdash-field">
              <label>Theme Color</label>
              <div className="pdash-color-row">
                <input
                  type="color"
                  value={draft.primaryColor}
                  onChange={(e) => updateDraft({ primaryColor: e.target.value })}
                />
                <input
                  type="text"
                  value={draft.primaryColor}
                  onChange={(e) => updateDraft({ primaryColor: e.target.value })}
                />
              </div>
            </div>
            <div className="pdash-field">
              <label>Support Phone</label>
              <input
                value={draft.contactPhone}
                onChange={(e) => updateDraft({ contactPhone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="pdash-field">
              <label>WhatsApp Number</label>
              <input
                value={draft.contactWhatsapp}
                onChange={(e) => updateDraft({ contactWhatsapp: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>
            <div className="pdash-field">
              <label>Website URL</label>
              <input
                value={draft.contactWebsite}
                onChange={(e) => updateDraft({ contactWebsite: e.target.value })}
                placeholder="https://yourbrand.com"
              />
            </div>
          </div>
        </div>

        <div className="pdash-panel">
          <h2>Site Template</h2>
          <p className="pdash-panel-lead">Choose a layout style. Your services and checkout stay the same — only the design changes.</p>
          <div className="pdash-template-grid">
            {PARTNER_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`pdash-template-card${draft.templateId === template.id ? ' active' : ''}`}
                onClick={() => updateDraft({ templateId: template.id })}
              >
                <div className="pdash-template-preview" style={{ background: template.preview }} />
                <div className="pdash-template-body">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pdash-panel">
          <h2>Website Content</h2>
          <p className="pdash-panel-lead">Customize homepage, footer, and About page copy for your brand.</p>
          {PARTNER_CONTENT_FIELDS.map((field) => (
            <div key={field.key} className="pdash-field">
              <label>{field.label}</label>
              <textarea
                rows={field.rows}
                value={draft.content?.[field.key] || ''}
                onChange={(e) => updateDraftContent(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="pdash-panel">
          <h2>Visibility Settings</h2>
          <p className="pdash-panel-lead">Control which sections appear on your white-label homepage.</p>
          {PARTNER_FEATURE_TOGGLES.map((toggle) => (
            <div key={toggle.key} className="pdash-toggle">
              <div>
                <strong>{toggle.label}</strong>
                <span>{toggle.description}</span>
              </div>
              <label className="pdash-switch">
                <input
                  type="checkbox"
                  checked={Boolean(draft.features?.[toggle.key])}
                  onChange={(e) => updateDraftFeature(toggle.key, e.target.checked)}
                />
                <span className="pdash-switch-slider" />
              </label>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderMedia = () => {
    if (!draft) return null;

    return (
      <div className="pdash-panel">
        <h2>Media Library</h2>
        <p className="pdash-panel-lead">
          Upload your own images and videos. Bluetick assets are never shown on your partner site — only your uploads or neutral placeholders.
        </p>
        <div className="pdash-asset-grid">
          {PARTNER_ASSET_FIELDS.map((field) => {
            const assetSrc = draft.assets?.[field.key];
            const isDataUrl = typeof assetSrc === 'string' && assetSrc.startsWith('data:');
            const displaySrc = isDataUrl ? assetSrc : assetSrc;

            return (
              <div key={field.key} className="pdash-asset-card">
                <div className="pdash-asset-preview">
                  {displaySrc ? (
                    field.type === 'video' ? (
                      <video src={displaySrc} muted playsInline controls />
                    ) : (
                      <img src={displaySrc} alt={field.label} />
                    )
                  ) : (
                    <div className="pdash-asset-empty">No file uploaded yet</div>
                  )}
                </div>
                <strong style={{ display: 'block', marginBottom: 6 }}>{field.label}</strong>
                <small style={{ display: 'block', marginBottom: 10, color: 'var(--pdash-soft)' }}>{field.hint}</small>
                <input
                  type="file"
                  accept={field.type === 'video' ? 'video/*' : 'image/*'}
                  onChange={(e) => handleAssetChange(field.key, e)}
                />
                {displaySrc ? (
                  <button
                    type="button"
                    className="pdash-btn pdash-btn-ghost"
                    style={{ marginTop: 10 }}
                    onClick={() => handleRemoveAsset(field.key)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDomain = () => {
    if (!draft) return null;

    return (
      <div className="pdash-panel">
        <h2>Custom Domain</h2>
        <p className="pdash-panel-lead">
          Connect your own domain so customers visit your brand directly instead of the subdomain.
        </p>

        {domainMessage ? (
          <div className={`pdash-alert ${domainMessage.type}`}>{domainMessage.text}</div>
        ) : null}

        <div className="pdash-field">
          <label>Your Domain</label>
          <input
            value={draft.customDomain}
            onChange={(e) => updateDraft({ customDomain: e.target.value })}
            placeholder="www.yourbrand.com"
          />
          <small>Enter without https:// — e.g. www.yourbrand.com or yourbrand.com</small>
        </div>

        <div className="pdash-field">
          <label>DNS Configuration</label>
          <div className="pdash-dns-box">
            Type: CNAME<br />
            Host: www (or your subdomain)<br />
            Value: {cnameTarget}<br />
            TTL: 3600 (or Auto)
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="pdash-btn pdash-btn-secondary" onClick={handleSaveSettings} disabled={saving}>
            Save Domain
          </button>
          <button
            type="button"
            className="pdash-btn pdash-btn-primary"
            onClick={handleVerifyDomain}
            disabled={verifyingDomain || !draft.customDomain}
          >
            {verifyingDomain ? 'Verifying...' : 'Verify DNS'}
          </button>
          {siteSettings?.siteConfig?.customDomainVerified ? (
            <span className="pdash-badge verified"><MdVerified size={14} /> Verified</span>
          ) : (
            <span className="pdash-badge pending">Not verified</span>
          )}
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="pdash-panel">
      <h2>Orders on Your Site</h2>
      <p className="pdash-panel-lead">Every order placed on your white-label storefront appears here in real time.</p>

      {!overview?.orders?.length ? (
        <div className="adm-empty" style={{ border: 'none' }}>
          <div className="adm-empty-emoji">🛍️</div>
          <p style={{ margin: '0 0 6px', fontWeight: 700 }}>No orders yet</p>
          <p style={{ margin: 0 }}>Share your site link — orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="pdash-orders-grid">
          {overview.orders.map((order) => (
            <div key={order.id} className="pdash-order-card">
              <div className="pdash-order-top">
                <h3>{order.email}</h3>
                <span className={`adm-badge ${order.status}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="pdash-order-services">{getOrderServiceLabel(order)}</div>
              <div className="pdash-order-foot">
                <div>
                  <div className="pdash-order-amount">{formatAmount(order.totalAmount, order.currency)}</div>
                  <div className="pdash-order-date">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`adm-badge ${order.paymentStatus === 'paid' ? 'completed' : 'pending'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabTitles = {
    overview: 'Dashboard Overview',
    customize: 'Site Customization',
    media: 'Media Library',
    domain: 'Custom Domain',
    orders: 'Orders',
  };

  const tabDescriptions = {
    overview: 'Performance snapshot and setup progress for your white-label storefront.',
    customize: 'Brand identity, templates, content, and visibility controls.',
    media: 'Upload images and videos that represent your business.',
    domain: 'Connect and verify your custom domain.',
    orders: 'Track revenue and fulfillment for orders on your site.',
  };

  return (
    <div className="pdash-root">
      <aside className="pdash-sidebar">
        <div className="pdash-brand">
          {logoPreview ? (
            <img src={logoPreview} alt="" className="pdash-brand-logo" />
          ) : (
            <div className="pdash-brand-badge">{brandName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <div className="pdash-brand-name">{brandName}</div>
            <div className="pdash-brand-sub">Partner Dashboard</div>
          </div>
        </div>

        <nav className="pdash-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`pdash-nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pdash-nav-footer">
          {siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdash-nav-item"
              style={{ textDecoration: 'none' }}
            >
              <MdOpenInNew size={18} />
              View Live Site
            </a>
          ) : null}
          <button type="button" className="pdash-nav-item" onClick={handleLogout}>
            <MdLogout size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="pdash-main">
        <div className="pdash-topbar">
          <div>
            <h1>{tabTitles[activeTab]}</h1>
            <p>{tabDescriptions[activeTab]}</p>
          </div>
          <div className="pdash-topbar-actions">
            <button type="button" className="pdash-btn pdash-btn-ghost" onClick={loadDashboard} disabled={loading}>
              <MdRefresh size={16} />
              Refresh
            </button>
            {activeTab !== 'orders' && activeTab !== 'overview' ? (
              <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSaveSettings} disabled={saving || !draft}>
                <MdSave size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="pdash-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="pdash-spinner" />
            <p style={{ color: 'var(--pdash-soft)', margin: 0 }}>Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="pdash-panel">
            <div className="pdash-alert error">{error}</div>
            <button type="button" className="pdash-btn pdash-btn-primary" onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'customize' && renderCustomize()}
            {activeTab === 'media' && renderMedia()}
            {activeTab === 'domain' && renderDomain()}
            {activeTab === 'orders' && renderOrders()}
          </>
        )}
      </main>
    </div>
  );
}

export default PartnerAdminApp;
