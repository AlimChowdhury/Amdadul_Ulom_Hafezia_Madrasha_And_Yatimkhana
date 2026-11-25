// Tabs (row 1 = headings):
// Students: id|pin|name|class|roll|phone      Teachers: id|pin|name|designation|phone
// Assignments: teacher_id|class|subject   (one row per class+subject a teacher teaches)
// Fees: id|head|amount|paid|note|receipt|paid_date   Results: id|exam|subject|full|marks|grade|entered_by|entered_at
// Progress: id|item|done|total|note   Attendance: id|month|present|total|entered_by|entered_at
// AuditLog and Applications are created automatically. After editing: Deploy -> Manage deployments -> Edit -> New version.
const SS=()=>SpreadsheetApp.getActive();
function tab(n){const sh=SS().getSheetByName(n);return sh?sh.getDataRange().getDisplayValues().slice(1).filter(r=>r[0]!==''):[]}
function objs(n){const sh=SS().getSheetByName(n);if(!sh)return[];const v=sh.getDataRange().getDisplayValues(),h=v[0].map(x=>String(x).trim().toLowerCase());
  return v.slice(1).filter(r=>r[0]!=='').map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]);return o})}
function ranks(S,R){const c={},t={};S.forEach(s=>c[String(s[0])]=s[3]);
  R.forEach(r=>{const k=c[String(r[0])]+'|'+r[1],o=t[k]=t[k]||{};o[r[0]]=(o[r[0]]||0)+(+r[4]||0)});return{c:c,t:t}}
function pack(s,D,rk){const id=String(s[0]),pos={},mine=a=>a.filter(r=>String(r[0])===id);
  mine(D.R).forEach(r=>{const o=rk.t[rk.c[id]+'|'+r[1]],m=o[id];pos[r[1]]=[1+Object.keys(o).filter(k=>o[k]>m).length,Object.keys(o).length]});
  return{id:id,name:s[2],class:s[3],roll:s[4],phone:s[5]||'',pos:pos,fees:mine(D.F).map(r=>r.slice(1,7)),
    results:mine(D.R).map(r=>r.slice(1,6)),progress:mine(D.P).map(r=>r.slice(1,5)),att:mine(D.A).map(r=>r.slice(1,4))}}
function upsert(name,keys,ids,rows,make){const sh=SS().getSheetByName(name)||SS().insertSheet(name),data=sh.getDataRange().getDisplayValues();let n=0;
  String(rows||'').split(';').forEach(x=>{const a=x.split(':'),i=a[0],v=a[1];if(ids.indexOf(i)<0||v===undefined||v===''||isNaN(+v))return;
    const row=make(i,v);let at=-1;
    for(let r=1;r<data.length;r++)if(String(data[r][0])===i&&keys.every(k=>String(data[r][k[0]])===String(k[1]))){at=r;break}
    if(at<0){sh.appendRow(row);data.push(row)}else{sh.getRange(at+1,1,1,row.length).setValues([row]);data[at]=row}
    n++});return{ok:true,saved:n}}
function audit(who,action,details){const ss=SS();let sh=ss.getSheetByName('AuditLog');
  if(!sh){sh=ss.insertSheet('AuditLog');sh.appendRow(['time','role','user_id','name','action','details'])}
  sh.appendRow([new Date(),who.role,who.id,who.name,action,details])}
// Caller must already have checked permission. Saves marks or attendance for one class and records who did it.
function save(p,who,S){const mk=p.action.indexOf('Marks')>0,cls=String(p.class||'').trim(),c=v=>String(v||'').slice(0,60),
  ids=S.filter(s=>String(s[3]).trim()===cls).map(s=>String(s[0])),
  by=who.role+': '+who.name+' ('+who.id+')',now=Utilities.formatDate(new Date(),'Asia/Dhaka','yyyy-MM-dd HH:mm');
  const r=mk?upsert('Results',[[1,c(p.exam)],[2,c(p.subject)]],ids,p.rows,(i,v)=>[i,c(p.exam),c(p.subject),c(p.full),v,'',by,now])
            :upsert('Attendance',[[1,c(p.month)]],ids,p.rows,(i,v)=>[i,c(p.month),v,c(p.total),by,now]);
  audit(who,mk?'marks':'attendance',cls+' | '+(mk?c(p.exam)+' / '+c(p.subject):c(p.month))+' | '+r.saved+' rows');return r}
function doGet(e){const p=e.parameter,act=p.action||'';
  if(act==='apply'){const ss=SS();let sh=ss.getSheetByName('Applications');
    if(!sh){sh=ss.insertSheet('Applications');sh.appendRow(['time','name','father','mother','dob','class','phone','address','note'])}
    if(!p.name||!p.phone)return out({ok:false});
    sh.appendRow([new Date()].concat(['name','father','mother','dob','cls','phone','addr','note'].map(k=>(k==='phone'?"'":'')+String(p[k]||'').slice(0,300))));
    return out({ok:true})}
  const S=tab('Students'),D={F:tab('Fees'),R:tab('Results'),P:tab('Progress'),A:tab('Attendance')},rk=ranks(S,D.R);
  const key=PropertiesService.getScriptProperties().getProperty('ADMIN_KEY'),isAdmin=!!key&&p.key===key;
  if(act==='admin')return out(isAdmin?{ok:true,students:S.map(s=>pack(s,D,rk))}:{ok:false});
  if(act==='adminSaveMarks'||act==='adminSaveAtt')return out(isAdmin?save(p,{role:'Admin',id:'admin',name:'Admin'},S):{ok:false});
  if(act==='teacher'||act==='saveMarks'||act==='saveAtt'){
    const T=objs('Teachers').find(r=>String(r.id).trim()===String(p.id||'').trim()&&String(r.pin).trim()===String(p.pin||'').trim());
    if(!T)return out({ok:false});
    const asg=objs('Assignments').filter(a=>String(a.teacher_id).trim()===String(T.id).trim()).map(a=>[String(a['class']).trim(),String(a.subject).trim()]),cl=asg.map(a=>a[0]);
    if(act==='teacher')return out({ok:true,teacher:{id:T.id,name:T.name,desig:T.designation||'',phone:T.phone||''},assign:asg,
      students:S.filter(s=>cl.indexOf(String(s[3]).trim())>=0).map(s=>pack(s,D,rk))});
    const c=String(p['class']||'').trim(),ok=act==='saveMarks'?asg.some(a=>a[0]===c&&a[1]===String(p.subject||'').trim()):cl.indexOf(c)>=0;
    return out(ok?save(p,{role:'Teacher',id:T.id,name:T.name},S):{ok:false})}
  const s=S.find(r=>String(r[0])===String(p.id||'').trim()&&String(r[1])===String(p.pin||'').trim());
  return out(s?Object.assign({ok:true},pack(s,D,rk)):{ok:false})}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
