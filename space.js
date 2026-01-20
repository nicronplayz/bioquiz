// ================= SPACE BACKGROUND (AUTO-INJECT) =================

// Inject CSS
const style = document.createElement("style");
style.textContent = `
  .space-canvas, .space-nebula {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  .space-canvas {
    z-index: 0;
  }

  .space-nebula {
    z-index: 1;
    background:
      radial-gradient(800px 600px at 30% 40%, rgba(90,140,255,.06), transparent 60%),
      radial-gradient(900px 700px at 70% 60%, rgba(180,80,255,.05), transparent 65%);
    animation: spaceNebulaMove 120s linear infinite;
  }

  @keyframes spaceNebulaMove {
    from { transform: translate(0,0); }
    to   { transform: translate(-200px,150px); }
  }
`;
document.head.appendChild(style);

// Create canvas
const canvas = document.createElement("canvas");
canvas.className = "space-canvas";
document.body.prepend(canvas);

// Create nebula layer
const nebula = document.createElement("div");
nebula.className = "space-nebula";
document.body.prepend(nebula);

// Canvas setup
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Star field
const STAR_COUNT = 140;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.2 + 0.2,
  s: Math.random() * 0.25 + 0.05
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";

  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.s;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  }

  requestAnimationFrame(animateStars);
}

animateStars();
