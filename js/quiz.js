/* =========================
   TIMER MODULE – FINAL
========================= */

let timeLeft = 30;
let timerInterval = null;
let timerRunning = false;

const timerEl = document.getElementById("timer");

/* 🔊 SINGLE TIMER SOUND */
const timerTick = new Audio("sounds/timer.mp3");
timerTick.volume = 0.4;

/* =========================
   UI UPDATE
========================= */
function updateTimerUI() {
  timerEl.textContent = timeLeft;

  /* visual urgency */
  if (timeLeft <= 5) {
    timerEl.style.color = "#ff6b6b";
    timerEl.style.boxShadow = "0 0 12px rgba(255,100,100,.6)";
  } else {
    timerEl.style.color = "#4dd6ff";
    timerEl.style.boxShadow = "none";
  }
}

/* =========================
   START TIMER (MANUAL)
========================= */
function startTimer() {
  if (timerRunning) return;

  timerRunning = true;
  timerTick.currentTime = 0;
  timerTick.play();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    /* play tick sound */
    if (timeLeft > 0) {
      timerTick.currentTime = 0;
      timerTick.play();
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
  timerRunning = false;
}

/* =========================
   RESET TIMER
========================= */
function resetTimer() {
  stopTimer();
  timeLeft = 30;
  updateTimerUI();
}

/* =========================
   CLICK TO START
========================= */
timerEl.addEventListener("click", startTimer);

/* INITIAL STATE */
updateTimerUI();
