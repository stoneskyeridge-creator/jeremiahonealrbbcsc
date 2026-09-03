const test=require('node:test');
const assert=require('node:assert/strict');
const T=require('../assets/transcript-search.js');

test('findMatches returns the first matching timestamp and excerpt',()=>{
  const segs=[[82.51,'My name is Nicole'],[89.43,'Journeys is a self-contained special education classroom'],[92.63,'serving students with high support needs']];
  const hits=T.findMatches(segs,'special education');
  assert.equal(hits[0].start,89.43);
  assert.match(hits[0].excerpt,/special education/i);
});

test('formatTimestamp formats seconds',()=>{
  assert.equal(T.formatTimestamp(89.43),'1:29');
  assert.equal(T.formatTimestamp(3723),'1:02:03');
});
