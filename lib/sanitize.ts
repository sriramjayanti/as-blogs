import sanitizeHtml from 'sanitize-html';

export const SECURE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'div',
    'span',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'strike',
    'ul',
    'ol',
    'li',
    'blockquote',
    'hr',
    'br',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'img',
    'a',
    'figure',
    'figcaption',
    'section',
    'article',
    'aside',
    'iframe',
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'data-*'],
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder', 'title'],
    table: ['border', 'cellpadding', 'cellspacing'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'player.vimeo.com',
  ],
  transformTags: {
    a: (tagName, attribs) => {
      // Force safe links
      return {
        tagName: 'a',
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
        },
      };
    },
  },
};

/**
 * Sanitizes rich HTML content to prevent XSS while preserving editorial styling
 */
export function sanitizeArticleContent(rawHtml: string): string {
  if (!rawHtml) return '';
  return sanitizeHtml(rawHtml, SECURE_SANITIZE_OPTIONS);
}

/**
 * Escapes characters for safe inclusion inside HTML attributes
 */
export function escapeHtmlAttribute(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
