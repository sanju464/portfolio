import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMANDS = {
  help: {
    output: [
      '╔══════════════════════════════════════╗',
      '║         SANJU.SYS — HELP MATRIX      ║',
      '╚══════════════════════════════════════╝',
      '',
      '  about      → cognitive profile',
      '  modules    → deployed systems',
      '  skills     → capability matrix',
      '  github     → initialize uplink',
      '  linkedin   → initialize uplink',
      '  clear      → purge buffer',
      '  exit       → close terminal',
      '',
    ],
    type: 'success',
  },
  about: {
    output: [
      '┌─ COGNITIVE PROFILE ────────────────────',
      '│',
      '│  ENTITY   : Sanju Thomas',
      '│  ROLE     : 2nd Year CSE Student',
      '│  FOCUS    : Machine Learning · Security',
      '│             Hardware · Fullstack',
      '│',
      '│  STATUS   : ACTIVE',
      '│  MISSION  : Builds systems that think,',
      '│             see, and defend.',
      '│',
      '└────────────────────────────────────────',
    ],
    type: 'success',
  },
  modules: {
    output: [
      '┌─ MODULE REGISTRY ──────────────────────',
      '│',
      '│  [ACTIVE] AI Council',
      '│  [ACTIVE] MergeForge (Client-side WASM)',
      '│  [IDLE]   WhoPushedThat (Multiplayer)',
      '│  [ACTIVE] URL Phishing Detection',
      '│  [ACTIVE] Coursework Alert System',
      '│  [IDLE]   Radar (Arduino/Telemetry)',
      '│  [IDLE]   Positron (Smart Infra)',
      '│  [IDLE]   Network/Email Monitors',
      '│',
      '└────────────────────────────────────────',
    ],
    type: 'success',
  },
  skills: {
    output: [
      '┌─ CAPABILITY MATRIX ────────────────────',
      '│',
      '│  AI/ML    : Scikit-Learn · LLMs · CV',
      '│  SYSTEMS  : C/C++ · Python · Go · Linux',
      '│  HARDWARE : Arduino · ESP32 · Sensors',
      '│  SECURITY : Threat Modeling · Networks',
      '│  WEB      : React · Node.js · WASM',
      '│',
      '└────────────────────────────────────────',
    ],
    type: 'success',
  },
  github: {
    output: ['// Establishing secure link to github.com/sanju464...'],
    type: 'success',
  },
  linkedin: {
    output: ['// Establishing secure link to linkedin.com/in/sanju-thomas-70335a319...'],
    type: 'success',
  },
  clear: { output: [], type: 'clear' },
  exit: { output: ['// Terminal closing...'], type: 'exit' },
};

const BOOT_SEQUENCE = [
  'SANJU.SYS v2.6.0 — Antigravity Interface',
  'Initializing subsystems...',
  'Loading cognitive matrix... OK',
  'Establishing zero-G environment... OK',
  'Module registry synced.',
  '',
  'Type "help" to view available commands.',
  '─'.repeat(42),
];

export default function SystemConsole({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const bootedRef = useRef(false);
  const cmdHistory = useRef([]);
  const historyIdx = useRef(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  // Reset boot on close so the sequence replays on re-open
  useEffect(() => {
    if (!isOpen) {
      bootedRef.current = false;
      setHistory([]);
      cmdHistory.current = [];
      historyIdx.current = -1;
      return;
    }
    if (!bootedRef.current) {
      bootedRef.current = true;
      BOOT_SEQUENCE.forEach((line, i) => {
        setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            { id: Date.now() + i, text: line, type: i === 0 ? 'success' : 'output' },
          ]);
        }, i * 200);
      });
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newEntries = [
      { id: Date.now(), text: `> ${cmd}`, type: 'prompt' },
    ];

    if (!trimmed) {
      setHistory((prev) => [...prev, ...newEntries]);
      setInput('');
      return;
    }

    // Save to command history (deduplicate consecutive same commands)
    if (cmdHistory.current[0] !== trimmed) {
      cmdHistory.current.unshift(trimmed);
      if (cmdHistory.current.length > 50) cmdHistory.current.pop();
    }

    const processCommand = () => {
      const result = COMMANDS[trimmed];

      if (!result) {
        newEntries.push({
          id: Date.now() + 1,
          text: `ERR: command not found — '${trimmed}'. Type 'help'.`,
          type: 'error',
        });
      } else if (result.type === 'clear') {
        setHistory([]);
        return;
      } else if (result.type === 'exit') {
        newEntries.push({ id: Date.now() + 1, text: result.output[0], type: 'output' });
        setHistory((prev) => [...prev, ...newEntries]);
        setTimeout(onClose, 500);
        return;
      } else {
        result.output.forEach((line, i) => {
          newEntries.push({ id: Date.now() + i + 1, text: line, type: 'output' });
        });
      }

      setHistory((prev) => [...prev, ...newEntries]);

      if (trimmed === 'github') {
        setTimeout(() => window.open('https://github.com/sanju464', '_blank'), 600);
      } else if (trimmed === 'linkedin') {
        setTimeout(() => window.open('https://www.linkedin.com/in/sanju-thomas-70335a319', '_blank'), 600);
      }
    };

    // Synchronously show the prompt line immediately
    setHistory((prev) => [...prev, ...newEntries]);
    setInput('');
    
    // Asynchronously process and return the result after a simulated latency
    if (trimmed) {
      setTimeout(processCommand, 300);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      historyIdx.current = -1;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.current.length === 0) return;
      const next = Math.min(historyIdx.current + 1, cmdHistory.current.length - 1);
      historyIdx.current = next;
      setInput(cmdHistory.current[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIdx.current - 1;
      if (next < 0) {
        historyIdx.current = -1;
        setInput('');
      } else {
        historyIdx.current = next;
        setInput(cmdHistory.current[next] || '');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'prompt': return '#00ff88';
      case 'success': return 'rgba(0,255,136,0.8)';
      case 'error': return '#ff5555';
      case 'output': return 'rgba(107,138,122,0.9)';
      default: return 'rgba(232,244,240,0.7)';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(520px, calc(100vw - 48px))',
            height: 'min(400px, 60vh)',
            background: 'rgba(2, 6, 10, 0.96)',
            border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 0 1px rgba(0,255,136,0.1), 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,255,136,0.05)',
            fontFamily: 'var(--font-mono)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid rgba(0,255,136,0.1)',
            background: 'rgba(0,255,136,0.03)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(0,255,136,0.6)', letterSpacing: '0.2em' }}>
                SYS.TERMINAL — ACTIVE
              </span>
            </div>
            <button
              onClick={onClose}
              data-hover="true"
              style={{
                background: 'none',
                border: '1px solid rgba(0,255,136,0.2)',
                color: 'rgba(0,255,136,0.5)',
                width: '22px',
                height: '22px',
                borderRadius: '2px',
                cursor: 'none',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.6)'; e.currentTarget.style.color = '#00ff88'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)'; e.currentTarget.style.color = 'rgba(0,255,136,0.5)'; }}
            >
              ×
            </button>
          </div>

          {/* Output */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            {history.map((entry) => (
              <div
                key={entry.id}
                style={{
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: getColor(entry.type),
                  whiteSpace: 'pre',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {entry.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            borderTop: '1px solid rgba(0,255,136,0.1)',
            gap: '8px',
            flexShrink: 0,
          }}>
            <span style={{ color: '#00ff88', fontSize: '12px', flexShrink: 0 }}>{'>'}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="enter command..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#e8f4f0',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.05em',
                caretColor: '#00ff88',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
