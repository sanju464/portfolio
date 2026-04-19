import { useEffect, useRef } from 'react';

// Cognitive Core — Central floating orb with network nodes and dynamic connections
// Mouse interaction warps the node positions

const NODE_COUNT = 14;

function createNodes(W, H) {
  const nodes = [];
  const cx = W / 2;
  const cy = H / 2;

  // Center node
  nodes.push({ id: 0, x: cx, y: cy, ox: cx, oy: cy, r: 7, primary: true, pulsePhase: 0 });

  // Ring 1
  const r1 = Math.min(W, H) * 0.14;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const x = cx + Math.cos(angle) * r1;
    const y = cy + Math.sin(angle) * r1;
    nodes.push({ id: i + 1, x, y, ox: x, oy: y, r: 4, angle, ring: 1, speed: 0.0004, pulsePhase: (i / 5) * Math.PI * 2 });
  }

  // Ring 2
  const r2 = Math.min(W, H) * 0.26;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + 0.3;
    const x = cx + Math.cos(angle) * r2;
    const y = cy + Math.sin(angle) * r2;
    nodes.push({ id: i + 6, x, y, ox: x, oy: y, r: 2.5, angle, ring: 2, speed: -0.0002, pulsePhase: (i / 8) * Math.PI * 2 });
  }

  // Ring 3 (Outer edge)
  const r3 = Math.min(W, H) * 0.38;
  for (let i = 0; i < 15; i++) {
    const angle = (i / 15) * Math.PI * 2 + 0.8;
    const x = cx + Math.cos(angle) * r3;
    const y = cy + Math.sin(angle) * r3;
    nodes.push({ id: i + 14, x, y, ox: x, oy: y, r: 1.5, angle, ring: 3, speed: 0.0001, pulsePhase: Math.random() * Math.PI * 2 });
  }

  return nodes;
}

export default function CognitiveCore() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const smoothedMouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    let nodes = createNodes(W, H);
    let t = 0;

    const handleResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      nodes = createNodes(W, H);
    };
    window.addEventListener('resize', handleResize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // Inertia interpolation for mouse
      if (mouse.current.x === -9999) {
        smoothedMouse.current = { x: -9999, y: -9999 };
      } else if (smoothedMouse.current.x === -9999) {
        smoothedMouse.current = { x: mouse.current.x, y: mouse.current.y };
      } else {
        smoothedMouse.current.x += (mouse.current.x - smoothedMouse.current.x) * 0.03;
        smoothedMouse.current.y += (mouse.current.y - smoothedMouse.current.y) * 0.03;
      }

      // Update node positions — orbit + mouse repulsion
      nodes.forEach((n) => {
        if (n.primary) return;

        // Orbital motion
        const baseAngle = n.angle + t * (n.speed || 0);
        const radius = n.ring === 1 
          ? Math.min(W, H) * 0.14 
          : n.ring === 2 
            ? Math.min(W, H) * 0.26 
            : Math.min(W, H) * 0.38;
            
        n.x = cx + Math.cos(baseAngle) * radius;
        n.y = cy + Math.sin(baseAngle) * radius;

        // Mouse proximity — weighted repulsion based on inertia
        const dx = n.x - smoothedMouse.current.x;
        const dy = n.y - smoothedMouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = Math.pow(1 - dist / 180, 2) * 35; // Stronger falloff for wow factor
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      });

      // Draw connections
      nodes.forEach((a) => {
        nodes.forEach((b) => {
          if (a.id >= b.id) return;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = a.primary || b.primary ? 350 : 180;
          if (dist < threshold) {
            const alpha = (1 - dist / threshold) * 0.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            // Inner ring gets brighter lines, outer rings get faded ones
            const isInner = a.ring <= 1 || b.ring <= 1;
            ctx.strokeStyle = `rgba(0, 255, 136, ${isInner ? alpha * 1.5 : alpha})`;
            ctx.lineWidth = isInner ? 0.8 : 0.4;
            ctx.stroke();
          }
        });
        
        // Draw connection from mouse to this node if close enough
        if (smoothedMouse.current.x !== -9999) {
          const mx = smoothedMouse.current.x;
          const my = smoothedMouse.current.y;
          const mDist = Math.sqrt((a.x - mx) ** 2 + (a.y - my) ** 2);
          if (mDist < 200 && !a.primary) {
            const mAlpha = (1 - mDist / 200) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(0, 255, 136, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Draw center orb glow
      const baseGlowRadius = 90 + 15 * Math.sin(t * 0.015);
      const centerGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseGlowRadius);
      const coreAlpha = 0.05 + 0.03 * Math.sin(t * 0.015);
      centerGlow.addColorStop(0, `rgba(0, 255, 136, ${coreAlpha * 6})`);
      centerGlow.addColorStop(0.2, `rgba(0, 255, 136, ${coreAlpha * 2.5})`);
      centerGlow.addColorStop(0.6, `rgba(0, 255, 136, ${coreAlpha * 0.8})`);
      centerGlow.addColorStop(1, 'rgba(0, 255, 136, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, baseGlowRadius, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      // Technical inner rings rotating
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.005);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([15, 10, 5, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.rotate(-t * 0.008);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.setLineDash([5, 15, 20, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(t * 0.02 + n.pulsePhase);
        const r = n.r + pulse * (n.primary ? 2.5 : 0.5);

        // Outer glow
        const glowR = r * 6;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        glow.addColorStop(0, `rgba(0, 255, 136, ${n.primary ? 0.5 : 0.15})`);
        glow.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node body
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.primary ? '#00ff88' : `rgba(0, 255, 136, ${0.6 + pulse * 0.1})`;
        ctx.fill();

        // Center dot for primary
        if (n.primary) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#020406';
          ctx.fill();
        }
      });

      // Pulsing ring around center
      const ringRadius = 45 + 5 * Math.sin(t * 0.025);
      const ringAlpha = 0.15 + 0.05 * Math.sin(t * 0.025);
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 136, ${ringAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
