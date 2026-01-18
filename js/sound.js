window.playCorrectSound = function(){
  const a = new Audio("sounds/correct.mp3");
  a.volume = 1;
  a.play();
};

window.playWrongSound = function(){
  const a = new Audio("sounds/wrong.mp3");
  a.volume = 1;
  a.play();
};
