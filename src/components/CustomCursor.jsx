import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const clickedRef = useRef(false);
  const hoveringRef = useRef(false);
  const [renderState, setRenderState] = useState({ clicked: false, hovering: false });

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animRef = useRef(null);

  useEffect(() => {
    const moveDot = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px) scale(${clickedRef.current ? 0.6 : 1})`;
      }
    };

    const animateRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        const size = hoveringRef.current ? 40 : 28;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
        ringRef.current.style.width = size + 'px';
        ringRef.current.style.height = size + 'px';
        ringRef.current.style.borderColor = hoveringRef.current ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ringRef.current.style.boxShadow = hoveringRef.current ? '0 0 16px rgba(255,255,255,0.3)' : 'none';
      }
      animRef.current = requestAnimationFrame(animateRing);
    };

    const handleMouseDown = () => {
      clickedRef.current = true;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px) scale(0.6)`;
    };
    const handleMouseUp = () => {
      clickedRef.current = false;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px) scale(1)`;
    };

    // Delegated hover — works for dynamically rendered elements too
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        hoveringRef.current = true;
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        hoveringRef.current = false;
      }
    };

    document.addEventListener('mousemove', moveDot);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    animRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', moveDot);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#ffffff', // pure white for difference mode
          boxShadow: '0 0 12px #ffffff',
          pointerEvents: 'none',
          zIndex: 9999,
          top: 0,
          left: 0,
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          top: 0,
          left: 0,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
