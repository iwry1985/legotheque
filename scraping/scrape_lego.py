# pip install playwright pandas beautifulsoup4 lxml
# playwright install chromium

from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import pandas as pd
import re, os, mimetypes, pathlib

URL        = "https://www.lego.com/fr-be/themes"
OUT_DIR    = "themes_assets"
CSV_FILE   = "themes_assets.csv"
HEADLESS   = True
MIN_BYTES  = 1500   # filtre anti-icônes (on reste prudent)
TIMEOUT_MS = 30000

os.makedirs(OUT_DIR, exist_ok=True)

def slugify(s: str) -> str:
    s = (s or "").strip().lower()
    s = re.sub(r"[^\w\-]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "theme"

def ensure_ext(base_no_ext: str, content_type: str | None):
    # Ajoute extension si manquante
    if os.path.splitext(base_no_ext)[1]:
        return base_no_ext
    ext = mimetypes.guess_extension(content_type or "") or ".png"
    return base_no_ext + ext

def dedupe(path_in: str) -> str:
    p = pathlib.Path(path_in)
    if not p.exists():
        return str(p)
    i = 2
    while True:
        cand = p.with_name(f"{p.stem}-{i}{p.suffix}")
        if not cand.exists():
            return str(cand)
        i += 1

def choose_logo(img_urls, img_alts):
    # 1) si "logo" dans l'url/alt
    for u in img_urls:
        if "logo" in u.lower():
            return u
    for alt, u in zip(img_alts, img_urls):
        if "logo" in (alt or "").lower():
            return u
    # 2) sinon, on prend l’URL la “moins large” (souvent le logo est petit)
    def score(u):
        m = re.search(r"[?&]width=(\d+)", u)
        if m: return int(m.group(1))
        m = re.search(r"(\d{2,4})x(\d{2,4})", u)
        return int(m.group(1)) if m else 99999
    return sorted(img_urls, key=score)[0] if img_urls else ""

def choose_banner(all_urls):
    # 1) priorise banner/hero/tile/card/background
    prefs = [u for u in all_urls if any(k in u.lower() for k in ["banner","hero","tile","card","background"])]
    if prefs:
        def w(u):
            m = re.search(r"[?&]width=(\d+)", u)
            if m: return -int(m.group(1))
            m = re.search(r"(\d{3,4})x(\d{3,4})", u)
            if m: return -int(m.group(1))
            return 0
        return sorted(prefs, key=w)[0]
    # 2) fallback : la plus “longue”
    return max(all_urls, key=len) if all_urls else ""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=HEADLESS)
    ctx = browser.new_context()
    page = ctx.new_page()

    page.goto(URL, wait_until="domcontentloaded")

    # 1) Cookies (selon locale)
    for txt in ["Tout accepter", "Accepter tout", "Allow all", "Accept all", "J’accepte"]:
        loc = page.locator(f"button:has-text('{txt}')")
        if loc.count():
            try:
                loc.first.click(timeout=2000)
                break
            except:
                pass

    # 2) Scroll agressif jusqu’à stabilisation (déclenche lazy-load)
    prev_h, stable = 0, 0
    for _ in range(100):
        page.mouse.wheel(0, 2200)
        page.wait_for_timeout(200)
        h = page.evaluate("() => document.body.scrollHeight")
        if h == prev_h:
            stable += 1
            if stable >= 3:
                break
        else:
            stable = 0
        prev_h = h

    # 3) Boutons “voir plus” s’il y en a
    for _ in range(6):
        clicked = False
        for txt in ["Afficher plus", "Voir plus", "Show more", "Load more"]:
            btn = page.locator(f"button:has-text('{txt}')")
            if btn.count() and btn.first.is_visible():
                try:
                    btn.first.click(timeout=2000)
                    clicked = True
                    page.wait_for_timeout(700)
                except:
                    pass
        if not clicked:
            break

    page.wait_for_load_state("networkidle")

    # 4) Récupérer, pour chaque carte thème, les URLs effectives (img + picture + background-image calculé)
    cards = page.evaluate("""
    () => {
      const anchors = Array.from(document.querySelectorAll('a[href*="/themes/"]'))
        // on garde tous les liens vers /themes/<slug> même avec ?params
        .filter(a => /\\/themes\\//.test(a.getAttribute('href') || a.href));

      const pickUrlsFromSrcset = (ss) => {
        const out = [];
        (ss || "").split(",").forEach(part => {
          const u = part.trim().split(" ")[0];
          if (u) out.push(u);
        });
        return out;
      };

      const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

      return anchors.map(card => {
        const name = card.getAttribute('aria-label') || card.textContent.trim();
        const href = card.getAttribute('href') || card.href;

        const imgs = Array.from(card.querySelectorAll('img'));
        const imgUrls  = imgs.map(img => img.currentSrc || img.src || "");
        const imgAlts  = imgs.map(img => img.alt || "");

        const srcsetUrls = [];
        card.querySelectorAll('source[srcset]').forEach(s => {
          srcsetUrls.push(...pickUrlsFromSrcset(s.getAttribute('srcset')));
        });

        // background-image calculé (utile pour les bannières CSS)
        const bgUrls = [];
        const nodes = [card, ...card.querySelectorAll('*')];
        nodes.forEach(n => {
          const cs = getComputedStyle(n).backgroundImage || "";
          const m = cs.match(/url\\((['"]?)(.*?)\\1\\)/);
          if (m && m[2]) bgUrls.push(m[2]);
        });

        return {
          href,
          name,
          imgUrls: uniq(imgUrls),
          imgAlts: imgAlts,
          srcsetUrls: uniq(srcsetUrls),
          bgUrls: uniq(bgUrls)
        };
      });
    }
    """)

    # 5) Regrouper par slug de thème (et dédupliquer)
    by_slug = {}
    def abs_url(u: str) -> str:
        return urljoin(URL, u)

    for c in cards:
        href = c["href"] or ""
        m = re.search(r"/themes/([^/?#]+)", href)
        if not m:
            continue
        slug = m.group(1)
        rec = by_slug.get(slug, {"name": c["name"], "img": set(), "alts": [], "extra": set()})
        rec["name"] = rec["name"] or c["name"]
        rec["alts"].extend(c["imgAlts"])
        for u in c["imgUrls"]:
            rec["img"].add(abs_url(u))
        for u in c["srcsetUrls"]:
            rec["img"].add(abs_url(u))
        for u in c["bgUrls"]:
            rec["extra"].add(abs_url(u))
        by_slug[slug] = rec

    # 6) Choisir logo + bannière et télécharger, avec numérotation liée (logo_1 / banner_1)
    rows = []
    slugs_sorted = sorted(by_slug.keys())
    for i, slug in enumerate(slugs_sorted, start=1):
        rec = by_slug[slug]
        name = rec["name"] or slug.replace("-", " ").title()
        img_urls = list(rec["img"])
        all_urls = list(set(img_urls) | set(rec["extra"]))

        logo_url   = choose_logo(img_urls, rec["alts"])
        banner_url = choose_banner(all_urls)

        def download(u: str, basename: str) -> str:
            if not u: return ""
            r = ctx.request.get(u, headers={"Referer": URL, "User-Agent": "Mozilla/5.0"})
            if not r.ok: return ""
            body = r.body()
            if len(body) < MIN_BYTES:
                return ""
            out_no_ext = os.path.join(OUT_DIR, basename)
            out_path = ensure_ext(out_no_ext, r.headers.get("content-type"))
            out_path = dedupe(out_path)
            with open(out_path, "wb") as f:
                f.write(body)
            return out_path

        # Noms liés (ex: logo_1.png / banner_1.png)
        logo_file   = download(logo_url,   f"logo_{i}")
        banner_file = download(banner_url, f"banner_{i}")

        print(f"✔ {i:02d} {name:<35}  logo:{bool(logo_file):<5}  banner:{bool(banner_file):<5}")

        rows.append({
            "id": i,
            "theme": name,
            "slug": slug,
            "logo_url": logo_url,
            "banner_url": banner_url,
            "logo_file": logo_file,
            "banner_file": banner_file
        })

    browser.close()
    pd.DataFrame(rows).to_csv(CSV_FILE, index=False, encoding="utf-8")

print(f"\n✅ Terminé. {len(rows)} thèmes capturés. CSV: {CSV_FILE}  |  Dossier: {OUT_DIR}")
