/* =========================
   COSMIC BACKGROUND ENGINE
   Parallax Stars + Meteors
========================= */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* =========================
   STAR LAYERS (PARALLAX)
========================= */

const layers = [
  { count: 80, speed: 0.15, size: 0.8 }, // far
  { count: 50, speed: 0.35, size: 1.2 }, // mid
  { count: 30, speed: 0.6,  size: 1.8 }  // near
];

const stars = [];

layers.forEach(layer => {
  for (let i = 0; i < layer.count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: layer.size * (0.6 + Math.random()),
      s: layer.speed,
      alpha: 0.4 + Math.random() * 0.6
    });
  }
});

/* =========================
   SHOOTING STARS
========================= */

const meteors = [];

function spawnMeteor(x = Math.random() * w, y = -50, vx = 6, vy = 10) {
  meteors.push({
    x,
    y,
    vx,
    vy,
    life: 0,
    maxLife: 60 + Math.random() * 20
  });
}

/* Rare random meteor */
setInterval(() => {
  if (Math.random() < 0.35) {
    spawnMeteor(Math.random() * w, -40, 5 + Math.random() * 2, 9);
  }
}, 6000);

/* Group meteor shower (≈ every 1 min) */
setInterval(() => {
  const baseX = Math.random() * w * 0.6;
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      spawnMeteor(
        baseX + Math.random() * 200,
        -50,
        6 + Math.random() * 2,
        10 + Math.random() * 2
      );
    }, i * 250);
  }
}, 60000);

/* Bottom meteors (subtle) */
setInterval(() => {
  if (Math.random() < 0.3) {
    spawnMeteor(
      Math.random() * w,
      h + 20,
      -4 - Math.random() * 2,
      -7 - Math.random() * 2
    );
  }
}, 12000);

/* =========================
   ANIMATION LOOP
========================= */

function animate() {
  ctx.clearRect(0, 0, w, h);

  /* Stars */
  stars.forEach(s => {
    s.y += s.s;
    if (s.y > h) {
      s.y = -10;
      s.x = Math.random() * w;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  });

  /* Meteors */
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.x += m.vx;
    m.y += m.vy;
    m.life++;

    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * 4, m.y - m.vy * 4);
    ctx.strokeStyle = "rgba(200,220,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (
      m.life > m.maxLife ||
      m.x < -100 || m.x > w + 100 ||
      m.y < -100 || m.y > h + 100
    ) {
      meteors.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
