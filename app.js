const state={classId:null,subject:null,page:null,mode:null,contentId:null,contentTitle:"",questions:[],answers:[],index:0,started:0,timer:null,studentName:""};
const TEACHER_KEY="Kusanagikun18";
const KEYS={questions:"bimbel_question_bank_v2",materials:"bimbel_materials_v1",exams:"bimbel_exams_v1",results:"bimbel_results_v1"};
const classes=Array.from({length:6},(_,i)=>({id:i+1,label:"Kelas "+(i+1)}));
const subjects=[
{id:"matematika",name:"Matematika",icon:"🔢",desc:"Angka & logika"},
{id:"bahasa-indonesia",name:"Bahasa Indonesia",icon:"📚",desc:"Membaca & menulis"},
{id:"ipa",name:"IPA",icon:"🔬",desc:"Sains & alam"},
{id:"ips",name:"IPS",icon:"🌍",desc:"Sosial & lingkungan"},
{id:"bahasa-inggris",name:"Bahasa Inggris",icon:"🔤",desc:"Bahasa & komunikasi"},
{id:"pai",name:"Pendidikan Agama Islam",icon:"🕌",desc:"Pendidikan agama"},
{id:"pendidikan-pancasila",name:"Pendidikan Pancasila",icon:"🇮🇩",desc:"Pancasila & kewarganegaraan"},
{id:"seni-budaya",name:"Seni Budaya",icon:"🎨",desc:"Seni & kreativitas"},
{id:"pjok",name:"PJOK",icon:"⚽",desc:"Jasmani & olahraga"},
{id:"informatika",name:"Informatika",icon:"💻",desc:"Teknologi & komputer"}];

const questionBank={
matematika:[{question:"Berapakah 7 + 5?",options:["10","11","12","13"],answer:2,explanation:"7 + 5 = 12."},{question:"Berapakah 15 - 8?",options:["5","6","7","8"],answer:2,explanation:"15 - 8 = 7."},{question:"Berapakah 4 × 3?",options:["7","10","12","14"],answer:2,explanation:"4 × 3 = 12."},{question:"Berapakah 20 ÷ 5?",options:["2","3","4","5"],answer:2,explanation:"20 ÷ 5 = 4."},{question:"Bilangan manakah yang paling besar?",options:["18","21","19","17"],answer:1,explanation:"21 adalah yang paling besar."}],
"bahasa-indonesia":[{question:"Kalimat untuk menanyakan sesuatu disebut kalimat ...",options:["berita","tanya","perintah","seru"],answer:1,explanation:"Kalimat tanya digunakan untuk menanyakan sesuatu."},{question:"Lawan kata dari 'besar' adalah ...",options:["tinggi","panjang","kecil","lebar"],answer:2,explanation:"Lawan kata besar adalah kecil."},{question:"Nama orang, tempat, atau benda termasuk ...",options:["kata benda","kata kerja","kata sifat","kata tanya"],answer:0,explanation:"Nama orang, tempat, dan benda termasuk kata benda."},{question:"Tanda baca di akhir kalimat tanya adalah ...",options:[".","!",",","?"],answer:3,explanation:"Kalimat tanya diakhiri tanda tanya."},{question:"Kegiatan memahami tulisan disebut ...",options:["menulis","membaca","berbicara","berhitung"],answer:1,explanation:"Membaca adalah kegiatan memahami tulisan."}],
ipa:[{question:"Bagian tubuh untuk melihat adalah ...",options:["telinga","hidung","mata","tangan"],answer:2,explanation:"Mata digunakan untuk melihat."},{question:"Tumbuhan membutuhkan air dan ... untuk membuat makanan.",options:["cahaya matahari","batu","plastik","pasir"],answer:0,explanation:"Cahaya matahari membantu tumbuhan membuat makanan."},{question:"Hewan yang berkembang biak dengan bertelur adalah ...",options:["ayam","kucing","sapi","kambing"],answer:0,explanation:"Ayam berkembang biak dengan bertelur."},{question:"Air yang membeku berubah menjadi ...",options:["uap","es","awan","embun"],answer:1,explanation:"Air yang membeku menjadi es."},{question:"Sumber cahaya dan panas utama bagi Bumi adalah ...",options:["Bulan","bintang kecil","Matahari","angin"],answer:2,explanation:"Matahari adalah sumber cahaya dan panas utama bagi Bumi."}],
ips:[],"bahasa-inggris":[],
pai:[{question:"Rukun Islam yang pertama adalah ...",options:["salat","zakat","syahadat","puasa"],answer:2,explanation:"Rukun Islam pertama adalah syahadat."},{question:"Salat wajib sehari semalam berjumlah ... waktu.",options:["3","4","5","6"],answer:2,explanation:"Salat wajib terdiri dari lima waktu."},{question:"Kitab suci umat Islam adalah ...",options:["Al-Qur'an","Taurat","Zabur","Injil"],answer:0,explanation:"Kitab suci umat Islam adalah Al-Qur'an."},{question:"Sebelum salat, seorang muslim biasanya melakukan ...",options:["tidur","wudu","makan","bermain"],answer:1,explanation:"Wudu dilakukan sebagai persiapan sebelum salat."},{question:"Berkata sesuai kenyataan disebut ...",options:["sabar","jujur","malas","marah"],answer:1,explanation:"Jujur berarti berkata sesuai kenyataan."}],
"pendidikan-pancasila":[],"seni-budaya":[],pjok:[],informatika:[]};

