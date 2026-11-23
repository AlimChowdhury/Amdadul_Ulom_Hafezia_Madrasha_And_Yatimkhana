// Student portal: fee statement, result sheet, and admin bulk print.
// Talks to the Google Apps Script web app whose URL is DATA.site.api (see PORTAL-README.md).
(()=>{
const S=DATA.site,MODE=document.body.dataset.mode,$=id=>document.getElementById(id),app=$('app');
let lang=localStorage.getItem('lang')||'bn',ST=null,ALL=null;
const T={id:['Student ID','স্টুডেন্ট আইডি'],pin:['PIN','পিন'],key:['Admin key','অ্যাডমিন কী'],view:['View','দেখুন'],print:['Download PDF','পিডিএফ ডাউনলোড'],err:['Wrong ID/PIN, or no connection.','আইডি/পিন ভুল, অথবা ইন্টারনেট সংযোগ নেই।'],load:['Loading…','লোড হচ্ছে…'],noapi:['Set "api" in data/site.js first.','আগে data/site.js-এ "api" দিন।'],fee:['Fees','ফি'],res:['Result','ফলাফল'],adm:['Admin','অ্যাডমিন'],head:['Fee head','ফি-এর খাত'],amt:['Amount','পরিমাণ'],paid:['Paid','পরিশোধ'],due:['Due','বাকি'],st:['Status','অবস্থা'],ps:['Paid','পরিশোধিত'],ds:['Due','বাকি'],total:['Total','মোট'],sub:['Subject','বিষয়'],full:['Full marks','পূর্ণমান'],marks:['Marks','প্রাপ্ত নম্বর'],grade:['Grade','গ্রেড'],name:['Name','নাম'],cls:['Class','শ্রেণি'],date:['Date','তারিখ'],sf:['Fee Statement','ফি বিবরণী'],sr:['Result Sheet','ফলাফল পত্র'],all:['All classes','সব শ্রেণি'],gen:['Generate PDF for all shown','দেখানো সবার পিডিএফ তৈরি'],open:['Open','খুলুন'],search:['Search name / ID…','নাম / আইডি খুঁজুন…'],empty:['No records.','কোনো তথ্য নেই।'],td:['Total due','মোট বাকি']};
const t=k=>T[k][lang==='en'?0:1],L=o=>o[lang]||o.en,e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),M=n=>'৳ '+Number(n||0).toLocaleString('en-IN');
const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],ORD=['Admission',...MO,'Exam'];
const BN={Admission:'ভর্তি ফি',Jan:'জানুয়ারি',Feb:'ফেব্রুয়ারি',Mar:'মার্চ',Apr:'এপ্রিল',May:'মে',Jun:'জুন',Jul:'জুলাই',Aug:'আগস্ট',Sep:'সেপ্টেম্বর',Oct:'অক্টোবর',Nov:'নভেম্বর',Dec:'ডিসেম্বর',Exam:'পরীক্ষা ফি'};
const hn=h=>lang==='bn'&&BN[h]||h,dueOf=s=>s.fees.reduce((a,r)=>a+(+r[1]||0)-(+r[2]||0),0);
const td=(x,c='')=>`<td class="border border-slate-300 px-2 py-1 ${c}">${x}</td>`,th=x=>`<th class="border border-slate-400 px-2 py-1 text-left bg-[#f3e8cd]">${t(x)}</th>`;
const top=(s,title)=>`<div class="text-center border-b-2 border-double border-gold pb-3 mb-4"><div class="serif text-2xl font-bold text-navy">${e(L(S.name))}</div><div class="text-sm">${e(L(S.address))}</div></div><h3 class="serif text-xl font-bold text-center mb-3">${title}</h3><div class="grid grid-cols-2 gap-1 text-sm mb-4"><div>${t('name')}: <b>${e(s.name)}</b></div><div>ID: <b>${e(s.id)}</b></div><div>${t('cls')}: <b>${e(s.class)}</b></div><div>${t('date')}: ${new Date().toLocaleDateString('en-GB')}</div></div>`;
function feeDoc(s){let A=0,P=0;const rows=[...s.fees].sort((a,b)=>((ORD.indexOf(a[0])+1)||99)-((ORD.indexOf(b[0])+1)||99));
 const tr=rows.map(r=>{const a=+r[1]||0,p=+r[2]||0,d=a-p;A+=a;P+=p;return `<tr>${td(e(hn(r[0]))+(r[3]?` <small>(${e(r[3])})</small>`:''))}${td(M(a))}${td(M(p))}${td(M(d))}${d>0?td(t('ds'),'text-red-700 font-bold'):td(t('ps'),'text-green-700')}</tr>`}).join('');
 return `<div class="doc card">${top(s,t('sf'))}<table class="w-full text-sm border-collapse"><tr>${th('head')}${th('amt')}${th('paid')}${th('due')}${th('st')}</tr>${tr}<tr class="font-bold">${td(t('total'))}${td(M(A))}${td(M(P))}${td(M(A-P))}${td('')}</tr></table></div>`}
