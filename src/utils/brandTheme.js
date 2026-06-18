function normalizeHex(hex) {
  const trimmed = String(hex || '').trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    return null;
  }
  let value = trimmed.slice(1);
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  return `#${value.toLowerCase()}`;
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return { r: 37, g: 99, b: 235 };
  }
  const value = normalized.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (channel) => Math.max(0, Math.min(255, Math.round(channel)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function lightenHex(hex, amount = 0.12) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

export function darkenHex(hex, amount = 0.12) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

export function hexToRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildBrandCssVariables(primaryColor, primaryColorDark) {
  const primary = normalizeHex(primaryColor) || '#2563eb';
  const dark = normalizeHex(primaryColorDark) || darkenHex(primary, 0.14);
  const light = lightenHex(primary, 0.22);
  const lighter = lightenHex(primary, 0.42);
  const pale = lightenHex(primary, 0.58);
  const { r, g, b } = hexToRgb(primary);

  return {
    '--brand-primary': primary,
    '--brand-primary-dark': dark,
    '--brand-primary-light': light,
    '--brand-primary-lighter': lighter,
    '--brand-primary-pale': pale,
    '--brand-accent': primary,
    '--brand-primary-rgb': `${r}, ${g}, ${b}`,
    '--brand-primary-soft': hexToRgba(primary, 0.1),
    '--brand-primary-medium': hexToRgba(primary, 0.18),
    '--brand-primary-strong': hexToRgba(primary, 0.28),
    '--brand-primary-glow': hexToRgba(primary, 0.35),
    '--brand-gradient-start': lightenHex(primary, 0.18),
    '--brand-gradient-mid': primary,
    '--brand-gradient-end': dark,
    '--brand-gradient-hover-start': lightenHex(primary, 0.28),
    '--brand-gradient-hover-mid': lightenHex(primary, 0.12),
    '--brand-gradient-hover-end': primary,
    '--brand-surface-tint': hexToRgba(primary, 0.06),
    '--brand-surface-bg': hexToRgba(primary, 0.04),
    '--brand-navbar-bg': hexToRgba(primary, 0.05),
    '--brand-button-secondary-bg': `linear-gradient(180deg, ${hexToRgba(primary, 0.08)} 0%, ${hexToRgba(primary, 0.14)} 100%)`,
    '--brand-button-secondary-hover': `linear-gradient(180deg, #ffffff 0%, ${hexToRgba(primary, 0.12)} 100%)`,
    '--brand-footer-bg': darkenHex(primary, 0.62),
    '--brand-section-dark-start': darkenHex(primary, 0.72),
    '--brand-section-dark-mid': darkenHex(primary, 0.55),
    '--brand-section-dark-end': darkenHex(primary, 0.38),
    '--brand-section-glow': hexToRgba(primary, 0.22),
    '--brand-section-glow-soft': hexToRgba(primary, 0.12),
    '--brand-link': primary,
    '--brand-link-hover': dark,
    '--brand-shadow': hexToRgba(primary, 0.22),
    '--brand-shadow-soft': hexToRgba(primary, 0.14),
  };
}

export function applyBrandCssVariables(root, primaryColor, primaryColorDark) {
  const variables = buildBrandCssVariables(primaryColor, primaryColorDark);
  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
