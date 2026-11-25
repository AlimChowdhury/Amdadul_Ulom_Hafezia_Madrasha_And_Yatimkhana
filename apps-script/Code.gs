// Tabs: Students (id|pin|name|class|roll|phone)  Teachers (id|pin|name|designation|class|phone|subject)
// Fees (id|head|amount|paid|note|receipt|paid_date)  Results (id|exam|subject|full|marks|grade)
// Progress (id|item|done|total|note)  Attendance (id|month|present|total).  "Applications" is created automatically.
// A teacher's "class" must match the Students "class" text exactly. After editing: Deploy -> Manage deployments -> Edit -> New version.
const SS=()=>SpreadsheetApp.getActive();
function tab(n){const sh=SS().getSheetByName(n);return sh?sh.getDataRange().getDisplayValues().slice(1).filter(r=>r[0]!==''):[]}
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
function doGet(e){const p=e.parameter;
  if(p.action==='apply'){const ss=SS();let sh=ss.getSheetByName('Applications');
    if(!sh){sh=ss.insertSheet('Applications');sh.appendRow(['time','name','father','mother','dob','class','phone','address','note'])}
    if(!p.name||!p.phone)return out({ok:false});
    sh.appendRow([new Date()].concat(['name','father','mother','dob','cls','phone','addr','note'].map(k=>(k==='phone'?"'":'')+String(p[k]||'').slice(0,300))));
    return out({ok:true})}
  const S=tab('Students'),D={F:tab('Fees'),R:tab('Results'),P:tab('Progress'),A:tab('Attendance')},rk=ranks(S,D.R);
  if(p.action==='admin'){const key=PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
    if(!key||p.key!==key)return out({ok:false});return out({ok:true,students:S.map(s=>pack(s,D,rk))})}
  if(p.action==='teacher'||p.action==='saveMarks'||p.action==='saveAtt'){
    const T=tab('Teachers').find(r=>String(r[0])===String(p.id||'').trim()&&String(r[1])===String(p.pin||'').trim());
    if(!T)return out({ok:false});
    const mine=S.filter(s=>String(s[3])===String(T[4])),ids=mine.map(s=>String(s[0])),c=v=>String(v||'').slice(0,60);
    if(p.action==='saveMarks')return out(upsert('Results',[[1,c(p.exam)],[2,c(p.subject)]],ids,p.rows,(i,v)=>[i,c(p.exam),c(p.subject),c(p.full),v,'']));
    if(p.action==='saveAtt')return out(upsert('Attendance',[[1,c(p.month)]],ids,p.rows,(i,v)=>[i,c(p.month),v,c(p.total)]));
    return out({ok:true,teacher:{id:T[0],name:T[2],desig:T[3],class:T[4],phone:T[5]||'',subject:T[6]||''},students:mine.map(s=>pack(s,D,rk))})}
  const s=S.find(r=>String(r[0])===String(p.id||'').trim()&&String(r[1])===String(p.pin||'').trim());
  return out(s?Object.assign({ok:true},pack(s,D,rk)):{ok:false})}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
