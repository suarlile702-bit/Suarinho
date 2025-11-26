/* ---------- NAVIGATION ---------- */
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const page = btn.dataset.page;
    pages.forEach(p => p.classList.toggle('active', p.dataset.page === page));
  });
});

/* ---------- CHATBOT ---------- */
const openChat = document.getElementById('openChat');
const chatbot = document.getElementById('chatbot');
const cbClose = document.getElementById('cbClose');
const cbMessages = document.getElementById('cbMessages');
const cbInput = document.getElementById('cbInput');
const cbSend = document.getElementById('cbSend');

openChat.addEventListener('click', () => { 
  chatbot.style.display = 'flex'; 
  openChat.style.display = 'none'; 
  botWelcome(); 
});
cbClose.addEventListener('click', () => { 
  chatbot.style.display = 'none'; 
  openChat.style.display = 'block'; 
});
cbSend.addEventListener('click', sendBot);
cbInput.addEventListener('keydown', (e) => { if (e.key==='Enter') sendBot(); });

function appendMessage(text, who='bot'){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.style.marginBottom = '8px';
  div.innerHTML = `<div style="font-size:13px;color:${who==='bot'?'#ddd':'#fff'}"><strong>${who==='bot'?'Biseduesi':'Ju'}:</strong> ${escapeHtml(text)}</div>`;
  cbMessages.appendChild(div);
  cbMessages.scrollTop = cbMessages.scrollHeight;
}

function botWelcome(){
  appendMessage('Përshëndetje! Më pyet për 28 & 29 Nëntor.');
}

function sendBot(){
  const q = cbInput.value.trim();
  if(!q) return;
  appendMessage(q, 'user');
  cbInput.value = '';
  setTimeout(()=> { appendMessage(generateBotAnswer(q)); }, 300);
}

function escapeHtml(s){ return s.replaceAll('<','&lt;').replaceAll('>','&gt;'); }

/* ---------- CHATBOT ANSWERS ---------- */
function generateBotAnswer(q){
  const text = q.toLowerCase();

  const qaList = [
    {keywords: ["Kur dhe nga kush u shpall pavaresia e shqiperise"], answer: "Pavarësia e Shqipërisë më 28 Nëntor 1912."},
    {keywords: ["Kush e ngriti flamurin ne vlore"], answer: "Ismail Qemali ngriti flamurin në Vlorë."},
    {keywords: ["Cila ishte ushtria qe luftoi per clirimin e Shqiperise"], answer: "Ushtria Nacional Clirimtare"},
    {keywords: ["shqiponja","flamur"], answer: "Shqiponja është e zezë."},
    {keywords: ["sfondi","flamur"], answer: "Sfondi i flamurit është i kuq."},
    {keywords: ["29","nentor"], answer: "29 Nëntori lidhet me përkujtimin e ngjarjeve historike pas shpalljes së Pavarësisë."}
  ];

  for(const qa of qaList){
    if(qa.keywords.every(k => text.includes(k))) return qa.answer;
  }

  return 'Më vjen keq, provoj pyetje më specifike.';
}

/* ---------- AUTH / PROFILE ---------- */
const loginBtn = document.getElementById('openLogin');
const signupBtn = document.getElementById('openSignup');
const authArea = document.getElementById('authArea');
const profileArea = document.getElementById('profileArea');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

loginBtn.addEventListener('click', () => openAuthForm('login'));
signupBtn.addEventListener('click', () => openAuthForm('signup'));
modalClose.addEventListener('click', () => modal.classList.add('hidden'));

document.addEventListener('DOMContentLoaded', () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if(storedUser) showProfile(storedUser);

  cbMessages.innerHTML = '<div style="color:#ddd;font-size:13px"><strong>Shembuj pyetjesh:</strong> "Kush ishte Skënderbeu?"</div>';
});

function openAuthForm(type){
  modal.classList.remove('hidden');
  modalContent.innerHTML = `
    <h3>${type==='login'?'Hyr':'Regjistrohu'}</h3>
    <form id="authForm">
      <label>Email:<input type="email" id="email" required></label>
      <label>Username:<input type="text" id="username" required></label>
      <label>Password:<input type="password" id="password" required></label>
      <button type="submit">${type==='login'?'Hyr':'Regjistrohu'}</button>
    </form>
    <div id="authMessage" style="color:red;margin-top:5px;"></div>
  `;

  const authForm = document.getElementById('authForm');
  const authMessage = document.getElementById('authMessage');

  authForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(type==='signup'){
      const user = { email, username, password };
      localStorage.setItem('user', JSON.stringify(user));
      showProfile(user);
      modal.classList.add('hidden');
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if(!storedUser){
        authMessage.textContent = "Nuk ka përdorues të regjistruar. Regjistrohu fillimisht.";
        return;
      }
      if(storedUser.email === email && storedUser.password === password){
        showProfile(storedUser);
        modal.classList.add('hidden');
      } else {
        authMessage.textContent = "Email ose fjalëkalimi gabim.";
      }
    }
  });
}

