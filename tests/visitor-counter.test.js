const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
if (!html.includes('id="websiteVisits"')) throw new Error('visitor counter display missing');
if (!html.includes('countapi.mileshilliard.com/api/v1/hit/jeremiahonealrbbcsc-site-visits')) throw new Error('persistent counter endpoint missing');
if (!html.includes('Website Visits')) throw new Error('visitor counter label missing');
console.log('visitor counter markup present');
