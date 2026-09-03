const fs=require('fs');
const path='index.html';
let html=fs.readFileSync(path,'utf8');
const css='.archiveSearchTop{background:#fff3cd;padding:24px 0;border-bottom:3px solid #d6a72a}.archiveSearchTop form{display:flex;gap:10px}.archiveSearchTop input{flex:1;padding:14px;border:2px solid #1c1a17;border-radius:10px;font:inherit}.liveDot{display:inline-block;width:11px;height:11px;border-radius:50%;background:#c00;margin-right:8px;animation:pulse 1.1s infinite}@keyframes pulse{50%{opacity:.2}}@media(max-width:600px){.archiveSearchTop form{display:grid}}';
const block='<section class="archiveSearchTop" aria-label="RBBCSC meeting archive search"><div class="wrap"><div class="ey"><span class="liveDot"></span>SEARCH THE PUBLIC RECORD</div><h2>Search 214 Complete Meeting Transcripts</h2><p class="lead">Search meeting transcripts and official public records by topic, name or phrase.</p><form action="board-search.html" method="get"><input name="q" type="search" placeholder="Try: special education, Journeys, a name…" aria-label="Search RBBCSC meeting archive"><button class="btn gold" type="submit">SEARCH MEETINGS</button></form><p class="small">Automatically generated audio transcripts may contain errors. Verify important statements against the original recording.</p></div></section>';
if(!html.includes('.archiveSearchTop{')) html=html.replace('</style>',css+'</style>');
if(!html.includes('aria-label="RBBCSC meeting archive search"')) html=html.replace('<main id="top">','<main id="top">'+block);
fs.writeFileSync(path,html);
// Idempotent: safe to run on every archive refresh.
