'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {confirmationFor,celebrationConfig}=require('../assets/form-success.js');

test('all Netlify forms have a success confirmation',()=>{
  for(const name of ['campaign-volunteer','campaign-sign-request','student-safeguards-support','staff-feedback','campaign-contact','sepac-interest','neurodiversity-advisory-interest']){
    const msg=confirmationFor(name);
    assert.ok(msg&&msg.title&&msg.body,`${name} needs a confirmation`);
  }
});

test('neurodiversity advisory form has a specific confirmation',()=>{
  const msg=confirmationFor('neurodiversity-advisory-interest');
  assert.match(msg.title,/thank you/i);
  assert.match(msg.body,/neurodiversity|advisory/i);
});

test('unknown forms receive a safe generic confirmation',()=>{
  const msg=confirmationFor('other-form');
  assert.match(msg.title,/thank you/i);
  assert.match(msg.body,/submitted/i);
});

test('success celebration is a seven-second full-screen chicken takeover',()=>{
  assert.equal(celebrationConfig.duration,7000);
  assert.ok(celebrationConfig.pieces>=250);
  assert.match(celebrationConfig.stageImage,/chicken-stage/i);
  assert.equal(celebrationConfig.fullScreen,true);
});
