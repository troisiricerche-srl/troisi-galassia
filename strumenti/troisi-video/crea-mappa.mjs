import fs from 'fs'; import { feature } from 'topojson-client'; import { geoNaturalEarth1, geoPath, geoCentroid } from 'd3-geo';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc = feature(topo, topo.objects.countries); fc.features = fc.features.filter(f => f.id !== '010'); // senza Antartide
const fr = fc.features.find(f => f.id === '250'); fr.geometry.coordinates = fr.geometry.coordinates.filter(p => p[0][0][0] > -10); // solo Francia europea
const SEL = [['380','Italia'],['250','Francia'],['826','Regno Unito'],['276','Germania'],['191','Croazia'],['008','Albania'],['499','Montenegro'],['504','Marocco'],['784','Emirati Arabi Uniti'],['840','Stati Uniti'],['152','Cile'],['410','Corea del Sud'],['036','Australia']];
const out = {};
for (const [k, W, H, box] of [['h', 1920, 1080, [[90, 230], [1830, 900]]], ['v', 1080, 1920, [[20, 640], [1060, 1240]]]]) {
  const pr = geoNaturalEarth1().fitExtent(box, fc); const pa = geoPath(pr);
  const terra = fc.features.map(f => pa(f)).filter(Boolean);
  const sel = SEL.map(([id, nome]) => { const f = fc.features.find(x => x.id === id); if (!f) throw id;
    let c = pr(geoCentroid(f)); if (id === '840') c = pr([-98, 39]); if (id === '250') c = pr([2.4, 46.6]); if (id === '152') c = pr([-71, -33]);
    const eu = ['380','250','826','276','191','008','499'].includes(id); return { id, nome, d: pa(f), x: c[0], y: c[1], eu }; });
  const e = pr([12, 47]);
  out[k] = { terra, sel, europa: e };
}
fs.writeFileSync('../tr-video/mondo.json', JSON.stringify(out)); console.log(fs.statSync('../tr-video/mondo.json').size);
