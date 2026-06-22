import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  MdAdd,
  MdDashboard,
  MdLanguage,
  MdWeb,
  MdStorefront,
  MdInventory2,
  MdPeople,
  MdChat,
  MdAccountBalanceWallet,
  MdPayments,
  MdReceipt,
  MdNotifications,
  MdSupport,
  MdSettings,
  MdLogout,
  MdOpenInNew,
  MdSave,
  MdRefresh,
  MdCheckCircle,
  MdVerified,
  MdEdit,
  MdDelete,
  MdPalette,
  MdPermMedia,
} from 'react-icons/md';
import SectionContentEditor from './components/SectionContentEditor';
import { useAuth } from '../contexts/AuthContext';
import { createPartnerAdminApi } from './partner/partnerAdminApi';
import PartnerDashboardTab from './partner/PartnerDashboardTab';
import PartnerServicesTab from './partner/PartnerServicesTab';
import PartnerOrdersTab, { PartnerClientsTab } from './partner/PartnerOrdersTab';
import PartnerMessagesTab from './partner/PartnerMessagesTab';
import PartnerEarningsTab from './partner/PartnerEarningsTab';
import PartnerWithdrawalsTab from './partner/PartnerWithdrawalsTab';
import PartnerInvoicesTab from './partner/PartnerInvoicesTab';
import PartnerNotificationsTab from './partner/PartnerNotificationsTab';
import PartnerSupportTab from './partner/PartnerSupportTab';
import PartnerSettingsTab from './partner/PartnerSettingsTab';
import {
  PARTNER_TEMPLATES,
  PARTNER_ASSET_FIELDS,
  PARTNER_CONTENT_FIELDS,
  PARTNER_SECTION_TOGGLES,
  PARTNER_HOMEPAGE_SERVICES,
  PARTNER_MEDIA_GROUPS,
  PARTNER_TOGGLE_EDITOR_MAP,
  getServiceEditorMeta,
  getDefaultEnabledServices,
  getCustomServiceDefinitions,
  createCustomServiceDefinition,
  countEnabledHomepageServices,
  getHomepageServiceOptions,
  isVideoFirstPartnerSite,
  MAX_SERVICE_VIDEO_BYTES,
} from '../config/partnerSiteConfig';
import { PARTNER_CUSTOM_SERVICE_CONTENT_DEFAULTS } from '../data/partnerSectionDefaults';
import { applyBrandCssVariables } from '../utils/brandTheme';
import { normalizeMediaUrl } from '../utils/partnerMedia';
import { resizeImageFile } from '../utils/resizeImageFile';
import AdminMessagesFab from '../components/AdminMessagesFab';
import './styles/admin.css';
import './styles/partnerDashboard.css';

const PARTNER_BASE_DOMAIN = import.meta.env.VITE_PARTNER_BASE_DOMAIN || 'bluetickgeng.com';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: MdDashboard },
  { id: 'website', label: 'My Website', icon: MdWeb },
  { id: 'services', label: 'Services', icon: MdStorefront },
  { id: 'orders', label: 'Orders', icon: MdInventory2 },
  { id: 'clients', label: 'Clients', icon: MdPeople },
  { id: 'messages', label: 'Messages', icon: MdChat },
  { id: 'earnings', label: 'Earnings', icon: MdAccountBalanceWallet },
  { id: 'withdrawals', label: 'Withdrawals', icon: MdPayments },
  { id: 'invoices', label: 'Invoices', icon: MdReceipt },
  { id: 'notifications', label: 'Notifications', icon: MdNotifications },
  { id: 'support', label: 'Support', icon: MdSupport },
  { id: 'settings', label: 'Settings', icon: MdSettings },
];

const WEBSITE_SUB_TABS = [
  { id: 'customize', label: 'Branding & Content', icon: MdPalette },
  { id: 'media', label: 'Media Library', icon: MdPermMedia },
  { id: 'domain', label: 'Custom Domain', icon: MdLanguage },
];

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
    enabledServices: {
      ...getDefaultEnabledServices(),
      ...(siteConfig.enabledServices || {}),
    },
    assets: Object.fromEntries(
      Object.entries(siteConfig.assets || {}).map(([key, value]) => [key, normalizeMediaUrl(value)])
    ),
    sectionContent: { ...(siteConfig.sectionContent || {}) },
  };
}

