import re
import time
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# =========================
# CONFIG
# =========================
SET_ID = "75936-1"   # ex: "10218-1"
URL = f"https://www.bricklink.com/v2/catalog/catalogitem.page?S={SET_ID}#T=P"
HEADLESS = False
NAV_TIMEOUT = 120_000
WAIT_TIMEOUT = 90_000

# =========================
# UTILS
# =========================
def to_float(x: str):
    if x is None:
        return None
    # enlève devise/signes et garde 1234.56
    x = x.replace("~", "")
    x = x.replace(",", "")            # "1,581.20" -> "1581.20"
    x = re.sub(r"[^0-9.\-]", "", x)   # enlève "EUR", espaces, etc.
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

# =========================
# FETCH PAGE  (version stable)
# =========================
def fetch_html(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS, slow_mo=250)
        page = browser.new_page()
        page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/123 Safari/537.36"
        })

        # charge la page (réseau calme)
        try:
            page.goto(url, wait_until="networkidle", timeout=NAV_TIMEOUT)
        except PWTimeout:
            page.goto(url, wait_until="load", timeout=NAV_TIMEOUT)

        # cookies
        for sel in [
            "#onetrust-accept-btn-handler",
            "button:has-text('Accept all')",
            "button:has-text('Accept All')",
            "button:has-text('Accept')",
            "button:has-text('I agree')",
        ]:
            try:
                page.locator(sel).first.click(timeout=2000)
                time.sleep(0.5)
                break
            except Exception:
                pass

        # onglet Price Guide
        try:
            page.locator("a:has-text('Price Guide')").first.click(timeout=4000)
            time.sleep(2)
        except Exception:
            pass

        # attends que les blocs principaux existent
        page.wait_for_selector(".pcipgMainTable", timeout=WAIT_TIMEOUT)
        time.sleep(4)  # petit délai pour laisser finir le rendu

        html = page.content()
        browser.close()
        return html

# =========================
# PARSING SUMMARY UNIQUEMENT (robuste)
# =========================
def parse_summary(soup: BeautifulSoup, set_id: str) -> pd.DataFrame:
    # Regex souples (devise optionnelle, espaces variables)
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

    # 1) Parcourt par section explicite si possible
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

    # 2) Fallback : si rien via sections, on scanne tous les tableaux (version qui marchait chez toi)
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

    # 3) DataFrame + nettoyage minimal
    if not rows:
        # évite le KeyError 'Section'
        return pd.DataFrame(columns=[
            "Set ID","Section","Condition","Times Sold","Total Lots","Total Qty",
            "Min Price (EUR)","Avg Price (EUR)","Qty Avg Price (EUR)","Max Price (EUR)"
        ])

    df = pd.DataFrame(rows)

    # conversions numériques sûres
    for col in ["Times Sold","Total Lots","Total Qty"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    for col in ["Min Price (EUR)","Avg Price (EUR)","Qty Avg Price (EUR)","Max Price (EUR)"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # ordre lisible
    df["Section"] = pd.Categorical(df["Section"], ["Last 6 Months Sales","Current Items for Sale"])
    df["Condition"] = pd.Categorical(df["Condition"], ["New","Used"])
    df = df.sort_values(["Section","Condition"]).reset_index(drop=True)

    return df

# =========================
# RUN
# =========================
html = fetch_html(URL)
soup = BeautifulSoup(html, "html.parser")

df_summary = parse_summary(soup, SET_ID)

# Export & print
df_summary.to_csv("bricklink_summary_stable.csv", index=False)
print("\n=== SUMMARY (stable) ===")
print(df_summary)
