let timeLeft = 20;
let timerInterval = null;
let timerStarted = false;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startTimerBtn");
const ring = document.querySelector(".timer-ring circle");

const FULL_DASH = 113;

// 🔊 SINGLE TIMER SOUND
const timerSound = new Audio("sounds/timer.mp3");
timerSound.volume = 0.4;

function updateTimerUI(){
  timerEl.textContent = timeLeft;

  // circle progress
  ring.style.strokeDashoffset =
    FULL_DASH - (timeLeft / 20) * FULL_DASH;

  // turn red in last 5 seconds
  ring.style.stroke = timeLeft <= 5 ? "#ff8a8a" : "#4dd6ff";
}

function startTimer(){
  if(timerStarted) return;
  timerStarted = true;
  startBtn.disabled = true;

  timerInterval = setInterval(()=>{
    timeLeft--;

    // play single sound
    timerSound.currentTime = 0;
    timerSound.play().catch(()=>{});

    updateTimerUI();

    if(timeLeft <= 0){
      stopTimer();
      if(typeof handleTimeUp === "function"){
        handleTimeUp();
      }
    }
  },1000);
}

function stopTimer(){
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer(){
  stopTimer();
  timerStarted = false;
  timeLeft = 20;
  startBtn.disabled = false;
  updateTimerUI();
}

startBtn.onclick = startTimer;
updateTimerUI();
