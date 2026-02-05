interface Sparkle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const SPARKLE_COLORS = ["#FFD700", "#FFFFFF", "#FFB6C1", "#FFF0F5", "#FF69B4"];
const MAX_SPARKLES = 200;

let sparkles: Sparkle[] = [];
let animationId: number | null = null;

function createSparkle(width: number): Sparkle {
  return {
    x: Math.random() * width,
    y: -10,
    size: 2 + Math.random() * 4,
    speed: 1 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 0.5,
    opacity: 0.6 + Math.random() * 0.4,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
  };
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
) {
  const spikes = 4;
  const outerRadius = size;
  const innerRadius = size * 0.4;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes + rotation;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function render(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);

  // Spawn new sparkles
  if (sparkles.length < MAX_SPARKLES && Math.random() < 0.3) {
    sparkles.push(createSparkle(width));
  }

  // Update and draw
  sparkles = sparkles.filter((s) => {
    s.y += s.speed;
    s.x += s.drift;
    s.rotation += s.rotationSpeed;

    // Fade near bottom
    const fadeStart = height * 0.8;
    if (s.y > fadeStart) {
      s.opacity *= 0.98;
    }

    // Remove if off screen or invisible
    if (s.y > height + 10 || s.opacity < 0.01) return false;

    ctx.save();
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = s.color;
    drawStar(ctx, s.x, s.y, s.size, s.rotation);
    ctx.fill();
    ctx.restore();

    return true;
  });

  animationId = requestAnimationFrame(() => render(ctx, width, height));
}

export function startSparkles(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  sparkles = [];
  render(ctx, canvas.width, canvas.height);
}

export function stopSparkles(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  sparkles = [];
}
