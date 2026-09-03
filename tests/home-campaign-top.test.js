const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('scripts/add-home-archive-search.js','utf8');
assert(src.includes('tel:+18127275679'), 'top ribbon should include clickable campaign phone');
assert(src.includes('Call/Text (812) 727-5679'), 'top ribbon should display campaign phone');
assert(src.includes('href="#sign-request"'), 'top ribbon should link to sign request');
assert(src.includes('href="#volunteer"'), 'top ribbon should link to volunteer form');
assert(src.includes('padding:7px 0 6px'), 'search block should use compact vertical padding');
console.log('campaign top ribbon checks passed');
