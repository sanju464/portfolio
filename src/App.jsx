import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import BackgroundSystem from './components/BackgroundSystem';
import CustomCursor from './components/CustomCursor';
import CognitiveCore from './components/CognitiveCore';
import RadarPanel from './components/RadarPanel';
import ModuleCard from './components/ModuleCard';
import SystemConsole from './components/SystemConsole';

const MODULES = [
  {
    id: 1,
    title: 'AI Council',
    description: 'Multi-agent system where AI models debate and a neutral arbiter enforces truth. Ensures high-fidelity outputs through adversarial consensus.',
    tags: ['ML', 'SYSTEMS', 'AI'],
    stack: ['Python', 'LLMs', 'LangChain'],
    status: 'ACTIVE',
    year: '2025',
    link: null,
    githubLink: 'https://github.com/sanju464/ai-council',
  },
  {
    id: 2,
    title: 'MergeForge',
    description: 'Client-side file processing engine. Executes format conversions and PDF merging entirely in memory — zero uploads, full privacy.',
    tags: ['WEB', 'SYS', 'PRIVACY'],
    stack: ['React', 'WASM', 'Vite'],
    status: 'ACTIVE',
    year: '2024',
    link: 'https://mergeforge.onrender.com',
    githubLink: 'https://github.com/sanju464/MergeForge',
  },
  {
    id: 3,
    title: 'WhoPushedThat',
    description: 'Multiplayer deduction system. Participants navigate corrupted data structures to identify a hidden adversary within a compromised network.',
    tags: ['SYS', 'NETWORKING', 'GAME'],
    stack: ['Node.js', 'WebSockets', 'React'],
    status: 'IDLE',
    year: '2024',
    link: null,
    githubLink: 'https://github.com/sanju464/WhoPushedThat',
  },
  {
    id: 4,
    title: 'URL Phishing Detection',
    description: 'Detects malicious URLs using structural and lexical ML features. Parses obscure parameters and flags high-risk domains.',
    tags: ['ML', 'SEC', 'MODELING'],
    stack: ['Python', 'Scikit-Learn', 'Pandas'],
    status: 'ACTIVE',
    year: '2024',
    link: null,
    githubLink: 'https://github.com/sanju464/url-phishing-detection',
  },
  {
    id: 5,
    title: 'Coursework Alert System',
    description: 'Autonomous monitoring daemon. Scrapes ETLab portals, detects state changes, and dispatches real-time automated alerts.',
    tags: ['SYS', 'AUTOMATION', 'ETLAB'],
    stack: ['Python', 'Requests', 'Cron'],
    status: 'ACTIVE',
    year: '2024',
    link: null,
    githubLink: 'https://github.com/sanju464/coursework-alert-system',
  },
  {
    id: 6,
    title: 'Radar',
    description: 'Arduino-based ultrasonic telemetry system. Detects object proximity and position mapping in real time.',
    tags: ['HW', 'EMBEDDED', 'SENSORS'],
    stack: ['Arduino', 'C++', 'Processing'],
    status: 'IDLE',
    year: '2023',
    link: null,
    githubLink: 'https://github.com/sanju464/radar-telemetry',
  },
  {
    id: 7,
    title: 'Positron',
    description: 'Smart street lighting infrastructure using PIR and LDR sensors. Intelligently modulates brightness while logging activity metrics.',
    tags: ['HW', 'IOT', 'EMBEDDED'],
    stack: ['C++', 'Sensors', 'Microcontrollers'],
    status: 'IDLE',
    year: '2023',
    link: null,
    githubLink: 'https://github.com/sanju464/positron',
  },
  {
    id: 8,
    title: 'Network Monitor',
    description: 'Real-time network traffic analyzer. Identifies packet anomalies and flags suspicious bandwidth utilization spikes.',
    tags: ['SYS', 'SEC', 'NETWORKING'],
    stack: ['Python', 'Scapy', 'Bash'],
    status: 'IDLE',
    year: '2023',
    link: null,
    githubLink: 'https://github.com/sanju464/network-monitor',
  },
  {
    id: 9,
    title: 'Email Phishing Detection',
    description: 'Automated parser for detecting targeted phishing attempts via heuristic email pattern and header analysis.',
    tags: ['ML', 'SEC', 'NLP'],
    stack: ['Python', 'NLTK', 'Regex'],
    status: 'IDLE',
    year: '2023',
    link: null,
    githubLink: 'https://github.com/sanju464/email-phishing-detection',
  },
];

