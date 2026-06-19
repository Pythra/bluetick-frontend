import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PartnerSettingsTab({ api, onMessage }) {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({});
  const [businessAddress, setBusinessAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [kycFiles, setKycFiles] = useState({ idDocument: '', businessDocument: '' });
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
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setKycFiles((prev) => ({ ...prev, [field]: dataUrl }));
  };

  const submitKyc = async () => {
    try {
      setSubmittingKyc(true);
      await api.submitKyc(kycFiles);
      onMessage?.({ type: 'success', text: 'KYC documents submitted for review.' });
      const data = await api.getSettings();
      setProfile(data.profile || {});
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
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
        <p className="pdash-panel-lead">
          Status: <strong>{kycStatus.replace('_', ' ')}</strong>
        </p>
        {kycStatus !== 'approved' ? (
          <>
            <div className="pdash-grid-2">
              <div className="pdash-field">
                <label>Government ID</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleKycFile('idDocument', e.target.files?.[0])} />
              </div>
              <div className="pdash-field">
                <label>Business Document (optional)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleKycFile('businessDocument', e.target.files?.[0])} />
              </div>
            </div>
            <button type="button" className="pdash-btn pdash-btn-primary" onClick={submitKyc} disabled={submittingKyc || !kycFiles.idDocument}>
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
