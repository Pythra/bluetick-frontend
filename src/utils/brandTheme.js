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

function getRelativeLuminance(r, g, b) {
  const transform = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

export function isLightBrandColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return getRelativeLuminance(r, g, b) > 0.58;
}

function getReadableAccentOnLight(primary) {
  let candidate = darkenHex(primary, 0.58);
  let { r, g, b } = hexToRgb(candidate);

  if (getRelativeLuminance(r, g, b) > 0.32) {
    candidate = darkenHex(primary, 0.78);
    ({ r, g, b } = hexToRgb(candidate));
  }

  if (getRelativeLuminance(r, g, b) > 0.32) {
    return '#0f172a';
  }

  return candidate;
}

function getOnPrimaryText(primary) {
  return isLightBrandColor(primary) ? '#0f172a' : '#ffffff';
}

function getSectionDarkColor(primary, amount, fallback = '#0f172a') {
  const candidate = darkenHex(primary, amount);
  const { r, g, b } = hexToRgb(candidate);
  return getRelativeLuminance(r, g, b) > 0.28 ? fallback : candidate;
}

function mixWithBlack(hex, blackRatio = 0.75) {
  const { r, g, b } = hexToRgb(hex);
  const colorRatio = 1 - blackRatio;
  return rgbToHex(r * colorRatio, g * colorRatio, b * colorRatio);
}

function getDeepSectionColors(primary) {
  const base = normalizeHex(primary) || '#2563eb';
  return {
    start: mixWithBlack(darkenHex(base, 0.18), 0.9),
    mid: mixWithBlack(darkenHex(base, 0.1), 0.84),
    end: mixWithBlack(base, 0.76),
  };
}

export function buildBrandCssVariables(primaryColor, primaryColorDark) {
  const primary = normalizeHex(primaryColor) || '#2563eb';
  const dark = normalizeHex(primaryColorDark) || darkenHex(primary, 0.14);
  const light = lightenHex(primary, 0.22);
  const lighter = lightenHex(primary, 0.42);
  const pale = lightenHex(primary, 0.58);
  const { r, g, b } = hexToRgb(primary);
  const textAccent = isLightBrandColor(primary) ? getReadableAccentOnLight(primary) : dark;
  const onPrimary = getOnPrimaryText(primary);
  const headingColor = isLightBrandColor(primary) ? '#0f2546' : getSectionDarkColor(primary, 0.55, '#0f2546');
  const deepSection = getDeepSectionColors(primary);

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
    '--brand-text-accent': textAccent,
    '--brand-on-primary': onPrimary,
    '--brand-heading-color': headingColor,
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
    '--brand-footer-bg': isLightBrandColor(primary) ? '#0f172a' : darkenHex(primary, 0.62),
    '--brand-section-dark-start': getSectionDarkColor(primary, 0.72),
    '--brand-section-dark-mid': getSectionDarkColor(primary, 0.55),
    '--brand-section-dark-end': getSectionDarkColor(primary, 0.38),
    '--brand-section-deep-start': deepSection.start,
    '--brand-section-deep-mid': deepSection.mid,
    '--brand-section-deep-end': deepSection.end,
    '--brand-section-glow': hexToRgba(primary, 0.22),
    '--brand-section-glow-soft': hexToRgba(primary, 0.12),
    '--brand-link': textAccent,
    '--brand-link-hover': isLightBrandColor(primary) ? '#020617' : dark,
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
