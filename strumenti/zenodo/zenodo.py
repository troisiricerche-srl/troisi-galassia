#!/usr/bin/env python3
"""Deposito su Zenodo delle analisi della galassia Troisi Ricerche (gira in GitHub Actions).

Comandi:
  python3 zenodo.py bozze N        crea fino a N nuove bozze: metadati, DOI prenotato, PDF caricato
  python3 zenodo.py pubblica [ids]  pubblica le bozze (tutte quelle in registro, o solo gli id indicati)
  python3 zenodo.py elenco          stampa lo stato del registro
Token: variabile d'ambiente ZENODO_TOKEN (segreto del repository, mai scritto altrove).
Registro: registro.json (link originale -> id record, DOI, stato).
"""
import html, json, os, re, sys, time
from pathlib import Path
import urllib.request, urllib.error

QUI = Path(__file__).resolve().parent
REG = QUI / 'registro.json'
OUT = QUI / 'pdf-uscita'
API = os.environ.get('ZENODO_API', 'https://zenodo.org/api')
TOKEN = os.environ.get('ZENODO_TOKEN', '')
ORCID = '0009-0006-2618-2254'

SITI = {
    'troisiinsight.it': 'TroisiInsight', 'customerpa.it': 'CustomerPA™',
    'benessereorganizzativo.it': 'Benessere Organizzativo', 'governancefinanziaria.it': 'Governance Finanziaria',
    'digitalizzazionenellapa.it': 'DigitalizzazionePA', 'consulenzainternazionalizzazione.it': 'Consulenza Internazionalizzazione',
    'dibattito-pubblico.it': 'Dibattito Pubblico', 'benesseredigitalegiovani.it': 'Benessere Digitale Giovani',
    'mappaturadellecompetenze.it': 'Mappatura delle Competenze'}
# guide pratiche e riepiloghi esclusi (decisione del 16/10/2026)
ESCLUSI = {'consulenzainternazionalizzazione.it': set(range(18, 34)), 'governancefinanziaria.it': {24, 25, 26}}
KW = {
    'TroisiInsight': ['economia italiana', 'Eurostat', 'ISTAT'],
    'CustomerPA™': ['pubblica amministrazione', 'servizi pubblici', 'customer satisfaction'],
    'Benessere Organizzativo': ['benessere organizzativo', 'lavoro', 'condizioni di lavoro'],
    'Governance Finanziaria': ['imprese', 'governance', 'ESG', "finanza d'impresa"],
    'DigitalizzazionePA': ['digitalizzazione', 'pubblica amministrazione', 'competenze digitali'],
    'Consulenza Internazionalizzazione': ['export', 'internazionalizzazione', 'commercio estero', 'PMI'],
    'Dibattito Pubblico': ['partecipazione', 'infrastrutture', 'politiche pubbliche'],
    'Benessere Digitale Giovani': ['giovani', 'benessere digitale', 'competenze digitali'],
    'Mappatura delle Competenze': ['competenze', 'mercato del lavoro', 'istruzione']}


def testo(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s or '')).strip()


