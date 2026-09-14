'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {confirmationFor}=require('../assets/form-success.js');

test('all six Netlify forms have a success confirmation',()=>{
  for(const name of ['campaign-volunteer','campaign-sign-request','student-safeguards-support','staff-feedback','campaign-contact','sepac-interest']){
    const msg=confirmationFor(name);
    assert.ok(msg&&msg.title&&msg.body,`${name} needs a confirmation`);
  }
});

test('unknown forms receive a safe generic confirmation',()=>{
  const msg=confirmationFor('other-form');
  assert.match(msg.title,/thank you/i);
  assert.match(msg.body,/submitted/i);
});
