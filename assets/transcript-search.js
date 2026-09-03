(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TranscriptSearch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const stop = new Set('the and for that with this from have are was were will would could should into about your our their they them then than been being not but you all can may has had its his her she he we of to in on at by as is it or be do did does if so no yes what when where who how why which out up down over under more most some any each other there here also just very much many such only through because while during before after between within without across per via upon these those'.split(' '));
  const tokens = q => String(q || '').toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9']{3,}/g)?.filter(t => !stop.has(t) && !/^[0-9]+$/.test(t)) || [];
  const decodePostings = s => String(s || '').split('.').filter(Boolean).map(x => parseInt(x, 36)).filter(Number.isFinite);
  function searchIndex(index, q) {
    const ts = [...new Set(tokens(q))]; if (!ts.length) return [];
    const lists=[]; for(const t of ts){const p=decodePostings(index&&index.x&&index.x[t]);if(!p.length)return[];lists.push(p)}
    lists.sort((a,b)=>a.length-b.length); let ids=new Set(lists[0]);
    for(const list of lists.slice(1)){const s=new Set(list);ids=new Set([...ids].filter(i=>s.has(i)));if(!ids.size)break}
    return [...ids].map(i=>index.r[i]).filter(Boolean).sort((a,b)=>String(b[1]||'').localeCompare(String(a[1]||'')));
  }
  function formatTimestamp(seconds){
    const n=Math.max(0,Math.floor(Number(seconds)||0)),h=Math.floor(n/3600),m=Math.floor((n%3600)/60),s=n%60;
    return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;
  }
  function findMatches(segments,q){
    const wanted=[...new Set(tokens(q))]; if(!wanted.length||!Array.isArray(segments))return[];
    const hits=[];
    for(let i=0;i<segments.length;i++){
      const start=Number(segments[i]?.[0])||0,window=segments.slice(i,Math.min(segments.length,i+3));
      const text=window.map(s=>String(s?.[1]||'')).join(' ').trim(),hay=text.toLowerCase().replace(/[’‘]/g,"'");
      if(wanted.every(t=>hay.includes(t))){const before=i?String(segments[i-1]?.[1]||'')+' ':'';const after=i+3<segments.length?' '+String(segments[i+3]?.[1]||''):'';hits.push({start,excerpt:(before+text+after).trim()});i+=Math.max(0,window.length-1)}
    }
    return hits;
  }
  async function loadArchive(base='data/transcript-index') {
    const plain=await fetch(`${base}/RBBCSC_transcript_index.json`,{cache:'no-cache'});
    if(!plain.ok) throw new Error('Transcript index failed to load');
    const index=await plain.json(); if(!index||!Array.isArray(index.r)||!index.x) throw new Error('Transcript archive index is invalid'); return index;
  }
  async function loadTranscriptData(url='data/transcript-detail/RBBCSC_transcripts.json.gz'){
    const r=await fetch(url,{cache:'no-cache'}); if(!r.ok)throw new Error('Transcript detail data failed to load');
    if(typeof DecompressionStream!=='function')throw new Error('This browser cannot open compressed transcript detail data');
    const stream=r.body.pipeThrough(new DecompressionStream('gzip')); const text=await new Response(stream).text(); const data=JSON.parse(text);
    if(!Array.isArray(data))throw new Error('Transcript detail data is invalid'); return data;
  }
  const findMeeting=(data,catsId)=>Array.isArray(data)?data.find(r=>String(r?.[0])===String(catsId)):null;
  let detailPromise=null,lastQuery='';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function highlighted(text,q){let out=esc(text);for(const t of [...new Set(tokens(q))])out=out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')})`,'ig'),'<mark>$1</mark>');return out}
  async function enrichCards(){
    if(typeof document==='undefined')return;const query=document.getElementById('q')?.value?.trim()||'';if(!query)return;
    const cards=[...document.querySelectorAll('#results .card')].filter(c=>c.querySelector('a[href*="catstv.net/m.php?q="]')&&!c.dataset.transcriptEnriched);if(!cards.length)return;
    try{detailPromise=detailPromise||loadTranscriptData();const data=await detailPromise;if(query!==(document.getElementById('q')?.value?.trim()||''))return;
      for(const card of cards){const a=card.querySelector('a[href*="catstv.net/m.php?q="]'),id=new URL(a.href).searchParams.get('q'),row=findMeeting(data,id);if(!row)continue;const hits=findMatches(row[3],query);if(!hits.length)continue;const hit=hits[0],p=card.querySelector('.excerpt');if(p)p.innerHTML=highlighted(hit.excerpt,query);const info=document.createElement('p');info.style.fontWeight='900';info.textContent=`First transcript match: ${formatTimestamp(hit.start)}`;p?.after(info);const view=document.createElement('a');view.href=`transcript.html?id=${encodeURIComponent(id)}&q=${encodeURIComponent(query)}`;view.textContent='View Full Transcript ↗';view.style.marginRight='18px';a.before(view);card.dataset.transcriptEnriched='1'}
    }catch(e){}
  }
  function installEnricher(){if(typeof document==='undefined')return;const start=()=>{const r=document.getElementById('results');if(!r)return;new MutationObserver(()=>setTimeout(enrichCards,0)).observe(r,{childList:true});document.getElementById('go')?.addEventListener('click',()=>setTimeout(enrichCards,100));setTimeout(enrichCards,100)};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start()}
  installEnricher();
  return {tokens,decodePostings,searchIndex,formatTimestamp,findMatches,loadArchive,loadTranscriptData,findMeeting};
});
