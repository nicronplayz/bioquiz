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
   BLACK HOLE
====================== */
const blackHole = {
  x: () => canvas.width * 0.68,
  y: () => canvas.height * 0.45,
  r: 46,
  diskR: 88,
  angle: 0,
  lensRadius: 140
};

/* ======================
   NEBULA
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
   STAR LAYERS
====================== */
function createStars(count, speed, size) {
  return [...Array(count)].map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * size + 0.2,
    s: speed + Math.random() * speed
  }));
}

const farStars = createStars(130, 0.05, 0.6);
const midStars = createStars(90, 0.12, 1.0);
const nearStars = createStars(45, 0.25, 1.4);

function drawStars(stars) {
  stars.forEach(s => {
    const dx = s.x - blackHole.x();
    const dy = s.y - blackHole.y();
    const dist = Math.hypot(dx, dy);

    let bendX = s.x;
    let bendY = s.y;
    let alpha = 1;

    if (dist < blackHole.lensRadius) {
      const factor = (blackHole.lensRadius - dist) / blackHole.lensRadius;
      bendX += dx * factor * 0.08;
      bendY += dy * factor * 0.08;
      alpha = 0.6;
    }

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(bendX, bendY, s.r, 0, Math.PI * 2);
    ctx.fill();

    s.y += s.s;
    if (s.y > canvas.height) {
      s.y = -10;
      s.x = Math.random() * canvas.width;
    }
  });
}

/* ======================
   BLACK HOLE DRAW
====================== */
function drawBlackHole() {
  const bx = blackHole.x();
  const by = blackHole.y();

  const core = ctx.createRadialGradient(bx, by, 0, bx, by, blackHole.r);
  core.addColorStop(0, "#000");
  core.addColorStop(0.75, "#000");
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(bx, by, blackHole.r, 0, Math.PI * 2);
  ctx.fill();

  blackHole.angle += 0.0018;
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(blackHole.angle);

  const disk = ctx.createLinearGradient(
    -blackHole.diskR, 0,
     blackHole.diskR, 0
  );
  disk.addColorStop(0, "rgba(255,200,120,0)");
  disk.addColorStop(0.25, "rgba(255,170,90,0.15)");
  disk.addColorStop(0.5, "rgba(255,230,160,0.28)");
  disk.addColorStop(0.75, "rgba(255,170,90,0.15)");
  disk.addColorStop(1, "rgba(255,200,120,0)");

  ctx.strokeStyle = disk;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, blackHole.diskR, blackHole.diskR * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
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
    ctx.lineTo(m.x - m.vx * m.len / 6, m.y - m.vy * m.len / 6);
    ctx.stroke();
    m.x += m.vx;
    m.y += m.vy;
    m.life++;
  });

  meteors = meteors.filter(m =>
    m.life < 90 &&
    m.x > -300 && m.x < canvas.width + 300 &&
    m.y < canvas.height + 300
  );
}

/* ======================
   ANIMATION LOOP
====================== */
(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNebula();
  drawBlackHole();

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
  requestAnimationFrame(animate);
})();
