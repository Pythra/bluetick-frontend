const DEFAULT_CHIPS = [
  { label: 'Apps & Web', description: 'Build products that scale' },
  { label: 'Verification', description: 'Trusted badges & monetization' },
  { label: 'PR & Media', description: 'Global publication reach' },
];

function TemplateFeatureChips({ chips = DEFAULT_CHIPS, className = '' }) {
  return (
    <div className={`tpl-feature-chips ${className}`.trim()} role="list" aria-label="Core services">
      {chips.map((chip) => (
        <div key={chip.label} className="tpl-feature-chip" role="listitem">
          <span className="tpl-feature-chip-label">{chip.label}</span>
          <span className="tpl-feature-chip-desc">{chip.description}</span>
        </div>
      ))}
    </div>
  );
}

export default TemplateFeatureChips;
