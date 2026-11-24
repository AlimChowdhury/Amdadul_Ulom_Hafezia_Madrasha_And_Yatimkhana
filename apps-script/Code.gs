// Google Sheet tabs: Students (id|pin|name|class|roll|phone)  Fees (id|head|amount|paid|note|receipt|paid_date)
// Results (id|exam|subject|full|marks|grade)  Progress (id|item|done|total|note)  Attendance (id|month|present|total)
// "Applications" is created automatically. After editing: Deploy -> Manage deployments -> Edit -> New version.
function tab(n){const sh=SpreadsheetApp.getActive().getSheetByName(n);return sh?sh.getDataRange().getDisplayValues().slice(1).filter(r=>r[0]!==''):[]}
function ranks(S,R){const c={},t={};S.forEach(s=>c[String(s[0])]=s[3]);
  R.forEach(r=>{const k=c[String(r[0])]+'|'+r[1],o=t[k]=t[k]||{};o[r[0]]=(o[r[0]]||0)+(+r[4]||0)});return{c:c,t:t}}
function pack(s,D,rk){const id=String(s[0]),pos={},mine=a=>a.filter(r=>String(r[0])===id);
  mine(D.R).forEach(r=>{const o=rk.t[rk.c[id]+'|'+r[1]],m=o[id];pos[r[1]]=[1+Object.keys(o).filter(k=>o[k]>m).length,Object.keys(o).length]});
  return{id:id,name:s[2],class:s[3],roll:s[4],phone:s[5]||'',pos:pos,fees:mine(D.F).map(r=>r.slice(1,7)),
    results:mine(D.R).map(r=>r.slice(1,6)),progress:mine(D.P).map(r=>r.slice(1,5)),att:mine(D.A).map(r=>r.slice(1,4))}}
function doGet(e){const p=e.parameter;
  if(p.action==='apply'){const ss=SpreadsheetApp.getActive();let sh=ss.getSheetByName('Applications');
    if(!sh){sh=ss.insertSheet('Applications');sh.appendRow(['time','name','father','mother','dob','class','phone','address','note'])}
    if(!p.name||!p.phone)return out({ok:false});
    sh.appendRow([new Date()].concat(['name','father','mother','dob','cls','phone','addr','note'].map(k=>(k==='phone'?"'":'')+String(p[k]||'').slice(0,300))));
    return out({ok:true})}
  const S=tab('Students'),D={F:tab('Fees'),R:tab('Results'),P:tab('Progress'),A:tab('Attendance')},rk=ranks(S,D.R);
  if(p.action==='admin'){const key=PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
    if(!key||p.key!==key)return out({ok:false});return out({ok:true,students:S.map(s=>pack(s,D,rk))})}
  const s=S.find(r=>String(r[0])===String(p.id||'').trim()&&String(r[1])===String(p.pin||'').trim());
  return out(s?Object.assign({ok:true},pack(s,D,rk)):{ok:false})}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
