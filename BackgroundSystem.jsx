import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 60;
const STAR_COUNT = 150;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function BackgroundSystem() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = window.innerWidth;
    let H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    // Stars
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: randomBetween(0.2, 1.2),
      opacity: randomBetween(0.03, 0.3),
      twinkleSpeed: randomBetween(0.005, 0.01),
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Drifting particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: randomBetween(-0.03, 0.03),
      vy: randomBetween(-0.02, 0.02),
      r: randomBetween(0.5, 2),
      opacity: randomBetween(0.05, 0.25),
      maxOpacity: randomBetween(0.1, 0.3),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: randomBetween(0.005, 0.01),
    }));

    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      grad.addColorStop(0, 'rgba(6, 13, 26, 1)');
      grad.addColorStop(0.6, 'rgba(4, 8, 16, 1)');
      grad.addColorStop(1, 'rgba(2, 4, 6, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Stars
      stars.forEach((s) => {
        const osc = Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const op = s.opacity * (0.4 + 0.6 * ((osc + 1) / 2));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${op})`;
        ctx.fill();
      });

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const osc = Math.sin(t * p.pulseSpeed + p.pulsePhase);
        const op = p.opacity * (0.5 + 0.5 * ((osc + 1) / 2));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${op})`;
        ctx.fill();

        // Particle glow
        if (op > 0.15) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          glowGrad.addColorStop(0, `rgba(0, 255, 136, ${op * 0.3})`);
          glowGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      // Re-seed so elements fill new viewport
      stars.length = 0;
      Array.from({ length: STAR_COUNT }, () =>
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: randomBetween(0.2, 1.2),
          opacity: randomBetween(0.03, 0.3),
          twinkleSpeed: randomBetween(0.005, 0.01),
          twinkleOffset: Math.random() * Math.PI * 2,
        })
      );
      particles.length = 0;
      Array.from({ length: PARTICLE_COUNT }, () =>
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: randomBetween(-0.03, 0.03),
          vy: randomBetween(-0.02, 0.02),
          r: randomBetween(0.5, 2),
          opacity: randomBetween(0.05, 0.25),
          maxOpacity: randomBetween(0.1, 0.3),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: randomBetween(0.005, 0.01),
        })
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