export default function App() {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [latency] = useState(() => Math.floor(10 + Math.random() * 8));
  const [latencyJitter, setLatencyJitter] = useState(latency);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Animate latency ±1ms jitter
  useEffect(() => {
    const id = setInterval(() => {
      setLatencyJitter(latency + Math.round((Math.random() - 0.5) * 2));
    }, 2000);
    return () => clearInterval(id);
  }, [latency]);

  // Terminal toggle with ~ (backtick/tilde key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setConsoleOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen text-[#e8f4f0] selection:bg-[#00ff8833] selection:text-[#00ff88]">
      <CustomCursor />
      <BackgroundSystem />
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Persistent Header */}
      <header className="fixed top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-start z-40 pointer-events-none mix-blend-difference">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-xl lg:text-3xl font-bold tracking-tighter shadow-none text-white">SANJU.SYS</h1>
          <span className="font-mono text-[9px] lg:text-[10px] tracking-[0.2em] text-[#00ff88]">
            {consoleOpen ? 'TERMINAL_LINK_ACTIVE' : 'SYSTEM_ONLINE'}
          </span>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">PRESS ~ TO ACCESS TERMINAL</span>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-[#00ff88]">SYS.OK</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-10"
        >
          <CognitiveCore />
        </motion.div>

        {/* Foreground Typography */}
        <motion.div 
          className="relative z-20 pointer-events-none flex flex-col items-center mt-[10vh]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <h2 className="font-sans text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-[#00ff88]/30 pb-2 custom-text-glow">
            SANJU THOMAS
          </h2>
          <p className="font-mono text-xs md:text-sm tracking-[0.4em] text-[#00ff88] mt-4 opacity-80 uppercase glow-pulse">
            Cyber · Machine Learning · Systems
          </p>
        </motion.div>

        {/* Radar Art Element - hidden on mobile to prevent overlap */}
        <motion.div 
          className="absolute bottom-12 md:bottom-24 left-6 md:left-24 z-20 hidden md:block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <RadarPanel />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase rotate-90 mb-6">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#00ff88] to-transparent animate-[scanline_2s_ease-in-out_infinite]" />
        </motion.div>
      </section>

      {/* Profile / Skills Section */}
      <section className="relative z-30 py-24 px-6 lg:px-24 border-t border-[#00ff8810]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="flex items-center gap-6 mb-16"
          >
            <h2 className="font-mono text-2xl tracking-tighter text-white">PROFILE.SYS</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00ff8840] to-transparent" />
            <span className="font-mono text-[10px] tracking-widest text-[#00ff88]">ENTITY DATA</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-lg border border-transparent hover:border-[#00ff8815] hover:bg-[#020406]/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00ff8805] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#00ff88] mb-6 opacity-70">COGNITIVE PROFILE</p>
              <div className="space-y-4 font-mono text-sm text-white/50 leading-relaxed border-l-2 border-[#00ff8820] group-hover:border-[#00ff8860] transition-colors duration-500 pl-6">
                <p><span className="text-white/80">ENTITY</span><span className="text-[#00ff8840] mx-3">│</span>Sanju Thomas</p>
                <p><span className="text-white/80">ROLE</span><span className="text-[#00ff8840] mx-6">│</span>2nd Year CSE Student</p>
                <p><span className="text-white/80">FOCUS</span><span className="text-[#00ff8840] mx-4">│</span>Machine Learning · Security · Hardware</p>
                <p><span className="text-white/80">STATUS</span><span className="text-[#00ff8840] mx-2">│</span><span className="text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">ACTIVE</span></p>
                <p><span className="text-white/80">MISSION</span><span className="text-[#00ff8840] mx-1">│</span>Builds systems that think, see, and defend.</p>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-lg border border-transparent hover:border-[#00ff8815] hover:bg-[#020406]/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-[#00ff8805] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#00ff88] mb-6 opacity-70">CAPABILITY MATRIX</p>
              <div className="space-y-5">
                {[
                  { domain: 'AI / ML', items: ['Scikit-Learn', 'LLMs', 'LangChain', 'CV'] },
                  { domain: 'SYSTEMS', items: ['C / C++', 'Python', 'Go', 'Linux', 'Bash'] },
                  { domain: 'HARDWARE', items: ['Arduino', 'ESP32', 'Sensors', 'PIR / LDR'] },
                  { domain: 'SECURITY', items: ['Threat Modeling', 'Scapy', 'Networks'] },
                  { domain: 'WEB', items: ['React', 'Node.js', 'WASM', 'Vite'] },
                ].map(({ domain, items }) => (
                  <div key={domain} className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300">
                    <span className="font-mono text-[9px] tracking-widest text-[#00ff88]/60 w-20 shrink-0 pt-[2px]">{domain}</span>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span key={item} className="font-mono text-[10px] text-white/50 border border-[#00ff8810] bg-[#00ff8803] px-2 py-0.5 rounded-sm hover:border-[#00ff8840] hover:text-[#00ff88] transition-colors duration-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="relative z-30 min-h-screen py-32 px-6 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center gap-6 mb-20"
          >
            <h2 className="font-mono text-2xl tracking-tighter text-white">MODULE_REGISTRY</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00ff8840] to-transparent" />
            <span className="font-mono text-[10px] tracking-widest text-[#00ff88]">09 ENTRIES</span>
          </motion.div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {MODULES.map((mod, i) => (
              <ModuleCard key={mod.id} module={mod} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 border-t border-[#00ff8815] bg-[#020406]/80 backdrop-blur-md pt-24 pb-12 px-6 lg:px-24 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-[#00ff88] animate-pulse" />
              <span className="font-mono text-sm font-bold tracking-widest text-white">SYSTEM.END</span>
            </div>
            <p className="font-mono text-xs text-white/40 leading-relaxed">
              Design pattern based on secure operational environments. Built with React and Framer Motion.
            </p>
          </div>

          <div className="flex gap-12 font-mono text-xs">
            <div className="flex flex-col gap-4">
              <span className="text-white/30 tracking-widest mb-2">LINK_LAYER</span>
              <a href="https://github.com/sanju464" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#00ff88] transition-all duration-500 ease-out flex items-center gap-2" data-hover="true">
                <span className="text-[#00ff88]/50">→</span> GITHUB
              </a>
              <a href="https://www.linkedin.com/in/sanju-thomas-70335a319" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#00ff88] transition-all duration-500 ease-out flex items-center gap-2" data-hover="true">
                <span className="text-[#00ff88]/50">→</span> LINKEDIN
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white/30 tracking-widest mb-2">COMM_PROTO</span>
              <a href="mailto:sanjuthomas464@gmail.com" className="text-white/70 hover:text-[#00ff88] transition-all duration-500 ease-out flex items-center gap-2" data-hover="true">
                <span className="text-[#00ff88]/50">→</span> INITIATE.TRANSMISSION
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-white/20 font-mono text-[9px] tracking-widest">
          <span>© {new Date().getFullYear()} SANJU.SYS</span>
          <span>LATENCY: {latencyJitter}ms</span>
        </div>
      </footer>

      {/* System Console Overlay */}
      <SystemConsole isOpen={consoleOpen} onClose={() => setConsoleOpen(false)} />
    </div>
  );
}
