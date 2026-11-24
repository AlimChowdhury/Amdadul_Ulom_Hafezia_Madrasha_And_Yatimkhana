# Student portal setup (fee statement, result, admin)
1. Make a Google Sheet with 3 tabs named exactly **Students**, **Fees**, **Results**; import the CSVs in `sheet-template/` as a starting point. Format the whole `head` column in Fees as **Plain text** (so Jan is not turned into a date).
   Fees `head` values: `Admission`, `Jan`..`Dec`, `Exam`, or any other name (e.g. `Other`, note: Uniform). Due = amount - paid.
   Results `exam` values: your 3 exams, e.g. `1st Term`, `2nd Term`, `Final`.
2. Sheet menu: Extensions -> Apps Script. Paste `apps-script/Code.gs`. Project Settings -> Script properties -> add `ADMIN_KEY` = a long secret.
3. Deploy -> New deployment -> Web app -> Execute as **Me**, Who has access **Anyone** -> copy the `/exec` URL.
4. In `data/site.js` add one line inside `DATA.site={`:  `api:"PASTE_EXEC_URL_HERE",`
5. Pages: `fee.html`, `result.html`, `admin.html`. After editing the script, use Deploy -> Manage deployments -> New version.
PDF: the "Download PDF" button opens the print dialog; choose **Save as PDF**. Admin can filter a class and generate one PDF with every student on its own page.
Give each guardian a random 6+ digit PIN. Never put student data in the GitHub repo.

## Version 2 additions
- **Students** tab: add column F `phone` (format column as Plain text). **Fees**: add F `receipt`, G `paid_date`. New tabs **Progress** (id|item|done|total|note) and **Attendance** (id|month|present|total). **Applications** is created automatically by the Apply page.
- Marks -> grade and GPA are automatic (A+ 80, A 70, A- 60, B 50, C 40, D 33, F below; GPA = average, 0 if any F). Position is calculated per class and exam. Leave `grade` empty to use the automatic grade.
- Admin page: choose Fee Statement / Result / Admit Card / ID Card, filter a class, then "Generate PDF". WhatsApp reminder appears for students with dues and a phone number.
- ID card photo (optional): `assets/images/students/<id>.jpg`.
- Edit `data/donate.js` and `data/routine.js`. Prayer times load from aladhan.com (set `city` and `country` in `data/site.js` if not Dhaka/Bangladesh).
- After replacing Code.gs: Deploy -> Manage deployments -> Edit -> New version.
