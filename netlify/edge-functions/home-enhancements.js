export default async (request, context) => {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  let html = await response.text();

  const socialMeta = `<meta name="description" content="Jeremiah O'Neal for RBBCSC School Board — Bean Blossom District. Write-In Candidate. Listen First. Speak Last.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Jeremiah O'Neal for RBBCSC School Board">
<meta property="og:title" content="Jeremiah O'Neal for RBBCSC School Board">
<meta property="og:description" content="Write-In Candidate • Bean Blossom District • Listen First. Speak Last.">
<meta property="og:url" content="https://jeremiahonealrbbcsc.netlify.app/">
<meta property="og:image" content="https://jeremiahonealrbbcsc.netlify.app/assets/jeremiah-oneal-portrait.jpeg">
<meta property="og:image:secure_url" content="https://jeremiahonealrbbcsc.netlify.app/assets/jeremiah-oneal-portrait.jpeg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="Jeremiah O'Neal for RBBCSC School Board">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Jeremiah O'Neal for RBBCSC School Board">
<meta name="twitter:description" content="Write-In Candidate • Bean Blossom District • Listen First. Speak Last.">
<meta name="twitter:image" content="https://jeremiahonealrbbcsc.netlify.app/assets/jeremiah-oneal-portrait.jpeg">`;

  if (!html.includes('property="og:title"')) {
    html = html.replace('</head>', socialMeta + '</head>');
  }

  const news = `<section id="innovation-news" style="background:#fff;padding:38px 0 10px"><div class="wrap"><a href="innovation-watch.html" style="display:block;text-decoration:none;color:inherit"><div style="border:2px solid #d6a72a;border-radius:17px;padding:22px;background:#fbf6e9;box-shadow:0 8px 22px rgba(28,26,23,.08)"><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div aria-hidden="true" style="font-size:64px;line-height:1">📰</div><div style="flex:1;min-width:240px"><div class="ey">INNOVATION & NEWS • NEWEST ARTICLE</div><h2 style="margin:5px 0 8px;font-size:clamp(1.55rem,3vw,2.25rem)">Yale research: Can socially assistive robots help children with autism engage and communicate?</h2><p style="margin:0;color:#625d53">Research, emerging technology and school ideas worth watching. See the newest story, then browse the full article list.</p><span class="btn gold" style="margin-top:14px">VIEW INNOVATION & NEWS →</span></div></div></div></a></div></section>`;

  if (!html.includes('id="innovation-news"')) {
    html = html.replace('<section id="support"', news + '<section id="support"');
  }

  const counter = `<div id="site-visit-counter" style="margin-top:12px;font-size:.84rem;color:#aaa">Website visits: <strong id="site-visit-count">—</strong></div><script>(function(){var k='jo_visit_counted';var shouldCount=!sessionStorage.getItem(k);fetch('/.netlify/functions/site-visits?count='+(shouldCount?'1':'0'),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){if(typeof d.count==='number'){document.getElementById('site-visit-count').textContent=d.count.toLocaleString();if(shouldCount)sessionStorage.setItem(k,'1')}}).catch(function(){var e=document.getElementById('site-visit-counter');if(e)e.style.display='none'})})();</script>`;

  if (!html.includes('id="site-visit-counter"')) {
    html = html.replace('</footer>', counter + '</footer>');
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/' };