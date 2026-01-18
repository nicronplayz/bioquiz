/* =========================
   SOUND MODULE (DIRECT)
========================= */

const correctSound = new Audio("sounds/correct.mp3");
const wrongSound   = new Audio("sounds/wrong.mp3");

correctSound.volume = 0.7;
wrongSound.volume = 0.7;

/* DIRECT PLAY — NO UNLOCK NEEDED */
function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playWrongSound() {
  wrongSound.currentTime = 0;
  wrongSound.play();
}

/* expose */
window.playCorrectSound = playCorrectSound;
window.playWrongSound = playWrongSound;