function PartnerAdminApp({ subdomain }) {
  const { apiUrl } = useAuth();
  const tokenKey = `partnerAdminToken:${subdomain}`;

  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [websiteSubTab, setWebsiteSubTab] = useState('customize');
  const [dashboard, setDashboard] = useState(null);
  const [overview, setOverview] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [pendingLogo, setPendingLogo] = useState(null);
  const [pendingAssets, setPendingAssets] = useState({});
  const [pendingPromoUploads, setPendingPromoUploads] = useState({});
  const [pendingCustomServiceUploads, setPendingCustomServiceUploads] = useState({});
  const [pendingServiceVideoUploads, setPendingServiceVideoUploads] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);
  const [error, setError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [domainMessage, setDomainMessage] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [messagesIntent, setMessagesIntent] = useState(null);
  const pdashRootRef = useRef(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const partnerApi = useMemo(
    () => (token ? createPartnerAdminApi(apiUrl, subdomain, token) : null),
    [apiUrl, subdomain, token]
  );

  const clearPartnerSession = useCallback(() => {
    localStorage.removeItem(tokenKey);
    setToken(null);
    setOverview(null);
    setSiteSettings(null);
    setDraft(null);
    setError(null);
  }, [tokenKey]);

  const handleLogout = useCallback(() => {
    clearPartnerSession();
  }, [clearPartnerSession]);

  const handlePartnerSiteMissing = useCallback((message) => {
    clearPartnerSession();
    setLoginError(
      message ||
        `No partner site is registered for ${subdomain}.${PARTNER_BASE_DOMAIN}. Submit a partnership application on the main site, or confirm the subdomain in Bluetick Admin → Partnerships.`
    );
  }, [clearPartnerSession, subdomain]);

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
      if (response.status === 404) {
        handlePartnerSiteMissing(data.error);
        return null;
      }
      throw new Error(data.error || 'Failed to load dashboard');
    }

    setOverview(data);
    return data;
  }, [apiUrl, token, subdomain, handleLogout, handlePartnerSiteMissing]);

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
      if (response.status === 404) {
        handlePartnerSiteMissing(data.error);
        return null;
      }
      throw new Error(data.error || 'Failed to load site settings');
    }

    setSiteSettings(data);
    setDraft(buildEmptyDraft(data.siteConfig));
    setLogoPreview(normalizeMediaUrl(data.logoUrl) || null);
    setPendingLogo(null);
    setPendingAssets({});
    setPendingPromoUploads({});
    return data;
  }, [apiUrl, token, subdomain, handleLogout, handlePartnerSiteMissing]);

  const fetchDashboard = useCallback(async () => {
    if (!token || !partnerApi) return null;
    try {
      const data = await partnerApi.getDashboard();
      setDashboard(data);
      setOverview((prev) => ({ ...prev, stats: data.stats, orders: data.orders, branding: data.branding, site: data.site }));
      return data;
    } catch {
      return fetchOverview();
    }
  }, [token, partnerApi, fetchOverview]);

  const loadDashboard = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDashboard(), fetchSiteSettings()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, fetchDashboard, fetchSiteSettings]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!partnerApi) return undefined;

    const fetchUnread = () => {
      partnerApi
        .getUnreadCount()
        .then((data) => setUnreadMessages(data.unreadCount || 0))
        .catch(() => {});
    };

    fetchUnread();
    const intervalId = window.setInterval(fetchUnread, 30000);
    return () => window.clearInterval(intervalId);
  }, [partnerApi, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(`${apiUrl}/api/partner-admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain,
          username: loginData.username.trim(),
          password: loginData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.isMainAdmin) {
        localStorage.setItem('adminToken', data.token);
      }

      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setLoginData({ username: '', password: '' });
      setLoginError(null);
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

  const updateDraftService = (serviceId, enabled) => {
    setDraft((prev) => ({
      ...prev,
      enabledServices: { ...prev.enabledServices, [serviceId]: enabled },
    }));
  };

  const openSectionEditor = (editorMeta) => {
    setActiveEditor(editorMeta);
  };

  const handleSectionEditorSave = ({ contentPatch, sectionPatch }) => {
    setDraft((prev) => ({
      ...prev,
      content: contentPatch ? { ...prev.content, ...contentPatch } : prev.content,
      sectionContent: sectionPatch
        ? {
            ...prev.sectionContent,
            [activeEditor.key]: {
              ...(prev.sectionContent?.[activeEditor.key] || {}),
              ...sectionPatch,
            },
          }
        : prev.sectionContent,
    }));
    setSaveMessage({
      type: 'success',
      text: 'Section content updated. Click Save Changes to publish it on your site.',
    });
  };

  const enabledServiceCount = useMemo(() => {
    if (!draft?.enabledServices) return 0;
    return countEnabledHomepageServices(
      draft.enabledServices,
      getCustomServiceDefinitions(draft)
    );
  }, [draft?.enabledServices, draft?.sectionContent?.customServices?.items]);

  const customServiceItems = getCustomServiceDefinitions(draft);
  const homepageServiceOptions = useMemo(
    () => getHomepageServiceOptions(draft),
    [draft?.sectionContent?.customServices?.items]
  );

  const videoFirstSite = useMemo(
    () => isVideoFirstPartnerSite({
      ...draft,
      contactEmail: overview?.branding?.contactEmail || siteSettings?.contactEmail,
      isVideoFirstPartnerSite: overview?.branding?.isVideoFirstPartnerSite,
    }),
    [draft, overview?.branding, siteSettings?.contactEmail]
  );

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

    const optimizedFile = await resizeImageFile(file, { maxWidth: 420, maxHeight: 96 });
    const dataUrl = await readFileAsDataUrl(optimizedFile);
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

  const promoItems = draft?.sectionContent?.homepagePromos?.items || [];

  const updatePromoItems = (items) => {
    setDraft((prev) => ({
      ...prev,
      sectionContent: {
        ...prev.sectionContent,
        homepagePromos: { items },
      },
    }));
  };

  const handleAddPromo = () => {
    const nextItem = {
      id: `promo-${Date.now()}`,
      afterService: PARTNER_HOMEPAGE_SERVICES[0]?.id || 'appDevelopment',
      imageUrl: '',
      linkUrl: '',
      alt: 'Promotional banner',
      enabled: true,
    };
    updatePromoItems([...promoItems, nextItem]);
  };

  const handleUpdatePromo = (promoId, patch) => {
    updatePromoItems(
      promoItems.map((item) => (item.id === promoId ? { ...item, ...patch } : item))
    );
  };

  const handleRemovePromo = (promoId) => {
    updatePromoItems(promoItems.filter((item) => item.id !== promoId));
    setPendingPromoUploads((prev) => {
      const next = { ...prev };
      delete next[promoId];
      return next;
    });
  };

  const handlePromoImageChange = async (promoId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Promo banner must be an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Promo image must be under 5MB.' });
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPendingPromoUploads((prev) => ({ ...prev, [promoId]: dataUrl }));
    handleUpdatePromo(promoId, { imageUrl: dataUrl });
  };

  const updateCustomServiceItems = (items) => {
    setDraft((prev) => ({
      ...prev,
      sectionContent: {
        ...prev.sectionContent,
        customServices: { items },
      },
    }));
  };

  const handleAddCustomService = () => {
    const nextService = createCustomServiceDefinition('Custom Service');
    setDraft((prev) => ({
      ...prev,
      enabledServices: { ...prev.enabledServices, [nextService.id]: true },
      sectionContent: {
        ...prev.sectionContent,
        customServices: {
          items: [...getCustomServiceDefinitions(prev), nextService],
        },
        [nextService.id]: {
          ...(prev.sectionContent?.[nextService.id] || {}),
          ...PARTNER_CUSTOM_SERVICE_CONTENT_DEFAULTS,
        },
      },
    }));
  };

  const handleUpdateCustomService = (serviceId, patch) => {
    updateCustomServiceItems(
      customServiceItems.map((item) => (item.id === serviceId ? { ...item, ...patch } : item))
    );
  };

  const handleRemoveCustomService = (serviceId) => {
    setDraft((prev) => {
      const nextEnabled = { ...prev.enabledServices };
      delete nextEnabled[serviceId];
      const nextSectionContent = { ...prev.sectionContent };
      delete nextSectionContent[serviceId];
      return {
        ...prev,
        enabledServices: nextEnabled,
        sectionContent: {
          ...nextSectionContent,
          customServices: {
            items: getCustomServiceDefinitions(prev).filter((item) => item.id !== serviceId),
          },
        },
      };
    });
    setPendingCustomServiceUploads((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  const handleCustomServiceImageChange = async (serviceId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Service image must be an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Service image must be under 5MB.' });
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPendingCustomServiceUploads((prev) => ({ ...prev, [serviceId]: dataUrl }));
    handleUpdateCustomService(serviceId, { imageUrl: dataUrl });
  };

  const updateServiceVideoDraft = (serviceId, videoUrl) => {
    setDraft((prev) => ({
      ...prev,
      sectionContent: {
        ...prev.sectionContent,
        serviceVideos: {
          ...(prev.sectionContent?.serviceVideos || {}),
          [serviceId]: {
            ...(prev.sectionContent?.serviceVideos?.[serviceId] || {}),
            videoUrl,
          },
        },
      },
    }));
  };

  const handleServiceVideoChange = async (serviceId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setSaveMessage({ type: 'error', text: 'Service media must be a video file (MP4, WEBM, or MOV).' });
      return;
    }
    if (file.size > MAX_SERVICE_VIDEO_BYTES) {
      setSaveMessage({ type: 'error', text: 'Service video must be under 100MB.' });
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setPendingServiceVideoUploads((prev) => ({ ...prev, [serviceId]: dataUrl }));
    updateServiceVideoDraft(serviceId, dataUrl);
  };

  const handleRemoveServiceVideo = (serviceId) => {
    updateServiceVideoDraft(serviceId, '');
    setPendingServiceVideoUploads((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  const getServiceVideoPreview = (serviceId) => {
    return (
      pendingServiceVideoUploads[serviceId] ||
      draft?.sectionContent?.serviceVideos?.[serviceId]?.videoUrl ||
      ''
    );
  };

  const handleSaveSettings = async () => {
    if (!draft) return;

    const selectedServices = countEnabledHomepageServices(
      draft.enabledServices,
      getCustomServiceDefinitions(draft)
    );
    if (selectedServices === 0) {
      setSaveMessage({ type: 'error', text: 'Select at least one homepage service before saving.' });
      return;
    }

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

      const promoUploads = {};
      Object.entries(pendingPromoUploads).forEach(([promoId, value]) => {
        if (typeof value === 'string' && value.startsWith('data:')) {
          promoUploads[promoId] = value;
        }
      });

      const customServiceUploads = {};
      Object.entries(pendingCustomServiceUploads).forEach(([serviceId, value]) => {
        if (typeof value === 'string' && value.startsWith('data:')) {
          customServiceUploads[serviceId] = value;
        }
      });

      const serviceVideoUploads = {};
      Object.entries(pendingServiceVideoUploads).forEach(([serviceId, value]) => {
        if (typeof value === 'string' && value.startsWith('data:')) {
          serviceVideoUploads[serviceId] = value;
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
            enabledServices: draft.enabledServices,
            sectionContent: draft.sectionContent,
            logo: pendingLogo || undefined,
            assetUploads: Object.keys(assetUploads).length ? assetUploads : undefined,
            promoUploads: Object.keys(promoUploads).length ? promoUploads : undefined,
            customServiceUploads: Object.keys(customServiceUploads).length ? customServiceUploads : undefined,
            serviceVideoUploads: Object.keys(serviceVideoUploads).length ? serviceVideoUploads : undefined,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSiteSettings(data);
      setDraft(buildEmptyDraft(data.siteConfig));
      setLogoPreview(normalizeMediaUrl(data.logoUrl) || null);
      setPendingLogo(null);
      setPendingAssets({});
      setPendingPromoUploads({});
      setPendingCustomServiceUploads({});
      setPendingServiceVideoUploads({});
      setSaveMessage({ type: 'success', text: 'Your site settings were saved successfully.' });

      applyBrandCssVariables(
        document.documentElement,
        data.siteConfig.primaryColor,
        data.siteConfig.primaryColorDark
      );
    } catch (err) {
      const message =
        err?.message === 'Failed to fetch'
          ? 'Could not reach the server. Check your connection and try again. If this keeps happening, the API may need to be redeployed.'
          : err.message;
      setSaveMessage({ type: 'error', text: message });
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
      {
        label: 'Choose homepage services',
        done: Boolean(
          config?.enabledServices &&
            PARTNER_HOMEPAGE_SERVICES.some((service) => config.enabledServices[service.id] === false)
        ),
      },
      { label: 'Upload app development media', done: Boolean(assets.appDevelopmentImage) },
      { label: 'Connect a custom domain', done: Boolean(config?.customDomainVerified) },
    ];
  }, [siteSettings]);

  const completionPercent = Math.round(
    (setupChecklist.filter((item) => item.done).length / setupChecklist.length) * 100
  );

  useEffect(() => {
    const root = pdashRootRef.current;
    if (!root || !token) return;

    const primaryColor = draft?.primaryColor || siteSettings?.siteConfig?.primaryColor || '#2563eb';
    const primaryColorDark = siteSettings?.siteConfig?.primaryColorDark;
    applyBrandCssVariables(root, primaryColor, primaryColorDark);
  }, [
    token,
    draft?.primaryColor,
    siteSettings?.siteConfig?.primaryColor,
    siteSettings?.siteConfig?.primaryColorDark,
  ]);

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

            <button
              type="submit"
              className="pdash-btn pdash-btn-primary pdash-login-submit"
              disabled={loginLoading}
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="pdash-login-sub" style={{ marginTop: 18, marginBottom: 0 }}>
            No site here yet?{' '}
            <a href={`https://${PARTNER_BASE_DOMAIN}/partner/apply`} target="_blank" rel="noopener noreferrer">
              Apply for a partnership
            </a>
          </p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <PartnerDashboardTab
      dashboard={dashboard}
      overview={overview}
      siteSettings={siteSettings}
      siteUrl={siteUrl}
      setupChecklist={setupChecklist}
      completionPercent={completionPercent}
    />
  );

  const renderWebsite = () => (
    <>
      <div className="pdash-subnav">
        {WEBSITE_SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`pdash-subnav-item${websiteSubTab === tab.id ? ' active' : ''}`}
              onClick={() => setWebsiteSubTab(tab.id)}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>
      {websiteSubTab === 'customize' && renderCustomize()}
      {websiteSubTab === 'media' && renderMedia()}
      {websiteSubTab === 'domain' && renderDomain()}
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
          <h2>Homepage Services</h2>
          <p className="pdash-panel-lead">
            {videoFirstSite
              ? 'Upload a large video for each enabled homepage service. Videos display full-width with no text overlay — visitors can expand them and toggle sound.'
              : 'Choose which services appear on your homepage. This list matches the main Bluetick site — from App Development through Wikipedia Page Services.'}
            <strong> {enabledServiceCount} service{enabledServiceCount === 1 ? '' : 's'} enabled.</strong>
          </p>
          <div className="pdash-service-list">
            {PARTNER_HOMEPAGE_SERVICES.map((service, index) => {
              const isEnabled = Boolean(draft.enabledServices?.[service.id]);
              const editorMeta = getServiceEditorMeta(service);
              const videoPreview = getServiceVideoPreview(service.id);
              return (
                <div key={service.id} className={`pdash-service-item${isEnabled ? ' is-enabled' : ''}${videoFirstSite && isEnabled ? ' is-video-mode' : ''}`}>
                  <label className="pdash-service-item-main">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => updateDraftService(service.id, e.target.checked)}
                    />
                    <span className="pdash-service-order">{index + 1}</span>
                    <span className="pdash-service-copy">
                      <strong>{service.label}</strong>
                      <span>{videoFirstSite ? 'Homepage video section' : service.description}</span>
                    </span>
                  </label>
                  {videoFirstSite && isEnabled ? (
                    <div className="pdash-service-video-upload">
                      {videoPreview ? (
                        <video
                          src={videoPreview}
                          controls
                          muted
                          playsInline
                          style={{ width: '100%', maxHeight: 180, borderRadius: 12, background: '#000' }}
                        />
                      ) : null}
                      <input type="file" accept="video/*" onChange={(e) => handleServiceVideoChange(service.id, e)} />
                      {videoPreview ? (
                        <button
                          type="button"
                          className="pdash-btn pdash-btn-ghost"
                          onClick={() => handleRemoveServiceVideo(service.id)}
                        >
                          Remove video
                        </button>
                      ) : null}
                      <small>MP4, WEBM or MOV up to 100MB.</small>
                    </div>
                  ) : null}
                  {!videoFirstSite ? (
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-ghost pdash-service-edit"
                      onClick={() => openSectionEditor(editorMeta)}
                    >
                      <MdEdit /> Edit content
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="pdash-custom-services">
            <div className="pdash-custom-services-head">
              <div>
                <strong>Custom Services</strong>
                <span>
                  {videoFirstSite
                    ? 'Add extra homepage video sections. Only the service name and video are shown on the site.'
                    : 'Add your own service sections with a name, image, and write-up.'}
                </span>
              </div>
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost pdash-editor-add"
                onClick={handleAddCustomService}
              >
                <MdAdd /> Add custom service
              </button>
            </div>

            {customServiceItems.length ? (
              <div className="pdash-editor-list">
                {customServiceItems.map((service, index) => {
                  const previewSrc = videoFirstSite
                    ? getServiceVideoPreview(service.id)
                    : pendingCustomServiceUploads[service.id] || service.imageUrl;
                  const isEnabled = draft.enabledServices?.[service.id] !== false;
                  const editorMeta = getServiceEditorMeta(service);
                  return (
                    <div key={service.id} className={`pdash-editor-list-item${isEnabled ? ' is-enabled' : ''}`}>
                      <div className="pdash-editor-list-head">
                        <strong>Custom service {index + 1}</strong>
                        <button
                          type="button"
                          className="pdash-btn pdash-btn-ghost"
                          onClick={() => handleRemoveCustomService(service.id)}
                        >
                          <MdDelete /> Remove
                        </button>
                      </div>

                      <label className="pdash-service-item-main" style={{ marginBottom: 12 }}>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => updateDraftService(service.id, e.target.checked)}
                        />
                        <span className="pdash-service-copy">
                          <strong>Show on homepage</strong>
                        </span>
                      </label>

                      <div className="pdash-grid-2">
                        <div className="pdash-field">
                          <label>Service name</label>
                          <input
                            value={service.label || ''}
                            onChange={(e) => handleUpdateCustomService(service.id, { label: e.target.value })}
                            placeholder="e.g. Brand Consulting"
                          />
                        </div>
                        <div className="pdash-field">
                          <label>Short description (dashboard only)</label>
                          <input
                            value={service.description || ''}
                            onChange={(e) => handleUpdateCustomService(service.id, { description: e.target.value })}
                            placeholder="Brief note for your reference"
                          />
                        </div>
                      </div>

                      <div className="pdash-field">
                        <label>{videoFirstSite ? 'Section video' : 'Section image'}</label>
                        {previewSrc ? (
                          videoFirstSite ? (
                            <video
                              src={previewSrc}
                              controls
                              muted
                              playsInline
                              style={{ width: '100%', maxHeight: 160, borderRadius: 12, background: '#000' }}
                            />
                          ) : (
                            <img
                              src={previewSrc}
                              alt={service.label || 'Service preview'}
                              style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12 }}
                            />
                          )
                        ) : null}
                        <input
                          type="file"
                          accept={videoFirstSite ? 'video/*' : 'image/*'}
                          onChange={(e) =>
                            videoFirstSite
                              ? handleServiceVideoChange(service.id, e)
                              : handleCustomServiceImageChange(service.id, e)
                          }
                        />
                        {videoFirstSite && previewSrc ? (
                          <button
                            type="button"
                            className="pdash-btn pdash-btn-ghost"
                            onClick={() => handleRemoveServiceVideo(service.id)}
                          >
                            Remove video
                          </button>
                        ) : null}
                        {videoFirstSite ? <small>MP4, WEBM or MOV up to 100MB.</small> : null}
                      </div>

                      {!videoFirstSite ? (
                        <>
                      <div className="pdash-grid-2">
                        <div className="pdash-field">
                          <label>Button label</label>
                          <input
                            value={service.ctaLabel || ''}
                            onChange={(e) => handleUpdateCustomService(service.id, { ctaLabel: e.target.value })}
                            placeholder="Get Started"
                          />
                        </div>
                        <div className="pdash-field">
                          <label>Button link</label>
                          <input
                            value={service.ctaLink || ''}
                            onChange={(e) => handleUpdateCustomService(service.id, { ctaLink: e.target.value })}
                            placeholder="#custom-requests or https://..."
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="pdash-btn pdash-btn-ghost"
                        onClick={() => openSectionEditor(editorMeta)}
                      >
                        <MdEdit /> Edit section content
                      </button>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="pdash-panel-lead" style={{ marginTop: 12 }}>
                No custom services yet. Use the button above to create one.
              </p>
            )}
          </div>
        </div>

        <div className="pdash-panel">
          <h2>Homepage Sections</h2>
          <p className="pdash-panel-lead">Control hero, logos, testimonials, FAQ, and other non-service blocks on your site.</p>
          {PARTNER_SECTION_TOGGLES.map((toggle) => {
            const editorMeta = PARTNER_TOGGLE_EDITOR_MAP[toggle.key];
            return (
            <div key={toggle.key} className="pdash-toggle">
              <div>
                <strong>{toggle.label}</strong>
                <span>{toggle.description}</span>
              </div>
              <div className="pdash-toggle-actions">
                {editorMeta ? (
                  <button
                    type="button"
                    className="pdash-btn pdash-btn-ghost pdash-toggle-edit"
                    onClick={() => openSectionEditor(editorMeta)}
                  >
                    <MdEdit /> Edit
                  </button>
                ) : null}
                <label className="pdash-switch">
                  <input
                    type="checkbox"
                    checked={
                      draft.features?.[toggle.key] ??
                      toggle.defaultEnabled ??
                      false
                    }
                    onChange={(e) => updateDraftFeature(toggle.key, e.target.checked)}
                  />
                  <span className="pdash-switch-slider" />
                </label>
              </div>
            </div>
          );
          })}
        </div>

        <div className="pdash-panel">
          <h2>Homepage Promo Banners</h2>
          <p className="pdash-panel-lead">
            Add image banners (ads, announcements, offers) that appear between service sections on your homepage.
          </p>
          <div className="pdash-editor-list">
            {promoItems.map((promo, index) => {
              const previewSrc = pendingPromoUploads[promo.id] || promo.imageUrl;
              return (
                <div key={promo.id} className="pdash-editor-list-item">
                  <div className="pdash-editor-list-head">
                    <strong>Promo banner {index + 1}</strong>
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-ghost"
                      onClick={() => handleRemovePromo(promo.id)}
                    >
                      <MdDelete /> Remove
                    </button>
                  </div>
                  <div className="pdash-grid-2">
                    <div className="pdash-field">
                      <label>Show after service</label>
                      <select
                        value={promo.afterService}
                        onChange={(e) => handleUpdatePromo(promo.id, { afterService: e.target.value })}
                      >
                        {homepageServiceOptions.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="pdash-field">
                      <label>Enabled</label>
                      <label className="pdash-switch" style={{ marginTop: 8 }}>
                        <input
                          type="checkbox"
                          checked={promo.enabled !== false}
                          onChange={(e) => handleUpdatePromo(promo.id, { enabled: e.target.checked })}
                        />
                        <span className="pdash-switch-slider" />
                      </label>
                    </div>
                  </div>
                  <div className="pdash-field">
                    <label>Banner image</label>
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt={promo.alt || 'Promo preview'}
                        style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 12 }}
                      />
                    ) : null}
                    <input type="file" accept="image/*" onChange={(e) => handlePromoImageChange(promo.id, e)} />
                  </div>
                  <div className="pdash-grid-2">
                    <div className="pdash-field">
                      <label>Link URL (optional)</label>
                      <input
                        value={promo.linkUrl || ''}
                        onChange={(e) => handleUpdatePromo(promo.id, { linkUrl: e.target.value })}
                        placeholder="https://your-offer-page.com"
                      />
                    </div>
                    <div className="pdash-field">
                      <label>Alt text</label>
                      <input
                        value={promo.alt || ''}
                        onChange={(e) => handleUpdatePromo(promo.id, { alt: e.target.value })}
                        placeholder="Describe the banner"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="pdash-btn pdash-btn-ghost pdash-editor-add" onClick={handleAddPromo}>
            <MdAdd /> Add promo banner
          </button>
        </div>
      </>
    );
  };

  const renderMedia = () => {
    if (!draft) return null;

    return (
      <>
        <div className="pdash-panel">
          <h2>Media Library</h2>
          <p className="pdash-panel-lead">
            Upload images and videos for your homepage hero, service sections, and About page.
            For hero media, go to the <strong>Homepage Hero</strong> group below — use a hero image for a static banner, or a hero video for motion.
          </p>
        </div>

        {PARTNER_MEDIA_GROUPS.map((group) => (
          <div key={group.id} className="pdash-panel">
            <h2>{group.label}</h2>
            <p className="pdash-panel-lead">{group.description}</p>
            <div className="pdash-asset-grid">
              {PARTNER_ASSET_FIELDS.filter((field) => field.group === group.id).map((field) => {
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
        ))}
      </>
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
    <PartnerOrdersTab orders={dashboard?.orders} overviewOrders={overview?.orders} />
  );

  const tabTitles = {
    overview: 'Dashboard',
    website: 'My Website',
    services: 'Services',
    orders: 'Orders',
    clients: 'Clients',
    messages: 'Messages',
    earnings: 'Earnings',
    withdrawals: 'Withdrawals',
    invoices: 'Invoices',
    notifications: 'Notifications',
    support: 'Support',
    settings: 'Settings',
  };

  const tabDescriptions = {
    overview: 'Performance snapshot — orders, revenue, clients, and earnings.',
    website: 'Brand your white-label site — logo, colors, content, domain, and media.',
    services: 'Set your selling prices and manage service availability.',
    orders: 'Track client orders and project status on your storefront.',
    clients: 'View and manage customers who ordered through your site.',
    messages: 'Real-time messaging with clients and Bluetickgeng support.',
    earnings: 'Monitor available balance, pending earnings, and profit history.',
    withdrawals: 'Request payouts via bank, PayPal, Wise, Payoneer, or crypto.',
    invoices: 'Download invoices and receipts for client orders.',
    notifications: 'Order, message, and earnings alerts.',
    support: 'Get help from the Bluetickgeng fulfillment team.',
    settings: 'Profile, KYC verification, business address, and preferences.',
  };

  const websiteSaveTabs = ['website'];
  const showSaveButton = activeTab === 'website' && websiteSubTab !== 'domain';

  return (
    <div className="pdash-root" ref={pdashRootRef}>
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
                {item.id === 'messages' && unreadMessages > 0 ? (
                  <span className="pdash-nav-badge">{unreadMessages > 99 ? '99+' : unreadMessages}</span>
                ) : null}
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
            {activeTab !== 'orders' && activeTab !== 'overview' && showSaveButton ? (
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
            <p className="pdash-panel-lead">
              This dashboard is tied to <strong>{subdomain}.{PARTNER_BASE_DOMAIN}</strong>. If you expected a site here,
              confirm the partnership exists in production and that you are using the correct subdomain.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="pdash-btn pdash-btn-primary" onClick={loadDashboard}>
                Try Again
              </button>
              <button type="button" className="pdash-btn pdash-btn-secondary" onClick={handleLogout}>
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'website' && renderWebsite()}
            {activeTab === 'services' && partnerApi && (
              <PartnerServicesTab api={partnerApi} onMessage={setSaveMessage} />
            )}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'clients' && partnerApi && (
              <PartnerClientsTab
                api={partnerApi}
                onMessageClient={(client) => {
                  setMessagesIntent({ category: 'clients', client, key: Date.now() });
                  setActiveTab('messages');
                }}
              />
            )}
            {activeTab === 'messages' && partnerApi && (
              <PartnerMessagesTab
                key={messagesIntent?.key || 'messages-default'}
                api={partnerApi}
                initialCategory={messagesIntent?.category || 'support'}
                initialClient={messagesIntent?.client || null}
              />
            )}
            {activeTab === 'earnings' && partnerApi && <PartnerEarningsTab api={partnerApi} />}
            {activeTab === 'withdrawals' && partnerApi && (
              <PartnerWithdrawalsTab api={partnerApi} onMessage={setSaveMessage} />
            )}
            {activeTab === 'invoices' && partnerApi && <PartnerInvoicesTab api={partnerApi} />}
            {activeTab === 'notifications' && partnerApi && <PartnerNotificationsTab api={partnerApi} />}
            {activeTab === 'support' && partnerApi && (
              <PartnerSupportTab api={partnerApi} onMessage={setSaveMessage} />
            )}
            {activeTab === 'settings' && partnerApi && (
              <PartnerSettingsTab api={partnerApi} onMessage={setSaveMessage} />
            )}
          </>
        )}
      </main>

      <SectionContentEditor
        isOpen={Boolean(activeEditor)}
        sectionKey={activeEditor?.key}
        editorType={activeEditor?.editorType}
        title={activeEditor ? `Edit ${activeEditor.label}` : ''}
        sectionContent={draft?.sectionContent}
        siteContent={draft?.content}
        onClose={() => setActiveEditor(null)}
        onSave={handleSectionEditorSave}
      />

      <AdminMessagesFab
        apiUrl={apiUrl}
        token={token}
        mode="partner"
        subdomain={subdomain}
        onNavigate={() => {
          setMessagesIntent({ category: 'clients', key: Date.now() });
          setActiveTab('messages');
        }}
        refreshKey={activeTab}
      />
    </div>
  );
}

export default PartnerAdminApp;
