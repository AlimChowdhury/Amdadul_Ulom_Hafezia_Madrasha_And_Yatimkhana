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
