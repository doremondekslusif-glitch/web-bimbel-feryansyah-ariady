const state = {
  classId: null,
  subject: null,
  page: null
};

const classes = Array.from({length: 6}, (_, i) => ({
  id: i + 1,
  label: "Kelas " + (i + 1)
}));

const subjects = [
  {id:"matematika", name:"Matematika", icon:"🔢", desc:"Angka & logika"},
  {id:"bahasa-indonesia", name:"Bahasa Indonesia", icon:"📚", desc:"Membaca & menulis"},
  {id:"ipa", name:"IPA", icon:"🔬", desc:"Sains & alam"},
  {id:"pai", name:"PAI", icon:"🕌", desc:"Pendidikan agama"}
];

const classGrid = document.getElementById("classGrid");
const subjectGrid = document.getElementById("subjectGrid");
const kelasSection = document.getElementById("kelasSection");
const mapelSection = document.getElementById("mapelSection");
const menuSection = document.getElementById("menuSection");
const workspace = document.getElementById("workspace");
const classLabel = document.getElementById("classLabel");
const subjectLabel = document.getElementById("subjectLabel");
const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceSubtitle = document.getElementById("workspaceSubtitle");
const workspaceContent = document.getElementById("workspaceContent");

function renderClasses() {
  classGrid.innerHTML = classes.map(item => `
    <button class="choice-card ${state.classId === item.id ? "selected" : ""}" data-class="${item.id}">
      <div class="class-number">${item.id}</div>
      <small>Kelas ${item.id} SD</small>
    </button>
  `).join("");
}

function renderSubjects() {
  subjectGrid.innerHTML = subjects.map(item => `
    <button class="choice-card subject-card ${state.subject === item.id ? "selected" : ""}" data-subject="${item.id}">
      <span class="subject-icon">${item.icon}</span>
      <span><strong>${item.name}</strong><small>${item.desc}</small></span>
    </button>
  `).join("");
}

function chooseClass(id) {
  state.classId = id;
  state.subject = null;
  state.page = null;
  classLabel.textContent = "Kelas " + id;
  subjectLabel.textContent = "Belum dipilih";
  renderClasses();
  renderSubjects();
  mapelSection.classList.remove("hidden");
  menuSection.classList.add("hidden");
  workspace.classList.add("hidden");
  setTimeout(() => mapelSection.scrollIntoView({behavior:"smooth", block:"start"}), 60);
}

function chooseSubject(id) {
  state.subject = id;
  state.page = null;
  const subject = subjects.find(item => item.id === id);
  subjectLabel.textContent = subject.name;
  renderSubjects();
  menuSection.classList.remove("hidden");
  workspace.classList.add("hidden");
  setTimeout(() => menuSection.scrollIntoView({behavior:"smooth", block:"start"}), 60);
}

function openPage(page) {
  if (!state.classId || !state.subject) return;
  state.page = page;
  const subject = subjects.find(item => item.id === state.subject);
  const titles = {
    materi: ["Materi", "Pelajari materi " + subject.name + " untuk kelas " + state.classId + "."],
    latihan: ["Latihan", "Kerjakan latihan " + subject.name + " dan asah kemampuanmu."],
    ulangan: ["Ulangan", "Uji pemahamanmu setelah belajar."],
    hasil: ["Hasil Belajar", "Ringkasan hasil belajar akan tampil di sini."]
  };
  workspaceTitle.textContent = titles[page][0];
  workspaceSubtitle.textContent = titles[page][1];
  workspaceContent.innerHTML = getPageContent(page, subject);
  workspace.classList.remove("hidden");
  setTimeout(() => workspace.scrollIntoView({behavior:"smooth", block:"start"}), 60);
}

function getPageContent(page, subject) {
  const common = `
    <div class="panel">
      <div class="empty-icon">${subject.icon}</div>
      <h3>${page === "materi" ? "Materi " + subject.name : page === "latihan" ? "Latihan " + subject.name : page === "ulangan" ? "Ulangan " + subject.name : "Rekap hasil belajar"}</h3>
      <p>Bagian ini sudah disiapkan sebagai ruang belajar. Konten soal, materi, dan penyimpanan hasil akan kita bangun pada tahap berikutnya.</p>
      <div class="info-grid">
        <div class="info-box"><strong>Kelas ${state.classId}</strong><span>Kelas yang dipilih</span></div>
        <div class="info-box"><strong>${subject.name}</strong><span>Mata pelajaran</span></div>
        <div class="info-box"><strong>0</strong><span>Hasil tersimpan</span></div>
      </div>
      <div class="notice">💡 Tahap pertama fokus pada alur dan tampilan. Setelah ini kita bisa memasukkan materi dan soal sungguhan tanpa mengubah fondasi websitenya.</div>
    </div>`;
  return common;
}

document.getElementById("startBtn").addEventListener("click", () => {
  kelasSection.scrollIntoView({behavior:"smooth", block:"start"});
});

classGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-class]");
  if (!button) return;
  chooseClass(Number(button.dataset.class));
});

subjectGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-subject]");
  if (!button) return;
  chooseSubject(button.dataset.subject);
});

document.querySelectorAll(".learning-card").forEach(button => {
  button.addEventListener("click", () => openPage(button.dataset.page));
});

document.getElementById("backBtn").addEventListener("click", () => {
  workspace.classList.add("hidden");
  menuSection.scrollIntoView({behavior:"smooth", block:"start"});
});

document.getElementById("year").textContent = new Date().getFullYear();
renderClasses();
renderSubjects();