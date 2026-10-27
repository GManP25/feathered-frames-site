import { getCollection } from 'astro:content';

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Category order follows the original Wix blog; covers can be overridden where the latest post has a poor thumbnail
const ORDER = ['On the Trail', 'The Viewfinder', 'Framing Work', 'Wilderness & Wonder'];
const COVER: Record<string, string> = {
  'the-viewfinder': '/images/blog/the-magic-of-bokeh-using-intentional-blur-to-elevate-your-photography/img-01.jpg',
};

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
    return { name, slug, posts: list, count: list.length, cover: COVER[slug] || list.find(p => p.data.heroImage)?.data.heroImage || '' };
  });
}

export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
