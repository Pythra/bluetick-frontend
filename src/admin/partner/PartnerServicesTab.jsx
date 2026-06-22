import { useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdChevronRight, MdSave } from 'react-icons/md';
import { formatNgn } from '../../data/partnerServiceCatalog';
import { PARTNER_PACKAGE_CATALOG } from '../../data/partnerPackageCatalog';

function buildPackageRows(pricingRows) {
  const pricingMap = Object.fromEntries((pricingRows || []).map((row) => [row.id, row]));
  return PARTNER_PACKAGE_CATALOG.map((entry) => {
    const row = pricingMap[entry.id];
    const base = row?.basePriceNgn ?? entry.basePriceNgn;
    const storedSelling = Number(row?.sellingPriceNgn);
    const selling =
      Number.isFinite(storedSelling) && storedSelling > 0 ? Math.max(base, storedSelling) : base;
    return {
      ...entry,
      basePriceNgn: base,
      sellingPriceNgn: selling,
      partnerProfit: Math.max(0, selling - base),
    };
  });
}

const SERVICE_ORDER = [
  'websiteDevelopment',
  'appDevelopment',
  'publication',
  'socialMedia',
  'musicStreaming',
  'tiktokArtist',
  'instagram',
  'wikipedia',
];

export default function PartnerServicesTab({ api, onMessage }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

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

    return Array.from(byService.values())
      .map((service) => ({
        ...service,
        groups: Array.from(service.groups.values()),
        packageCount: Array.from(service.groups.values()).reduce(
          (sum, group) => sum + group.packages.length,
          0
        ),
      }))
      .sort((a, b) => {
        const aIndex = SERVICE_ORDER.indexOf(a.serviceId);
        const bIndex = SERVICE_ORDER.indexOf(b.serviceId);
        if (aIndex === -1 && bIndex === -1) return a.serviceLabel.localeCompare(b.serviceLabel);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
  }, [packages]);

  const selectedService = grouped.find((service) => service.serviceId === selectedServiceId) || null;
  const selectedGroup =
    selectedService?.groups.find((group) => group.groupId === selectedGroupId) || null;

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
      window.dispatchEvent(new CustomEvent('partner-pricing-updated'));
      await load();
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const resetSelection = () => {
    setSelectedServiceId(null);
    setSelectedGroupId(null);
  };

  const handleSelectService = (serviceId) => {
    const service = grouped.find((entry) => entry.serviceId === serviceId);
    if (!service) return;
    setSelectedServiceId(serviceId);
    if (service.groups.length === 1) {
      setSelectedGroupId(service.groups[0].groupId);
    } else {
      setSelectedGroupId(null);
    }
  };

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
  };

  const handleBack = () => {
    if (selectedGroupId) {
      if (selectedService?.groups.length === 1) {
        resetSelection();
      } else {
        setSelectedGroupId(null);
      }
      return;
    }
    resetSelection();
  };

  if (loading) {
    return (
      <div className="pdash-panel">
        <div className="pdash-spinner" />
      </div>
    );
  }

  const renderPricingTable = (rows) => (
    <div className="pdash-pricing-table pdash-pricing-table-packages">
      <div className="pdash-pricing-head">
        <span>Package</span>
        <span>Base price</span>
        <span>Your selling price</span>
        <span>Your profit</span>
      </div>
      {rows.map((pkg) => (
        <div key={pkg.id} className="pdash-pricing-row">
          <span>
            <strong>{pkg.label}</strong>
          </span>
          <span>{formatNgn(pkg.basePriceNgn)}</span>
          <span>
            <input
              type="number"
              min={pkg.basePriceNgn}
              value={pkg.sellingPriceNgn}
              onChange={(event) => updatePrice(pkg.id, event.target.value)}
            />
          </span>
          <span className="pdash-profit">{formatNgn(pkg.partnerProfit)}</span>
        </div>
      ))}
    </div>
  );

  const renderServiceList = () => (
    <div className="pdash-pricing-picker">
      {grouped.map((service) => (
        <button
          key={service.serviceId}
          type="button"
          className="pdash-pricing-picker-card"
          onClick={() => handleSelectService(service.serviceId)}
        >
          <span className="pdash-pricing-picker-text">
            <strong>{service.serviceLabel}</strong>
            <span>
              {service.groups.length > 1
                ? `${service.groups.length} categories · ${service.packageCount} packages`
                : `${service.packageCount} packages`}
            </span>
          </span>
          <MdChevronRight size={20} aria-hidden="true" />
        </button>
      ))}
    </div>
  );

  const renderGroupList = () => (
    <div className="pdash-pricing-picker">
      {selectedService?.groups.map((group) => (
        <button
          key={group.groupId}
          type="button"
          className="pdash-pricing-picker-card"
          onClick={() => handleSelectGroup(group.groupId)}
        >
          <span className="pdash-pricing-picker-text">
            <strong>{group.groupLabel}</strong>
            <span>{group.packages.length} packages</span>
          </span>
          <MdChevronRight size={20} aria-hidden="true" />
        </button>
      ))}
    </div>
  );

  const breadcrumb =
    !selectedServiceId
      ? 'Choose a service to edit package prices'
      : !selectedGroupId && selectedService?.groups.length > 1
        ? selectedService.serviceLabel
        : selectedGroup
          ? `${selectedService.serviceLabel} · ${selectedGroup.groupLabel}`
          : selectedService?.serviceLabel;

  return (
    <div className="pdash-panel">
      <h2>Service package pricing</h2>
      <p className="pdash-panel-lead">
        Select a service, then choose a category or package group to set your selling prices. Base prices
        are fixed by Bluetickgeng — your profit is the difference between your price and the base.
      </p>

      <div className="pdash-pricing-nav">
        {selectedServiceId ? (
          <button type="button" className="pdash-pricing-back" onClick={handleBack}>
            <MdArrowBack size={18} aria-hidden="true" />
            Back
          </button>
        ) : null}
        <p className="pdash-pricing-crumb">{breadcrumb}</p>
      </div>

      {!selectedServiceId && renderServiceList()}
      {selectedServiceId && !selectedGroupId && selectedService?.groups.length > 1 && renderGroupList()}
      {selectedGroup ? renderPricingTable(selectedGroup.packages) : null}

      <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSave} disabled={saving}>
        <MdSave size={16} /> {saving ? 'Saving...' : 'Save all package pricing'}
      </button>
    </div>
  );
}
