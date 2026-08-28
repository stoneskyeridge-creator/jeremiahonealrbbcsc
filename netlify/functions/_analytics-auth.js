'use strict';
const crypto=require('crypto');const COOKIE='campaign_analytics_admin';
const b64=x=>Buffer.from(x).toString('base64url');const sig=(x,s)=>crypto.createHmac('sha256',s).update(x).digest('base64url');
function env(){const password=process.env.ANALYTICS_ADMIN_PASSWORD,secret=process.env.ANALYTICS_SESSION_SECRET;if(!password||!secret)throw new Error('analytics auth not configured');return{password,secret}}
function safeEqual(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function issue(){const {secret}=env(),payload=b64(JSON.stringify({exp:Date.now()+12*3600e3}));return `${payload}.${sig(payload,secret)}`}
function verify(token){try{const {secret}=env(),[p,s]=String(token||'').split('.');if(!p||!s||!safeEqual(sig(p,secret),s))return false;return JSON.parse(Buffer.from(p,'base64url')).exp>Date.now()}catch{return false}}
function cookie(req){const h=req.headers||{};const raw=h.cookie||h.Cookie||'';return raw.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)}
function requireAdmin(req){return verify(cookie(req))}
module.exports={COOKIE,env,safeEqual,issue,verify,requireAdmin};