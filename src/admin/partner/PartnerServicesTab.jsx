import { useEffect, useState } from 'react';
import { MdSave } from 'react-icons/md';
import { PARTNER_SERVICE_CATALOG, formatNgn } from '../../data/partnerServiceCatalog';

export default function PartnerServicesTab({ api, onMessage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState([]);

  const buildMergedServices = (pricingRows, catalog) => {
    const pricingMap = Object.fromEntries((pricingRows || []).map((r) => [r.id, r]));
    return catalog.map((cat) => {
      const row = pricingMap[cat.id];
      const base = row?.basePriceNgn ?? cat.basePriceNgn;
      const selling = row?.sellingPriceNgn ?? Math.round(base * 1.25);
      return {
        id: cat.id,
        label: row?.label || cat.label,
        category: cat.category,
        basePriceNgn: base,
        sellingPriceNgn: Math.max(base, selling),
        partnerProfit: Math.max(0, selling - base),
        bluetickRevenue: base,
        enabledOnSite: row != null,
      };
    });
  };

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      const catalog = data.catalog?.length ? data.catalog : PARTNER_SERVICE_CATALOG;
      setServices(buildMergedServices(data.pricing || [], catalog));
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
      setServices(PARTNER_SERVICE_CATALOG.map((cat) => ({
        id: cat.id,
        label: cat.label,
        category: cat.category,
        basePriceNgn: cat.basePriceNgn,
        sellingPriceNgn: Math.round(cat.basePriceNgn * 1.25),
        partnerProfit: Math.round(cat.basePriceNgn * 0.25),
        bluetickRevenue: cat.basePriceNgn,
        enabledOnSite: false,
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updatePrice = (id, value) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const selling = Math.max(s.basePriceNgn, Number(value) || s.basePriceNgn);
        return {
          ...s,
          sellingPriceNgn: selling,
          partnerProfit: Math.max(0, selling - s.basePriceNgn),
        };
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
            enabled: s.enabledOnSite !== false,
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

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <>
      <div className="pdash-panel">
        <h2>Service Pricing</h2>
        <p className="pdash-panel-lead">
          Set your selling prices for all services. The base price is fixed by Bluetickgeng — your profit is the difference between your price and the base.
          Services marked <strong>Active on site</strong> are currently shown on your homepage.
        </p>

        {categories.map((cat) => {
          const catServices = services.filter((s) => s.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--pdash-soft)', margin: '0 0 10px' }}>
                {cat}
              </h3>
              <div className="pdash-pricing-table">
                <div className="pdash-pricing-head">
                  <span>Service</span>
                  <span>Base Price</span>
                  <span>Your Selling Price (NGN)</span>
                  <span>Your Profit</span>
                  <span>Status</span>
                </div>
                {catServices.map((service) => (
                  <div key={service.id} className="pdash-pricing-row">
                    <span><strong>{service.label}</strong></span>
                    <span>{formatNgn(service.basePriceNgn)}</span>
                    <span>
                      <input
                        type="number"
                        min={service.basePriceNgn}
                        value={service.sellingPriceNgn}
                        onChange={(e) => updatePrice(service.id, e.target.value)}
                      />
                    </span>
                    <span className="pdash-profit">{formatNgn(Math.max(0, service.sellingPriceNgn - service.basePriceNgn))}</span>
                    <span>
                      {service.enabledOnSite
                        ? <span style={{ color: '#047857', fontWeight: 600, fontSize: '0.8rem' }}>● Active on site</span>
                        : <span style={{ color: 'var(--pdash-soft)', fontSize: '0.8rem' }}>○ Not on site</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSave} disabled={saving}>
          <MdSave size={16} /> {saving ? 'Saving...' : 'Save All Pricing'}
        </button>
      </div>
    </>
  );
}
