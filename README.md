# Bilingual School Website (GitHub Pages)

Static site: HTML + Tailwind (CDN) + vanilla JS. No build step, no server.

## Publish
1. Push this folder to a GitHub repo. 2. **Settings → Pages →** deploy from branch `main`, folder `/ (root)`. 3. Open `https://username.github.io/repo-name/`.
All paths are relative (`./assets/...`), so it works under a repo sub-path.

## Edit content on GitHub (open a file → pencil icon → Commit)
Every text is `{ en: "...", bn: "..." }`. Keep commas and quotes intact.
- **Notice:** `data/notices.js` – copy a block, change `id`, `date` (YYYY-MM-DD), `cat`, texts. `urgent:true` / `pinned:true` puts it in the ticker. Upload the PDF to `assets/pdfs/` and set `pdf:"./assets/pdfs/name.pdf"`.
- **Book:** upload PDF to `assets/pdfs/`, add a block in `data/books.js` (`cls`, `subject`, `size`, `pdf`, optional `cover` image).
- **Audio:** upload MP3 to `assets/audio/`, add a block in `data/audio.js`.
- **Job:** add a block in `data/careers.js` (upload circular PDF to `assets/pdfs/`).
- **Teachers / leadership / about / calendar / contact:** `data/teachers.js`, `data/authority.js`, `data/site.js`.
- **Photos:** upload to `assets/images/`; missing photos fall back to initials.
- File names are case-sensitive on GitHub Pages. GitHub limits files to 100 MB.
- Application and inquiry forms open the visitor's email app (`mailto:`). Change the addresses in `data/site.js` and `js/app.js`.

## Pages & home photo
One HTML file per section: `index.html` (home), `notices.html`, `about.html`, `authority.html`, `teachers.html`, `careers.html`, `library.html`, `audio.html`, `admission.html` (includes the calendar), `gallery.html`, `contact.html`. Header, footer and language switch are shared and built by `js/app.js`.
**Home photo:** upload your school photo as `assets/images/hero.jpg` (landscape, ~1600×1200). Until then a drawing is shown.
**Colours:** maroon `#166534`, antique gold `#ffffff`, cream `#ffffff`. Change the `tailwind.config` line in each page and the hex values in `css/style.css`.
