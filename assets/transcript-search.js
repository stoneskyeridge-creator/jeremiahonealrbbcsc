(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TranscriptSearch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const stop = new Set('the and for that with this from have are was were will would could should into about your our their they them then than been being not but you all can may has had its his her she he we of to in on at by as is it or be do did does if so no yes what when where who how why which out up down over under more most some any each other there here also just very much many such only through because while during before after between within without across per via upon these those'.split(' '));

  const tokens = q => String(q || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .match(/[a-z0-9']{3,}/g)
    ?.filter(t => !stop.has(t) && !/^[0-9]+$/.test(t)) || [];

  const decodePostings = s => String(s || '')
    .split('.')
    .filter(Boolean)
    .map(x => parseInt(x, 36))
    .filter(Number.isFinite);

  function searchIndex(index, q) {
    const ts = [...new Set(tokens(q))];
    if (!ts.length) return [];
    const lists = [];
    for (const t of ts) {
      const p = decodePostings(index && index.x && index.x[t]);
      if (!p.length) return [];
      lists.push(p);
    }
    lists.sort((a, b) => a.length - b.length);
    let ids = new Set(lists[0]);
    for (const list of lists.slice(1)) {
      const s = new Set(list);
      ids = new Set([...ids].filter(i => s.has(i)));
      if (!ids.size) break;
    }
    return [...ids]
      .map(i => index.r[i])
      .filter(Boolean)
      .sort((a, b) => String(b[1] || '').localeCompare(String(a[1] || '')));
  }

  async function loadArchive(base = 'data/transcript-index') {
    const plain = await fetch(`${base}/index.json`, { cache: 'no-cache' });
    if (!plain.ok) throw new Error('Transcript index failed to load');
    const index = await plain.json();
    if (!index || !Array.isArray(index.r) || !index.x) {
      throw new Error('Transcript archive index is invalid');
    }
    return index;
  }

  return { tokens, decodePostings, searchIndex, loadArchive };
});
