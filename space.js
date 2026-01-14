const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* =========================
   AMBIENT TOGGLE STATE
========================= */
let ambientEnabled = localStorage.getItem("ambient") !== "off";

/* =========================
   STAR LAYERS
========================= */

// Far stars (tiny, slow)
const farStars = Array.from({ length: 120 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 0.8 + 0.2,
  s: Math.random() * 0.05 + 0.02
}));

// Mid stars
const midStars = Array.from({ length: 60 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.5 + 0.5,
  s: Math.random() * 0.15 + 0.05
}));

// Space dust
const dust = Array.from({ length: 40 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 8 + 6,
  s: Math.random() * 0.02 + 0.01
}));

/* =========================
   SHOOTING STAR
========================= */
let meteor = null;
let nextMeteor = Date.now() + randomTime();

function randomTime(){
  return 45000 + Math.random() * 15000; // 45–60s
}

function spawnMeteor(){
  meteor = {
    x: Math.random() * w,
    y: -50,
    vx: 6 + Math.random() * 3,
    vy: 6 + Math.random() * 3,
    life: 0
  };
}

/* =========================
   DRAW FUNCTIONS
========================= */
function drawStars(arr, alpha){
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fff";
  arr.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.s;
    if (s.y > h) s.y = 0;
  });
  ctx.globalAlpha = 1;
}

function drawDust(){
  ctx.fillStyle = "rgba(180,200,255,0.04)";
  dust.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
    d.y += d.s;
    if (d.y > h) d.y = 0;
  });
}

function drawNebula(){
  const g = ctx.createRadialGradient(
    w * 0.8, h * 0.2, 0,
    w * 0.8, h * 0.2, w * 0.8
  );
  g.addColorStop(0, "rgba(120,90,255,0.06)");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawMeteor(){
  if (!meteor) return;
  ctx.strokeStyle = "rgba(200,220,255,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(meteor.x, meteor.y);
  ctx.lineTo(meteor.x - meteor.vx * 4, meteor.y - meteor.vy * 4);
  ctx.stroke();

  meteor.x += meteor.vx;
  meteor.y += meteor.vy;
  meteor.life++;

  if (meteor.life > 30) meteor = null;
}

/* =========================
   MAIN LOOP
========================= */
function animate(){
  ctx.clearRect(0, 0, w, h);

  if (ambientEnabled) {
    drawNebula();
    drawStars(farStars, 0.4);
    drawStars(midStars, 0.7);
    drawDust();

    if (!meteor && Date.now() > nextMeteor) {
      spawnMeteor();
      nextMeteor = Date.now() + randomTime();
    }
    drawMeteor();
  }

  requestAnimationFrame(animate);
}
animate();

/* =========================
   LISTEN FOR TOGGLE
========================= */
window.addEventListener("storage", e => {
  if (e.key === "ambient") {
    ambientEnabled = e.newValue !== "off";
  }
});