function showProfile(user){
  profileArea.innerHTML = `
    <p>Përshëndetje, ${user.username}!</p>
    <p>Email: ${user.email}</p>
    <button id="logoutBtn">Dil</button>
  `;
  authArea.style.display = 'none';
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    profileArea.innerHTML = '<p>Nuk jeni i identifikuar. Hyni ose regjistrohuni.</p>';
    authArea.style.display = 'block';
  });
}

/* ---------- QUIZ SYSTEM ---------- */
const quizSets = {
  easy:[
    {q:"Në cilën datë u shpall Pavarësia?", a:["28 Nëntor 1912","1 Janar 1900","17 Shkurt 1914"], correct:0},
    {q:"Kush ngriti flamurin në Vlorë?", a:["Ismail Qemali","Skënderbeu","Qemal Stafa"], correct:0},
    {q:"Cili simbol ndodhet në flamurin shqiptar?", a:["Shqiponja dykokë","Ylli","Kryqi"], correct:0},
    {q:"Çfarë përkujtojmë më 29 Nëntor?", a:["Ngjarje historike","Verën","Një ndeshje"], correct:0},
    {q:"Në cilin qytet u shpall pavarësia?", a:["Vlorë","Tiranë","Shkodër"], correct:0},
    {q:"Kush ishte kryetari i qeverisë së përkohshme?", a:["Ismail Qemali","Luigj Gurakuqi","Enver Hoxha"], correct:0},
    {q:"Çfarë simbolizon shqiponja dykrenare?", a:["Unitetin dhe historinë kombëtare","Një kafshë","Një mjet pune"], correct:0},
    {q:"Sa delegatë firmuan aktin e pavarësisë?", a:["40","35","50"], correct:0},
    {q:"Kush ishte delegati  i ri?", a:["Dhimitër Ilo","Isa Boletini","Skënderbeu"], correct:0},
    {q:"Ne cilin hotel u zhvillua mbledhja e shpalljes?", a:["Hotel Pavarësia","Hotel Tirana","Hotel Durrës"], correct:0},
  ]
};

let currentQuiz = null;
let currentIndex = 0;
let currentScore = 0;

const startQuizBtn = document.getElementById('startQuiz');
const levelSelect = document.getElementById('levelSelect');
const quizArea = document.getElementById('quizArea');
const questionCard = document.getElementById('questionCard');
const answersDiv = document.getElementById('answers');
const feedbackDiv = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const qProgress = document.getElementById('qProgress');

startQuizBtn.addEventListener('click', () => {
  const level = levelSelect.value;
  startQuiz(level);
});

function startQuiz(level){
  currentQuiz = shuffle(quizSets[level].slice());
  currentIndex = 0; currentScore = 0;
  quizArea.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion(){
  feedbackDiv.innerHTML = '';
  nextBtn.classList.add('hidden'); finishBtn.classList.add('hidden');
  const qObj = currentQuiz[currentIndex];
  qProgress.textContent = `Pyetja ${currentIndex+1} / ${currentQuiz.length}`;
  questionCard.innerHTML = `<div class="q-text">${qObj.q}</div>`;
  answersDiv.innerHTML = '';
  qObj.a.forEach((opt, idx)=>{
    const b = document.createElement('button');
    b.textContent = opt;
    b.addEventListener('click', ()=>onAnswerSelected(idx));
    answersDiv.appendChild(b);
  });
}

function onAnswerSelected(selectedIdx){
  const qObj = currentQuiz[currentIndex];
  const isCorrect = selectedIdx === qObj.correct;
  Array.from(answersDiv.children).forEach(b=>b.disabled=true);
  if(isCorrect){
    currentScore++;
    feedbackDiv.innerHTML = `<span style="color:#7CFC00;font-weight:600;">Sakt ✅</span>`;
    setTimeout(()=>{
      currentIndex++;
      if(currentIndex>=currentQuiz.length) finishQuiz(); else renderQuestion();
    },700);
  } else {
    feedbackDiv.innerHTML = `<span style="color:#ff6666;font-weight:600;">Gabim ✖ — përgjigjja e saktë: ${escapeHtml(qObj.a[qObj.correct])}</span>`;
    nextBtn.classList.remove('hidden');
  }
}

nextBtn.addEventListener('click', ()=>{
  currentIndex++;
  if(currentIndex>=currentQuiz.length) finishQuiz(); else renderQuestion();
});

finishBtn.addEventListener('click', ()=> finishQuiz());

function finishQuiz(){
  quizArea.classList.add('hidden');
  feedbackDiv.innerHTML = `Përfunduat: ${currentScore}/${currentQuiz.length}`;
}

function shuffle(arr){ 
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1)); 
    [arr[i],arr[j]]=[arr[j],arr[i]] 
  } 
  return arr; 
}
