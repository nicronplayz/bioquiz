const sounds = {
  correct: new Audio("sounds/correct.mp3"),
  wrong: new Audio("sounds/wrong.mp3")
};

function playSound(type){
  const s = sounds[type];
  if(!s) return;
  s.currentTime = 0;
  s.play().catch(()=>{});
}
