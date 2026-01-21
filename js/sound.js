let audioUnlocked = false;

const correctAudio = new Audio("sounds/correct.mp3");
const wrongAudio   = new Audio("sounds/wrong.mp3");
const timerAudio   = new Audio("sounds/timer.mp3");

timerAudio.loop = true;
timerAudio.volume = 0.4;

function unlockAudio() {
  if (audioUnlocked) return;

  [correctAudio, wrongAudio, timerAudio].forEach(a => {
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
    }).catch(()=>{});
  });

  audioUnlocked = true;
}

document.addEventListener("click", unlockAudio, { once:true });
document.addEventListener("touchstart", unlockAudio, { once:true });

window.playCorrectSound = () => {
  correctAudio.currentTime = 0;
  correctAudio.play().catch(()=>{});
};

window.playWrongSound = () => {
  wrongAudio.currentTime = 0;
  wrongAudio.play().catch(()=>{});
};

window.playTimerSound = () => {
  timerAudio.currentTime = 0;
  timerAudio.play().catch(()=>{});
};

window.stopTimerSound = () => {
  timerAudio.pause();
  timerAudio.currentTime = 0;
};