const $=id=>document.getElementById(id);
const classGrid=$("classGrid"),subjectGrid=$("subjectGrid"),kelasSection=$("kelasSection"),mapelSection=$("mapelSection"),menuSection=$("menuSection"),workspace=$("workspace"),workspaceContent=$("workspaceContent"),teacherSection=$("teacherSection"),teacherContent=$("teacherContent");
const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const uid=prefix=>prefix+"_"+Date.now()+"_"+Math.random().toString(36).slice(2,7);
const subjectName=id=>subjects.find(s=>s.id===id)?.name||id;
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function normalizeAnswer(v){return String(v??"").trim().toLowerCase().replace(/\s+/g," ")}
function renderClasses(){classGrid.innerHTML=classes.map(x=>`<button class="choice-card ${state.classId===x.id?"selected":""}" data-class="${x.id}"><div class="class-number">${x.id}</div><small>Kelas ${x.id} SD</small></button>`).join("")}
function renderSubjects(){subjectGrid.innerHTML=subjects.map(x=>`<button class="choice-card subject-card ${state.subject===x.id?"selected":""}" data-subject="${x.id}"><span class="subject-icon">${x.icon}</span><span><strong>${x.name}</strong><small>${x.desc}</small></span></button>`).join("")}
function chooseClass(id){state.classId=id;state.subject=null;$("classLabel").textContent="Kelas "+id;$("subjectLabel").textContent="Belum dipilih";renderClasses();renderSubjects();mapelSection.classList.remove("hidden");menuSection.classList.add("hidden");workspace.classList.add("hidden");mapelSection.scrollIntoView({behavior:"smooth"})}
function chooseSubject(id){state.subject=id;const s=subjects.find(x=>x.id===id);$("subjectLabel").textContent=s.name;renderSubjects();menuSection.classList.remove("hidden");workspace.classList.add("hidden");menuSection.scrollIntoView({behavior:"smooth"})}

function migrateOldQuestions(){
 const old=read("bimbel_question_bank_v1",[]);
 if(!old.length)return;
 const current=read(KEYS.questions,[]);
 if(current.length)return;
 const migrated=old.map(q=>({...q,id:q.id||uid("q")}));write(KEYS.questions,migrated);
}
function builtInQuestions(classId,subject){
 return (questionBank[subject]||[]).map((q,i)=>({...q,id:"builtin_"+subject+"_"+i,classId:Number(classId),subject,type:q.type||"mcq",source:"builtin"}));
}
function getAllQuestions(classId,subject){
 migrateOldQuestions();
 return [...builtInQuestions(classId,subject),...read(KEYS.questions).filter(q=>String(q.classId)===String(classId)&&q.subject===subject)];
}
function getQuestionById(classId,subject,id){return getAllQuestions(classId,subject).find(q=>String(q.id)===String(id))}
function getMaterials(classId,subject){return read(KEYS.materials).filter(x=>String(x.classId)===String(classId)&&x.subject===subject)}
function getExams(classId,subject){return read(KEYS.exams).filter(x=>String(x.classId)===String(classId)&&x.subject===subject)}
function getResults(){return read(KEYS.results)}

