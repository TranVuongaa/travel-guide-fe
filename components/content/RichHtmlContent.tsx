'use client';

const ALLOWED_TAGS = new Set([
  'a',
  'blockquote',
  'br',
  'em',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'hr',
  'img',
  'li',
  'ol',
  'p',
  'strong',
  'ul',
]);

const REMOVED_WITH_CONTENT_TAGS = new Set([
  'embed',
  'iframe',
  'object',
  'script',
  'style',
  'template',
]);

declare const sanitizedRichHtmlBrand: unique symbol;

export type SanitizedRichHtml = string & {
  readonly [sanitizedRichHtmlBrand]: true;
};

const getSafeAbsoluteHttpUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

const hasSafeDimension = (value: string): boolean => {
  if (!/^\d{1,5}$/.test(value)) {
    return false;
  }

  return Number(value) > 0;
};

const sanitizeImage = (element: Element): void => {
  const source = getSafeAbsoluteHttpUrl(element.getAttribute('src') ?? '');

  if (!source) {
    element.remove();
    return;
  }

  const alt = element.getAttribute('alt') ?? '';
  const width = element.getAttribute('width');
  const height = element.getAttribute('height');

  for (const attribute of Array.from(element.attributes)) {
    element.removeAttribute(attribute.name);
  }

  element.setAttribute('src', source);
  element.setAttribute('alt', alt);
  element.setAttribute('loading', 'lazy');
  element.setAttribute('decoding', 'async');

  if (width && hasSafeDimension(width)) {
    element.setAttribute('width', width);
  }
  if (height && hasSafeDimension(height)) {
    element.setAttribute('height', height);
  }
};

const sanitizeLink = (element: Element): void => {
  const href = getSafeAbsoluteHttpUrl(element.getAttribute('href') ?? '');

  if (!href) {
    element.replaceWith(...Array.from(element.childNodes));
    return;
  }

  for (const attribute of Array.from(element.attributes)) {
    element.removeAttribute(attribute.name);
  }

  element.setAttribute('href', href);
  element.setAttribute('target', '_blank');
  element.setAttribute('rel', 'noreferrer noopener');
};

export const sanitizeRichHtml = (html: string): SanitizedRichHtml => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

  for (const element of Array.from(parsedDocument.body.querySelectorAll('*'))) {
    const tagName = element.tagName.toLowerCase();

    if (REMOVED_WITH_CONTENT_TAGS.has(tagName)) {
      element.remove();
      continue;
    }

    if (!ALLOWED_TAGS.has(tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }

    if (tagName === 'img') {
      sanitizeImage(element);
      continue;
    }

    if (tagName === 'a') {
      sanitizeLink(element);
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      element.removeAttribute(attribute.name);
    }
  }

  return parsedDocument.body.innerHTML as SanitizedRichHtml;
};

export function RichHtmlContent({html}: Readonly<{html: SanitizedRichHtml}>) {
  return (
    <div
      className='rich-content'
      // Only the branded value produced by the allowlist sanitizer is accepted here. The external API remains
      // responsible for sanitizing stored HTML; this browser pass provides defense in depth before insertion.
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
}
