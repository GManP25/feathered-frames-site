// Makes a 1200x630 preview card for each photograph (used when a photo is shared on WhatsApp, Facebook and so on).
// The photograph is shown whole on a softly blurred copy of itself, so nothing is cropped.
// Only missing cards are made. Run with: npm run share-images        (add --force to remake all)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const photos = JSON.parse(fs.readFileSync(path.join(root, 'src/data/photos.json'), 'utf8'));
const force = process.argv.includes('--force');
const W = 1200, H = 630;
let made = 0, kept = 0;

for (const p of photos) {
  const out = path.join(root, 'public/images/share', p.id + '.jpg');
  if (!force && fs.existsSync(out)) { kept++; continue; }
  const src = path.join(root, 'public', p.image);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const bg = await sharp(src).resize(W, H, { fit: 'cover' }).blur(28).modulate({ brightness: 0.55 }).toBuffer();
  const fg = await sharp(src).resize(W, H, { fit: 'inside', withoutEnlargement: false }).toBuffer();
  await sharp(bg).composite([{ input: fg, gravity: 'centre' }]).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  made++;
}
console.log(`Share cards: ${made} made, ${kept} already present.`);
