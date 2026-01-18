document.addEventListener("DOMContentLoaded",()=>{

/* ---------- ELEMENTS ---------- */
const loading = document.getElementById("loading");
const quiz = document.getElementById("quiz");

const qEl = document.getElementById("question");
const oEl = document.getElementById("options");
const fEl = document.getElementById("feedback");
const nEl = document.getElementById("next");
const pEl = document.getElementById("progress");
const dEl = document.getElementById("difficulty");
const skipBtn = document.getElementById("skip");

/* ---------- STATE ---------- */
let quizData = [];
let i = Number(localStorage.getItem("quizIndex")) || 0;
let locked = false;

/* ---------- LOAD DATA ---------- */
setTimeout(()=>{
  loading.style.display = "none";
  quiz.style.display = "block";

  fetch("questions.json")
    .then(r=>r.json())
    .then(d=>{
      quizData = d;
      load();
    });
},2000);

/* ---------- HELPERS ---------- */
function shuffleOptions(q){
  const correct = q.options[q.answer];
  q.options = q.options
    .map(o=>({o,sort:Math.random()}))
    .sort((a,b)=>a.sort-b.sort)
    .map(x=>x.o);
  q.answer = q.options.indexOf(correct);
}

/* ---------- LOAD QUESTION ---------- */
function load(){
  resetTimer();               // 🔹 timer reset (manual start)
  locked = false;

  const q = quizData[i];
  shuffleOptions(q);

  qEl.textContent = q.question;
  pEl.textContent = `Q ${i+1}/${quizData.length}`;
  dEl.textContent = q.difficulty || "";

  oEl.innerHTML = "";
  oEl.classList.remove("focused");
  fEl.style.display = "none";
  nEl.style.display = "none";

  q.options.forEach((t,idx)=>{
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `<span class="label">${"ABCD"[idx]}.</span>${t}`;
    div.onclick = ()=>select(idx);
    oEl.appendChild(div);
  });

  localStorage.setItem("quizIndex", i);
}

/* ---------- OPTION SELECT ---------- */
function select(idx){
  if(locked) return;

  stopTimer();                // 🔹 stop timer on answer
  locked = true;

  oEl.classList.add("focused");
  [...oEl.children].forEach((o,j)=>{
    j===idx ? o.classList.add("focus") : o.classList.add("fade");
  });

  const q = quizData[i];

  if(idx === q.answer){
    playSound("correct");     // 🔊 correct sound
    localStorage.setItem(
      "correct",
      Number(localStorage.getItem("correct")||0)+1
    );
  }else{
    playSound("wrong");       // 🔊 wrong sound
  }

  localStorage.setItem("total", quizData.length);

  let html = idx===q.answer
    ? `<div class="correct"><b>Correct</b></div><p>${q.explanation}</p>`
    : `<div class="wrong"><b>Incorrect</b></div>
       <p><b>Correct:</b> ${q.options[q.answer]}</p>
       <p>${q.explanation}</p>`;

  if(q.fact){
    html += `<div class="fact"><b>Fact:</b> ${q.fact}</div>`;
  }

  fEl.innerHTML = html;
  fEl.style.display = "block";

  setTimeout(()=>nEl.style.display="inline-block",400);
}

/* ---------- TIMER TIME-UP ---------- */
window.timeUp = function(){
  if(locked) return;
  locked = true;

  playSound("wrong");         // 🔊 timeout sound

  const q = quizData[i];

  oEl.classList.add("focused");
  [...oEl.children].forEach(o=>o.classList.add("fade"));

  fEl.innerHTML = `
    <div class="wrong"><b>Time’s up!</b></div>
    <p><b>Correct:</b> ${q.options[q.answer]}</p>
    <p>${q.explanation}</p>
  `;

  if(q.fact){
    fEl.innerHTML += `<div class="fact"><b>Fact:</b> ${q.fact}</div>`;
  }

  fEl.style.display = "block";
  nEl.style.display = "inline-block";
};

/* ---------- NEXT ---------- */
nEl.onclick = ()=>{
  i++;
  if(i < quizData.length){
    load();
  }else{
    localStorage.removeItem("quizIndex");
    location.href = "results.html";
  }
};

/* ---------- SKIP ---------- */
skipBtn.onclick = ()=>{
  if(locked) return;
  i++;
  if(i < quizData.length){
    load();
  }else{
    localStorage.removeItem("quizIndex");
    location.href = "results.html";
  }
};

});
