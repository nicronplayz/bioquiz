const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ---------- STARS ---------- */
let stars = [...Array(140)].map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.2,
  s: Math.random() * 0.25 + 0.05
}));

/* ---------- COSMIC DUST ---------- */
let dust = [...Array(80)].map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 0.6,
  s: Math.random() * 0.05 + 0.02
}));

/* ---------- METEORS ---------- */
let meteors = [];
let lastShower = Date.now();

function spawnMeteor(fromBottom = false) {
  meteors.push({
    x: Math.random() * canvas.width,
    y: fromBottom ? canvas.height + 20 : -20,
    vx: Math.random() * 2 + 4,
    vy: fromBottom ? -(Math.random() * 2 + 4) : (Math.random() * 2 + 4),
    l: Math.random() * 60 + 60,
    life: 0
  });
}

function meteorShower() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => spawnMeteor(Math.random() > 0.5), i * 80);
  }
}

/* ---------- ANIMATION LOOP ---------- */
(function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "#ffffff";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.s;
    if (s.y > canvas.height) s.y = 0;
  });

  // Dust
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  dust.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
    d.y += d.s;
    if (d.y > canvas.height) d.y = 0;
  });

  // Random meteors (top + bottom)
  if (Math.random() < 0.003) spawnMeteor(false);
  if (Math.random() < 0.002) spawnMeteor(true);

  // Meteor shower every 60s
  if (Date.now() - lastShower > 60000) {
    meteorShower();
    lastShower = Date.now();
  }

  // Draw meteors
  meteors.forEach(m => {
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.l, m.y - m.l);
    ctx.stroke();
    m.x += m.vx;
    m.y += m.vy;
    m.life++;
  });

  meteors = meteors.filter(m =>
    m.x > -200 && m.x < canvas.width + 200 &&
    m.y > -200 && m.y < canvas.height + 200 &&
    m.life < 120
  );

  requestAnimationFrame(animateSpace);
})();
