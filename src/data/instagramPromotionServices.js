export const instagramBlogPromotions = [
  { id: 'alabareports', title: 'Alabareports', price: 70000, note: null },
  { id: 'gossipmill-1', title: 'Gossipmill', price: 750000, note: 'Account 1' },
  { id: 'gossipmill-2', title: 'Gossipmill', price: 400000, note: 'Account 2' },
  { id: 'wahalanetwork', title: 'WahalaNetwork', price: 300000, note: null },
  { id: 'instablog', title: 'Instablog', price: 900000, note: null },
  { id: 'themixhq', title: 'Themixhq', price: 750000, note: null },
  { id: 'gossiploaded', title: 'Gossiploaded', price: 200000, note: null },
  { id: 'thecontentlovers', title: 'Thecontentlovers', price: 300000, note: null },
  { id: 'olofofonija', title: 'Olofofonija', price: 200000, note: null },
  { id: 'notjustok', title: 'Notjustok', price: 800000, note: null },
  { id: 'gistloverblog', title: 'Gistloverblog', price: 700000, note: null },
  { id: 'samklef', title: 'Samklef', price: 750000, note: null },
  { id: 'funnyafrica', title: 'FunnyAfrica', price: 500000, note: null },
  { id: 'tundeednut', title: 'Tundeednut', price: 1000000, note: null },
  { id: 'naijaeverything', title: 'NaijaEverything', price: 350000, note: null },
  { id: 'yabaleftonline', title: 'Yabaleftonline', price: 650000, note: null },
  { id: 'goldmynetv', title: 'GoldmyneTV', price: 250000, note: null },
  { id: 'lindaikejisblog', title: 'Lindaikejisblog', price: 650000, note: null },
  { id: 'shallipopi-news', title: 'Shallipopi News', price: 200000, note: null },
  { id: 'officialbisloded', title: 'Officialbisloded', price: 500000, note: null },
];

export const instagramWizkidnewsPackages = [
  { id: 'wizkid-24h', title: '24 Hours Post', price: 180000, note: null },
  { id: 'wizkid-1d', title: '1 Day Post', price: 250000, note: null },
  { id: 'wizkid-3d', title: '3 Days Post', price: 500000, note: null },
  { id: 'wizkid-collab-3d', title: 'Collaboration Post (3 Days)', price: 800000, note: null },
  { id: 'wizkid-collab-6d', title: 'Collaboration Post (6 Days)', price: 2300000, note: null },
];

export function getInstagramCartTitle(item) {
  if (item.note) {
    return `${item.title} — ${item.note}`;
  }
  return item.title;
}
