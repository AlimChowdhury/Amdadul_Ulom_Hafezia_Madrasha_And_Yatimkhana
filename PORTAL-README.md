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

## Version 3: one Login page (portal.html)
Student, Teacher and Admin log in on `portal.html`. Teachers need a **Teachers** tab (id|pin|name|designation|class|phone|subject); their `class` must match the Students `class` text exactly. Teachers can view their class fees/results and enter marks (exam, subject, full marks) and attendance (month, total days); saving updates or adds rows in Results / Attendance. After replacing Code.gs: Deploy -> Manage deployments -> Edit -> New version. Old fee.html / result.html / admin.html still work but are no longer in the menu.

## Version 4: teachers with many classes and subjects, plus audit trail
- **Teachers** tab: `id | pin | name | designation | phone` (headings are matched by name, extra columns are ignored).
- **Assignments** tab (new): `teacher_id | class | subject`, one row for every class + subject a teacher teaches. A teacher may have many rows, different subjects in different classes. Class text must match the Students `class` text exactly.
- A teacher sees and enters marks only for assigned class + subject pairs; attendance only for assigned classes. The server rejects anything else.
- **Admin** can also enter marks and attendance for any class and subject (portal -> Admin -> Enter marks / Attendance).
- **Audit:** add headings `entered_by`, `entered_at` to the end of **Results** (G, H) and **Attendance** (E, F). Every save fills them (for example `Teacher: Maulana Karim (T01)`). A separate **AuditLog** tab (created automatically) keeps one line for every save: time, role, user, action, class, exam/subject or month, rows saved.
- Data lives in your Google Sheet. For an Excel copy: File -> Download -> Microsoft Excel (.xlsx).
- After replacing Code.gs: Deploy -> Manage deployments -> Edit -> New version.
