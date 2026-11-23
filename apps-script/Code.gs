// Paste into the Google Sheet: Extensions -> Apps Script. Then Deploy -> New deployment -> Web app
// (Execute as: Me, Who has access: Anyone). Set the admin key in Project Settings -> Script properties: ADMIN_KEY.
// Tabs: Students (id|pin|name|class|roll)  Fees (id|head|amount|paid|note)  Results (id|exam|subject|full|marks|grade)
function tab(n){return SpreadsheetApp.getActive().getSheetByName(n).getDataRange().getDisplayValues().slice(1).filter(r=>r[0]!=='')}
function pack(s,F,R){const id=String(s[0]);return{id:id,name:s[2],class:s[3],roll:s[4],
  fees:F.filter(r=>String(r[0])===id).map(r=>r.slice(1,5)),
  results:R.filter(r=>String(r[0])===id).map(r=>r.slice(1,6))}}
function doGet(e){const p=e.parameter,S=tab('Students'),F=tab('Fees'),R=tab('Results');
  if(p.action==='admin'){
    const key=PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
    if(!key||p.key!==key)return out({ok:false});
    return out({ok:true,students:S.map(s=>pack(s,F,R))});}
  const s=S.find(r=>String(r[0])===String(p.id||'').trim()&&String(r[1])===String(p.pin||'').trim());
  return out(s?Object.assign({ok:true},pack(s,F,R)):{ok:false});}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
