import re
import time
import json
import os
import random
import math
import logging
from datetime import datetime, timedelta
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# =========================
# CONFIG
# =========================
SET_ID = "71040-1"   # ex: "10218-1" 
URL_TEMPLATE = "https://www.bricklink.com/v2/catalog/catalogitem.page?S={set_id}#T=P"

HEADLESS = True
NAV_TIMEOUT = 120_000
WAIT_TIMEOUT = 60_000

# politeness / cadence
MIN_DELAY = 60         # secondes mini entre deux sets
MAX_DELAY = 120        # secondes maxi (jitter)
BLOCK_DURATION = 15*60 # durée mini après un block apparent (ex : 15 minutes)
DAILY_MAX_SETS = 150   # budget quotidien conservateur
BLOCKS_PER_DAY = 3     # nombre de blocs de scraping par jour

# cache / TTL
CACHE_FILE = "fetch_cache.json"   # stocke last_fetch par set
TTL_DAYS = 7                      # ne pas re-fetch si < TTL_DAYS

# output
OUT_CSV = "bricklink_summary_history.csv"
RAW_HTML_DIR = "raw_html"         # sauvegarde html 

# =========================
# LOGGING
# =========================
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
log_filename = os.path.join(LOG_DIR, datetime.utcnow().strftime("bricklink_%Y%m%d_%H%M.log"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_filename, encoding="utf-8"),
        logging.StreamHandler()  # continue d’afficher dans la console
    ]
)
logger = logging.getLogger("bricklink-scraper")

logger.info(f"Fichier de log actif : {log_filename}")

# =========================
# UTIL
# =========================
def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_cache(cache):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)

def should_skip_set(cache, set_id):
    if set_id not in cache:
        return False
    last = datetime.fromisoformat(cache[set_id])
    if datetime.utcnow() - last < timedelta(days=TTL_DAYS):
        return True
    return False

def mark_fetched(cache, set_id):
    cache[set_id] = datetime.utcnow().isoformat()
    save_cache(cache)

def to_float(x: str):
    if x is None:
        return None
    x = x.replace("~", "")
    x = x.replace(",", "")
    x = re.sub(r"[^0-9.\-]", "", x)
    try:
        return float(x) if x != "" else None
    except Exception:
        return None

def to_int(x: str):
    if x is None:
        return None
    x = x.replace(",", "").strip()
    try:
        return int(x)
    except Exception:
        return None

def save_raw_html(set_id, html):
    os.makedirs(RAW_HTML_DIR, exist_ok=True)
    filename = os.path.join(RAW_HTML_DIR, f"{set_id}_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.html")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)
    return filename

def append_df_to_csv(df: pd.DataFrame, csv_path=OUT_CSV):
    """Ajoute les nouvelles lignes au CSV tout en évitant les doublons exacts (Set+Section+Condition+snapshot)."""
    if df.empty:
        return
    df["ScrapeTimestampUTC"] = datetime.utcnow().isoformat()
    if os.path.exists(csv_path):
        try:
            existing = pd.read_csv(csv_path)
        except Exception:
            existing = pd.DataFrame()
        if not existing.empty:
            combined = pd.concat([existing, df], ignore_index=True)
            # on supprime doublons exacts sur une clé pertinente (garde l'historique des changements)
            dedup_cols = ["Set ID","Section","Condition","ScrapeTimestampUTC"]
            combined = combined.drop_duplicates(subset=dedup_cols, keep="last")
            combined.to_csv(csv_path, index=False)
            logger.info(f"Appended {len(df)} rows — CSV now has {len(combined)} rows.")
            return
    # file didn't exist or empty
    df.to_csv(csv_path, index=False)
    logger.info(f"Created {csv_path} with {len(df)} rows.")

# =========================
# FETCH HTML (améliorée, polie)
# =========================
def fetch_html(url: str, headless=HEADLESS) -> str:
    # user agents simples — évite l'usurpation d'outils explicites
    ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless, slow_mo=0)
        page = browser.new_page()
        page.set_extra_http_headers({"User-Agent": ua})
        try:
            try:
                page.goto(url, wait_until="networkidle", timeout=NAV_TIMEOUT)
            except PWTimeout:
                # fallback plus permissif
                page.goto(url, wait_until="load", timeout=NAV_TIMEOUT)
        except Exception as e:
            logger.warning(f"Erreur page.goto: {e}")
            browser.close()
            raise

        # accept cookies si visible
        for sel in [
            "#onetrust-accept-btn-handler",
            "button:has-text('Accept all')",
            "button:has-text('Accept All')",
            "button:has-text('Accept')",
            "button:has-text('I agree')",
        ]:
            try:
                btn = page.locator(sel).first
                if btn and btn.is_visible():
                    btn.click(timeout=2000)
                    time.sleep(0.5)
                    break
            except Exception:
                pass

        # onglet Price Guide si accessible
        try:
            a = page.locator("a:has-text('Price Guide')").first
            if a and a.is_visible():
                a.click(timeout=4000)
                time.sleep(1.5)
        except Exception:
            pass

        # attend un sélecteur attendu (timeout court)
        try:
            page.wait_for_selector(".pcipgMainTable", timeout=WAIT_TIMEOUT)
        except Exception:
            # on laisse quand même récupérer le html — possible page différente (captcha / bloque)
            logger.debug("pcipgMainTable non trouvée — on récupère malgré tout le contenu pour inspection.")

        html = page.content()
        browser.close()
        return html

