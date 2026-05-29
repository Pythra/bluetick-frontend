import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../src/assets/platforms/logos');

const retries = {
  WKMup: ['wkmup.com', 'wkmup.tv'],
  'Nigerian Movies Review': ['nigerianmovies.com', 'nigerianmoviereview.com'],
  'Esports News UK': ['esports-news.co.uk', 'esportsinsider.com'],
  'Business Matters': ['businessmattersmag.co.uk', 'businessmatters.co.uk'],
  'Financial News': ['fnlondon.com', 'financial-news.com'],
  'Property Development': ['propertyweek.com', 'propertyindustryeye.com'],
  UkHerald: ['theukherald.com', 'ukherald.news'],
  'Uk Wire': ['ukwire.com', 'ukwirenews.co.uk'],
  'Talk Business': ['talkbusinessmag.co.uk', 'talk-business.co.uk'],
  BusinessMole: ['businessmole.co.uk', 'businessmole.com'],
  'The Open News': ['theopennews.com', 'opennews.com'],
  'Resident Weekly': ['residentweekly.co.uk', 'residentweekly.com'],
  'Stats Globe': ['statsglobe.com', 'statsglobe.co.uk'],
  'California Times': ['californiatimes.us', 'latimes.com'],
  AsiaOne: ['asiaone.com', 'www.asiaone.com'],
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if ([301, 302].includes(res.statusCode) && res.headers.location) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

async function trySources(name, domains) {
  const slug = slugify(name);
  const dest = path.join(outDir, `${slug}.png`);

  for (const domain of domains) {
    const sources = [
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(`https://${domain}`)}&size=128`,
    ];

    for (const url of sources) {
      try {
        const buffer = await download(url);
        if (buffer.length >= 80) {
          fs.writeFileSync(dest, buffer);
          console.log(`OK ${name} via ${domain} (${buffer.length}b)`);
          return true;
        }
      } catch {
        // try next
      }
    }
  }

  console.log(`FAIL ${name}`);
  return false;
}

async function main() {
  let ok = 0;
  for (const [name, domains] of Object.entries(retries)) {
    if (await trySources(name, domains)) ok += 1;
    await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`Recovered ${ok}/${Object.keys(retries).length}`);
}

main();
