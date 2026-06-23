import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';

const MAX_KYC_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_KYC_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file. Try a different file.'));
    reader.readAsDataURL(file);
  });
}

function formatKycStatus(status = 'not_started') {
  return String(status).replace(/_/g, ' ');
}

function validateKycFile(file, label) {
  if (!file) return null;
  if (!ALLOWED_KYC_TYPES.has(file.type)) {
    return `${label} must be JPG, PNG, WEBP, GIF, or PDF.`;
  }
  if (file.size > MAX_KYC_FILE_BYTES) {
    return `${label} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 8MB.`;
  }
  return null;
}

export default function PartnerSettingsTab({ api, onMessage, onKycUpdated }) {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({});
  const [businessAddress, setBusinessAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [kycFiles, setKycFiles] = useState({ idDocument: '', businessDocument: '' });
  const [kycFileNames, setKycFileNames] = useState({ idDocument: '', businessDocument: '' });
  const [kycError, setKycError] = useState('');
  const [submittingKyc, setSubmittingKyc] = useState(false);

  useEffect(() => {
    setLoadError('');
    api
      .getSettings()
      .then((data) => {
        setProfile(data.profile || {});
        setSettings(data.profile?.settings || {});
        setBusinessAddress(data.profile?.businessAddress || {});
      })
      .catch((err) => {
        setLoadError(err.message || 'Failed to load settings');
      })
      .finally(() => setLoading(false));
  }, [api]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateSettings({
        profile: {
          fullName: profile.fullName,
          phone: profile.phone,
          company: profile.company,
          website: profile.website,
        },
        businessAddress,
        settings,
      });
      onMessage?.({ type: 'success', text: 'Settings saved.' });
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleKycFile = async (field, file) => {
    setKycError('');
    if (!file) return;

    const label = field === 'idDocument' ? 'Government ID' : 'Business document';
    const validationError = validateKycFile(file, label);
    if (validationError) {
      setKycError(validationError);
      onMessage?.({ type: 'error', text: validationError });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setKycFiles((prev) => ({ ...prev, [field]: dataUrl }));
      setKycFileNames((prev) => ({ ...prev, [field]: file.name }));
    } catch (error) {
      const message = error.message || `Could not read ${label.toLowerCase()}.`;
      setKycError(message);
      onMessage?.({ type: 'error', text: message });
    }
  };

  const submitKyc = async () => {
    setKycError('');

    if (!kycFiles.idDocument && !profile?.kyc?.idDocumentUrl) {
      const message = 'Upload your government ID before submitting. Accepted formats: JPG, PNG, WEBP, GIF, or PDF (max 8MB).';
      setKycError(message);
      onMessage?.({ type: 'error', text: message });
      return;
    }

    try {
      setSubmittingKyc(true);
      const data = await api.submitKyc(kycFiles);
      setProfile((prev) => ({ ...prev, kyc: data.kyc || { ...prev?.kyc, status: 'pending' } }));
      setKycFiles({ idDocument: '', businessDocument: '' });
      setKycFileNames({ idDocument: '', businessDocument: '' });
      onMessage?.({ type: 'success', text: data.message || 'KYC documents submitted for review.' });
      onKycUpdated?.();
    } catch (err) {
      const message = err.message || 'Could not submit KYC. Check your files and try again.';
      setKycError(message);
      onMessage?.({ type: 'error', text: message });
    } finally {
      setSubmittingKyc(false);
    }
  };

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  if (loadError) {
    return (
      <div className="pdash-panel">
        <div className="pdash-alert error">{loadError}</div>
        <p className="pdash-panel-lead">
          Settings could not be loaded. If you see a route-not-found error, the backend may need to be redeployed with the latest partner dashboard APIs.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pdash-panel">
        <p className="pdash-panel-lead">No profile data available.</p>
      </div>
    );
  }

  const kycStatus = profile.kyc?.status || 'not_started';
  const kycPending = kycStatus === 'pending';
  const kycApproved = kycStatus === 'approved';
  const kycRejected = kycStatus === 'rejected';
  const canSubmitKyc = !kycApproved && !kycPending;

  return (
    <>
      <div className="pdash-panel">
        <h2>Company Information</h2>
        <div className="pdash-grid-2">
          <div className="pdash-field">
            <label>Full Name</label>
            <input value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Company / Brand</label>
            <input value={profile.company || ''} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Phone</label>
            <input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Website (optional)</label>
            <input value={profile.website || ''} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Email</label>
            <input value={profile.email || ''} disabled />
            {!profile.emailVerified ? (
              <small style={{ color: '#b45309' }}>Email not verified — check your inbox</small>
            ) : (
              <small style={{ color: '#047857' }}>Email verified</small>
            )}
          </div>
          <div className="pdash-field">
            <label>Country</label>
            <input value={profile.country || ''} disabled />
          </div>
        </div>
      </div>

      <div className="pdash-panel">
        <h2>Business Address</h2>
        <div className="pdash-grid-2">
          <div className="pdash-field">
            <label>Address Line 1</label>
            <input value={businessAddress.line1 || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, line1: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Address Line 2</label>
            <input value={businessAddress.line2 || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, line2: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>City</label>
            <input value={businessAddress.city || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, city: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>State / Region</label>
            <input value={businessAddress.state || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, state: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Postal Code</label>
            <input value={businessAddress.postalCode || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, postalCode: e.target.value })} />
          </div>
          <div className="pdash-field">
            <label>Country</label>
            <input value={businessAddress.country || profile.country || ''} onChange={(e) => setBusinessAddress({ ...businessAddress, country: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="pdash-panel">
        <h2>KYC Verification</h2>
        {kycApproved ? (
          <div className="pdash-kyc-status pdash-kyc-status--approved">
            <strong>KYC completed</strong>
            <span>Your identity verification is approved. You can connect a custom domain from My Website → Domain.</span>
          </div>
        ) : kycPending ? (
          <div className="pdash-kyc-status pdash-kyc-status--pending">
            <strong>KYC under review</strong>
            <span>Your documents were submitted and are awaiting approval from the Bluetick team.</span>
          </div>
        ) : kycRejected ? (
          <div className="pdash-kyc-status pdash-kyc-status--rejected">
            <strong>KYC rejected</strong>
            <span>
              {profile.kyc?.notes
                ? profile.kyc.notes
                : 'Your previous submission was rejected. Upload updated documents and submit again.'}
            </span>
          </div>
        ) : (
          <div className="pdash-kyc-status pdash-kyc-status--action">
            <strong>Complete your KYC</strong>
            <span>Upload your government ID so we can verify your identity and unlock custom domains.</span>
          </div>
        )}
        <p className="pdash-panel-lead">
          Status: <strong>{formatKycStatus(kycStatus)}</strong>
        </p>
        {canSubmitKyc ? (
          <>
            <p className="pdash-panel-lead">
              Upload a clear government ID (required) and optional business registration document. JPG, PNG, WEBP, GIF, or PDF — max 8MB each.
            </p>
            <div className="pdash-grid-2">
              <div className="pdash-field">
                <label>Government ID *</label>
                <input type="file" accept="image/*,.pdf,application/pdf" onChange={(e) => handleKycFile('idDocument', e.target.files?.[0])} />
                {kycFileNames.idDocument ? <small>Selected: {kycFileNames.idDocument}</small> : null}
                {!kycFileNames.idDocument && profile.kyc?.idDocumentUrl ? (
                  <small>Previously uploaded ID on file — upload again only if replacing it.</small>
                ) : null}
              </div>
              <div className="pdash-field">
                <label>Business Document (optional)</label>
                <input type="file" accept="image/*,.pdf,application/pdf" onChange={(e) => handleKycFile('businessDocument', e.target.files?.[0])} />
                {kycFileNames.businessDocument ? <small>Selected: {kycFileNames.businessDocument}</small> : null}
              </div>
            </div>
            {kycError ? <div className="pdash-alert error" style={{ marginBottom: 12 }}>{kycError}</div> : null}
            <button
              type="button"
              className="pdash-btn pdash-btn-primary"
              onClick={submitKyc}
              disabled={submittingKyc || (!kycFiles.idDocument && !profile.kyc?.idDocumentUrl)}
            >
              {submittingKyc ? 'Submitting...' : 'Submit KYC'}
            </button>
          </>
        ) : null}
      </div>

      <div className="pdash-panel">
        <h2>Notification Preferences</h2>
        <label className="pdash-toggle">
          <div><strong>Email notifications</strong></div>
          <input
            type="checkbox"
            checked={settings.emailNotifications !== false}
            onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
          />
        </label>
        <label className="pdash-toggle">
          <div><strong>Order notifications</strong></div>
          <input
            type="checkbox"
            checked={settings.orderNotifications !== false}
            onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
          />
        </label>
        <label className="pdash-toggle">
          <div><strong>Message notifications</strong></div>
          <input
            type="checkbox"
            checked={settings.messageNotifications !== false}
            onChange={(e) => setSettings({ ...settings, messageNotifications: e.target.checked })}
          />
        </label>
        <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
          <MdSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </>
  );
}
