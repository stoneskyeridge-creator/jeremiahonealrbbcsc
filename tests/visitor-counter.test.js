const fs = require('fs');
const edge = fs.readFileSync('netlify/edge-functions/home-enhancements.js','utf8');
const fn = fs.readFileSync('netlify/functions/site-visits.mjs','utf8');
if (!edge.includes('id="site-visit-counter"')) throw new Error('visitor counter display missing');
if (!edge.includes('/.netlify/functions/site-visits')) throw new Error('visitor counter function call missing');
if (!edge.includes('Website Visits')) throw new Error('visitor counter label missing');
if (!fn.includes("getStore('campaign-site-stats')")) throw new Error('persistent Netlify store missing');
if (!fn.includes("key = 'homepage-visits'")) throw new Error('homepage counter key missing');
console.log('visitor counter wiring present');
