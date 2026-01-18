let timeLeft = 20;
let timerInterval = null;
let timerStarted = false;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startTimerBtn");
const ring = document.querySelector(".timer-ring circle");

const FULL_DASH = 113;

// 🔊 Sounds
const tickSound = new Audio("sounds/tick.mp3");
const hurrySound = new Audio("sounds/hurry.mp3");

tickSound.volume = 0.35;
hurrySound.volume = 0.6;

function updateTimerUI(){
  timerEl.textContent = timeLeft;

  ring.style.strokeDashoffset =
    FULL_DASH - (timeLeft / 20) * FULL_DASH;

  ring.style.stroke = timeLeft <= 5 ? "#ff8a8a" : "#4dd6ff";
}

function startTimer(){
  if(timerStarted) return;
  timerStarted = true;
  startBtn.disabled = true;

  timerInterval = setInterval(()=>{
    timeLeft--;

    tickSound.currentTime = 0;
    tickSound.play();

    updateTimerUI();

    if(timeLeft === 5){
      hurrySound.play();
    }

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
