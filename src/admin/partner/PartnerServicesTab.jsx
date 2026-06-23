import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdArrowBack, MdAdd, MdChevronRight, MdSave } from 'react-icons/md';
import {
  PARTNER_PACKAGE_CATALOG,
  buildPackagePricingMinimumError,
} from '../../data/partnerPackageCatalog';

function buildPackageRows(pricingRows) {
  const pricingMap = Object.fromEntries((pricingRows || []).map((row) => [row.id, row]));
  return PARTNER_PACKAGE_CATALOG.map((entry) => {
    const row = pricingMap[entry.id];
    return {
      ...entry,
      basePriceNgn: row?.basePriceNgn ?? entry.basePriceNgn,
      currentPriceNgn: row?.currentPriceNgn ?? row?.basePriceNgn ?? entry.basePriceNgn,
      markupNgn: row?.markupNgn ?? 0,
    };
  });
}

function CurrentPriceInput({ value, onCommit }) {
  const [draft, setDraft] = useState(String(value ?? ''));

  useEffect(() => {
    setDraft(String(value ?? ''));
  }, [value]);

  const commit = () => {
    const digits = draft.replace(/[^\d]/g, '');
    if (!digits) {
      setDraft(String(value ?? ''));
      return;
    }
    const parsed = Number(digits);
    onCommit(parsed);
    setDraft(String(parsed));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      className="pdash-price-input"
      value={draft}
      aria-label="Current price in Naira"
      onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ''))}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }
      }}
    />
  );
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

function getBulkScopePackages(packages, { selectedService, selectedGroup }) {
  if (selectedGroup) {
    return selectedGroup.packages;
  }
  if (selectedService) {
    return selectedService.groups.flatMap((group) => group.packages);
  }
  return packages;
}

export default function PartnerServicesTab({ api, onMessage, pricingMode = 'partner' }) {
  const isMainPricing = pricingMode === 'main';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [bulkAmount, setBulkAmount] = useState('');

  const load = useCallback(async () => {
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
  }, [api, onMessage]);

  useEffect(() => {
    load();
  }, [load]);

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

  const bulkScopeLabel = selectedGroup
    ? `${selectedGroup.groupLabel} packages`
    : selectedService
      ? `${selectedService.serviceLabel} packages`
      : 'all packages';

  const updatePrice = (id, value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, currentPriceNgn: parsed } : pkg))
    );
  };

  const applyBulkAmount = () => {
    const amount = Number(String(bulkAmount).replace(/[^\d]/g, ''));
    if (!Number.isFinite(amount) || amount <= 0) {
      onMessage?.({ type: 'error', text: 'Enter a valid amount to add.' });
      return;
    }

    const targetPackages = getBulkScopePackages(packages, {
      selectedService,
      selectedGroup,
    });
    const targetIds = new Set(targetPackages.map((pkg) => pkg.id));

    setPackages((prev) =>
      prev.map((pkg) =>
        targetIds.has(pkg.id)
          ? { ...pkg, currentPriceNgn: Number(pkg.currentPriceNgn) + amount }
          : pkg
      )
    );
    onMessage?.({
      type: 'success',
      text: `Added ₦${amount.toLocaleString('en-NG')} to ${targetPackages.length} package${targetPackages.length === 1 ? '' : 's'}. Save to publish.`,
    });
    setBulkAmount('');
  };

  const handleSave = async () => {
    const violations = packages
      .filter((pkg) => Number(pkg.currentPriceNgn) < Number(pkg.basePriceNgn))
      .map((pkg) => ({
        id: pkg.id,
        label: pkg.label,
        minimumPriceNgn: pkg.basePriceNgn,
        attemptedPriceNgn: pkg.currentPriceNgn,
      }));

    if (violations.length) {
      onMessage?.({ type: 'error', text: buildPackagePricingMinimumError(violations) });
      return;
    }

    try {
      setSaving(true);
      const pricing = Object.fromEntries(
        packages.map((pkg) => [
          pkg.id,
          {
            sellingPriceNgn: pkg.currentPriceNgn,
            currentPriceNgn: pkg.currentPriceNgn,
            enabled: true,
          },
        ])
      );
      await api.updateServices(pricing);
      onMessage?.({
        type: 'success',
        text: isMainPricing
          ? 'Main site pricing saved. Partner sites will inherit the updated base prices.'
          : 'Package pricing saved.',
      });
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
    <div className="pdash-pricing-table pdash-pricing-table-packages pdash-pricing-table-current">
      <div className="pdash-pricing-head">
        <span>Package</span>
        <span>{isMainPricing ? 'Main site price' : 'Your price'}</span>
      </div>
      {rows.map((pkg) => (
        <div key={pkg.id} className="pdash-pricing-row">
          <span>
            <strong>{pkg.label}</strong>
            {!isMainPricing && Number(pkg.markupNgn) > 0 ? (
              <small className="pdash-pricing-markup-note">
                Includes ₦{Number(pkg.markupNgn).toLocaleString('en-NG')} markup
              </small>
            ) : null}
          </span>
          <span>
            <CurrentPriceInput
              value={pkg.currentPriceNgn}
              onCommit={(value) => updatePrice(pkg.id, value)}
            />
          </span>
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
      <h2>{isMainPricing ? 'Main site service pricing' : 'Service package pricing'}</h2>
      <p className="pdash-panel-lead">
        {isMainPricing
          ? 'Set the base prices shown on the main Bluetick site. Partner websites inherit these prices automatically and can add their own markup on top.'
          : 'Select a service, then choose a category or package group to set the prices shown on your public site. Your minimum is the current main site price for each package.'}
      </p>

      <div className="pdash-pricing-bulk">
        <div className="pdash-pricing-bulk-copy">
          <strong>Add amount to prices</strong>
          <p>
            Increase {bulkScopeLabel} by a fixed amount before saving. Useful for quick markup
            adjustments.
          </p>
        </div>
        <div className="pdash-pricing-bulk-controls">
          <label className="pdash-pricing-bulk-label" htmlFor="pricing-bulk-amount">
            Amount (₦)
          </label>
          <input
            id="pricing-bulk-amount"
            type="text"
            inputMode="numeric"
            className="pdash-price-input pdash-pricing-bulk-input"
            value={bulkAmount}
            placeholder="e.g. 50000"
            onChange={(event) => setBulkAmount(event.target.value.replace(/[^\d]/g, ''))}
          />
          <button type="button" className="pdash-btn pdash-btn-secondary" onClick={applyBulkAmount}>
            <MdAdd size={16} />
            Add to {bulkScopeLabel}
          </button>
        </div>
      </div>

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
        <MdSave size={16} /> {saving ? 'Saving...' : isMainPricing ? 'Save main site pricing' : 'Save all package pricing'}
      </button>
    </div>
  );
}
