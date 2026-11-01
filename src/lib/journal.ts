import { getCollection } from 'astro:content';

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Category order follows the original Wix blog; covers can be overridden where the latest post has a poor thumbnail
const ORDER = ['On the Trail', 'The Viewfinder', 'Framing Work', 'Wilderness & Wonder'];
const COVER: Record<string, string> = {
  'the-viewfinder': '/images/blog/the-magic-of-bokeh-using-intentional-blur-to-elevate-your-photography/img-01.jpg',
};

// Alt text for a journal image, read from the alt attribute already written in the post markdown
const bodies = Object.values(import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })) as string[];
export function altFor(src: string) {
  if (!src) return '';
  for (const b of bodies) {
    const m = b.match(new RegExp('<img[^>]*src="' + src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"[^>]*alt="([^"]+)"'));
    if (m) return m[1];
  }
  return 'Journal photograph';
}

// Plain-text summary from the start of a post, used when the stored excerpt is too short to be a good meta description
export function summarise(body: string) {
  const line = body.split('\n').map(l => l.trim()).find(l => l.length > 60 && !l.startsWith('<') && !l.startsWith('#') && !l.startsWith('!['));
  return (line || '').replace(/[*_`>]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export async function getPosts() {
  return (await getCollection('blog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getCategories() {
  const posts = await getPosts();
  const names = [...new Set(posts.map(p => p.data.category))];
  names.sort((a, b) => {
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return names.map(name => {
    const slug = slugify(name);
    const list = posts.filter(p => p.data.category === name);
    const cover = COVER[slug] || list.find(p => p.data.heroImage)?.data.heroImage || '';
    return { name, slug, posts: list, count: list.length, cover, coverAlt: altFor(cover) };
  });
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
