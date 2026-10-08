#!/usr/bin/env bash
# Pubblica una nuova versione: ./strumenti/rilascia.sh 1.6.1 "Cosa cambia"
# Aggiorna numero di versione nel plugin, ricostruisce lo ZIP e update.json.
set -euo pipefail
V="$1"; NOTE="${2:-}"
cd "$(dirname "$0")/.."
F=troisi-galassia/troisi-galassia.php
sed -i -E "s/^ \* Version: .*/ * Version: $V/; s/define\( 'TG_VERSION', '[^']+' \);/define( 'TG_VERSION', '$V' );/" "$F"
php -l "$F" >/dev/null
rm -f dist/troisi-galassia.zip && zip -qr dist/troisi-galassia.zip troisi-galassia
python3 - "$V" "$NOTE" <<'PY'
import json,sys
v,n=sys.argv[1],sys.argv[2]
d=json.load(open('update.json'))
d['version']=v
d['changelog']=f'<p><b>{v}</b> – {n}</p>'+d.get('changelog','')
json.dump(d,open('update.json','w'),ensure_ascii=False,indent=2)
PY
echo "Pronta la $V: ora commit e push."