def http(method, url, data=None, ctype='application/json', auth=True):
    h = {'Accept': 'application/json', 'User-Agent': 'troisi-galassia-zenodo'}
    if auth:
        h['Authorization'] = 'Bearer ' + TOKEN
    body = None
    if data is not None:
        body = data if isinstance(data, (bytes, bytearray)) else json.dumps(data).encode()
        h['Content-Type'] = ctype
    for tent in range(4):
        req = urllib.request.Request(url, data=body, headers=h, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                t = r.read()
                return json.loads(t) if t else {}
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', 'replace')[:800]
            if e.code in (429, 502, 503, 504) and tent < 3:
                time.sleep(10 * (tent + 1)); continue
            raise SystemExit(f'ERRORE {e.code} {method} {url}\n{msg}')


def articoli():
    tutti = []
    for sito, portale in SITI.items():
        for pg in range(1, 6):
            url = f'https://www.{sito}/?rest_route=/wp/v2/posts&per_page=100&page={pg}&_fields=id,date,title,excerpt,content,link'
            try:
                j = http('GET', url, auth=False)
            except SystemExit:
                break
            for a in j:
                if a['id'] in ESCLUSI.get(sito, set()):
                    continue
                t = testo(a['title']['rendered'])
                if t.startswith('Sei mesi di dati'):
                    continue
                tutti.append({'sito': sito, 'portale': portale, 'id': a['id'], 'date': a['date'], 'title': t,
                              'excerpt': a['excerpt']['rendered'], 'content': a['content']['rendered'], 'link': a['link']})
            if len(j) < 100:
                break
    tutti.sort(key=lambda a: a['date'])
    return tutti


def metadati(a):
    sint = testo(a['excerpt'])
    desc = (f'<p>{html.escape(sint)}</p><p>Analisi su dati ufficiali pubblicata originariamente da <strong>{a["portale"]}</strong> '
            f'(Troisi Ricerche) il {a["date"][:10]}: <a href="{a["link"]}">{a["link"]}</a>.</p>')
    kw = ['Italia', 'statistiche ufficiali', 'Troisi Ricerche', a['portale']] + KW.get(a['portale'], [])
    if re.search(r'Mezzogiorno|\bSud\b|Puglia|region', a['title'] + ' ' + sint, re.I):
        kw += ['Mezzogiorno', 'divari territoriali']
    return {
        'access': {'record': 'public', 'files': 'public'},
        'files': {'enabled': True},
        'metadata': {
            'resource_type': {'id': 'publication-report'},
            'title': a['title'],
            'publication_date': a['date'][:10],
            'creators': [{'person_or_org': {'type': 'personal', 'given_name': 'Andrea', 'family_name': 'Troisi',
                                            'identifiers': [{'scheme': 'orcid', 'identifier': ORCID}]},
                          'affiliations': [{'id': '027ynra39'}, {'name': 'Troisi Ricerche'}]}],
            'description': desc,
            'languages': [{'id': 'ita'}],
            'rights': [{'id': 'cc-by-4.0'}],
            'subjects': [{'subject': s} for s in dict.fromkeys(kw)],
            'publisher': 'Zenodo',
            'related_identifiers': [{'identifier': a['link'], 'scheme': 'url', 'relation_type': {'id': 'isvariantformof'},
                                     'resource_type': {'id': 'publication-report'}}]}}


def carica_reg():
    return json.loads(REG.read_text()) if REG.exists() else {}


def salva_reg(r):
    REG.write_text(json.dumps(r, ensure_ascii=False, indent=1, sort_keys=True))


def bozze(n):
    sys.path.insert(0, str(QUI))
    import pdf as P
    from playwright.sync_api import sync_playwright
    reg = carica_reg()
    nuovi = [a for a in articoli() if a['link'] not in reg][:n]
    OUT.mkdir(exist_ok=True)
    print(f'Articoli da depositare in questo giro: {len(nuovi)}')
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        for a in nuovi:
            d = http('POST', f'{API}/records', metadati(a))
            rid = d['id']
            doi = http('POST', f'{API}/records/{rid}/draft/pids/doi')['pids']['doi']['identifier']
            a['doi'] = doi
            nome = f"troisi-{a['sito'].split('.')[0]}-{a['date'][:10]}-{a['id']}.pdf"
            pg.set_content(P.pagina(a), wait_until='load')
            pg.pdf(path=str(OUT / nome), format='A4', print_background=True, prefer_css_page_size=True)
            http('POST', f'{API}/records/{rid}/draft/files', [{'key': nome}])
            http('PUT', f'{API}/records/{rid}/draft/files/{nome}/content', (OUT / nome).read_bytes(), 'application/octet-stream')
            http('POST', f'{API}/records/{rid}/draft/files/{nome}/commit')
            reg[a['link']] = {'id': rid, 'doi': doi, 'stato': 'bozza', 'file': nome, 'titolo': a['title'],
                              'portale': a['portale'], 'data': a['date'][:10]}
            salva_reg(reg)
            print(f'BOZZA {rid} {doi} {a["date"][:10]} {a["title"][:70]}')
        b.close()


def pubblica(ids):
    reg = carica_reg()
    for link, v in sorted(reg.items(), key=lambda x: x[1]['data']):
        if v['stato'] != 'bozza' or (ids and v['id'] not in ids):
            continue
        http('POST', f"{API}/records/{v['id']}/draft/actions/publish")
        v['stato'] = 'pubblicato'
        salva_reg(reg)
        print(f"PUBBLICATO {v['id']} https://doi.org/{v['doi']} {v['titolo'][:70]}")


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'elenco'
    if cmd in ('bozze', 'pubblica') and not TOKEN:
        raise SystemExit('Manca ZENODO_TOKEN')
    if cmd == 'bozze':
        bozze(int(sys.argv[2]) if len(sys.argv) > 2 else 3)
    elif cmd == 'pubblica':
        pubblica([x for x in sys.argv[2:] if x])
    else:
        for k, v in carica_reg().items():
            print(v['stato'], v['id'], v['doi'], v['data'], v['titolo'][:60])
