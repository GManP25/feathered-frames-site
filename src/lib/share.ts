// Share links for journal posts and photographs. Plain links only: no tracking scripts are loaded.
export const SITE = 'https://www.gauravsfeatheredframes.com';

export interface ShareInput { url: string; text: string; image?: string; }
export interface ShareLink { id: string; label: string; href: string; }

export function shareLinks({ url, text, image }: ShareInput): ShareLink[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const both = encodeURIComponent(`${text} ${url}`);
  const links: ShareLink[] = [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${both}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: 'x', label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { id: 'threads', label: 'Threads', href: `https://www.threads.net/intent/post?text=${both}` },
    { id: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
  if (image) links.push({ id: 'pinterest', label: 'Pinterest', href: `https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(image)}&description=${t}` });
  links.push(
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}` },
    { id: 'email', label: 'Email', href: `mailto:?subject=${t}&body=${encodeURIComponent(`${text}\n\n${url}`)}` },
  );
  return links;
}
