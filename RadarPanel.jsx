import { useRef, useEffect } from 'react';

// Radar sweep that detects floating nodes — the mandatory "art" element

const BLIP_COUNT = 8;

function createBlips(R) {
  return Array.from({ length: BLIP_COUNT }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    r: R * (0.2 + Math.random() * 0.7),
    label: ['NODE-' + String(i).padStart(2,'0'), 'ENTITY', 'SIGNAL', 'PACKET', 'DRIFT', 'CORE', 'FLUX', 'VOID'][i % 8],
    lastSeen: -1,
    opacity: 0,
  }));
}

export default function RadarPanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const SIZE = 220;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE / 2 - 10;

    let sweep = 0;
    let t = 0;
    const blips = createBlips(R);

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Background
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(2, 10, 8, 0.92)';
      ctx.fill();

      // Concentric rings
      [0.25, 0.5, 0.75, 1].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Cross hairs
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();

      // Sweep trail
      const sweepGrad = ctx.createConicalGradient
        ? null // Not widely available
        : null;

      // Draw sweep cone manually
      const sweepAngle = sweep;
      const trailLength = Math.PI * 0.7;
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const a1 = sweepAngle - trailLength * (1 - ratio);
        const a2 = sweepAngle - trailLength * (1 - (i + 1) / steps);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, a1, a2);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 255, 136, ${ratio * 0.06})`;
        ctx.fill();
      }

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * R, cy + Math.sin(sweepAngle) * R);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Blips — detect when sweep passes over them
      blips.forEach((b) => {
        const bx = cx + Math.cos(b.angle) * b.r;
        const by = cy + Math.sin(b.angle) * b.r;

        // Normalize angles 0 to 2PI
        const norm = (a) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const swA = norm(sweep);
        const bA = norm(b.angle);

        const diff = Math.abs(swA - bA);
        if (diff < 0.12 || diff > Math.PI * 2 - 0.12) {
          b.lastSeen = t;
          b.opacity = 1;
        }

        // Fade blip
        if (b.lastSeen > 0) {
          const age = t - b.lastSeen;
          b.opacity = Math.max(0, 1 - age / 120);
        }

        if (b.opacity > 0.01) {
          // Blip glow
          const blipGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 8);
          blipGlow.addColorStop(0, `rgba(0, 255, 136, ${b.opacity * 0.8})`);
          blipGlow.addColorStop(1, 'rgba(0, 255, 136, 0)');
          ctx.beginPath();
          ctx.arc(bx, by, 8, 0, Math.PI * 2);
          ctx.fillStyle = blipGlow;
          ctx.fill();

          // Blip dot
          ctx.beginPath();
          ctx.arc(bx, by, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 136, ${b.opacity})`;
          ctx.fill();

          // Label
          if (b.opacity > 0.3) {
            ctx.font = '7px JetBrains Mono, monospace';
            ctx.fillStyle = `rgba(0, 255, 136, ${b.opacity * 0.7})`;
            ctx.fillText(b.label, bx + 5, by - 4);
          }
        }
      });

      // Border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff88';
      ctx.fill();

      sweep += 0.018;

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
    }}>
      {/* Panel Header */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.25em',
        color: 'var(--accent)',
        opacity: 0.6,
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        justifyContent: 'space-between',
      }}>
        <span>RADAR.SYS</span>
        <span style={{ color: 'var(--text-secondary)' }}>ACTIVE</span>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(0,255,136,0.08), 0 0 60px rgba(0,255,136,0.03)',
        }}
      />

      {/* Panel Footer */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '8px',
        color: 'var(--text-secondary)',
        letterSpacing: '0.15em',
        display: 'flex',
        gap: '16px',
      }}>
        <span>RNG:280km</span>
        <span>FRQ:1.8Hz</span>
        <span>SNR:94%</span>
      </div>
    </div>
  );
}
