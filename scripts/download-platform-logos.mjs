import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const domainsPath = path.join(__dirname, 'platform-domains.json');
const outDir = path.join(__dirname, '../src/assets/platforms/logos');

const domains = JSON.parse(fs.readFileSync(domainsPath, 'utf8'));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function faviconUrl(domain) {
  const site = encodeURIComponent(`https://${domain}`);
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${site}&size=128`;
}

function download(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          if (redirects > 5) return reject(new Error('Too many redirects'));
          return download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length < 80) {
            return reject(new Error('Response too small'));
          }
          fs.writeFileSync(dest, buffer);
          resolve(buffer.length);
        });
      })
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;
  let fail = 0;

  for (const [name, domain] of Object.entries(domains)) {
    const slug = slugify(name);
    const dest = path.join(outDir, `${slug}.png`);
    const url = faviconUrl(domain);

    try {
      const size = await download(url, dest);
      console.log(`OK  ${name} (${size} bytes) -> ${slug}.png`);
      ok += 1;
    } catch (error) {
      console.log(`FAIL ${name}: ${error.message}`);
      fail += 1;
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(`\nDone: ${ok} saved, ${fail} failed`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
