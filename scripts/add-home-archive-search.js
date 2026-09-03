const fs=require('fs');
const path='index.html';
let html=fs.readFileSync(path,'utf8');

const top='<div class="top"><span>WRITE-IN CANDIDATE • RBBCSC SCHOOL BOARD • NOVEMBER 3, 2026</span><span class="topActions"><a href="tel:+18127275679">📞 Call/Text (812) 727-5679</a><a href="#sign-request">🪧 Request a Sign</a><a href="#volunteer">🤝 Get Involved</a></span></div>';
html=html.replace(/<div class="top">[\s\S]*?<\/div>(?=<header class="nav">)/,top);
html=html.replace(/<div class="helpRibbon">[\s\S]*?<\/div><\/div>/,'');

const css='<style id="campaign-top-compact">.top{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;padding:6px 12px;font-size:10px}.topActions{display:flex;align-items:center;justify-content:center;gap:15px;flex-wrap:wrap}.topActions a{color:#111;font-weight:950;text-decoration:underline;text-underline-offset:2px;white-space:nowrap}.archiveSearchTop{padding:5px 0 4px!important}.archiveSearchTop h2{font-size:clamp(1.05rem,2vw,1.48rem)!important;margin:0 0 1px!important;line-height:1.05!important}.archiveSearchTop .ey{font-size:.6rem!important;margin:0!important;line-height:1!important}.archiveSearchTop .lead{margin:0 0 2px!important;font-size:.7rem!important;line-height:1.1!important}.archiveSearchTop form{gap:6px!important}.archiveSearchTop input{padding:4px 8px!important;min-height:28px!important;font-size:.74rem!important}.archiveSearchTop .btn{min-height:28px!important;padding:4px 11px!important;font-size:.7rem!important}.archiveSearchTop .transcriptOption{margin:2px 0 0!important;font-size:.66rem!important;line-height:1!important}.archiveSearchTop .recordNotice{margin:2px 0 0!important;font-size:.58rem!important;line-height:1.08!important}.archiveSearchTop .small{margin:1px 0 0!important;font-size:.56rem!important;line-height:1.05!important}@media(max-width:600px){.top{gap:4px;padding:5px 6px}.top>span:first-child{width:100%;font-size:9px}.topActions{width:100%;gap:9px;font-size:9px}.archiveSearchTop{padding:3px 0!important}.archiveSearchTop .lead,.archiveSearchTop .small{display:none!important}.archiveSearchTop .recordNotice{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}</style>';
html=html.replace(/<style id="campaign-top-compact">[\s\S]*?<\/style>/,'');
html=html.replace('</head>',css+'</head>');

fs.writeFileSync(path,html);
