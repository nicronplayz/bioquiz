/* =========================
   TIMER MODULE (30s)
========================= */

let timeLeft = 30;
let totalTime = 30;
let timerInterval = null;
let running = false;

/* ELEMENTS */
const timerText = document.getElementById("timer");
const timerWrap = document.getElementById("timerWrap");
const timerCircle = document.querySelector(".timer-ring circle");

/* SVG CIRCUMFERENCE */
const CIRCUMFERENCE = 113;

/* 🔊 SINGLE TIMER SOUND */
const timerSound = new Audio("sounds/timer.mp3");
timerSound.volume = 0.4;

/* INIT */
timerCircle.style.strokeDasharray = CIRCUMFERENCE;
timerCircle.style.strokeDashoffset = 0;

/* =========================
   UPDATE UI
========================= */
function updateTimerUI() {
  timerText.textContent = timeLeft;

  const progress = timeLeft / totalTime;
  timerCircle.style.strokeDashoffset =
    CIRCUMFERENCE * (1 - progress);

  if (timeLeft <= 5) {
    timerText.style.color = "#ff6b6b";
    timerCircle.style.stroke = "#ff6b6b";
  } else {
    timerText.style.color = "#4dd6ff";
    timerCircle.style.stroke = "#4dd6ff";
  }
}

/* =========================
   START TIMER (CLICK)
========================= */
function startTimer() {
  if (running) return;

  running = true;
  timerSound.currentTime = 0;
  timerSound.play().catch(()=>{});

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft > 0) {
      timerSound.currentTime = 0;
      timerSound.play().catch(()=>{});
    }

    if (timeLeft <= 0) {
      stopTimer();
      if (typeof handleTimeUp === "function") {
        handleTimeUp();
      }
    }
  }, 1000);
}

/* =========================
   STOP TIMER
========================= */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  running = false;
  timerSound.pause();
  timerSound.currentTime = 0;
}

/* =========================
   RESET TIMER
========================= */
function resetTimer() {
  stopTimer();
  timeLeft = totalTime;
  updateTimerUI();
}

/* =========================
   CLICK TO START
========================= */
timerWrap.addEventListener("click", startTimer);

/* INITIAL PAINT */
updateTimerUI();

/* EXPOSE FOR quiz.js */
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.resetTimer = resetTimer;
