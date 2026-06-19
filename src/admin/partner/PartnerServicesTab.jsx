import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';
import { formatNgn } from '../../data/partnerServiceCatalog';

export default function PartnerServicesTab({ api, onMessage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setServices(data.pricing || []);
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updatePrice = (id, field, value) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = { ...s, [field]: Number(value) || 0 };
        const base = next.basePriceNgn;
        const selling = field === 'sellingPriceNgn' ? next.sellingPriceNgn : next.sellingPriceNgn;
        next.partnerProfit = Math.max(0, selling - base);
        next.bluetickRevenue = base;
        return next;
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const pricing = Object.fromEntries(
        services.map((s) => [
          s.id,
          {
            basePriceNgn: s.basePriceNgn,
            sellingPriceNgn: Math.max(s.basePriceNgn, s.sellingPriceNgn),
            enabled: s.enabled !== false,
          },
        ])
      );
      await api.updateServices(pricing);
      onMessage?.({ type: 'success', text: 'Service pricing saved.' });
      await load();
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pdash-panel"><div className="pdash-spinner" /></div>;
  }

  return (
    <>
      <div className="pdash-panel">
        <h2>Service Pricing</h2>
        <p className="pdash-panel-lead">
          Set your selling prices. Bluetickgeng base price is fixed — your profit is the difference.
        </p>
        <div className="pdash-pricing-table">
          <div className="pdash-pricing-head">
            <span>Service</span>
            <span>Base Price</span>
            <span>Your Price</span>
            <span>Your Profit</span>
            <span>Bluetick Revenue</span>
          </div>
          {services.map((service) => (
            <div key={service.id} className="pdash-pricing-row">
              <span><strong>{service.label}</strong></span>
              <span>{formatNgn(service.basePriceNgn)}</span>
              <span>
                <input
                  type="number"
                  min={service.basePriceNgn}
                  value={service.sellingPriceNgn}
                  onChange={(e) => updatePrice(service.id, 'sellingPriceNgn', e.target.value)}
                />
              </span>
              <span className="pdash-profit">{formatNgn(Math.max(0, service.sellingPriceNgn - service.basePriceNgn))}</span>
              <span>{formatNgn(service.basePriceNgn)}</span>
            </div>
          ))}
        </div>
        <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSave} disabled={saving}>
          <MdSave size={16} /> {saving ? 'Saving...' : 'Save Pricing'}
        </button>
      </div>
    </>
  );
}
