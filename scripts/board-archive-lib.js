const { URL } = require('node:url');

function decodeHtml(s='') { return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>'); }
function stripTags(s='') { return decodeHtml(String(s).replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()); }
function absoluteUrl(href, base) { try { return new URL(decodeHtml(href), base).toString(); } catch { return null; } }
function isoDateFromText(text='') {
  const m = text.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](20\d{2})\b/); if (m) return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  const months={january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
  const h=text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(20\d{2})\b/i);
  return h?`${h[3]}-${months[h[1].toLowerCase()]}-${h[2].padStart(2,'0')}`:null;
}
function attr(tag,name){const m=String(tag).match(new RegExp(`${name}=["']([^"']*)["']`,'i'));return m?decodeHtml(m[1]):null;}
function parseCatsArchive(html, base='https://catstv.net/') {
  const out=[]; const rows=String(html).match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  for(const row of rows){ const text=stripTags(row); if(!/Richland[- ]Bean Blossom School Board/i.test(text)) continue; const anchor=(row.match(/<a\b[^>]*data-permalink=["'][^"']+["'][^>]*>/i)||[])[0]; if(!anchor)continue; const url=absoluteUrl(attr(anchor,'data-permalink'),base); const id=(String(url).match(/[?&]q=(\d+)/)||[])[1]; if(!id)continue; const vtt=attr(anchor,'data-vtt'); const dateText=attr(anchor,'data-date')||text; const title=attr(anchor,'data-name')||(text.match(/Richland[- ]Bean Blossom School Board.*?(?=(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),|$)/i)||[text])[0].trim(); out.push({id:`cats-${id}`,title,meetingDate:isoDateFromText(dateText),sourceUrl:url,captionUrl:vtt?absoluteUrl(vtt.startsWith('http')?vtt:`https://catstv.blob.core.windows.net/videoarchive/${vtt}`,base):null,videoFile:attr(anchor,'data-m4v')||null}); }
  const seen=new Set(); return out.filter(x=>!seen.has(x.id)&&(seen.add(x.id),true));
}
function parseCaptionLinks(html, base) {
  const links=[]; const re=/(?:src|href)=["']([^"']+\.(?:vtt|txt)(?:\?[^"']*)?)["']/gi; let m; while((m=re.exec(String(html)))){const u=absoluteUrl(m[1],base); if(u&&!links.includes(u))links.push(u);} return links;
}
function parseVtt(vtt='') {
  const chunks=String(vtt).replace(/^\uFEFF/,'').split(/\r?\n\r?\n+/); const out=[];
  for(const chunk of chunks){ const lines=chunk.split(/\r?\n/).filter(Boolean); const ti=lines.findIndex(x=>/\d{2}:\d{2}(?::\d{2})?[.,]\d{3}\s+-->/.test(x)); if(ti<0) continue; const ts=lines[ti].split('-->')[0].trim().replace(',','.'); const parts=ts.split(':').map(Number); const seconds=parts.length===3?parts[0]*3600+parts[1]*60+parts[2]:parts[0]*60+parts[1]; const text=stripTags(lines.slice(ti+1).join(' ')).replace(/\s+/g,' ').trim(); if(text) out.push({timestampSeconds:Math.floor(seconds),timestampLabel:formatTime(Math.floor(seconds)),text}); }
  return out;
}
function formatTime(s){s=Math.max(0,Number(s)||0);const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=Math.floor(s%60);return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`;}
function classifyOfficial(label='',url=''){const s=`${label} ${url}`.toLowerCase(); if(s.includes('minute'))return'minutes'; if(s.includes('agenda'))return'agenda'; if(s.includes('budget')||s.includes('capital project')||s.includes('bus replacement'))return'budget'; return'other';}
function parseBoardLinks(html, base='https://rbbschools.net/school-board/') {
  const out=[]; const re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(String(html)))){const label=stripTags(m[2]); if(!/(agenda|minutes?|budget|public hearing|notice|capital projects?|bus replacement)/i.test(label))continue; const url=absoluteUrl(m[1],base); if(!url)continue; const context=stripTags(String(html).slice(Math.max(0,m.index-450),Math.min(String(html).length,re.lastIndex+100))); const date=isoDateFromText(context); out.push({label,sourceUrl:url,sourceType:classifyOfficial(label,url),meetingDate:date});}
  return out;
}
module.exports={decodeHtml,stripTags,absoluteUrl,isoDateFromText,parseCatsArchive,parseCaptionLinks,parseVtt,formatTime,classifyOfficial,parseBoardLinks};
