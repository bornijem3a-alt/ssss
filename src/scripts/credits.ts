/**
 * Fills in photo credits that the build-time pipeline has not resolved yet,
 * straight from the Wikimedia Commons API (author + license of each file).
 */
export async function initCredits() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-credit-file][data-pending]')];
  if (!items.length) return;
  const by = document.querySelector<HTMLElement>('[data-credit-strings]')?.dataset.by ?? 'by';
  const titles = items.map((li) => `File:${li.dataset.creditFile}`);
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl',
    titles: titles.join('|'),
  });
  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
    const json = await res.json();
    const norm = new Map<string, string>(
      (json.query?.normalized ?? []).map((n: { from: string; to: string }) => [n.to, n.from])
    );
    for (const page of json.query?.pages ?? []) {
      const meta = page.imageinfo?.[0]?.extmetadata;
      if (!meta) continue;
      const original = (norm.get(page.title) ?? page.title).replace(/^File:/, '');
      const li = items.find((x) => x.dataset.creditFile === original || x.dataset.creditFile?.replace(/_/g, ' ') === page.title.replace(/^File:/, ''));
      const slot = li?.querySelector('[data-credit-text]');
      if (!slot) continue;
      const tmp = document.createElement('div');
      tmp.innerHTML = meta.Artist?.value ?? '';
      const author = (tmp.textContent ?? '').trim() || '—';
      const license = meta.LicenseShortName?.value ?? '';
      slot.textContent = `${by} ${author}, `;
      if (meta.LicenseUrl?.value) {
        const a = document.createElement('a');
        a.href = meta.LicenseUrl.value;
        a.rel = 'license noopener';
        a.textContent = license;
        slot.append(a);
      } else slot.append(license);
      li!.removeAttribute('data-pending');
    }
  } catch {
    /* offline or blocked: the file-page links remain as attribution */
  }
}
