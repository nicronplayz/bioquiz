/* ---------- TIMER ---------- */
let timeLeft = 30;
let interval = null;
let running = false;

const timerEl = document.getElementById("timer");
const ring = document.querySelector(".timer-ring circle");
const timerWrap = document.getElementById("timerWrap");

const timerSound = new Audio("sounds/timer.mp3");
timerSound.loop = true;
timerSound.volume = 0.4;

const FULL = 113;

function resetTimer(){
  clearInterval(interval);
  running = false;
  timeLeft = 30;
  timerEl.textContent = 30;
  ring.style.strokeDashoffset = 0;
  timerSound.pause();
  timerSound.currentTime = 0;
}

function startTimer(){
  if(running) return;
  running = true;

  timerSound.play().catch(()=>{});

  interval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;
    ring.style.strokeDashoffset = FULL - (timeLeft/30)*FULL;

    if(timeLeft <= 0){
      clearInterval(interval);
      timerSound.pause();
      timerSound.currentTime = 0;
    }
  },1000);
}

timerWrap.onclick = startTimer;
