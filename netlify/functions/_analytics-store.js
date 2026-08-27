'use strict';
const {getStore}=require('@netlify/blobs');
const STORE='private-campaign-analytics';
function store(){return getStore(STORE)}
async function appendEvent(event){const now=new Date();const id=`events/${now.toISOString().slice(0,10)}/${now.getTime()}-${Math.random().toString(36).slice(2)}.json`;await store().setJSON(id,event);await store().setJSON('status/last-event.json',{at:now.toISOString()});return id}
async function listEvents(){const s=store(),out=[];let cursor;do{const page=await s.list({prefix:'events/',cursor});for(const b of page.blobs||[]){const e=await s.get(b.key,{type:'json'});if(e)out.push({key:b.key,...e})}cursor=page.cursor}while(cursor);return out}
async function health(){try{const x=await store().get('status/last-event.json',{type:'json'});return{storage:true,lastEvent:x?.at||null}}catch{return{storage:false,lastEvent:null}}}
module.exports={appendEvent,listEvents,health,STORE};