#!/usr/bin/env python3
"""PDF «working paper» per Zenodo dalle analisi della galassia Troisi Ricerche.

Uso: python3 pdf.py articoli.json cartella_uscita
articoli.json = lista di {portale, sito, id, date, title, excerpt, content, link, doi}
(doi facoltativo: se c'è, va in prima pagina e nella citazione).
"""
import base64, html, json, re, sys
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

QUI = Path(__file__).resolve().parent
LOGO = (QUI.parent.parent / 'assets' / 'logo-troisi-ricerche-chiaro.png')
LOGO_B64 = base64.b64encode(LOGO.read_bytes()).decode() if LOGO.exists() else ''
ORCID = '0009-0006-2618-2254'
MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto',
        'settembre', 'ottobre', 'novembre', 'dicembre']


def data_it(s):
    d = datetime.fromisoformat(s[:19])
    return f"{d.day} {MESI[d.month-1]} {d.year}"


def testo(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()


def pulisci(content):
    """Toglie le frasi promozionali su Troisi Ricerche dai paragrafi (non da didascalie e riquadri)."""
    def fix_p(m):
        p = m.group(0)
        inner = m.group(2)
        if 'Troisi Ricerche' not in testo(inner):
            return p
        frasi = re.split(r'(?<=[.!?])\s+(?=[A-ZÀ-Ú«“"])', inner)
        tenute = [f for f in frasi if 'Troisi Ricerche' not in testo(f)]
        if not testo(' '.join(tenute)):
            return ''
        return m.group(1) + ' '.join(tenute) + '</p>'
    # protegge figure/aside: lavora solo fuori da quei blocchi
    parti = re.split(r'(<figure[\s\S]*?</figure>|<aside[\s\S]*?</aside>)', content)
    out = []
    for i, parte in enumerate(parti):
        if i % 2 == 1:
            out.append(parte)
        else:
            out.append(re.sub(r'(<p[^>]*>)([\s\S]*?)</p>', fix_p, parte))
    return ''.join(out)


CSS = r"""
@page { size: A4; margin: 18mm 18mm 20mm 18mm;
  @bottom-left { content: "Andrea Troisi · Troisi Ricerche · CC BY 4.0"; font: 7.5pt Inter, sans-serif; color: #7a8594; }
  @bottom-right { content: counter(page) " / " counter(pages); font: 7.5pt Inter, sans-serif; color: #7a8594; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Bitstream Charter', Charter, Georgia, serif; color: #1d2733; font-size: 10.6pt; line-height: 1.55; }
.band { background: #0a1628; color: #fff; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 4px; }
.band img { height: 30px; }
.band .s { font: 600 8pt Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #e8c46a; text-align: right; line-height: 1.4 }
.band .s span { display: block; color: #cfd6df; font-weight: 400; letter-spacing: .04em }
.tipo { font: 600 8pt Inter, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #8a6d1a; margin: 18px 0 6px; }
h1.t { font: 700 20pt/1.18 Inter, sans-serif; color: #0a1628; margin: 0 0 10px; }
.aut { font: 10pt Inter, sans-serif; color: #1d2733; margin: 0 0 2px; }
.aut b { font-weight: 700 }
.aff { font: 8.5pt Inter, sans-serif; color: #5b6676; margin: 0 0 12px; }
.meta { font: 8.3pt Inter, sans-serif; color: #3d4756; border-top: 1px solid #d5dbe3; border-bottom: 1px solid #d5dbe3; padding: 7px 0; margin: 0 0 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px 16px; }
.meta div b { color: #0a1628 }
.abs { background: #f4f6f9; border-left: 3px solid #c9981a; padding: 9px 12px; margin: 0 0 16px; font-size: 10pt; }
.abs b { font: 700 8pt Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #0a1628; display: block; margin-bottom: 3px }
.art h2 { font: 700 13pt/1.3 Inter, sans-serif; color: #0a1628; margin: 1.3em 0 .45em; break-after: avoid; }
.art h3 { font: 700 11pt Inter, sans-serif; color: #0a1628; break-after: avoid; }
.art p { margin: 0 0 .8em; orphans: 3; widows: 3; }
.art a { color: #1d2733; text-decoration: none; }
.art figure, .art .ti-chart, .art table, .art aside, .art .ti-kpi { break-inside: avoid; }
.art .ti-chart { margin: 1.1em 0 1.3em !important; }
.art .ti-chart svg { max-height: 95mm; }
.art img { max-width: 100%; height: auto; }
.art iframe, .art script, .art .tg-share, .art .ti-share, .art .flourish-embed { display: none !important; }
.art table { font-size: 8.8pt !important; }
.cit { margin-top: 18px; padding-top: 9px; border-top: 1px solid #d5dbe3; font: 8.3pt/1.5 Inter, sans-serif; color: #3d4756; break-inside: avoid; }
.cit b { color: #0a1628 }
"""


def pagina(a):
    titolo = testo(a['title'])
    sintesi = testo(a.get('excerpt', ''))
    dt = data_it(a['date'])
    anno = a['date'][:4]
    doi = a.get('doi') or ''
    cit = (f"Troisi, A. ({anno}). {titolo}. {a['portale']}, Troisi Ricerche. "
           + (f"https://doi.org/{doi}" if doi else a['link']))
    logo = f'<img src="data:image/png;base64,{LOGO_B64}" alt="Troisi Ricerche">' if LOGO_B64 else '<b>Troisi Ricerche</b>'
    return f"""<!doctype html><html lang="it"><head><meta charset="utf-8"><title>{html.escape(titolo)}</title>
<meta name="author" content="Andrea Troisi"><style>{CSS}</style></head><body>
<div class="band">{logo}<div class="s">{html.escape(a['portale'])}<span>Analisi su dati ufficiali · Troisi Ricerche</span></div></div>
<div class="tipo">Analisi · {html.escape(a['portale'])}</div>
<h1 class="t">{html.escape(titolo)}</h1>
<p class="aut"><b>Andrea Troisi</b> · ORCID {ORCID}</p>
<p class="aff">Troisi Ricerche S.r.l., Via De Rossi 57, 70122 Bari (Italia)</p>
<div class="meta">
<div><b>Data:</b> {dt}</div><div><b>Licenza:</b> CC BY 4.0</div>
<div><b>DOI:</b> {html.escape(doi) if doi else '—'}</div><div><b>Lingua:</b> italiano</div>
<div style="grid-column:1/3"><b>Pubblicato su:</b> {html.escape(a['link'])}</div>
</div>
{f'<div class="abs"><b>Sintesi</b>{html.escape(sintesi)}</div>' if sintesi else ''}
<div class="art">{pulisci(a['content'])}</div>
<div class="cit"><b>Citazione consigliata:</b> {html.escape(cit)}<br>
© {anno} Andrea Troisi, Troisi Ricerche. Testo e grafici sono rilasciati con licenza Creative Commons Attribuzione 4.0 Internazionale (CC BY 4.0): https://creativecommons.org/licenses/by/4.0/deed.it</div>
</body></html>"""


def main():
    arts = json.load(open(sys.argv[1]))
    out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        for a in arts:
            nome = a.get('file') or f"{a['sito'].split('.')[0]}-{a['id']}.pdf"
            pg.set_content(pagina(a), wait_until='load')
            pg.pdf(path=str(out / nome), format='A4', print_background=True, display_header_footer=False,
                   prefer_css_page_size=True)
            print(nome)
        b.close()


if __name__ == '__main__':
    main()
