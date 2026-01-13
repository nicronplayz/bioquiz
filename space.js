const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

/* ---------- RESIZE ---------- */
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

/* ======================
   NEBULA BACKDROP
====================== */
let nebulaShift = 0;
function drawNebula() {
  nebulaShift += 0.00035;

  const g = ctx.createRadialGradient(
    canvas.width * (0.35 + Math.sin(nebulaShift) * 0.08),
    canvas.height * (0.45 + Math.cos(nebulaShift) * 0.08),
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );

  g.addColorStop(0, "rgba(60,90,200,0.12)");
  g.addColorStop(0.45, "rgba(30,40,120,0.08)");
  g.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ======================
   STAR LAYERS (PARALLAX)
====================== */
function createStars(count, speed, size) {
  return [...Array(count)].map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * size + 0.2,
    s: speed + Math.random() * speed
  }));
}

const farStars = createStars(140, 0.04, 0.5);
const midStars = createStars(100, 0.1, 0.9);
const nearStars = createStars(50, 0.22, 1.3);

function drawStars(stars) {
  ctx.fillStyle = "#ffffff";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    s.y += s.s;
    if (s.y > canvas.height) {
      s.y = -10;
      s.x = Math.random() * canvas.width;
    }
  });
}

/* ======================
   METEORS
====================== */
let meteors = [];
let lastShower = Date.now();

function spawnMeteor(shower = false) {
  const angle = Math.random() * Math.PI / 4 + Math.PI * 1.25;
  const speed = shower ? 7 : 5;

  meteors.push({
    x: Math.random() * canvas.width,
    y: -60,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: shower ? 130 : 85,
    life: 0
  });
}

function drawMeteors() {
  meteors.forEach(m => {
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(
      m.x - m.vx * m.len / 6,
      m.y - m.vy * m.len / 6
    );
    ctx.stroke();

    m.x += m.vx;
    m.y += m.vy;
    m.life++;
  });

  meteors = meteors.filter(m =>
    m.life < 90 &&
    m.x > -300 &&
    m.x < canvas.width + 300 &&
    m.y < canvas.height + 300
  );
}

/* ======================
   CONSTELLATIONS (RARE)
====================== */
function drawConstellation() {
  if (Math.random() > 0.004) return;

  const points = [...Array(5)].map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  }));

  ctx.strokeStyle = "rgba(120,160,255,0.12)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
}

/* ======================
   ANIMATION LOOP
====================== */
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNebula();

  drawStars(farStars);
  drawStars(midStars);
  drawStars(nearStars);

  if (Math.random() < 0.002) spawnMeteor(false);

  if (Date.now() - lastShower > 60000) {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnMeteor(true), i * 120);
    }
    lastShower = Date.now();
  }

  drawMeteors();
  drawConstellation();

  requestAnimationFrame(animate);
})();
