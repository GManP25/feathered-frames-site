import type { APIRoute } from 'astro';
import collections from '../data/collections.json';
import { getCategories, getPosts } from '../lib/journal';

const SITE = 'https://www.gauravsfeatheredframes.com';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const categories = await getCategories();
  const latest = posts[0]?.data.date.toISOString().slice(0, 10);
  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/', lastmod: latest },
    { loc: '/blog/', lastmod: latest },
    { loc: '/prints/' },
    { loc: '/life-list/' },
    ...collections.map(c => ({ loc: `/gallery/${c.slug}/` })),
    ...categories.map(c => ({ loc: `/blog/category/${c.slug}/`, lastmod: c.posts[0]?.data.date.toISOString().slice(0, 10) })),
    ...posts.map(p => ({ loc: `/blog/${p.id}/`, lastmod: p.data.date.toISOString().slice(0, 10) })),
  ];
  const body = urls
    .map(u => `  <url>\n    <loc>${SITE}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
