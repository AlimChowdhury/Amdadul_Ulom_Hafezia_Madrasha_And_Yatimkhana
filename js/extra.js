// Donation, class routine and online admission pages (data in data/donate.js, data/routine.js).
(() => {
  const S = DATA.site, M = document.body.dataset.mode, $ = id => document.getElementById(id), app = $('app');
  let lang = localStorage.getItem('lang') || 'bn';
  const L = o => typeof o === 'string' ? o : (o && (o[lang] || o.en)) || '', e = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const T = { sponsor: ['Sponsor an orphan', 'এতিমের দায়িত্ব নিন'], use: ['How donations are used', 'দান যেভাবে ব্যয় হয়'], report: ['Yearly report', 'বার্ষিক প্রতিবেদন'], year: ['Year', 'সাল'], raised: ['Received', 'প্রাপ্ত'], spent: ['Spent', 'ব্যয়'], donors: ['Our donors', 'আমাদের দাতা'], ways: ['Ways to donate', 'দানের মাধ্যম'], name: ['Name', 'নাম'], father: ['Father name', 'পিতার নাম'], mother: ['Mother name', 'মাতার নাম'], dob: ['Date of birth', 'জন্ম তারিখ'], cls: ['Class applying for', 'যে শ্রেণিতে ভর্তি'], phone: ['Phone (WhatsApp)', 'ফোন (হোয়াটসঅ্যাপ)'], addr: ['Address', 'ঠিকানা'], note: ['Message', 'বার্তা'], send: ['Submit application', 'আবেদন জমা দিন'], ok: ['Application received. We will contact you.', 'আবেদন জমা হয়েছে। আমরা যোগাযোগ করব।'], err: ['Could not send. Try again or call us.', 'জমা হয়নি। আবার চেষ্টা করুন বা ফোন করুন।'], noapi: ['Set "api" in data/site.js first.', 'আগে data/site.js-এ "api" দিন।'], time: ['Time', 'সময়'], date: ['Date', 'তারিখ'], amt: ['Amount', 'পরিমাণ'] };
  const t = k => T[k][lang === 'en' ? 0 : 1], th = x => `<th class="border border-slate-400 px-2 py-1 text-left bg-[#ffffff]">${x}</th>`, td = x => `<td class="border border-slate-300 px-2 py-1">${e(L(x))}</td>`;
  const h3 = x => `<h3 class="serif text-xl font-bold text-navy mt-8 mb-3">${x}</h3>`;
  function donate() {
    const d = DATA.donate;
    app.innerHTML = `<p class="max-w-3xl mb-6">${e(L(d.note))}</p>${h3(t('ways'))}<div class="grid md:grid-cols-3 gap-4">${d.methods.map(m => `<div class="card"><b class="serif">${e(m.name)}</b><p class="text-xl font-bold text-navy">${e(m.number)}</p><p class="text-sm">${e(L(m.info))}</p></div>`).join('')}</div>${h3(t('sponsor'))}<div class="grid md:grid-cols-2 gap-4">${d.sponsor.map(x => `<div class="card"><b class="text-navy">${e(x.amt)}</b><p>${e(L(x.t))}</p></div>`).join('')}</div>${h3(t('use'))}<ul class="list-disc ml-6">${d.use.map(x => `<li>${e(L(x))}</li>`).join('')}</ul>${h3(t('report'))}<table class="w-full text-sm border-collapse bg-white"><tr>${th(t('year'))}${th(t('raised'))}${th(t('spent'))}${th(t('note'))}</tr>${d.report.map(r => `<tr>${td(r.year)}${td(r.raised)}${td(r.spent)}${td(r.note)}</tr>`).join('')}</table>${h3(t('donors'))}<table class="w-full text-sm border-collapse bg-white"><tr>${th(t('name'))}${th(t('amt'))}${th(t('date'))}</tr>${d.donors.map(r => `<tr>${td(r.name)}${td(r.amt)}${td(r.date)}</tr>`).join('')}</table>`
  }
  function routine() {
    const D = [['Sat', 'শনি'], ['Sun', 'রবি'], ['Mon', 'সোম'], ['Tue', 'মঙ্গল'], ['Wed', 'বুধ'], ['Thu', 'বৃহ']];
    app.innerHTML = DATA.routine.map(c => `${h3(L(c.cls))}<div class="overflow-x-auto"><table class="w-full text-sm border-collapse bg-white"><tr>${th(t('time'))}${D.map(d => th(d[lang === 'en' ? 0 : 1])).join('')}</tr>${c.rows.map(r => `<tr>${r.map(x => td(x)).join('')}</tr>`).join('')}</table></div>`).join('')
  }
  function apply() {
    const F = [['name', 1], ['father'], ['mother'], ['dob', 0, 'date'], ['cls', 1], ['phone', 1], ['addr'], ['note']];
    app.innerHTML = `<form id="f" class="card max-w-xl space-y-3">${F.map(([k, r, ty]) => `<label class="block text-sm">${t(k)}<input name="${k}" ${r ? 'required' : ''} type="${ty || 'text'}" maxlength="300" class="inp w-full mt-1"></label>`).join('')}<button class="btn bg-navy text-white">${t('send')}</button><p id="msg" class="text-sm"></p></form>`;
    $('f').onsubmit = async ev => {
      ev.preventDefault(); const m = $('msg'); if (!S.api) { m.textContent = t('noapi'); return }
      try { const r = await (await fetch(S.api + '?' + new URLSearchParams({ action: 'apply', ...Object.fromEntries(new FormData(ev.target)) }))).json(); m.textContent = r.ok ? t('ok') : t('err'); if (r.ok) ev.target.reset() } catch (x) { m.textContent = t('err') }
    }
  }
  const draw = () => ({ donate, routine, apply }[M])();
  $('lang').addEventListener('click', () => setTimeout(() => { lang = localStorage.getItem('lang') || 'bn'; draw() }, 0));
  draw();
})();
