import { useEffect, useMemo, useState } from 'react';
import { MdExpandLess, MdExpandMore, MdSave } from 'react-icons/md';
import { formatNgn } from '../../data/partnerServiceCatalog';
import { PARTNER_PACKAGE_CATALOG } from '../../data/partnerPackageCatalog';

function buildPackageRows(pricingRows) {
  const pricingMap = Object.fromEntries((pricingRows || []).map((row) => [row.id, row]));
  return PARTNER_PACKAGE_CATALOG.map((entry) => {
    const row = pricingMap[entry.id];
    const base = row?.basePriceNgn ?? entry.basePriceNgn;
    const selling = row?.sellingPriceNgn ?? Math.round(base * 1.25);
    return {
      ...entry,
      basePriceNgn: base,
      sellingPriceNgn: Math.max(base, selling),
      partnerProfit: Math.max(0, selling - base),
    };
  });
}

export default function PartnerServicesTab({ api, onMessage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState([]);
  const [expandedServices, setExpandedServices] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setPackages(buildPackageRows(data.packages || data.pricing || []));
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
      setPackages(buildPackageRows([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const byService = new Map();
    packages.forEach((pkg) => {
      if (!byService.has(pkg.serviceId)) {
        byService.set(pkg.serviceId, {
          serviceId: pkg.serviceId,
          serviceLabel: pkg.serviceLabel,
          groups: new Map(),
        });
      }
      const service = byService.get(pkg.serviceId);
      if (!service.groups.has(pkg.groupId)) {
        service.groups.set(pkg.groupId, {
          groupId: pkg.groupId,
          groupLabel: pkg.groupLabel,
          packages: [],
        });
      }
      service.groups.get(pkg.groupId).packages.push(pkg);
    });
    return Array.from(byService.values()).map((service) => ({
      ...service,
      groups: Array.from(service.groups.values()),
    }));
  }, [packages]);

  useEffect(() => {
    if (!grouped.length) return;
    setExpandedServices((prev) => {
      if (Object.keys(prev).length) return prev;
      return Object.fromEntries(grouped.map((service) => [service.serviceId, true]));
    });
    setExpandedGroups((prev) => {
      if (Object.keys(prev).length) return prev;
      const next = {};
      grouped.forEach((service) => {
        service.groups.forEach((group) => {
          next[group.groupId] = true;
        });
      });
      return next;
    });
  }, [grouped]);

  const updatePrice = (id, value) => {
    setPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.id !== id) return pkg;
        const selling = Math.max(pkg.basePriceNgn, Number(value) || pkg.basePriceNgn);
        return {
          ...pkg,
          sellingPriceNgn: selling,
          partnerProfit: Math.max(0, selling - pkg.basePriceNgn),
        };
      })
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const pricing = Object.fromEntries(
        packages.map((pkg) => [
          pkg.id,
          {
            basePriceNgn: pkg.basePriceNgn,
            sellingPriceNgn: Math.max(pkg.basePriceNgn, pkg.sellingPriceNgn),
            enabled: true,
          },
        ])
      );
      await api.updateServices(pricing);
      onMessage?.({ type: 'success', text: 'Package pricing saved.' });
      await load();
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (serviceId) => {
    setExpandedServices((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  if (loading) {
    return <div className="pdash-panel"><div className="pdash-spinner" /></div>;
  }

  return (
    <div className="pdash-panel">
      <h2>Service package pricing</h2>
      <p className="pdash-panel-lead">
        Set your selling price for every individual package — verification tiers, monetization options,
        app and website packages, publications add-ons, and more. Base prices are fixed by Bluetickgeng;
        your profit is the difference between your price and the base.
      </p>

      <div className="pdash-package-pricing">
        {grouped.map((service) => (
          <section key={service.serviceId} className="pdash-package-service">
            <button
              type="button"
              className="pdash-package-service-toggle"
              onClick={() => toggleService(service.serviceId)}
              aria-expanded={expandedServices[service.serviceId] !== false}
            >
              <span>
                <strong>{service.serviceLabel}</strong>
                <span className="pdash-package-count">
                  {service.groups.reduce((sum, group) => sum + group.packages.length, 0)} packages
                </span>
              </span>
              {expandedServices[service.serviceId] !== false ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
            </button>

            {expandedServices[service.serviceId] !== false ? (
              <div className="pdash-package-service-body">
                {service.groups.map((group) => (
                  <div key={group.groupId} className="pdash-package-group">
                    <button
                      type="button"
                      className="pdash-package-group-toggle"
                      onClick={() => toggleGroup(group.groupId)}
                      aria-expanded={expandedGroups[group.groupId] !== false}
                    >
                      <span>{group.groupLabel}</span>
                      {expandedGroups[group.groupId] !== false ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                    </button>

                    {expandedGroups[group.groupId] !== false ? (
                      <div className="pdash-pricing-table pdash-pricing-table-packages">
                        <div className="pdash-pricing-head">
                          <span>Package</span>
                          <span>Base price</span>
                          <span>Your selling price</span>
                          <span>Your profit</span>
                        </div>
                        {group.packages.map((pkg) => (
                          <div key={pkg.id} className="pdash-pricing-row">
                            <span><strong>{pkg.label}</strong></span>
                            <span>{formatNgn(pkg.basePriceNgn)}</span>
                            <span>
                              <input
                                type="number"
                                min={pkg.basePriceNgn}
                                value={pkg.sellingPriceNgn}
                                onChange={(e) => updatePrice(pkg.id, e.target.value)}
                              />
                            </span>
                            <span className="pdash-profit">{formatNgn(pkg.partnerProfit)}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSave} disabled={saving}>
        <MdSave size={16} /> {saving ? 'Saving...' : 'Save all package pricing'}
      </button>
    </div>
  );
}
