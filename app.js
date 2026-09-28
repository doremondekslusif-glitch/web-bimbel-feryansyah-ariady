const state={classId:null,subject:null,page:null,mode:null,questions:[],answers:[],index:0,started:0,timer:null,studentName:""};
/*
 * KATA KUNCI GURU
 * Ganti teks di bawah dengan kata kunci rahasia milik Anda sendiri.
 * Catatan: karena website ini masih statis, kata kunci di browser bukan
 * pengamanan server. Untuk keamanan penuh, nanti kita pindahkan autentikasi
 * guru ke backend/database.
 */
const TEACHER_KEY="Kusanagikun18";
const classes=Array.from({length:6},(_,i)=>({id:i+1,label:"Kelas "+(i+1)}));
const subjects=[
{id:"matematika",name:"Matematika",icon:"🔢",desc:"Angka & logika"},
{id:"bahasa-indonesia",name:"Bahasa Indonesia",icon:"📚",desc:"Membaca & menulis"},
{id:"ipa",name:"IPA",icon:"🔬",desc:"Sains & alam"},
{id:"pai",name:"PAI",icon:"🕌",desc:"Pendidikan agama"}];
/* BANK SOAL MANUAL. Edit bagian ini untuk mengganti/menambah soal. */
const questionBank={
matematika:[
{question:"Berapakah 7 + 5?",options:["10","11","12","13"],answer:2,explanation:"7 + 5 = 12."},
{question:"Berapakah 15 - 8?",options:["5","6","7","8"],answer:2,explanation:"15 - 8 = 7."},
{question:"Berapakah 4 × 3?",options:["7","10","12","14"],answer:2,explanation:"4 × 3 = 12."},
{question:"Berapakah 20 ÷ 5?",options:["2","3","4","5"],answer:2,explanation:"20 ÷ 5 = 4."},
{question:"Bilangan manakah yang paling besar?",options:["18","21","19","17"],answer:1,explanation:"21 adalah yang paling besar."}],
"bahasa-indonesia":[
{question:"Kalimat untuk menanyakan sesuatu disebut kalimat ...",options:["berita","tanya","perintah","seru"],answer:1,explanation:"Kalimat tanya digunakan untuk menanyakan sesuatu."},
{question:"Lawan kata dari 'besar' adalah ...",options:["tinggi","panjang","kecil","lebar"],answer:2,explanation:"Lawan kata besar adalah kecil."},
{question:"Nama orang, tempat, atau benda termasuk ...",options:["kata benda","kata kerja","kata sifat","kata tanya"],answer:0,explanation:"Nama orang, tempat, dan benda termasuk kata benda."},
{question:"Tanda baca di akhir kalimat tanya adalah ...",options:[".","!",",","?"],answer:3,explanation:"Kalimat tanya diakhiri tanda tanya."},
{question:"Kegiatan memahami tulisan disebut ...",options:["menulis","membaca","berbicara","berhitung"],answer:1,explanation:"Membaca adalah kegiatan memahami tulisan."}],
ipa:[
{question:"Bagian tubuh untuk melihat adalah ...",options:["telinga","hidung","mata","tangan"],answer:2,explanation:"Mata digunakan untuk melihat."},
{question:"Tumbuhan membutuhkan air dan ... untuk membuat makanan.",options:["cahaya matahari","batu","plastik","pasir"],answer:0,explanation:"Cahaya matahari membantu tumbuhan membuat makanan."},
{question:"Hewan yang berkembang biak dengan bertelur adalah ...",options:["ayam","kucing","sapi","kambing"],answer:0,explanation:"Ayam berkembang biak dengan bertelur."},
{question:"Air yang membeku berubah menjadi ...",options:["uap","es","awan","embun"],answer:1,explanation:"Air yang membeku menjadi es."},
{question:"Sumber cahaya dan panas utama bagi Bumi adalah ...",options:["Bulan","bintang kecil","Matahari","angin"],answer:2,explanation:"Matahari adalah sumber cahaya dan panas utama bagi Bumi."}],
pai:[
{question:"Rukun Islam yang pertama adalah ...",options:["salat","zakat","syahadat","puasa"],answer:2,explanation:"Rukun Islam pertama adalah syahadat."},
{question:"Salat wajib sehari semalam berjumlah ... waktu.",options:["3","4","5","6"],answer:2,explanation:"Salat wajib terdiri dari lima waktu."},
{question:"Kitab suci umat Islam adalah ...",options:["Al-Qur'an","Taurat","Zabur","Injil"],answer:0,explanation:"Kitab suci umat Islam adalah Al-Qur'an."},
{question:"Sebelum salat, seorang muslim biasanya melakukan ...",options:["tidur","wudu","makan","bermain"],answer:1,explanation:"Wudu dilakukan sebagai persiapan sebelum salat."},
{question:"Berkata sesuai kenyataan disebut ...",options:["sabar","jujur","malas","marah"],answer:1,explanation:"Jujur berarti berkata sesuai kenyataan."}]};

