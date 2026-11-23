// ADD A NOTICE: copy one block, change id/date/texts. cat = general|exam|admission|holiday|event. pdf is optional.
DATA.cats={general:{en:"General",bn:"সাধারণ"},exam:{en:"Exam",bn:"পরীক্ষা"},admission:{en:"Admission",bn:"ভর্তি"},holiday:{en:"Holiday",bn:"ছুটি"},event:{en:"Event",bn:"অনুষ্ঠান"}};
DATA.notices=[
 {id:1,date:"2026-11-20",cat:"exam",urgent:true,pinned:true,title:{en:"Annual exam routine published",bn:"বার্ষিক পরীক্ষার রুটিন প্রকাশিত"},body:{en:"Exams begin on 20 December. Collect admit cards from the office.",bn:"২০ ডিসেম্বর থেকে পরীক্ষা শুরু। প্রবেশপত্র অফিস থেকে সংগ্রহ করুন।"},pdf:"./assets/pdfs/exam-routine.pdf"},
 {id:2,date:"2026-11-15",cat:"admission",urgent:false,pinned:false,title:{en:"Admission form available",bn:"ভর্তি ফরম পাওয়া যাচ্ছে"},body:{en:"Forms are available from 1 December.",bn:"১ ডিসেম্বর থেকে ফরম পাওয়া যাবে।"},pdf:""},
 {id:3,date:"2026-11-10",cat:"holiday",urgent:false,pinned:false,title:{en:"Closed on Victory Day",bn:"বিজয় দিবসে বিদ্যালয় বন্ধ"},body:{en:"School remains closed on 16 December.",bn:"১৬ ডিসেম্বর বিদ্যালয় বন্ধ থাকবে।"},pdf:""}
];