function resDoc(s){const ex=[...new Set(s.results.map(r=>r[0]))];
 return `<div class="doc card">${top(s,t('sr'))}${ex.map(n=>{const rs=s.results.filter(r=>r[0]===n),F=rs.reduce((a,r)=>a+(+r[2]||0),0),G=rs.reduce((a,r)=>a+(+r[3]||0),0);
 return `<h4 class="serif font-bold mt-4 mb-1">${e(n)}</h4><table class="w-full text-sm border-collapse"><tr>${th('sub')}${th('full')}${th('marks')}${th('grade')}</tr>${rs.map(r=>`<tr>${td(e(r[1]))}${td(e(r[2]))}${td(e(r[3]))}${td(e(r[4]))}</tr>`).join('')}<tr class="font-bold">${td(t('total'))}${td(F)}${td(G)}${td(F?(G/F*100).toFixed(1)+'%':'')}</tr></table>`}).join('')||`<p>${t('empty')}</p>`}</div>`}
const pb=()=>`<button class="btn bg-gold text-navy mb-4 noprint" onclick="print()">${t('print')}</button>`;
const tabs=()=>`<div class="noprint flex gap-2 mb-5 items-center">${MODE==='admin'?'':`<a href="fee.html" class="chip ${MODE==='fees'?'on':''}">${t('fee')}</a><a href="result.html" class="chip ${MODE==='results'?'on':''}">${t('res')}</a><a href="admin.html" class="ml-auto text-sm underline">${t('adm')}</a>`}</div>`;
function form(){app.innerHTML=tabs()+`<form id="f" class="card max-w-md space-y-3 noprint">${MODE==='admin'?`<input id="k" type="password" required class="inp w-full" placeholder="${t('key')}">`:`<input id="i" required class="inp w-full" placeholder="${t('id')}"><input id="p" type="password" required class="inp w-full" placeholder="${t('pin')}">`}<button class="btn bg-navy text-white">${t('view')}</button><p id="msg" class="text-sm text-red-700"></p></form>`;
 $('f').onsubmit=async ev=>{ev.preventDefault();if(!S.api){$('msg').textContent=t('noapi');return}$('msg').textContent=t('load');
  const q=MODE==='admin'?{action:'admin',key:$('k').value}:{id:$('i').value.trim(),pin:$('p').value.trim()};let r;
  try{r=await(await fetch(S.api+'?'+new URLSearchParams(q))).json()}catch(x){r={ok:false}}
  if(!r.ok){$('msg').textContent=t('err');return}
  if(MODE==='admin'){ALL=r.students;adminUI()}else{ST=r;show()}}}
const show=()=>app.innerHTML=tabs()+pb()+`<div id="sheets">${MODE==='fees'?feeDoc(ST):resDoc(ST)}</div>`;
function adminUI(){const cl=[...new Set(ALL.map(s=>String(s.class)))];
 app.innerHTML=`<div class="noprint flex flex-wrap gap-2 mb-4"><select id="cl" class="inp"><option value="">${t('all')}</option>${cl.map(c=>`<option>${e(c)}</option>`).join('')}</select><select id="ty" class="inp"><option value="fees">${t('sf')}</option><option value="results">${t('sr')}</option></select><input id="q" class="inp" placeholder="${t('search')}"><button id="gen" class="btn bg-navy text-white">${t('gen')}</button></div><div id="alist" class="noprint overflow-x-auto"></div><div id="sheets"></div>`;
 const flt=()=>{const c=$('cl').value,q=$('q').value.toLowerCase();return ALL.filter(s=>(!c||String(s.class)===c)&&(!q||(s.name+' '+s.id).toLowerCase().includes(q)))};
 const docs=l=>l.map(s=>$('ty').value==='fees'?feeDoc(s):resDoc(s)).join('')||`<p>${t('empty')}</p>`;
 const list=()=>$('alist').innerHTML='<table class="w-full text-sm bg-white">'+flt().map(s=>`<tr class="border-b"><td class="p-2">${e(s.id)}</td><td class="p-2">${e(s.name)}</td><td class="p-2">${e(s.class)}</td><td class="p-2">${t('td')}: ${M(dueOf(s))}</td><td class="p-2"><button class="underline text-coral" data-o="${e(s.id)}">${t('open')}</button></td></tr>`).join('')+'</table>';
 $('cl').onchange=list;$('q').oninput=list;list();
 $('alist').onclick=ev=>{const id=ev.target.dataset.o;if(id)$('sheets').innerHTML=pb()+docs(ALL.filter(s=>String(s.id)===id))};
 $('gen').onclick=()=>{$('sheets').innerHTML=docs(flt());setTimeout(print,400)}}
$('lang').addEventListener('click',()=>setTimeout(()=>{lang=localStorage.getItem('lang')||'bn';ALL?adminUI():ST?show():form()},0));
form();
})();
