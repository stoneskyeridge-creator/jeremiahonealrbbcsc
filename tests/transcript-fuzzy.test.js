const assert=require('assert');
const T=require('../assets/transcript-search.js');

assert(T.fuzzyTokenMatch("o'neal", 'oneal'));
assert(T.fuzzyTokenMatch("o'neal", 'oneil'));
assert(T.fuzzyTokenMatch('fischman', 'fishman'));
assert(!T.fuzzyTokenMatch('board', 'boredom'));

const index={r:[[1,'2026-08-18','Meeting']],x:{oneil:'0'}};
const hits=T.searchIndex(index,"O'Neal");
assert.equal(hits.length,1);
assert.equal(hits[0][0],1);
console.log('transcript fuzzy matching checks passed');
