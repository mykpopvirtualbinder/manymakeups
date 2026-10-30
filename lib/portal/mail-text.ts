const LINK = /\[\[([^\[\]\n]{1,300})\]\]\((https?:\/\/[^\s)]{1,2000})\)/g;

export function cleanUrl(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function messageToPlain(message: string) {
  return message.replace(LINK, (whole, label: string, href: string) => {
    const url = cleanUrl(href);
    return url ? `${label} (${url})` : whole;
  });
}

export function messageToHtml(message: string) {
  let html = "";
  let last = 0;
  for (const match of message.matchAll(LINK)) {
    const index = match.index ?? 0;
    html += escapeHtml(message.slice(last, index));
    const href = cleanUrl(match[2]);
    if (!href) html += escapeHtml(match[0]);
    else html += `<a href="${escapeAttr(href)}" style="color:#1a1613;text-decoration:underline;">${escapeHtml(match[1])}</a>`;
    last = index + match[0].length;
  }
  html += escapeHtml(message.slice(last));
  return html;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}
