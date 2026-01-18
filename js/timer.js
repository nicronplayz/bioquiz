let timeLeft = 20;
let timerInterval = null;
let timerStarted = false;

document.addEventListener("DOMContentLoaded", () => {

  const timerEl = document.getElementById("timer");
  const startBtn = document.getElementById("startTimerBtn");

  function updateTimer(){
    if (timerEl) timerEl.textContent = timeLeft;
  }

  window.startTimer = function(){
    if (timerStarted) return;
    timerStarted = true;
    if (startBtn) startBtn.disabled = true;

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();

      if (timeLeft <= 0) {
        stopTimer();
        if (typeof handleTimeUp === "function") {
          handleTimeUp();
        }
      }
    }, 1000);
  };

  window.resetTimer = function(){
    stopTimer();
    timerStarted = false;
    timeLeft = 20;
    updateTimer();
    if (startBtn) startBtn.disabled = false;
  };

  window.stopTimer = function(){
    clearInterval(timerInterval);
    timerInterval = null;
  };

  if (startBtn) startBtn.onclick = startTimer;

  updateTimer();
});
