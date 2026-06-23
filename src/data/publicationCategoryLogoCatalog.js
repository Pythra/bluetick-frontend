import { PUBLICATION_CATEGORIES } from './publicationPackageCatalog';

export function slugifyPublicationPlatformName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'platform';
}

export function getPublicationCategoryPlatformNames(categoryId) {
  const category = PUBLICATION_CATEGORIES.find((entry) => entry.id === categoryId);
  return category?.platforms?.map((platform) => platform.name) || [];
}

export function isCatalogPublicationPlatform(categoryId, name) {
  const target = String(name || '').trim().toLowerCase();
  if (!target) return false;
  return getPublicationCategoryPlatformNames(categoryId).some(
    (platformName) => platformName.toLowerCase() === target
  );
}

/**
 * Merge stored category logos with the full platform catalog for a category.
 * Catalog platforms always appear (with null imageUrl when no logo is saved).
 */
export function mergeCategoryLogosWithCatalog(categoryId, storedLogos = []) {
  const category = PUBLICATION_CATEGORIES.find((entry) => entry.id === categoryId);
  if (!category) {
    return Array.isArray(storedLogos) ? storedLogos : [];
  }

  const storedByName = new Map();
  (storedLogos || []).forEach((logo) => {
    const key = String(logo?.name || '').trim().toLowerCase();
    if (key) {
      storedByName.set(key, logo);
    }
  });

  const merged = category.platforms.map((platform) => {
    const key = platform.name.toLowerCase();
    const existing = storedByName.get(key);
    storedByName.delete(key);

    if (existing) {
      return {
        id: existing.id || slugifyPublicationPlatformName(platform.name),
        name: platform.name,
        imageUrl: existing.imageUrl || null,
      };
    }

    return {
      id: slugifyPublicationPlatformName(platform.name),
      name: platform.name,
      imageUrl: null,
    };
  });

  for (const leftover of storedByName.values()) {
    merged.push({
      id: leftover.id || slugifyPublicationPlatformName(leftover.name),
      name: String(leftover.name || '').trim(),
      imageUrl: leftover.imageUrl || null,
    });
  }

  return merged.filter((entry) => entry.name);
}

export function categoryLogosMissingCatalogPlatforms(categoryId, storedLogos = []) {
  const category = PUBLICATION_CATEGORIES.find((entry) => entry.id === categoryId);
  if (!category) return false;

  const storedNames = new Set(
    (storedLogos || [])
      .map((logo) => String(logo?.name || '').trim().toLowerCase())
      .filter(Boolean)
  );

  return category.platforms.some((platform) => !storedNames.has(platform.name.toLowerCase()));
}