function openPage(page){
 if(!state.classId||!state.subject)return;
 state.page=page;state.mode=null;clearInterval(state.timer);
 const s=subjects.find(x=>x.id===state.subject);
 const titles={materi:["Materi","Pilih topik yang dibuat guru lalu kerjakan soalnya."],ulangan:["Ulangan","Pilih ulangan yang sudah disiapkan guru."],hasil:["Hasil Belajar","Lihat hasil pengerjaanmu untuk kelas dan mata pelajaran ini."]};
 $("workspaceTitle").textContent=titles[page][0];$("workspaceSubtitle").textContent=titles[page][1];
 workspaceContent.innerHTML=page==="hasil"?historyHTML():page==="materi"?studentMaterialsHTML(s):studentExamsHTML(s);
 workspace.classList.remove("hidden");workspace.scrollIntoView({behavior:"smooth"});
}
function resultForContent(type,id){return getResults().filter(r=>r.studentName===state.studentName&&r.contentType===type&&String(r.contentId)===String(id))}
function studentMaterialsHTML(s){
 const rows=getMaterials(state.classId,state.subject);
 if(!rows.length)return `<div class="panel"><div class="empty-icon">📚</div><h3>Belum ada materi</h3><p>Guru belum membuat topik untuk ${esc(s.name)} kelas ${state.classId}.</p></div>`;
 return `<div class="content-grid">${rows.map(m=>{const rs=resultForContent("material",m.id),last=rs[0];return `<article class="content-card"><div class="content-card-icon">📚</div><span class="content-badge">${m.questionIds.length} soal</span><h3>${esc(m.title)}</h3><p>${esc(m.description||"Kerjakan soal pada materi ini.")}</p><div class="content-status">${last?"✓ Sudah dikerjakan · Nilai "+last.score:"○ Belum dikerjakan"}</div><button class="primary-btn content-start" data-content-type="material" data-content-id="${m.id}">${last?"Kerjakan Lagi":"Mulai"} →</button></article>`}).join("")}</div>`;
}
function studentExamsHTML(s){
 const rows=getExams(state.classId,state.subject);
 if(!rows.length)return `<div class="panel"><div class="empty-icon">📝</div><h3>Belum ada ulangan</h3><p>Guru belum membuat ulangan untuk ${esc(s.name)} kelas ${state.classId}.</p></div>`;
 return `<div class="content-grid">${rows.map(x=>{const rs=resultForContent("exam",x.id),last=rs[0];return `<article class="content-card exam-card"><div class="content-card-icon">📝</div><span class="content-badge">${x.questionIds.length} soal${x.duration?" · "+x.duration+" menit":""}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||"Ulangan yang disiapkan guru.")}</p><div class="content-status">${last?"✓ Sudah dikerjakan · Nilai "+last.score:"○ Belum dikerjakan"}</div><button class="primary-btn content-start" data-content-type="exam" data-content-id="${x.id}">${last?"Kerjakan Lagi":"Mulai Ulangan"} →</button></article>`}).join("")}</div>`;
}
function launchContent(type,id){
 const source=type==="material"?read(KEYS.materials).find(x=>String(x.id)===String(id)):read(KEYS.exams).find(x=>String(x.id)===String(id));
 if(!source)return;
 const qs=source.questionIds.map(qid=>getQuestionById(state.classId,state.subject,qid)).filter(Boolean);
 if(!qs.length){alert("Konten ini belum memiliki soal.");return}
 state.contentId=source.id;state.contentTitle=source.title;state.mode=type;state.questions=qs.map(q=>({...q}));state.answers=Array(qs.length).fill(null);state.index=0;state.started=Date.now();state.studentName=state.studentName||"";
 const name=prompt("Masukkan nama siswa:");
 if(name===null)return;
 state.studentName=name.trim();
 if(!state.studentName){alert("Nama siswa wajib diisi.");return}
 clearInterval(state.timer);state.timer=setInterval(updateTimer,1000);renderQuestion();
}
function renderQuestion(){
 const q=state.questions[state.index],total=state.questions.length,chosen=state.answers[state.index];
 let answerUI="";
 if(q.type==="essay")answerUI=`<textarea id="essayAnswer" class="student-input essay-input" rows="6" placeholder="Tulis jawaban esai...">${esc(chosen??"")}</textarea>`;
 else if(q.type==="short")answerUI=`<input id="shortAnswer" class="student-input" value="${esc(chosen??"")}" placeholder="Tulis jawaban singkat">`;
 else if(q.type==="truefalse")answerUI=`<div class="options-list"><button class="answer-option ${chosen===true?"selected":""}" data-tf="true"><span class="option-letter">B</span><span>Benar</span></button><button class="answer-option ${chosen===false?"selected":""}" data-tf="false"><span class="option-letter">S</span><span>Salah</span></button></div>`;
 else answerUI=`<div class="options-list">${(q.options||[]).map((o,i)=>`<button class="answer-option ${chosen===i?"selected":""}" data-answer="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
 workspaceContent.innerHTML=`<div class="quiz-panel"><div class="quiz-topline"><span>Soal ${state.index+1} dari ${total}</span><span>⏱ <b id="quizTimer">${formatTime(Date.now()-state.started)}</b></span></div><div class="progress-track"><div class="progress-fill" style="width:${((state.index+1)/total)*100}%"></div></div><div class="question-number">${state.mode==="exam"?"ULANGAN":"MATERI"} · ${q.type==="mcq"?"PILIHAN GANDA":q.type==="truefalse"?"BENAR / SALAH":q.type==="short"?"ISIAN SINGKAT":"ESAI"}</div><h3 class="question-text">${esc(q.question)}</h3>${answerUI}<div class="quiz-actions"><button class="secondary-btn" id="prevQuestion" ${state.index===0?"disabled":""}>← Sebelumnya</button><button class="primary-btn" id="nextQuestion">${state.index===total-1?"Selesai & Lihat Nilai":"Soal Berikutnya →"}</button></div></div>`;
 updateTimer();
 document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{state.answers[state.index]=Number(b.dataset.answer);renderQuestion()});
 document.querySelectorAll("[data-tf]").forEach(b=>b.onclick=()=>{state.answers[state.index]=b.dataset.tf==="true";renderQuestion()});
 const ea=$("essayAnswer");if(ea)ea.oninput=()=>state.answers[state.index]=ea.value;
 const sa=$("shortAnswer");if(sa)sa.oninput=()=>state.answers[state.index]=sa.value;
 $("prevQuestion").onclick=()=>{if(state.index>0){state.index--;renderQuestion()}};
 $("nextQuestion").onclick=()=>{const a=state.answers[state.index];if(a===null||a===undefined||String(a).trim()===""){notice("Jawab soal terlebih dahulu.");return}if(state.index===total-1)finishQuiz();else{state.index++;renderQuestion()}};
}
function formatTime(ms){const t=Math.floor(Math.max(0,ms)/1000),m=Math.floor(t/60),s=t%60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function updateTimer(){const el=$("quizTimer");if(el)el.textContent=formatTime(Date.now()-state.started)}
function notice(msg){const n=document.createElement("div");n.className="quiz-inline-notice";n.textContent="⚠️ "+msg;document.querySelector(".quiz-actions").before(n)}
function finishQuiz(){
 clearInterval(state.timer);
 let correct=0,objective=0,pendingEssay=0;
 state.questions.forEach((q,i)=>{const a=state.answers[i];if(q.type==="essay"){pendingEssay++;return}objective++;if(q.type==="mcq"&&a===q.answer)correct++;else if(q.type==="truefalse"&&a===q.answer)correct++;else if(q.type==="short"&&normalizeAnswer(a)===normalizeAnswer(q.answer))correct++});
 const score=objective?Math.round(correct/objective*100):0;
 const r={id:Date.now(),studentName:state.studentName,classId:state.classId,subject:state.subject,subjectName:subjectName(state.subject),mode:state.mode,contentType:state.mode,contentId:state.contentId,contentTitle:state.contentTitle,score,correct,wrong:objective-correct,total:state.questions.length,duration:Date.now()-state.started,pendingEssay,date:new Date().toLocaleString("id-ID")};
 const h=getResults();h.unshift(r);write(KEYS.results,h.slice(0,300));resultHTML(r);
}
function resultHTML(r){
 workspaceContent.innerHTML=`<div class="result-panel"><div class="result-hero"><div class="result-trophy">🏆</div><span class="section-kicker">HASIL SELESAI</span><h3>${esc(r.studentName)}</h3><p>${r.contentType==="exam"?"Ulangan":"Materi"} · ${esc(r.contentTitle)} · Kelas ${r.classId}</p><div class="score-circle"><strong>${r.score}</strong><span>/ 100</span></div><b class="result-message">${r.score>=80?"Bagus sekali! 🌟":r.score>=60?"Sudah bagus. Pelajari lagi yang salah. 💪":"Pelajari pembahasannya lalu coba lagi. 📚"}</b></div><div class="result-stats"><div><strong>${r.correct}</strong><span>Benar</span></div><div><strong>${r.wrong}</strong><span>Salah</span></div><div><strong>${r.total}</strong><span>Total soal</span></div><div><strong>${formatTime(r.duration)}</strong><span>Waktu</span></div></div><div class="result-actions"><button class="primary-btn" id="reviewAnswers">Lihat Pembahasan</button><button class="secondary-btn" id="retryQuiz">Kerjakan Lagi</button></div><div id="reviewArea" class="review-area hidden"></div></div>`;
 $("reviewAnswers").onclick=()=>{const a=$("reviewArea");a.classList.toggle("hidden");if(!a.classList.contains("hidden"))a.innerHTML=state.questions.map((q,i)=>{const c=state.answers[i],ok=q.type==="mcq"?c===q.answer:q.type==="truefalse"?c===q.answer:q.type==="short"?normalizeAnswer(c)===normalizeAnswer(q.answer):false;const student=q.type==="mcq"?(q.options?.[c]??"Tidak dijawab"):q.type==="truefalse"?(c===null?"Tidak dijawab":c?"Benar":"Salah"):String(c??"Tidak dijawab");const key=q.type==="mcq"?(q.options?.[q.answer]??""):q.type==="truefalse"?(q.answer?"Benar":"Salah"):String(q.answer??"");return `<div class="review-item ${ok?"correct":"wrong"}"><strong>${i+1}. ${esc(q.question)}</strong><div>Jawaban siswa: <b>${esc(student)}</b></div><div>Kunci jawaban: <b>${esc(key)}</b></div><small>${esc(q.explanation||"")}</small></div>`}).join("")};
 $("retryQuiz").onclick=()=>{state.answers=Array(state.questions.length).fill(null);state.index=0;state.started=Date.now();clearInterval(state.timer);state.timer=setInterval(updateTimer,1000);renderQuestion()};
}
function historyHTML(){
 if(!state.studentName){
  const name=prompt("Masukkan nama siswa untuk melihat hasil:");
  if(name===null||!name.trim())return '<div class="panel"><div class="empty-icon">🏆</div><h3>Nama siswa belum diisi</h3><p>Isi nama siswa untuk melihat hasil belajar.</p></div>';
  state.studentName=name.trim();
 }
 const r=getResults().filter(x=>String(x.classId)===String(state.classId)&&x.subject===state.subject&&x.studentName===state.studentName);
 if(!r.length)return `<div class="panel"><div class="empty-icon">🏆</div><h3>Belum ada hasil</h3><p>Masukkan nama siswa saat mengerjakan materi atau ulangan agar hasil dapat dilihat kembali.</p></div>`;
 return `<div class="history-panel"><div class="history-summary"><div><strong>${r.length}</strong><span>Pengerjaan</span></div><div><strong>${Math.round(r.reduce((n,x)=>n+x.score,0)/r.length)}</strong><span>Rata-rata</span></div><div><strong>${Math.max(...r.map(x=>x.score))}</strong><span>Nilai tertinggi</span></div></div><div class="history-list">${r.map(x=>`<div class="history-item"><div><strong>${esc(x.contentTitle||"Konten")}</strong><small>${x.contentType==="exam"?"Ulangan":"Materi"} · ${esc(x.date)}</small></div><div class="history-score">${x.score}<span>/100</span></div></div>`).join("")}</div></div>`;
}

/* ========================= GURU ========================= */
function teacherHTML(){
 return `<div class="teacher-panel">
 <div class="teacher-tabs">
  <button class="teacher-tab active" data-teacher-tab="results">📊 Hasil Belajar</button>
  <button class="teacher-tab" data-teacher-tab="materials">📚 Materi</button>
  <button class="teacher-tab" data-teacher-tab="exams">📝 Ulangan</button>
 </div>
 <div id="teacherResultsArea">${teacherResultsHTML()}</div>
 <div id="teacherMaterialsArea" class="hidden">${teacherMaterialsHTML()}</div>
 <div id="teacherExamsArea" class="hidden">${teacherExamsHTML()}</div>
 </div>`;
}
function teacherScopeHTML(idPrefix=""){
 return `<div class="teacher-filters"><select id="${idPrefix}Class"><option value="">Pilih kelas</option>${classes.map(x=>`<option value="${x.id}">Kelas ${x.id}</option>`).join("")}</select><select id="${idPrefix}Subject"><option value="">Pilih mata pelajaran</option>${subjects.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select></div>`;
}
function teacherResultsHTML(){
 const all=getResults();
 if(!all.length)return `<div class="panel"><div class="empty-icon">📊</div><h3>Belum ada data hasil</h3><p>Hasil materi dan ulangan siswa akan tampil di sini.</p></div>`;
 const avg=Math.round(all.reduce((n,x)=>n+x.score,0)/all.length),students=new Set(all.map(x=>x.studentName)).size,best=Math.max(...all.map(x=>x.score));
 return `<div class="teacher-toolbar"><div class="teacher-filters"><select id="teacherClass"><option value="">Semua kelas</option>${classes.map(x=>`<option value="${x.id}">Kelas ${x.id}</option>`).join("")}</select><select id="teacherSubject"><option value="">Semua mata pelajaran</option>${subjects.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select><select id="teacherContentType"><option value="">Materi + Ulangan</option><option value="material">Materi</option><option value="exam">Ulangan</option></select></div><div class="teacher-actions"><button class="secondary-btn" id="exportResults">⬇ Export CSV</button><button class="danger-btn" id="clearResults">Hapus Data</button></div></div><div class="teacher-stats"><div><strong id="teacherCount">${all.length}</strong><span>Pengerjaan</span></div><div><strong id="teacherStudents">${students}</strong><span>Siswa</span></div><div><strong id="teacherAverage">${avg}</strong><span>Rata-rata</span></div><div><strong id="teacherBest">${best}</strong><span>Nilai tertinggi</span></div></div><div id="teacherTableWrap">${teacherTable(all)}</div><div class="notice">💾 Data saat ini disimpan di browser/perangkat ini. Untuk sinkronisasi antarperangkat, tahap berikutnya membutuhkan database bersama.</div>`;
}
function teacherMaterialsHTML(){
 const mats=read(KEYS.materials);
 return `<div class="admin-intro"><span class="section-kicker">MATERI</span><h3>Buat topik pembelajaran</h3><p>Setiap materi memiliki kumpulan soal sendiri. Soalnya tidak otomatis masuk ke Ulangan.</p></div><div class="teacher-create-grid">${teacherScopeHTML("material")}<input id="materialTitle" class="student-input" placeholder="Nama materi, misalnya Perkalian"><input id="materialDescription" class="student-input" placeholder="Deskripsi singkat (opsional)"><button class="primary-btn" id="createMaterial">＋ Buat Materi</button></div><div class="admin-list"><h3>Materi yang dibuat (${mats.length})</h3>${mats.length?mats.map(materialAdminCard).join(""):'<div class="empty-table">Belum ada materi.</div>'}</div>`;
}
function materialAdminCard(m){
 const qs=m.questionIds.map(id=>getQuestionById(m.classId,m.subject,id)).filter(Boolean);
 return `<article class="admin-card"><div class="admin-card-head"><div><span class="content-badge">Kelas ${m.classId} · ${esc(subjectName(m.subject))}</span><h3>📚 ${esc(m.title)}</h3><p>${esc(m.description||"Tanpa deskripsi")}</p></div><button class="danger-btn delete-material" data-id="${m.id}">Hapus</button></div><div class="admin-card-meta"><b>${qs.length} soal</b><span>·</span><span>Soal materi hanya untuk topik ini sampai guru memilihnya ke Ulangan.</span></div><button class="secondary-btn manage-material" data-id="${m.id}">Kelola Soal</button><div class="inline-manager hidden" id="materialManager_${m.id}">${questionBuilderHTML("material",m)}</div></article>`;
}
function teacherExamsHTML(){
 const exams=read(KEYS.exams);
 return `<div class="admin-intro"><span class="section-kicker">ULANGAN</span><h3>Buat ulangan terpisah</h3><p>Pilih sendiri soal yang masuk. Soal dari Materi tidak akan ikut otomatis.</p></div><div class="teacher-create-grid">${teacherScopeHTML("exam")}<input id="examTitle" class="student-input" placeholder="Nama ulangan, misalnya Ulangan Harian 1"><input id="examDescription" class="student-input" placeholder="Deskripsi singkat (opsional)"><input id="examDuration" class="student-input" type="number" min="0" placeholder="Durasi menit (opsional)"><button class="primary-btn" id="createExam">＋ Buat Ulangan</button></div><div class="admin-list"><h3>Ulangan yang dibuat (${exams.length})</h3>${exams.length?exams.map(examAdminCard).join(""):'<div class="empty-table">Belum ada ulangan.</div>'}</div>`;
}
function examAdminCard(exam){
 const qs=exam.questionIds.map(id=>getQuestionById(exam.classId,exam.subject,id)).filter(Boolean);
 return `<article class="admin-card"><div class="admin-card-head"><div><span class="content-badge">Kelas ${exam.classId} · ${esc(subjectName(exam.subject))}</span><h3>📝 ${esc(exam.title)}</h3><p>${esc(exam.description||"Tanpa deskripsi")}${exam.duration?" · "+exam.duration+" menit":""}</p></div><button class="danger-btn delete-exam" data-id="${exam.id}">Hapus</button></div><div class="admin-card-meta"><b>${qs.length} soal</b><span>·</span><span>Soal dipilih manual oleh guru.</span></div><button class="secondary-btn manage-exam" data-id="${exam.id}">Pilih / Kelola Soal</button><div class="inline-manager hidden" id="examManager_${exam.id}">${examBuilderHTML(exam)}</div></article>`;
}
function questionTypeLabel(t){return t==="mcq"?"Pilihan Ganda":t==="truefalse"?"Benar/Salah":t==="short"?"Isian Singkat":"Esai"}
function questionBuilderHTML(kind,item){
 return `<div class="builder-box"><div class="builder-head"><h4>Tambah soal ke ${kind==="material"?"Materi":"Ulangan"}</h4><button class="secondary-btn close-builder">Tutup</button></div><input class="student-input builder-question" placeholder="Tulis pertanyaan..."><select class="student-input builder-type"><option value="mcq">Pilihan Ganda A–D</option><option value="truefalse">Benar / Salah</option><option value="short">Isian Singkat</option><option value="essay">Esai</option></select><div class="builder-answer-fields"></div><button class="primary-btn save-builder-question" data-kind="${kind}" data-id="${item.id}">Simpan Soal</button></div>`;
}
function examBuilderHTML(exam){
 const qs=getAllQuestions(exam.classId,exam.subject);
 const selected=new Set(exam.questionIds.map(String));
 return `<div class="builder-box"><div class="builder-head"><h4>Pilih soal untuk ${esc(exam.title)}</h4><button class="secondary-btn close-builder">Tutup</button></div><p class="builder-help">Centang soal yang ingin dimasukkan. Pilihan ini berdiri sendiri dan tidak mengubah Materi.</p><div class="question-picker">${qs.map(q=>`<label class="question-picker-item"><input type="checkbox" class="exam-question-check" value="${esc(q.id)}" ${selected.has(String(q.id))?"checked":""}><span><b>${esc(q.question)}</b><small>${questionTypeLabel(q.type)}${q.source==="builtin"?" · Soal bawaan":""}</small></span></label>`).join("")}</div><button class="primary-btn save-exam-selection" data-id="${exam.id}">Simpan Pilihan (${selected.size})</button></div>`;
}
function renderBuilderAnswers(container,type){
 if(type==="mcq")container.innerHTML=`<div class="mcq-fields">${["A","B","C","D"].map((l,i)=>`<input class="student-input builder-opt" data-opt="${i}" placeholder="Pilihan ${l}">`).join("")}</div><select class="student-input builder-key"><option value="0">Kunci: A</option><option value="1">Kunci: B</option><option value="2">Kunci: C</option><option value="3">Kunci: D</option></select>`;
 else if(type==="truefalse")container.innerHTML=`<select class="student-input builder-key"><option value="true">Kunci: Benar</option><option value="false">Kunci: Salah</option></select>`;
 else container.innerHTML=`<textarea class="student-input builder-key" rows="4" placeholder="${type==="essay"?"Kunci/contoh jawaban esai":"Kunci jawaban"}"></textarea>`;
}
function saveBuilderQuestion(btn){
 const box=btn.closest(".builder-box"),kind=btn.dataset.kind,id=btn.dataset.id;
 const q=(box.querySelector(".builder-question").value||"").trim(),type=box.querySelector(".builder-type").value;
 if(!q){alert("Pertanyaan belum diisi.");return}
 const item={id:uid("q"),classId:kind==="material"?read(KEYS.materials).find(x=>x.id===id).classId:read(KEYS.exams).find(x=>x.id===id).classId,subject:kind==="material"?read(KEYS.materials).find(x=>x.id===id).subject:read(KEYS.exams).find(x=>x.id===id).subject,type,question:q,explanation:"Soal dibuat oleh guru.",source:"teacher"};
 if(type==="mcq"){item.options=[...box.querySelectorAll(".builder-opt")].map(x=>x.value.trim());if(item.options.some(x=>!x)){alert("Isi pilihan A, B, C, dan D.");return}item.answer=Number(box.querySelector(".builder-key").value)}
 else if(type==="truefalse")item.answer=box.querySelector(".builder-key").value==="true";
 else{item.answer=(box.querySelector(".builder-key").value||"").trim();if(!item.answer){alert("Kunci jawaban belum diisi.");return}}
 const bank=read(KEYS.questions);bank.push(item);write(KEYS.questions,bank);
 if(kind==="material"){const mats=read(KEYS.materials),m=mats.find(x=>x.id===id);m.questionIds.push(item.id);write(KEYS.materials,mats)}
 else{const exams=read(KEYS.exams),e=exams.find(x=>x.id===id);e.questionIds.push(item.id);write(KEYS.exams,exams)}
 teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab(kind==="material"?"materials":"exams");
}
function createMaterial(){
 const classId=Number($("materialClass").value),subject=$("materialSubject").value,title=$("materialTitle").value.trim(),description=$("materialDescription").value.trim();
 if(!classId||!subject||!title){alert("Pilih kelas, mata pelajaran, dan isi nama materi.");return}
 const mats=read(KEYS.materials);mats.unshift({id:uid("mat"),classId,subject,title,description,questionIds:[],createdAt:Date.now()});write(KEYS.materials,mats);teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab("materials");
}
function createExam(){
 const classId=Number($("examClass").value),subject=$("examSubject").value,title=$("examTitle").value.trim(),description=$("examDescription").value.trim(),duration=Number($("examDuration").value)||0;
 if(!classId||!subject||!title){alert("Pilih kelas, mata pelajaran, dan isi nama ulangan.");return}
 const exams=read(KEYS.exams);exams.unshift({id:uid("exam"),classId,subject,title,description,duration,questionIds:[],createdAt:Date.now()});write(KEYS.exams,exams);teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab("exams");
}
function deleteMaterial(id){if(!confirm("Hapus materi ini? Soalnya tetap tersimpan di bank soal."))return;write(KEYS.materials,read(KEYS.materials).filter(x=>x.id!==id));teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab("materials")}
function deleteExam(id){if(!confirm("Hapus ulangan ini? Soalnya tetap tersimpan di bank soal."))return;write(KEYS.exams,read(KEYS.exams).filter(x=>x.id!==id));teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab("exams")}
function saveExamSelection(btn){const id=btn.dataset.id,checks=[...document.querySelectorAll(`#examManager_${id} .exam-question-check:checked`)].map(x=>x.value),exams=read(KEYS.exams),e=exams.find(x=>x.id===id);e.questionIds=checks;write(KEYS.exams,exams);teacherContent.innerHTML=teacherHTML();bindTeacherUI();openTeacherTab("exams")}
function openTeacherTab(tab){
 const b=document.querySelector(`[data-teacher-tab="${tab}"]`);if(b)b.click();
}
function bindTeacherUI(){
 document.querySelectorAll("[data-teacher-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".teacher-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");["results","materials","exams"].forEach(t=>{const el=$("teacher"+t.charAt(0).toUpperCase()+t.slice(1)+"Area");if(el)el.classList.toggle("hidden",t!==b.dataset.teacherTab)});if(b.dataset.teacherTab==="materials"||b.dataset.teacherTab==="exams")bindAdminCards()});
 const refresh=()=>{const classId=$("teacherClass")?.value,subject=$("teacherSubject")?.value,type=$("teacherContentType")?.value;const rows=getResults().filter(x=>(!classId||String(x.classId)===classId)&&(!subject||x.subject===subject)&&(!type||x.contentType===type));$("teacherTableWrap").innerHTML=teacherTable(rows);$("teacherCount").textContent=rows.length;$("teacherStudents").textContent=new Set(rows.map(x=>x.studentName)).size;$("teacherAverage").textContent=rows.length?Math.round(rows.reduce((n,x)=>n+x.score,0)/rows.length):0;$("teacherBest").textContent=rows.length?Math.max(...rows.map(x=>x.score)):0};
 if($("teacherClass"))$("teacherClass").onchange=refresh;if($("teacherSubject"))$("teacherSubject").onchange=refresh;if($("teacherContentType"))$("teacherContentType").onchange=refresh;
 if($("exportResults"))$("exportResults").onclick=exportResultsCSV;
 if($("clearResults"))$("clearResults").onclick=()=>{if(confirm("Hapus semua hasil yang tersimpan di browser ini?")){localStorage.removeItem(KEYS.results);teacherContent.innerHTML=teacherHTML();bindTeacherUI()}};
 if($("createMaterial"))$("createMaterial").onclick=createMaterial;if($("createExam"))$("createExam").onclick=createExam;
 bindAdminCards();
}
function bindAdminCards(){
 document.querySelectorAll(".manage-material,.manage-exam").forEach(b=>b.onclick=()=>{const id=b.dataset.id,el=$(b.classList.contains("manage-material")?"materialManager_"+id:"examManager_"+id);el.classList.toggle("hidden");if(el&&!el.classList.contains("hidden")){const type=b.classList.contains("manage-material")?"material":"exam";if(type==="material"){const sel=el.querySelector(".builder-type");if(sel){renderBuilderAnswers(el.querySelector(".builder-answer-fields"),sel.value);sel.onchange=()=>renderBuilderAnswers(el.querySelector(".builder-answer-fields"),sel.value)}}}});
 document.querySelectorAll(".close-builder").forEach(b=>b.onclick=()=>b.closest(".inline-manager").classList.add("hidden"));
 document.querySelectorAll(".save-builder-question").forEach(b=>b.onclick=()=>saveBuilderQuestion(b));
 document.querySelectorAll(".save-exam-selection").forEach(b=>b.onclick=()=>saveExamSelection(b));
 document.querySelectorAll(".delete-material").forEach(b=>b.onclick=()=>deleteMaterial(b.dataset.id));
 document.querySelectorAll(".delete-exam").forEach(b=>b.onclick=()=>deleteExam(b.dataset.id));
}
function teacherTable(rows){
 if(!rows.length)return '<div class="empty-table">Tidak ada hasil sesuai filter.</div>';
 return `<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Kelas</th><th>Mapel</th><th>Konten</th><th>Jenis</th><th>Nilai</th><th>Benar/Salah</th><th>Waktu</th><th>Tanggal</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.studentName)}</b></td><td>${x.classId}</td><td>${esc(x.subjectName)}</td><td>${esc(x.contentTitle||"-")}</td><td>${x.contentType==="exam"?"Ulangan":"Materi"}</td><td><strong class="score-text">${x.score}</strong>${x.pendingEssay?'<small class="pending-score"> + esai menunggu pemeriksaan</small>':""}</td><td>${x.correct}/${x.wrong}</td><td>${formatTime(x.duration)}</td><td>${esc(x.date)}</td></tr>`).join("")}</tbody></table></div>`;
}
function exportResultsCSV(){
 const rows=getResults(),head=["Nama","Kelas","Mata Pelajaran","Konten","Jenis","Nilai","Benar","Salah","Total","Durasi","Tanggal"],lines=[head.join(",")];
 rows.forEach(x=>lines.push([x.studentName,x.classId,x.subjectName,x.contentTitle||"",x.contentType==="exam"?"Ulangan":"Materi",x.score,x.correct,x.wrong,x.total,formatTime(x.duration),x.date].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")));
 const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="hasil-belajar-bimbel.csv";a.click();URL.revokeObjectURL(a.href);
}
function openTeacher(){
 const key=prompt("Masukkan kata kunci Guru:");if(key===null)return;if(key!==TEACHER_KEY){alert("Kata kunci Guru salah.");return}
 clearInterval(state.timer);teacherSection.classList.remove("hidden");teacherSection.scrollIntoView({behavior:"smooth"});teacherContent.innerHTML=teacherHTML();bindTeacherUI();
}
$("startBtn").onclick=()=>kelasSection.scrollIntoView({behavior:"smooth"});
$("teacherBtn").onclick=openTeacher;
$("closeTeacherBtn").onclick=()=>{teacherSection.classList.add("hidden");kelasSection.scrollIntoView({behavior:"smooth"})};
classGrid.onclick=e=>{const b=e.target.closest("[data-class]");if(b)chooseClass(Number(b.dataset.class))};
subjectGrid.onclick=e=>{const b=e.target.closest("[data-subject]");if(b)chooseSubject(b.dataset.subject)};
document.querySelectorAll(".learning-card").forEach(b=>b.onclick=()=>openPage(b.dataset.page));
workspaceContent.onclick=e=>{const start=e.target.closest(".content-start");if(start){launchContent(start.dataset.contentType,start.dataset.contentId)}};
$("backBtn").onclick=()=>{clearInterval(state.timer);workspace.classList.add("hidden");menuSection.scrollIntoView({behavior:"smooth"})};
$("year").textContent=new Date().getFullYear();renderClasses();renderSubjects();