# =========================
# PARSE (repris / inchangé mais nettoyé)
# =========================
def parse_summary(soup: BeautifulSoup, set_id: str) -> pd.DataFrame:
    l6m_re = re.compile(
        r"Times\s*Sold\s*:\s*(\d+)\D+"
        r"Total\s*Qty\s*:\s*(\d+)\D+"
        r"Min\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Avg\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Qty\s*Avg\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Max\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)",
        re.I | re.S
    )
    curr_re = re.compile(
        r"Total\s*Lots\s*:\s*(\d+)\D+"
        r"Total\s*Qty\s*:\s*(\d+)\D+"
        r"Min\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Avg\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Qty\s*Avg\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)\D+"
        r"Max\s*Price\s*:\s*(?:[A-Z]{3}\s*)?([\d,.\-]+)",
        re.I | re.S
    )

    rows = []
    for sec in soup.select("div.pcipgSection"):
        title = sec.get_text(" ", strip=True).lower()
        table = sec.find("table", class_="pcipgMainTable")
        if not table:
            continue
        txt = table.get_text(" ", strip=True)

        if "last" in title and "month" in title:
            matches = list(l6m_re.finditer(txt))
            for i, m in enumerate(matches[:2]):
                rows.append({
                    "Set ID": set_id,
                    "Section": "Last 6 Months Sales",
                    "Condition": "New" if i == 0 else "Used",
                    "Times Sold": to_int(m.group(1)),
                    "Total Qty": to_int(m.group(2)),
                    "Total Lots": None,
                    "Min Price (EUR)": to_float(m.group(3)),
                    "Avg Price (EUR)": to_float(m.group(4)),
                    "Qty Avg Price (EUR)": to_float(m.group(5)),
                    "Max Price (EUR)": to_float(m.group(6)),
                })
        elif "current" in title or "available" in title or "for sale" in title:
            matches = list(curr_re.finditer(txt))
            for i, m in enumerate(matches[:2]):
                rows.append({
                    "Set ID": set_id,
                    "Section": "Current Items for Sale",
                    "Condition": "New" if i == 0 else "Used",
                    "Times Sold": None,
                    "Total Qty": to_int(m.group(2)),
                    "Total Lots": to_int(m.group(1)),
                    "Min Price (EUR)": to_float(m.group(3)),
                    "Avg Price (EUR)": to_float(m.group(4)),
                    "Qty Avg Price (EUR)": to_float(m.group(5)),
                    "Max Price (EUR)": to_float(m.group(6)),
                })

    if not rows:
        for table in soup.select("table.pcipgMainTable"):
            txt = table.get_text(" ", strip=True)
            l6m = list(l6m_re.finditer(txt))
            curr = list(curr_re.finditer(txt))
            if l6m:
                for i, m in enumerate(l6m[:2]):
                    rows.append({
                        "Set ID": set_id,
                        "Section": "Last 6 Months Sales",
                        "Condition": "New" if i == 0 else "Used",
                        "Times Sold": to_int(m.group(1)),
                        "Total Qty": to_int(m.group(2)),
                        "Total Lots": None,
                        "Min Price (EUR)": to_float(m.group(3)),
                        "Avg Price (EUR)": to_float(m.group(4)),
                        "Qty Avg Price (EUR)": to_float(m.group(5)),
                        "Max Price (EUR)": to_float(m.group(6)),
                    })
            if curr:
                for i, m in enumerate(curr[:2]):
                    rows.append({
                        "Set ID": set_id,
                        "Section": "Current Items for Sale",
                        "Condition": "New" if i == 0 else "Used",
                        "Times Sold": None,
                        "Total Qty": to_int(m.group(2)),
                        "Total Lots": to_int(m.group(1)),
                        "Min Price (EUR)": to_float(m.group(3)),
                        "Avg Price (EUR)": to_float(m.group(4)),
                        "Qty Avg Price (EUR)": to_float(m.group(5)),
                        "Max Price (EUR)": to_float(m.group(6)),
                    })

    if not rows:
        return pd.DataFrame(columns=[
            "Set ID","Section","Condition","Times Sold","Total Lots","Total Qty",
            "Min Price (EUR)","Avg Price (EUR)","Qty Avg Price (EUR)","Max Price (EUR)"
        ])

    df = pd.DataFrame(rows)
    for col in ["Times Sold","Total Lots","Total Qty"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    for col in ["Min Price (EUR)","Avg Price (EUR)","Qty Avg Price (EUR)","Max Price (EUR)"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df["Section"] = pd.Categorical(df["Section"], ["Last 6 Months Sales","Current Items for Sale"])
    df["Condition"] = pd.Categorical(df["Condition"], ["New","Used"])
    df = df.sort_values(["Section","Condition"]).reset_index(drop=True)
    return df

# =========================
# DETECTION D'ERREUR / CAPTCHA
# =========================
def detect_block(html: str) -> bool:
    """Retourne True si on voit un blocage apparent (captcha, 403-like page, message anti-bot)."""
    hay = html.lower()
    suspicious_markers = [
        "captcha", "are you human", "access denied", "too many requests",
        "please enable cookies", "blocked", "/robot", "verify you're human"
    ]
    for m in suspicious_markers:
        if m in hay:
            logger.warning(f"Suspicious marker detected: {m}")
            return True
    return False

# =========================
# MAIN RUN (single set or loop)
# =========================
def run_for_sets(set_ids):
    cache = load_cache()
    fetched_today = 0
    start_day = datetime.utcnow()

    for set_id in set_ids:
        if fetched_today >= DAILY_MAX_SETS:
            logger.info(f"Atteint le quota journalier de {DAILY_MAX_SETS} sets. Stopping.")
            break

        # TTL check
        if should_skip_set(cache, set_id):
            logger.info(f"Skip {set_id} (fetch récent < {TTL_DAYS} jours).")
            continue

        url = URL_TEMPLATE.format(set_id=set_id)
        logger.info(f"Fetching {set_id} — {url}")

        # tentative avec backoff exponentiel
        max_tries = 4
        base_wait = 5
        html = None
        for attempt in range(1, max_tries + 1):
            try:
                html = fetch_html(url)
                if detect_block(html):
                    # signe de blocage : on stoppe et attend plus long
                    logger.error(f"Blocage détecté pour {set_id} lors de l'essai {attempt}. Pause longue.")
                    time.sleep(BLOCK_DURATION)
                    raise RuntimeError("Block suspected (captcha / anti-bot).")
                # ok
                break
            except Exception as e:
                wait = base_wait * (2 ** (attempt - 1)) + random.uniform(0, 2)
                logger.warning(f"Erreur fetch {set_id} (essai {attempt}/{max_tries}): {e} — wait {wait:.1f}s")
                time.sleep(wait)
        if html is None:
            logger.error(f"Impossible de récupérer {set_id} après {max_tries} essais. On passe au suivant.")
            continue

        # sauvegarde html brute pour audit/debug
        # raw_path = save_raw_html(set_id, html)
        # logger.info(f"Saved raw html to {raw_path}")

        soup = BeautifulSoup(html, "html.parser")
        df_summary = parse_summary(soup, set_id)

        if df_summary.empty:
            logger.info(f"Aucune donnée parsée pour {set_id}.")
        else:
            append_df_to_csv(df_summary, OUT_CSV)

        # marque comme fetché
        mark_fetched(cache, set_id)
        fetched_today += 1

        # délai aléatoire entre 2 sets (politeness)
        delay = random.uniform(MIN_DELAY, MAX_DELAY)
        # ajustement: si on a fait beaucoup, on peut allonger
        if fetched_today % 20 == 0:
            delay *= 1.5
        logger.info(f"Sleeping {math.floor(delay)}s before next set.")
        time.sleep(delay)

    logger.info("Finished run.")


# =========================
# INTÉGRATION AVEC LA BASE
# =========================
from sqlalchemy import create_engine, text

DB_URL = "postgresql://postgres:technofutur2025@localhost:5432/legothec"
MAX_SETS_FROM_DB = 50  # nombre maximum de sets à scrapper par exécution

def get_sets_to_scrape(limit=MAX_SETS_FROM_DB):
    """Récupère les références à scrapper depuis la table legoset."""
    engine = create_engine(DB_URL)
    query = text("""
        SELECT bricksetid
        FROM legoset
        WHERE fetch_bricklink=false AND retailprice > 0 AND pieces >= 1000
        ORDER BY year ASC
        LIMIT :limit;
    """)
    with engine.begin() as conn:
        rows = conn.execute(query, {"limit": limit}).fetchall()
    return [r[0] for r in rows]

# =========================
# MAIN (scraping via DB)
# =========================
if __name__ == "__main__":
    try:
        set_list = get_sets_to_scrape()
        if not set_list:
            logger.info("Aucun set à scrapper depuis la DB.")
        else:
            logger.info(f"{len(set_list)} sets à scrapper récupérés depuis la DB.")
            run_for_sets(set_list)
    except Exception as e:
        logger.error(f"Erreur pendant le run global : {e}")
