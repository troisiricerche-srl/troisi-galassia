// Icone lineari dell'Osservatorio (stile «line icons», tratto 1.75, colore = currentColor).
// Disegnate per sostituire le emoji del sito. Uso: OSMI.svg('📊') → <svg class="osm-i">…</svg>
(() => {
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.3c2.1.7 3.5 2.8 3.5 5.7"/>',
    landmark: '<path d="M3 21h18M4.5 18h15"/><path d="M6.5 18v-7M10.2 18v-7M13.8 18v-7M17.5 18v-7"/><path d="M3 9 12 4l9 5Z"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3Z"/>',
    news: '<path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2Z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M7.5 9h6M7.5 12.5h6M7.5 16h4"/>',
    clipboard: '<path d="M9 3h6v3H9z"/><path d="M15 4.5h2.5A1.5 1.5 0 0 1 19 6v13.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V6a1.5 1.5 0 0 1 1.5-1.5H9"/><path d="M8.5 11h7M8.5 15h5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    userplus: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M19 8v6M16 11h6"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-4M12 16V6M17 16V9"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
    scale: '<path d="M12 4v16M8 20h8M5 7h14"/><path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0Z"/><path d="M19 7l-2.5 6a2.5 2.5 0 0 0 5 0Z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M10.8 7.2 6.2 16.8M13.2 7.2l4.6 9.6M7.5 19h9"/>',
    filetext: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6M9 9h2"/>',
    bookopen: '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5h-5A1.5 1.5 0 0 1 3 16Z"/><path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5h5A1.5 1.5 0 0 0 21 16Z"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5Z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z"/>',
    send: '<path d="M21 3 10 14"/><path d="M21 3l-7 18-4-7-7-4Z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2"/><path d="M3 12.5h18"/>',
    play: '<path d="M7 4.5v15l12.5-7.5Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
    cap: '<path d="M2 9.5 12 5l10 4.5-10 4.5Z"/><path d="M6 11.3V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.7"/><path d="M22 9.5v5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z"/>',
    camera: '<path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 5 0v-1a9 9 0 1 0-3.5 7.1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6Z"/><path d="m9 12 2 2 4-4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1Z"/><path d="M18.5 9a4 4 0 0 1 0 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    building: '<path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M14 10h5a1 1 0 0 1 1 1v10"/><path d="M2.5 21h19"/><path d="M7.5 8h3M7.5 12h3M7.5 16h3M17 14v.01M17 17.5v.01"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    monitor: '<rect x="2.5" y="4.5" width="19" height="13" rx="2"/><path d="M8 21h8M12 17.5V21"/><path d="m10.5 8.5 4 2.5-4 2.5Z"/>',
    flask: '<path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9.5V3"/><path d="M7 15h10"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    leaf: '<path d="M5 19C5 11 10 5 20 5c0 10-6 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
    coast: '<circle cx="12" cy="9" r="3.5"/><path d="M12 2.5V4M5.5 9H4M20 9h-1.5M7.4 4.4l1 1M16.6 4.4l-1 1"/><path d="M2.5 16c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2"/><path d="M2.5 20c1.6 0 1.6-1.2 3.2-1.2s1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bookmark: '<path d="M6 3.5h12V21l-6-4-6 4Z"/>',
    cycle: '<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M21 20v-5h-5"/>',
    zap: '<path d="M13 2.5 4 14h7l-1 7.5L19 10h-7Z"/>',
    factory: '<path d="M3 21V10l5 3v-3l5 3v-3l5 3V4h3v17Z"/><path d="M7 17h2M12 17h2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    library: '<path d="M5 4v16M9 4v16"/><path d="m13 4.5 4 15.5"/><path d="M3 20h18"/>',
    heart: '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10Z"/>',
    health: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M12 8v8M8 12h8"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>',
    ship: '<path d="M2.5 14h19l-2.5 5.5H5Z"/><path d="M6 14v-4h5v4M11 14V8h5v6"/><path d="M18.5 14v-2.5"/>',
    office: '<path d="M4 21V4h11v17"/><path d="M15 9h5v12"/><path d="M2.5 21h19"/><path d="M8 8h3M8 12h3M8 16h3"/>'
  };
  const MAP = {
    '🏠':'home','👥':'users','🏛':'landmark','🚀':'bulb','📰':'news','📋':'clipboard','📍':'pin','✨':'userplus',
    '📊':'chart','🔍':'search','⚖':'scale','🔒':'lock','🤝':'network','📜':'bookopen','📄':'filetext','📘':'book',
    '📬':'inbox','📧':'mail','📮':'send','💼':'briefcase','▶':'play','👤':'user','🎓':'cap','⭐':'star','📷':'camera','📸':'camera',
    '🐦':'at','🌐':'globe','🌍':'globe','🛡':'shield','📅':'calendar','📢':'megaphone','📣':'megaphone','🎤':'mic','🏙':'building',
    '🤖':'cpu','📺':'monitor','🔬':'flask','💻':'laptop','⚙':'sliders','🌿':'leaf','🌱':'leaf','🏖':'coast','🎯':'target','📌':'bookmark',
    '♻':'cycle','⚡':'zap','🏭':'factory','📈':'trend','📚':'library','👶':'heart','🏥':'health','👑':'award','🚢':'ship','👷':'briefcase','🏢':'office'
  };
  const svg = (k, extra='') => `<svg class="osm-i" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"${extra}>${P[k]}</svg>`;
  const OSMI = { P, MAP, svg, byEmoji: e => MAP[e.replace(/️/g,'')] ? svg(MAP[e.replace(/️/g,'')]) : null };
  if (typeof window !== 'undefined') window.OSMI = OSMI;
  if (typeof module !== 'undefined') module.exports = OSMI;
})();