const $=id=>document.getElementById(id);
const classGrid=$("classGrid"),subjectGrid=$("subjectGrid"),kelasSection=$("kelasSection"),mapelSection=$("mapelSection"),menuSection=$("menuSection"),workspace=$("workspace"),workspaceContent=$("workspaceContent"),teacherSection=$("teacherSection"),teacherContent=$("teacherContent");
function renderClasses(){classGrid.innerHTML=classes.map(x=>`<button class="choice-card ${state.classId===x.id?"selected":""}" data-class="${x.id}"><div class="class-number">${x.id}</div><small>Kelas ${x.id} SD</small></button>`).join("")}
function renderSubjects(){subjectGrid.innerHTML=subjects.map(x=>`<button class="choice-card subject-card ${state.subject===x.id?"selected":""}" data-subject="${x.id}"><span class="subject-icon">${x.icon}</span><span><strong>${x.name}</strong><small>${x.desc}</small></span></button>`).join("")}
function chooseClass(id){state.classId=id;state.subject=null;$("classLabel").textContent="Kelas "+id;$("subjectLabel").textContent="Belum dipilih";renderClasses();renderSubjects();mapelSection.classList.remove("hidden");menuSection.classList.add("hidden");workspace.classList.add("hidden");mapelSection.scrollIntoView({behavior:"smooth"})}
function chooseSubject(id){state.subject=id;const s=subjects.find(x=>x.id===id);$("subjectLabel").textContent=s.name;renderSubjects();menuSection.classList.remove("hidden");workspace.classList.add("hidden");menuSection.scrollIntoView({behavior:"smooth"})}
function openPage(page){if(!state.classId||!state.subject)return;state.page=page;const s=subjects.find(x=>x.id===state.subject);const titles={materi:["Materi","Pelajari materi "+s.name+" untuk kelas "+state.classId+"."],latihan:["Latihan","Kerjakan latihan "+s.name+" dan lihat nilai langsung."],ulangan:["Ulangan","Uji pemahamanmu dengan penilaian otomatis."],hasil:["Hasil Belajar","Lihat riwayat hasil pada perangkat ini."]};$("workspaceTitle").textContent=titles[page][0];$("workspaceSubtitle").textContent=titles[page][1];workspaceContent.innerHTML=page==="hasil"?historyHTML():page==="latihan"||page==="ulangan"?launchHTML(page,s):materialHTML(s);workspace.classList.remove("hidden");workspace.scrollIntoView({behavior:"smooth"})}
function materialHTML(s){return `<div class="panel"><div class="empty-icon">${s.icon}</div><h3>Materi ${s.name}</h3><p>Ruang materi siap diisi secara manual sesuai kelas dan kebutuhan siswa.</p><div class="info-grid"><div class="info-box"><strong>Kelas ${state.classId}</strong><span>Kelas</span></div><div class="info-box"><strong>${s.name}</strong><span>Mata pelajaran</span></div><div class="info-box"><strong>Manual</strong><span>Sumber materi</span></div></div><div class="notice">📘 Materi tidak membutuhkan Gemini, AI, atau layanan eksternal.</div></div>`}
function launchHTML(mode,s){const n=questionBank[state.subject].length;return `<div class="panel quiz-launch-panel"><div class="quiz-icon">${mode==="latihan"?"✏️":"📝"}</div><h3>${mode==="latihan"?"Latihan":"Ulangan"} ${s.name}</h3><p>${n} soal pilihan ganda. Nilai, jawaban benar/salah, waktu, dan pembahasan tampil setelah selesai.</p><div class="quiz-info-grid"><div class="info-box"><strong>${n}</strong><span>Jumlah soal</span></div><div class="info-box"><strong>100</strong><span>Nilai maksimal</span></div><div class="info-box"><strong>Otomatis</strong><span>Penilaian</span></div></div><label class="field-label">Nama siswa</label><input id="studentName" class="student-input" maxlength="60" placeholder="Tulis nama siswa"><button class="primary-btn quiz-start-btn" id="startQuizBtn">Mulai ${mode==="latihan"?"Latihan":"Ulangan"} →</button><div class="notice">💡 Soal dan kunci jawaban dikelola manual di <b>app.js</b>. Tidak ada Gemini/AI.</div></div>`}
function startQuiz(){const input=$("studentName"),name=input.value.trim();if(!name){input.classList.add("input-error");input.focus();return}state.studentName=name;state.mode=state.page;state.questions=questionBank[state.subject].map(q=>({...q}));state.answers=Array(state.questions.length).fill(null);state.index=0;state.started=Date.now();clearInterval(state.timer);state.timer=setInterval(updateTimer,1000);renderQuestion()}
function formatTime(ms){const t=Math.floor(Math.max(0,ms)/1000),m=Math.floor(t/60),s=t%60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
function updateTimer(){const el=$("quizTimer");if(el)el.textContent=formatTime(Date.now()-state.started)}
function renderQuestion(){const q=state.questions[state.index],total=state.questions.length,chosen=state.answers[state.index];workspaceContent.innerHTML=`<div class="quiz-panel"><div class="quiz-topline"><span>Soal ${state.index+1} dari ${total}</span><span>⏱ <b id="quizTimer">${formatTime(Date.now()-state.started)}</b></span></div><div class="progress-track"><div class="progress-fill" style="width:${((state.index+1)/total)*100}%"></div></div><div class="question-number">PERTANYAAN ${state.index+1}</div><h3 class="question-text">${q.question}</h3><div class="options-list">${q.options.map((o,i)=>`<button class="answer-option ${chosen===i?"selected":""}" data-answer="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join("")}</div><div class="quiz-actions"><button class="secondary-btn" id="prevQuestion" ${state.index===0?"disabled":""}>← Sebelumnya</button><button class="primary-btn" id="nextQuestion">${state.index===total-1?"Selesai & Lihat Nilai":"Soal Berikutnya →"}</button></div></div>`;updateTimer();document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{state.answers[state.index]=Number(b.dataset.answer);renderQuestion()});$("prevQuestion").onclick=()=>{if(state.index>0){state.index--;renderQuestion()}};$("nextQuestion").onclick=()=>{if(state.answers[state.index]===null){notice("Pilih salah satu jawaban terlebih dahulu.");return}if(state.index===total-1)finishQuiz();else{state.index++;renderQuestion()}}}
function notice(msg){const n=document.createElement("div");n.className="quiz-inline-notice";n.textContent="⚠️ "+msg;document.querySelector(".quiz-actions").before(n)}
function finishQuiz(){clearInterval(state.timer);const correct=state.answers.reduce((n,a,i)=>n+(a===state.questions[i].answer?1:0),0),total=state.questions.length,result={id:Date.now(),studentName:state.studentName,classId:state.classId,subject:state.subject,subjectName:subjects.find(s=>s.id===state.subject).name,mode:state.mode,score:Math.round(correct/total*100),correct,wrong:total-correct,total,duration:Date.now()-state.started,date:new Date().toLocaleString("id-ID")};const h=getResults();h.unshift(result);localStorage.setItem("bimbel_results_v1",JSON.stringify(h.slice(0,100)));resultHTML(result)}
function resultHTML(r){const s=subjects.find(x=>x.id===state.subject);workspaceContent.innerHTML=`<div class="result-panel"><div class="result-hero"><div class="result-trophy">🏆</div><span class="section-kicker">HASIL SELESAI</span><h3>${esc(r.studentName)}</h3><p>${r.mode==="latihan"?"Latihan":"Ulangan"} · Kelas ${r.classId} · ${s.name}</p><div class="score-circle"><strong>${r.score}</strong><span>/ 100</span></div><b class="result-message">${r.score>=80?"Bagus sekali! 🌟":r.score>=60?"Sudah bagus. Pelajari lagi yang salah. 💪":"Pelajari pembahasannya lalu coba lagi. 📚"}</b></div><div class="result-stats"><div><strong>${r.correct}</strong><span>Benar</span></div><div><strong>${r.wrong}</strong><span>Salah</span></div><div><strong>${r.total}</strong><span>Total soal</span></div><div><strong>${formatTime(r.duration)}</strong><span>Waktu</span></div></div><div class="result-actions"><button class="primary-btn" id="reviewAnswers">Lihat Pembahasan</button><button class="secondary-btn" id="retryQuiz">Kerjakan Lagi</button></div><div id="reviewArea" class="review-area hidden"></div></div>`;$("reviewAnswers").onclick=()=>{const a=$("reviewArea");a.classList.toggle("hidden");if(!a.classList.contains("hidden"))a.innerHTML=state.questions.map((q,i)=>{const c=state.answers[i],ok=c===q.answer;return `<div class="review-item ${ok?"correct":"wrong"}"><strong>${i+1}. ${q.question}</strong><div>Jawaban siswa: <b>${c===null?"Tidak dijawab":q.options[c]}</b></div><div>Kunci jawaban: <b>${q.options[q.answer]}</b></div><small>${q.explanation}</small></div>`}).join("")};$("retryQuiz").onclick=()=>{state.answers=Array(state.questions.length).fill(null);state.index=0;state.started=Date.now();state.timer=setInterval(updateTimer,1000);renderQuestion()}}
function teacherHTML(){
const all=getResults();
if(!all.length)return `<div class="panel"><div class="empty-icon">📊</div><h3>Belum ada data hasil</h3><p>Hasil siswa yang dikerjakan pada perangkat ini akan tampil di sini.</p></div>`;
const avg=Math.round(all.reduce((n,x)=>n+x.score,0)/all.length);
const students=new Set(all.map(x=>x.studentName)).size;
const best=Math.max(...all.map(x=>x.score));
return `<div class="teacher-panel">
<div class="teacher-toolbar">
<div class="teacher-filters">
<select id="teacherClass"><option value="">Semua kelas</option>${classes.map(x=>`<option value="${x.id}">Kelas ${x.id}</option>`).join("")}</select>
<select id="teacherSubject"><option value="">Semua mata pelajaran</option>${subjects.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select>
</div>
<div class="teacher-actions"><button class="secondary-btn" id="exportResults">⬇ Export CSV</button><button class="danger-btn" id="clearResults">Hapus Data</button></div>
</div>
<div class="teacher-stats"><div><strong id="teacherCount">${all.length}</strong><span>Pengerjaan</span></div><div><strong id="teacherStudents">${students}</strong><span>Siswa</span></div><div><strong id="teacherAverage">${avg}</strong><span>Rata-rata</span></div><div><strong id="teacherBest">${best}</strong><span>Nilai tertinggi</span></div></div>
<div id="teacherTableWrap">${teacherTable(all)}</div>
<div class="notice">💾 Data saat ini tersimpan di browser. Dashboard ini siap dipakai sebagai tampilan guru; untuk melihat hasil dari perangkat siswa lain, tahap berikutnya adalah menghubungkannya ke database bersama.</div>
</div>`;
}
function teacherTable(rows){
if(!rows.length)return '<div class="empty-table">Tidak ada hasil sesuai filter.</div>';
return `<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Kelas</th><th>Mapel</th><th>Jenis</th><th>Nilai</th><th>Benar/Salah</th><th>Waktu</th><th>Tanggal</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.studentName)}</b></td><td>${x.classId}</td><td>${esc(x.subjectName)}</td><td>${x.mode==="latihan"?"Latihan":"Ulangan"}</td><td><strong class="score-text">${x.score}</strong></td><td>${x.correct}/${x.wrong}</td><td>${formatTime(x.duration)}</td><td>${esc(x.date)}</td></tr>`).join("")}</tbody></table></div>`;
}
function openTeacher(){
const key=prompt("Masukkan kata kunci Guru:");
if(key===null)return;
if(key!==TEACHER_KEY){alert("Kata kunci Guru salah.");return;}
clearInterval(state.timer);
teacherSection.classList.remove("hidden");
teacherSection.scrollIntoView({behavior:"smooth"});
teacherContent.innerHTML=teacherHTML();
const refresh=()=>{
const classId=$( "teacherClass").value,subject=$( "teacherSubject").value;
const rows=getResults().filter(x=>(!classId||String(x.classId)===classId)&&(!subject||x.subject===subject));
$( "teacherTableWrap").innerHTML=teacherTable(rows);
$( "teacherCount").textContent=rows.length;
$( "teacherStudents").textContent=new Set(rows.map(x=>x.studentName)).size;
$( "teacherAverage").textContent=rows.length?Math.round(rows.reduce((n,x)=>n+x.score,0)/rows.length):0;
$( "teacherBest").textContent=rows.length?Math.max(...rows.map(x=>x.score)):0;
};
$( "teacherClass").onchange=refresh;$( "teacherSubject").onchange=refresh;
$( "exportResults").onclick=exportResultsCSV;
$( "clearResults").onclick=()=>{if(confirm("Hapus semua hasil yang tersimpan di browser ini?")){localStorage.removeItem("bimbel_results_v1");openTeacher()}};
}
function exportResultsCSV(){
const rows=getResults();
if(!rows.length){alert("Belum ada data untuk diekspor.");return}
const header=["Nama","Kelas","Mata Pelajaran","Jenis","Nilai","Benar","Salah","Total","Durasi","Tanggal"];
const body=rows.map(x=>[x.studentName,x.classId,x.subjectName,x.mode==="latihan"?"Latihan":"Ulangan",x.score,x.correct,x.wrong,x.total,formatTime(x.duration),x.date]);
const csv=[header,...body].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
const blob=new Blob(["\\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="hasil-belajar-bimbel.csv";a.click();URL.revokeObjectURL(a.href);
}

function getResults(){return JSON.parse(localStorage.getItem("bimbel_results_v1")||"[]")}
function historyHTML(){const r=getResults().filter(x=>x.classId===state.classId&&x.subject===state.subject);if(!r.length)return `<div class="panel"><div class="empty-icon">🏆</div><h3>Belum ada hasil</h3><p>Hasil pengerjaan akan muncul di sini.</p><div class="notice">💾 Saat ini hasil disimpan di browser/perangkat ini. Agar guru dapat melihat hasil siswa dari perangkat lain, tahap berikutnya membutuhkan database/backend bersama.</div></div>`;const avg=Math.round(r.reduce((n,x)=>n+x.score,0)/r.length);return `<div class="history-panel"><div class="history-summary"><div><strong>${r.length}</strong><span>Pengerjaan</span></div><div><strong>${avg}</strong><span>Rata-rata</span></div><div><strong>${Math.max(...r.map(x=>x.score))}</strong><span>Nilai tertinggi</span></div></div><div class="history-list">${r.map(x=>`<div class="history-item"><div><strong>${esc(x.studentName)}</strong><small>${x.mode==="latihan"?"Latihan":"Ulangan"} · ${x.date}</small></div><div class="history-score">${x.score}<span>/100</span></div></div>`).join("")}</div></div>`}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
$("startBtn").onclick=()=>kelasSection.scrollIntoView({behavior:"smooth"});
$("teacherBtn").onclick=openTeacher;
$("closeTeacherBtn").onclick=()=>{teacherSection.classList.add("hidden");kelasSection.scrollIntoView({behavior:"smooth"})};
classGrid.onclick=e=>{const b=e.target.closest("[data-class]");if(b)chooseClass(Number(b.dataset.class))};
subjectGrid.onclick=e=>{const b=e.target.closest("[data-subject]");if(b)chooseSubject(b.dataset.subject)};
document.querySelectorAll(".learning-card").forEach(b=>b.onclick=()=>openPage(b.dataset.page));
workspaceContent.onclick=e=>{if(e.target.closest("#startQuizBtn"))startQuiz()};
$("backBtn").onclick=()=>{clearInterval(state.timer);workspace.classList.add("hidden");menuSection.scrollIntoView({behavior:"smooth"})};
$("year").textContent=new Date().getFullYear();renderClasses();renderSubjects();
