import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

const blogNotes = {
  'instagram.blog.gossipmill-account-1': 'Account 1',
  'instagram.blog.gossipmill-account-2': 'Account 2',
};

export const instagramBlogPromotions = toServiceListEntries(getPackagesByGroup('instagram-blog')).map(
  (entry) => ({
    ...entry,
    note: blogNotes[entry.packageId] || null,
  })
);

export const instagramWizkidnewsPackages = toServiceListEntries(getPackagesByGroup('instagram-wizkid')).map(
  (entry) => ({
    ...entry,
    note: null,
  })
);

export function getInstagramCartTitle(item) {
  if (item.note) {
    return `${item.title} — ${item.note}`;
  }
  return item.title;
}
