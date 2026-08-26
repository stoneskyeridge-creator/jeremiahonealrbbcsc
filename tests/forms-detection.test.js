const fs=require('fs');
const checks=[
 ['index.html','sepac-interest'],
 ['index.html','campaign-contact'],
 ['staff.html','staff-feedback'],
 ['student-safeguards.html','student-safeguards-support']
];
for(const [file,name] of checks){
 const html=fs.readFileSync(file,'utf8');
 if(!html.includes(`name="${name}"`)) throw new Error(`${name} form missing`);
 if(!html.includes('data-netlify="true"')) throw new Error(`${file} missing Netlify detection`);
 if(!html.includes(`name="form-name" value="${name}"`)) throw new Error(`${name} hidden form-name missing`);
}
if(!fs.existsSync('forms.html')) throw new Error('static forms detection page missing');
const detector=fs.readFileSync('forms.html','utf8');
for(const [,name] of checks){ if(!detector.includes(`name="${name}"`)) throw new Error(`${name} missing from static detector`); }
console.log('all campaign forms have separate Netlify detection');
