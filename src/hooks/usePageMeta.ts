import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key, name] = selector.match(/meta\[(\w+)="([^"]+)"\]/) || [];
    if (key && name) el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function usePageMeta({ title, description, ogTitle, ogDescription, ogUrl }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    if (ogTitle) setMeta('meta[property="og:title"]', 'content', ogTitle);
    if (ogDescription) setMeta('meta[property="og:description"]', 'content', ogDescription);
    if (ogUrl) setMeta('meta[property="og:url"]', 'content', ogUrl);
  }, [title, description, ogTitle, ogDescription, ogUrl]);
}
