/**
 * Minimal, dependency-free Markdown → HTML renderer for admin-authored articles.
 *
 * All input is HTML-escaped first, so nothing an author pastes can inject markup.
 * Supported: h2/h3/h4, paragraphs, bullet & numbered lists, blockquotes, hr,
 * images, links, bold, italic, inline code.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Only allow URLs that can't execute script */
function safeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:\/\/|\/|mailto:|#)/i.test(trimmed)) return trimmed;
  return "#";
}

function inline(text: string): string {
  let out = escapeHtml(text);

  // ![alt](src)
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, src) =>
    `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy" />`
  );
  // [label](href)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const url = safeUrl(href);
    const external = /^https?:\/\//i.test(url);
    const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${rel}>${label}</a>`;
  });
  // `code`
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *italic*
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  return out;
}

export function renderMarkdown(markdown: string): string {
  const lines = (markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  let listType: "ul" | "ol" | null = null;
  let paragraph: string[] = [];
  let quote: string[] = [];

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };
  const closeParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeQuote = () => {
    if (quote.length) {
      html.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
      quote = [];
    }
  };
  const closeAll = () => {
    closeParagraph();
    closeQuote();
    closeList();
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line === "") {
      closeAll();
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      closeAll();
      html.push("<hr />");
      continue;
    }

    // Headings — h1 is reserved for the article title, so # and ## both become h2
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      closeAll();
      const level = Math.min(Math.max(heading[1].length, 2), 4);
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    // Blockquote
    const bq = /^>\s?(.*)$/.exec(line);
    if (bq) {
      closeParagraph();
      closeList();
      quote.push(bq[1]);
      continue;
    }

    // Bullet list
    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      closeParagraph();
      closeQuote();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }

    // Numbered list
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      closeParagraph();
      closeQuote();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inline(numbered[1])}</li>`);
      continue;
    }

    closeQuote();
    closeList();
    paragraph.push(line);
  }

  closeAll();
  return html.join("\n");
}

/** Plain text version of a body — for meta descriptions, llms.txt and JSON-LD */
export function markdownToPlainText(markdown: string): string {
  return (markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** "2026-11-20" → "November 20, 2026" */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Rough reading time, shown on the article page */
export function readingMinutes(markdown: string): number {
  const words = markdownToPlainText(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
