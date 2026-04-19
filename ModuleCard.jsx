import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const STATUS = {
  ACTIVE: 'ACTIVE',
  IDLE: 'IDLE',
};

export default function ModuleCard({ module, index }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [8, -8]), { stiffness: 75, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-8, 8]), { stiffness: 75, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
    
    // For spotlight pointer effect (raw local coords)
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isActive = module.status === STATUS.ACTIVE;
  const floatDelay = index * 0.7;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hover="true"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      animate={{
        y: [0, -4, 0],
        transition: {
          y: {
            duration: 5 + index,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          }
        }
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
    >
      <div
        style={{
          background: 'rgba(6, 13, 26, 0.65)',
          border: '1px solid rgba(0, 255, 136, 0.1)',
          borderRadius: '4px',
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: `
            0 0 0 1px rgba(0,255,136,0.05),
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 0 40px rgba(0,255,136,0.02)
          `,
          cursor: 'none',
          transition: 'border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease',
        }}
        className="group"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
          e.currentTarget.style.background = 'rgba(6, 13, 26, 0.85)';
          e.currentTarget.style.boxShadow = `
            0 0 0 1px rgba(0,255,136,0.2),
            0 0 30px rgba(0,255,136,0.05),
            0 30px 80px rgba(0,0,0,0.7),
            inset 0 0 80px rgba(0,255,136,0.05)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,255,136,0.1)';
          e.currentTarget.style.background = 'rgba(6, 13, 26, 0.65)';
          e.currentTarget.style.boxShadow = `
            0 0 0 1px rgba(0,255,136,0.05),
            0 20px 60px rgba(0,0,0,0.5),
            inset 0 0 40px rgba(0,255,136,0.02)
          `;
        }}
      >
        {/* Spotlight Effect */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,255,136,0.06), transparent 40%)'
          }}
        />
        {/* Corner accents */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: 20, height: 20,
          borderTop: '1px solid rgba(0,255,136,0.4)',
          borderLeft: '1px solid rgba(0,255,136,0.4)',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 20, height: 20,
          borderTop: '1px solid rgba(0,255,136,0.4)',
          borderRight: '1px solid rgba(0,255,136,0.4)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: 20, height: 20,
          borderBottom: '1px solid rgba(0,255,136,0.4)',
          borderLeft: '1px solid rgba(0,255,136,0.4)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 20, height: 20,
          borderBottom: '1px solid rgba(0,255,136,0.4)',
          borderRight: '1px solid rgba(0,255,136,0.4)',
        }} />

        {/* Module ID */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: 'rgba(0,255,136,0.5)',
          }}>
            MOD-{String(index + 1).padStart(3, '0')}
          </span>
          <span className={isActive ? 'status-active' : 'status-idle'}>
            {module.status}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {module.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.15em',
              color: 'rgba(0,255,136,0.5)',
              border: '1px solid rgba(0,255,136,0.15)',
              padding: '2px 6px',
              borderRadius: '2px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '19px',
          fontWeight: 600,
          color: '#e8f4f0',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
        }}>
          {module.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'rgba(107,138,122,0.8)',
          lineHeight: 1.7,
          marginBottom: '24px',
        }}>
          {module.description}
        </p>

        {/* Stack */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}>
          {module.stack.map((tech) => (
            <span key={tech} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(232,244,240,0.5)',
              letterSpacing: '0.05em',
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0,255,136,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {module.link ? (
              <a
                href={module.link}
                target="_blank"
                rel="noopener noreferrer"
                data-hover="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                ACCESS →
              </a>
            ) : (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(107,138,122,0.4)',
              }}>CLASSIFIED</span>
            )}
            {/* Secondary source link for all projects */}
            {module.githubLink && (
              <a
                href={module.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                data-hover="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: 'rgba(107,138,122,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(0,255,136,0.7)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(107,138,122,0.5)'}
              >
                SRC →
              </a>
            )}
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(107,138,122,0.3)',
            letterSpacing: '0.1em',
          }}>
            {module.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
