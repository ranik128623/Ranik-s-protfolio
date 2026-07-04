/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useMemo, FormEvent } from "react";
// @ts-ignore
import ranikAvatar from "./assets/images/ranik_sen_vector_avatar_1783152788270.jpg";
import { 
  Linkedin, 
  Mail, 
  ExternalLink, 
  MessageSquare, 
  Award, 
  GraduationCap,
  Briefcase,
  Copy,
  Check,
  Sparkles,
  Activity,
  Globe,
  Terminal,
  Volume2,
  VolumeX,
  Github,
  Facebook,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Monitor,
  CheckCircle,
  Menu,
  X,
  Send
} from "lucide-react";

// --- Types ---
interface Project {
  id: number;
  title: string;
  role: string;
  period: string;
  category: string;
  desc: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  link?: string;
  highlights: string[];
}

interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  desc: string;
  bullets: string[];
}

// --- Sound Synthesizer Utility (Web Audio API) ---
const playSynthSound = (type: 'keyboard' | 'switch' | 'success' | 'hover' | 'boot', muted: boolean) => {
  if (muted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'keyboard') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'switch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      // Positive harmonic double beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'boot') {
      const chords = [196.00, 261.63, 329.63, 392.00]; // G3, C4, E4, G4 major chord
      chords.forEach((freq) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
        o.start();
        o.stop(ctx.currentTime + 1.0);
      });
    }
  } catch (e) {
    // Web audio blocked
  }
};

// --- Types & Data for TypingTerminal ---
interface Token {
  text: string;
  className?: string;
}

interface LineData {
  num: number;
  tokens: Token[];
}

const TERMINAL_LINES: LineData[] = [
  {
    num: 1,
    tokens: [
      { text: "const ", className: "text-white/60" },
      { text: "moderator = ", className: "text-white" },
      { text: '"Ranik Sen"', className: "text-emerald-400" },
      { text: ";", className: "text-white" }
    ]
  },
  {
    num: 2,
    tokens: [
      { text: "const ", className: "text-white/60" },
      { text: "skills = [", className: "text-white" },
      { text: '"Community Scaling"', className: "text-orange-400" },
      { text: ", ", className: "text-white" },
      { text: '"AI Prototyping"', className: "text-orange-400" },
      { text: ", ", className: "text-white" },
      { text: '"Excel Admin"', className: "text-orange-400" },
      { text: "];", className: "text-white" }
    ]
  },
  {
    num: 3,
    tokens: []
  },
  {
    num: 4,
    tokens: [
      { text: "function ", className: "text-white/60" },
      { text: "getCommitment", className: "text-indigo-300" },
      { text: "() {", className: "text-white" }
    ]
  },
  {
    num: 5,
    tokens: [
      { text: "  return ", className: "text-white/60" },
      { text: "{", className: "text-white" }
    ]
  },
  {
    num: 6,
    tokens: [
      { text: "    timezoneSync: ", className: "text-white" },
      { text: '"Flexible remote"', className: "text-yellow-400" },
      { text: ",", className: "text-white" }
    ]
  },
  {
    num: 7,
    tokens: [
      { text: "    weeklyModerationHours: ", className: "text-white" },
      { text: '"40+"', className: "text-purple-400" },
      { text: ",", className: "text-white" }
    ]
  },
  {
    num: 8,
    tokens: [
      { text: "    academicLogisticsAccuracy: ", className: "text-white" },
      { text: '"100%"', className: "text-emerald-400" }
    ]
  },
  {
    num: 9,
    tokens: [
      { text: "  };", className: "text-white" }
    ]
  },
  {
    num: 10,
    tokens: [
      { text: "}", className: "text-white" }
    ]
  }
];

function TypingTerminal({ muted }: { muted: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);

  // Total character length across all tokens
  const totalChars = useMemo(() => {
    let sum = 0;
    TERMINAL_LINES.forEach(line => {
      line.tokens.forEach(tok => {
        sum += tok.text.length;
      });
    });
    return sum;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisibleChars(current);
      
      // Make a quiet clicking noise as code types
      if (current % 3 === 0) {
        playSynthSound("keyboard", muted);
      }

      if (current >= totalChars) {
        clearInterval(interval);
      }
    }, 20); // 20ms per character is a perfect sweet spot!

    return () => clearInterval(interval);
  }, [inView, totalChars, muted]);

  // A helper to track overall rendered characters
  let charsRendered = 0;

  return (
    <div ref={containerRef} className="space-y-1.5 text-[11px] text-blue-400/90 leading-normal overflow-x-auto min-h-[160px]">
      {TERMINAL_LINES.map((line, lineIdx) => {
        const renderedTokens: any[] = [];
        let lineHasContent = line.tokens.length === 0;

        line.tokens.forEach((tok, tokIdx) => {
          const charsLeft = visibleChars - charsRendered;
          if (charsLeft <= 0) return;

          lineHasContent = true;
          const textToRender = tok.text.substring(0, charsLeft);
          charsRendered += textToRender.length;

          renderedTokens.push(
            <span key={tokIdx} className={tok.className}>
              {textToRender}
            </span>
          );
        });

        const shouldShowLine = lineIdx === 0 || lineHasContent || (visibleChars >= totalChars);

        if (!shouldShowLine) return null;

        return (
          <div key={lineIdx} className="flex">
            <span className="text-white/40 select-none mr-3 w-4 text-right">{line.num}</span>
            <div className="flex-1 whitespace-pre">
              {renderedTokens}
              {charsRendered === visibleChars && visibleChars < totalChars && (
                <span className="inline-block w-1 h-3 bg-accent animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Beautiful Constellation Background Canvas ---
const StarfieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Render constellation connections
      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Boundary bounce
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p1.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Gravity pull to mouse
        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p1.x;
          const mdy = mouseRef.current.y - p1.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            p1.x += mdx * 0.003;
            p1.y += mdy * 0.003;
            
            // Highlight connections to mouse
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - mdist / 180) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// --- Custom 3D Holographic Interactive Canvas Object ---
const HologramSphere = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef(false);
  const rotation = useRef({ x: 0.3, y: 0.5 });
  const startMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    // Generate beautiful 3D sphere point vertices
    const points: { x: number; y: number; z: number; color: string }[] = [];
    const sphereLayers = 16;
    
    // Generate layered latitude and longitude nodes
    for (let i = 0; i < sphereLayers; i++) {
      const lat = (i * Math.PI) / sphereLayers;
      const r = Math.sin(lat) * 110;
      const y = Math.cos(lat) * 110;
      const count = Math.max(6, Math.floor(r * 0.25));

      for (let j = 0; j < count; j++) {
        const lng = (j * Math.PI * 2) / count;
        const x = Math.cos(lng) * r;
        const z = Math.sin(lng) * r;
        
        // Dynamic colors depending on coordinate position
        const greenShift = Math.floor((y + 110) * 0.5);
        const color = `rgba(59, 130, 246, ${0.45 + (z + 110) / 440})`;
        points.push({ x, y, z, color });
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) {
        // Subtle drift hover response
        rotation.current.y += 0.0015;
        return;
      }
      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      rotation.current.y += dx * 0.006;
      rotation.current.x += dy * 0.006;
      startMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - startMouse.current.x;
      const dy = e.touches[0].clientY - startMouse.current.y;
      rotation.current.y += dx * 0.01;
      rotation.current.x += dy * 0.01;
      startMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    let frameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Center translations
      const cx = width / 2;
      const cy = height / 2;

      // Project and render points with coordinate rotations
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);
      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);

      const projected = points.map(p => {
        // Rotate Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate X axis
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Simple perspective scaling
        const perspective = 300;
        const scale = perspective / (perspective + z2);
        return {
          x2d: cx + x1 * scale,
          y2d: cy + y1 * scale,
          z2: z2,
          radius: scale * 2.2,
          color: p.color
        };
      });

      // Sort by depth (Z index) for correct visual overlapping
      projected.sort((a, b) => b.z2 - a.z2);

      // Render orbiting ring lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Projected nodes
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, p.radius, 0, Math.PI * 2);
        
        // Highlight foreground points
        if (p.z2 < 0) {
          ctx.fillStyle = "#60a5fa";
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      // Ambient system connection lines
      for (let i = 0; i < projected.length; i += 6) {
        if (i + 1 < projected.length) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x2d, projected[i].y2d);
          ctx.lineTo(projected[i+1].x2d, projected[i+1].y2d);
          ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
          ctx.stroke();
        }
      }

      // Dynamic automatic slow rotate if not actively dragging
      if (!isDragging.current) {
        rotation.current.y += 0.002;
        rotation.current.x += 0.0005;
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center select-none w-72 h-72 md:w-96 md:h-96">
      <div className="absolute inset-0 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />
      <canvas ref={canvasRef} className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-accent/30 pointer-events-none uppercase tracking-widest text-center animate-pulse">
        DRAG TO SPIN<br/>HOLOGRAPHIC GLOBE
      </div>
    </div>
  );
};

// --- Detailed About Me Modal Overlay ---
interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  muted: boolean;
}

function AboutMeModal({ isOpen, onClose, muted }: AboutMeModalProps) {
  const [activeTab, setActiveTab] = useState<'journey' | 'hobbies' | 'achievements'>('journey');

  const clack = () => playSynthSound('keyboard', muted);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020202]/95 backdrop-blur-xl overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(59,130,246,0.2)] grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
          >
            {/* Ambient glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/10 rounded-full filter blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => { playSynthSound('switch', muted); onClose(); }}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/5 bg-white/5 hover:border-accent/30 text-white/70 hover:text-white transition-all active:scale-90 cursor-pointer z-20"
            >
              <X size={18} />
            </button>

            {/* Left Column: Image & Quick Stats */}
            <div className="md:col-span-5 p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between space-y-6 relative z-10 bg-black/40">
              <div className="space-y-6 text-center md:text-left">
                {/* Profile Picture Frame */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto md:mx-0 rounded-3xl overflow-hidden group shadow-[0_20px_50px_rgba(59,130,246,0.15)] border-2 border-accent/20 p-1">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent to-indigo-500 opacity-20 group-hover:opacity-30 transition-opacity" />
                  <img
                    src={ranikAvatar}
                    alt="Ranik Sen Avatar"
                    className="w-full h-full object-cover rounded-[20px] filter saturate-[1.1] contrast-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Glowing cyber scanning bar */}
                  <div className="absolute inset-x-0 h-0.5 bg-accent/60 shadow-[0_0_8px_#3b82f6] animate-[pulse_2s_infinite]" />
                  
                  {/* Status badge */}
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#020202]/80 backdrop-blur-md rounded-lg border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[8px] font-black text-emerald-400 uppercase tracking-widest">SYS_ACTIVE</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">Ranik Sen</h3>
                  <p className="font-mono text-[10px] text-accent uppercase tracking-widest font-black">
                    Community Operations & Tech
                  </p>
                </div>
              </div>

              {/* Fast Bio Card */}
              <div className="space-y-3.5 border-t border-white/5 pt-6 font-mono text-[11px] text-white/60">
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase">HQ LOCATION:</span>
                  <span className="text-white font-medium">Chittagong, BD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase">DIPLOMA LEVEL:</span>
                  <span className="text-white font-medium">High School / Coll</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase">TYPING CORE:</span>
                  <span className="text-accent font-bold">75+ WPM (Specialist)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 uppercase">NETWORKS SCALE:</span>
                  <span className="text-emerald-400 font-bold">4.5 Lakh+ Learners</span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Tabs & Rich Information */}
            <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6 relative z-10">
              <div className="space-y-6">
                {/* Modal Navigation Tabs */}
                <div className="flex border-b border-white/5 pb-2 gap-4">
                  {[
                    { id: 'journey', label: 'My Story' },
                    { id: 'hobbies', label: 'Interests & Passion' },
                    { id: 'achievements', label: 'Olympiad & Logs' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { clack(); setActiveTab(tab.id as any); }}
                      className={`font-mono text-[10px] tracking-widest uppercase pb-2 relative transition-colors cursor-pointer ${
                        activeTab === tab.id ? "text-accent font-bold" : "text-white/45 hover:text-white"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="modalTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content wrapper */}
                <div className="min-h-[220px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'journey' && (
                      <motion.div
                        key="journey"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-sm text-white/75 leading-relaxed"
                      >
                        <p>
                          Hello! I am a student, tech manager, and community builder based in Chittagong, Bangladesh. I believe in translating human power into clean digital infrastructure.
                        </p>
                        <p>
                          Currently, I work closely with <span className="text-accent font-semibold">Apars Classroom (ACS)</span>, one of Bangladesh's most prominent edtech initiatives. I serve as the Lead Moderator of <span className="text-emerald-400 font-semibold">Math & Science Nards</span>, scaling discussion pipelines and resolving conflicts across a community of <strong>450,000+ active student peers</strong>.
                        </p>
                        <p>
                          Simultaneously, I serve as a registrations leader at <span className="text-indigo-400 font-semibold">Achieve Exam Centre</span>, coordinating offline centers, localized on-field workshops, and ensuring precise databases for 5,000+ localized student registrations.
                        </p>
                      </motion.div>
                    )}

                    {activeTab === 'hobbies' && (
                      <motion.div
                        key="hobbies"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4"
                      >
                        <p className="text-sm text-white/70 leading-relaxed">
                          Beyond moderation and logistics spreadsheets, I am fueled by interactive technology and local on-field development. Here are the core pursuits that capture my dedication:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                          {[
                            { title: "Public Speaking", desc: "Leading workshops and coordinate on-field campus campaigns." },
                            { title: "Competitive Chess", desc: "Deeply interested in analytical strategies and logic loops." },
                            { title: "Academic Tutoring", desc: "Coaching juniors in algebra, physics, and computational thinking." },
                            { title: "Generative AI Bots", desc: "Configuring automated screening templates and bot proxies." }
                          ].map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/10 transition-colors">
                              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-accent" />
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-white/50 mt-1 leading-normal">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                      <motion.div
                        key="achievements"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-sm text-white/75 leading-relaxed"
                      >
                        <p>
                          My analytical foundations were built through competitive scientific challenges:
                        </p>
                        <ul className="space-y-3 font-mono text-[11px] text-white/60">
                          <li className="flex gap-2 items-start">
                            <Award size={14} className="text-accent shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white">Bangladesh Mathematical Olympiad (2022)</strong>
                              <p className="text-[10px] text-white/40 mt-0.5">National Level Contender & Selected Participant</p>
                            </div>
                          </li>
                          <li className="flex gap-2 items-start">
                            <Award size={14} className="text-accent shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white">Bangladesh Olympiad Challenge / Math (2025)</strong>
                              <p className="text-[10px] text-white/40 mt-0.5">Competitor showcasing complex problem-solving abilities</p>
                            </div>
                          </li>
                          <li className="flex gap-2 items-start">
                            <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-white">Community Champion Award</strong>
                              <p className="text-[10px] text-white/40 mt-0.5">Recognized by Senior EdTech Educators for moderation merit</p>
                            </div>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Call to Action bar */}
              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-accent" />
                  <span className="font-mono text-[11px] text-white/60">raniksen202024@gmail.com</span>
                </div>
                <button
                  onClick={() => { playSynthSound('success', muted); window.location.href = "mailto:raniksen202024@gmail.com"; }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/80 font-bold font-mono text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-accent/10 cursor-pointer"
                >
                  <span>Launch Mail Client</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main Portfolio Component ---
export default function App() {
  const [booted, setBooted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  
  // Contact Form States
  const [formState, setFormState] = useState<{ name: string; email: string; message: string }>({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Typing effect in Hero
  const titleCarousel = useMemo(() => [
    "Community Moderator",
    "EdTech Infrastructure Lead",
    "Junior Marketing Executive",
    "Creative AI Designer"
  ], []);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselText, setCarouselText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Audio trigger
  const clack = () => playSynthSound('keyboard', muted);
  const hoverSound = () => playSynthSound('hover', muted);

  // Clock updates
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Chittagong UTC+6 time
      const options = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true } as const;
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // System preloader
  useEffect(() => {
    const logs = [
      "INITIALIZING BOOT PROTOCOL v2.4...",
      "LOADING GLOWMAPPED CANVAS ELEMENTS...",
      "ESTABLISHING CONSTELLATION NODE NETWORK...",
      "SYNCHRONIZING WEBAUDIO_API CHANNELS...",
      "COMPILING RETRO INTERACTIVE TERMINALS...",
      "SYS_OS SECURED. BOOTING DESK COMPLETED."
    ];
    let prog = 0;
    const t = setInterval(() => {
      prog += 5;
      setBootProgress(Math.min(prog, 100));
      
      const logIdx = Math.floor((prog / 100) * logs.length);
      if (logs[logIdx] && !bootLogs.includes(logs[logIdx])) {
        setBootLogs(prev => [...prev, logs[logIdx]]);
      }

      if (prog >= 100) {
        clearInterval(t);
      }
    }, 70);
    return () => clearInterval(t);
  }, [bootLogs]);

  // Handle final unlock
  const handleSystemUnlock = () => {
    playSynthSound('boot', false); // force play on start
    setBooted(true);
  };

  // Carousel text typer effect
  useEffect(() => {
    let timer: number;
    const fullText = titleCarousel[carouselIndex];
    
    const tickType = () => {
      if (!isDeleting) {
        setCarouselText(fullText.substring(0, carouselText.length + 1));
        if (carouselText === fullText) {
          timer = window.setTimeout(() => setIsDeleting(true), 2500);
        } else {
          timer = window.setTimeout(tickType, 80);
        }
      } else {
        setCarouselText(fullText.substring(0, carouselText.length - 1));
        if (carouselText === "") {
          setIsDeleting(false);
          setCarouselIndex((prev) => (prev + 1) % titleCarousel.length);
        } else {
          timer = window.setTimeout(tickType, 40);
        }
      }
    };

    timer = window.setTimeout(tickType, 100);
    return () => clearTimeout(timer);
  }, [carouselText, isDeleting, carouselIndex, titleCarousel]);

  // Tracking Active section on Scroll
  useEffect(() => {
    const sections = ["home", "about", "projects", "experience", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Quick Copy Email Utility
  const copyMailToClipboard = () => {
    navigator.clipboard.writeText("raniksen202024@gmail.com");
    setCopied(true);
    playSynthSound('success', muted);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sound enable/disable toggle
  const toggleMute = () => {
    setMuted(!muted);
    playSynthSound('switch', false); // play before state locks
  };

  // Featured Projects database
  const projectsData: Project[] = [
    {
      id: 1,
      title: "Math & Science Nards",
      role: "Lead Platform Moderator",
      period: "2025 - Present",
      category: "COMMUNITY PLATFORM",
      desc: "An enormous student network connected with the Apars Classroom (ACS) edtech initiative. Administered content screening and system compliance to protect and support highly active discussions.",
      metrics: [
        { label: "Community Members", value: "4.5 Lakh+" },
        { label: "Monthly Interactions", value: "250K+" },
        { label: "Admin Actions", value: "12,000+" }
      ],
      tags: ["Facebook API", "EdTech Ops", "Moderation Bots", "Event Logistics"],
      highlights: [
        "Maintained educational integrity across major student traffic pools",
        "Configured robust content filtration matrices for learning modules",
        "Orchestrated direct feedback channels for senior lecturers and moderators"
      ]
    },
    {
      id: 2,
      title: "Achieve Exam Centre Hub",
      role: "Marketing & Registration Executive",
      period: "2025 - Present",
      category: "OPERATIONAL FLOWS",
      desc: "Designed and coordinated marketing campaigns and logistic systems for physical registration, results monitoring, and offline testing centers linked alongside the online ACS ecosystem.",
      metrics: [
        { label: "Physical Registrations", value: "5,000+" },
        { label: "Offline Testing Sites", value: "Multiple Sites" },
        { label: "Local Conversion Rate", value: "+34%" }
      ],
      tags: ["Microsoft Excel Master", "System Logistics", "Local Marketing Campaigns"],
      highlights: [
        "Engineered registration tracking pipelines for large batch student enrollments",
        "Maintained high speed databases ensuring error-free student result delivery",
        "Initiated on-field localized campaigns in Chittagong region"
      ]
    },
    {
      id: 3,
      title: "GenAI EdTech Automation Bot",
      role: "Solo Developer / Architect",
      period: "2024",
      category: "ARTIFICIAL INTELLIGENCE",
      desc: "Constructed an automated assistant using Google's Gemini Pro API to process, tag, and sort academic posts, filtering questions and summarizing complex student discussions.",
      metrics: [
        { label: "Filtering Speed", value: "<1.2s" },
        { label: "Tagging Accuracy", value: "94%" },
        { label: "Inquiries Sorted", value: "10,000+" }
      ],
      tags: ["Google Gemini API", "Node.js", "Express", "Vite React"],
      highlights: [
        "Integrated modern server-side proxies to hide API credentials safely",
        "Parsed complex mathematics and chemistry notations seamlessly using regex patterns",
        "Streamlined human moderators' workloads by pre-approving verified content"
      ]
    }
  ];

  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const activeProject = projectsData[activeProjectIdx];

  // Work experience database
  const experiencesData: Experience[] = [
    {
      id: 1,
      title: "Junior Marketing Executive",
      company: "Achieve Exam Centre",
      location: "Chittagong, Bangladesh",
      period: "Dec 2025 - Present",
      desc: "Coordinating offline test logistical workflows, localized campus campaigns, and registering student pipelines in connection with ACS online courses.",
      bullets: [
        "Constructed operational spreadsheets handling 5,000+ localized database records.",
        "Increased physical registrations by 34% through targeted high school workshops.",
        "Supervised results documentation schedules with flawless processing timelines."
      ]
    },
    {
      id: 2,
      title: "Student Community Moderator",
      company: "Apars Classroom (ACS)",
      location: "Remote / Chittagong",
      period: "Aug 2025 - Present",
      desc: "Assumed structural leadership of the high-traffic Facebook group 'Math & Science Nards' with 4.5 Lakh+ members.",
      bullets: [
        "Administer academic post queues, ensuring safe peer-to-peer environments.",
        "Resolved platform compliance conflicts through active liaison with online educators.",
        "Created customized sorting bots reducing content approval cycle times."
      ]
    },
    {
      id: 3,
      title: "National Olympiad Contender",
      company: "Olympiad Logistics & Comp",
      location: "Dhaka & Chittagong",
      period: "2021 - 2025",
      desc: "Actively trained, organized, and competed in prestigious national competitions focused on computational logic and mathematics.",
      bullets: [
        "Selected participant at the Bangladesh Mathematical Olympiad (2022).",
        "Selected competitor at the Bangladesh Olympiad Challenge / Math (2025).",
        "Collaborated with local student bodies to tutor younger teams in programming concepts."
      ]
    }
  ];

  // Contact form handler
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setFormStatus('sending');
    playSynthSound('switch', muted);
    
    setTimeout(() => {
      setFormStatus('success');
      playSynthSound('success', muted);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-accent/30 selection:text-white font-sans overflow-x-hidden">
      <StarfieldCanvas />

      {/* --- Preloader --- */}
      <AnimatePresence>
        {!booted && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#020202] z-50 flex flex-col items-center justify-center p-6 select-none"
          >
            <div className="w-full max-w-md p-8 rounded-3xl border border-white/5 bg-neutral-950/85 backdrop-blur-2xl relative overflow-hidden space-y-6 shadow-[0_30px_100px_rgba(59,130,246,0.1)]">
              {/* Top border highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-accent animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest text-white/45">RANIK_SYS_BOOT</span>
                </div>
                <span className="font-mono text-[9px] text-accent px-1.5 py-0.5 rounded bg-accent/10 font-bold">ONLINE</span>
              </div>

              {/* Progress and status */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white/40 uppercase">Assembling Workspace</span>
                  <span className="text-accent font-bold">{bootProgress}%</span>
                </div>
                <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-100 ease-out"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>

              {/* Fake logs */}
              <div className="h-32 bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-blue-400/80 space-y-1.5 overflow-y-auto scrollbar-none">
                {bootLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-white/20 select-none">›</span>
                    <span className="leading-normal">{log}</span>
                  </div>
                ))}
                {bootProgress < 100 && (
                  <span className="inline-block w-1 h-3 bg-accent animate-pulse" />
                )}
              </div>

              {/* Unlock Trigger */}
              <button
                disabled={bootProgress < 100}
                onClick={handleSystemUnlock}
                className="w-full py-4 rounded-xl font-mono text-xs tracking-widest uppercase font-bold text-white transition-all flex items-center justify-center gap-2 border border-white/5 disabled:opacity-30 bg-accent hover:bg-accent/80 active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer"
              >
                Enter Ranik's Space
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Sticky Floating Navbar --- */}
      <header className="fixed top-5 left-0 right-0 z-40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto glass rounded-full px-6 py-3.5 flex items-center justify-between border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Logo / Brand */}
          <a 
            href="#home"
            onMouseEnter={hoverSound}
            onClick={() => { clack(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span className="font-bold tracking-widest text-xs uppercase font-mono text-white group-hover:text-accent transition-colors">
              RANIK_SEN.DEV
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {["home", "about", "projects", "experience", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onMouseEnter={hoverSound}
                onClick={() => { clack(); if (section === "about") setAboutModalOpen(true); }}
                className={`font-mono text-[10px] tracking-wider uppercase transition-colors relative py-1 ${
                  activeSection === section ? "text-accent" : "text-white/50 hover:text-white"
                }`}
              >
                {section === "about" ? "about me" : section}
                {activeSection === section && (
                  <motion.div 
                    layoutId="activeIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" 
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Clock Widget */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 font-mono text-[10px] text-white/50">
              <Clock size={11} className="text-accent" />
              <span>BD TIME: {currentTime || "LOADING..."}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              onMouseEnter={hoverSound}
              className="p-2 rounded-full border border-white/5 bg-white/5 hover:border-accent/20 hover:text-accent transition-all active:scale-90 cursor-pointer text-white/70"
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full border border-white/5 bg-white/5 text-white/70"
            >
              {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
            <button
              onClick={() => { clack(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="p-1.5 rounded-full border border-white/5 bg-white/5 text-white/70 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 p-5 rounded-3xl border border-white/5 glass shadow-2xl flex flex-col gap-4"
            >
              {["home", "about", "projects", "experience", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => { clack(); setMobileMenuOpen(false); if (section === "about") setAboutModalOpen(true); }}
                  className="font-mono text-xs tracking-widest uppercase py-1.5 text-white/70 hover:text-accent"
                >
                  {section === "about" ? "about me" : section}
                </a>
              ))}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] font-mono text-white/40">
                <span>CHITTAGONG, BANGLADESH</span>
                <span>{currentTime}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero details */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-[10px] tracking-wider uppercase font-semibold">
              <Sparkles size={11} className="animate-spin" />
              <span>Available for collaborations</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-accent to-indigo-400">Ranik Sen</span>
              </h1>
              <div className="h-8 md:h-12 flex items-center justify-center lg:justify-start">
                <span className="font-mono text-sm md:text-xl text-white/70 tracking-widest font-bold border-r-2 border-accent/70 pr-2 animate-pulse whitespace-nowrap">
                  {carouselText || "Community Growth"}
                </span>
              </div>
            </div>

            <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A proactive, energetic tech moderator and community operations leader based in Bangladesh. I specialize in scaling massive student networks, organizing educational logistics, and building beautiful digital products.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                onMouseEnter={hoverSound}
                onClick={clack}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-accent hover:bg-accent/80 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-[0_10px_30px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <span>View My Projects</span>
                <ChevronRight size={14} />
              </a>
              <a
                href="#contact"
                onMouseEnter={hoverSound}
                onClick={clack}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/10 hover:border-accent/30 bg-white/5 hover:bg-accent/5 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer text-white/80"
              >
                <span>Contact Direct</span>
                <ArrowRight size={14} className="text-accent" />
              </a>
            </div>

            {/* Local Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-sm mx-auto lg:mx-0 text-left border-t border-white/5 font-mono">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-white">450K+</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Students Managed</p>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-black text-white">5K+</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Registrations</p>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-black text-white">75+</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">WPM Typing Speed</p>
              </div>
            </div>
          </div>

          {/* 3D Holographic Object (Interactive) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <HologramSphere />
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <span className="font-mono text-[9px] tracking-widest uppercase">Scroll down</span>
          <div className="w-[1.5px] h-8 bg-white/40" />
        </div>
      </section>

      {/* --- ABOUT SECTION (BENTO GRID) --- */}
      <section id="about" className="py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-2 text-center md:text-left">
          <p className="font-mono text-[10px] tracking-widest text-accent uppercase font-black">
            IDENT_DATABASE_CORE
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            About My Space & Mission
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Main profile avatar details */}
          <div className="md:col-span-2 glass border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-accent/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors" />
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div 
                onClick={() => { clack(); setAboutModalOpen(true); }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-accent to-indigo-500 p-0.5 shadow-xl cursor-pointer relative overflow-hidden group/avatar shrink-0 active:scale-95 transition-transform"
              >
                <img
                  src={ranikAvatar}
                  alt="Ranik Sen Portrait"
                  className="w-full h-full object-cover rounded-[14px] group-hover/avatar:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-bold">Ranik Sen</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] font-black uppercase">
                    ONLINE PROTOCOL
                  </span>
                </div>
                <p className="text-xs text-accent font-mono tracking-widest uppercase font-semibold">
                  Community Architect & EdTech Operations Lead
                </p>
              </div>
            </div>

            <p className="text-sm text-white/60 leading-relaxed">
              Based in Chittagong, Bangladesh, I bridge the gap between human scaling and software automations. I am a highly motivated student currently managing huge academic networks connected directly with Apars Classroom (ACS). I enjoy building interactive web apps and compiling systems to streamline organizational workloads.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent" />
                  <span className="text-white/70">Chittagong, BD</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={14} className="text-accent" />
                  <span className="text-white/70">Chittagong College</span>
                </div>
              </div>

              <button
                onClick={() => { clack(); setAboutModalOpen(true); }}
                className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 font-mono text-[9px] text-accent font-black tracking-widest uppercase transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95 cursor-pointer shadow-lg shadow-accent/5"
              >
                <Sparkles size={11} className="animate-pulse text-accent" />
                <span>Reveal Full Passport</span>
              </button>
            </div>
          </div>

          {/* Card 2: Interactive copy email */}
          <div className="glass border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-accent/20 transition-all duration-300 relative">
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider block">CONTACT ACTIONS</span>
              <h3 className="text-lg font-bold text-white">Let's coordinate on new ventures.</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-white/50 leading-relaxed">
                Need help moderating community queues, designing local campaigns, or setting up AI automations? Reach me directly.
              </p>

              <button
                onClick={copyMailToClipboard}
                onMouseEnter={hoverSound}
                className="w-full py-3.5 px-4 rounded-xl border border-white/5 hover:border-accent/30 bg-white/5 hover:bg-accent/5 font-mono text-xs font-bold text-accent transition-all flex items-center justify-between active:scale-95 cursor-pointer"
              >
                <span className="truncate">raniksen202024@gmail.com</span>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Skills & Capabilities */}
          <div className="glass border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-accent/20 transition-all duration-300">
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider block">CAPABILITIES MATRIX</span>
              <h3 className="text-lg font-bold">Skills I specialize in</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Community Scaling",
                "Marketing Logistics",
                "Generative AI APIs",
                "Microsoft Office Specialist",
                "Spreadsheet Databases",
                "Typing (75+ WPM)",
                "Workflow Automations",
                "React / TailwindCSS"
              ].map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 font-mono text-[10px] text-white/80 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Retro Terminal Script */}
          <div className="md:col-span-2 glass border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-4 hover:border-accent/20 transition-all duration-300 font-mono">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-1.5">
                <Terminal size={13} className="text-accent" />
                <span className="text-[10px] text-white/45">sys_compiler_logs.sh</span>
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
              </div>
            </div>

            <TypingTerminal muted={muted} />

            <div className="text-[9px] text-white/30 pt-3 border-t border-white/5 flex items-center gap-1.5 justify-end">
              <Activity size={10} className="text-emerald-500 animate-pulse" />
              <span>TERMINAL STATUS: DEPLOYED</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="font-mono text-[10px] tracking-widest text-accent uppercase font-black">
              WORKSPACE_PORTFOLIO_HUB
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Featured Platforms & Projects
            </h2>
          </div>

          {/* Quick tab filters */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {projectsData.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => { clack(); setActiveProjectIdx(idx); }}
                className={`px-4 py-2 rounded-xl font-mono text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer ${
                  activeProjectIdx === idx 
                    ? "bg-accent text-white shadow-[0_5px_15px_rgba(59,130,246,0.25)]" 
                    : "bg-white/5 border border-white/5 hover:border-accent/20 text-white/60 hover:text-white"
                }`}
              >
                {project.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Showcase Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: details, lists & tags */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-accent tracking-widest uppercase font-black px-2.5 py-1 rounded bg-accent/10">
                {activeProject.category}
              </span>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{activeProject.title}</h3>
                <span className="font-mono text-xs text-white/40">{activeProject.period}</span>
              </div>
              <p className="font-mono text-xs text-white/50">{activeProject.role}</p>
            </div>

            <p className="text-sm md:text-base text-white/60 leading-relaxed">
              {activeProject.desc}
            </p>

            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Core Highlights</h4>
              <ul className="space-y-2">
                {activeProject.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                    <CheckCircle size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {activeProject.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 rounded-full border border-white/5 bg-white/5 font-mono text-[9px] text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right panel: Statistics & visualization indicators */}
          <div className="lg:col-span-5 flex flex-col justify-between glass border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">OPERATIONAL STATISTICS</span>
            
            <div className="space-y-6">
              {activeProject.metrics.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-end font-mono">
                    <span className="text-[10px] text-white/45 uppercase tracking-wider">{metric.label}</span>
                    <span className="text-lg font-black text-accent">{metric.value}</span>
                  </div>
                  {/* Glowing progress line visual */}
                  <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-4/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[10px] text-white/50 flex items-center gap-2">
              <Compass size={14} className="text-accent animate-spin" />
              <span>Status: Verifiably verified. Security clear.</span>
            </div>
          </div>

        </div>
      </section>

      {/* --- EXPERIENCE TIMELINE SECTION --- */}
      <section id="experience" className="py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] tracking-widest text-accent uppercase font-black">
            CAREER_HIST_LOG
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Work Experience & Timeline
          </h2>
        </div>

        {/* Timeline blocks */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-[1px] before:bg-white/5">
          
          {experiencesData.map((exp, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={exp.id} className={`relative flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Visual Connector Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-[7px] w-3 h-3 rounded-full bg-accent border-4 border-background z-20" />

                {/* Main chronological card */}
                <div className={`w-full md:w-[46%] ml-8 md:ml-0 glass border-white/5 rounded-3xl p-6 md:p-8 space-y-4 hover:border-accent/20 transition-all duration-300`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                      <p className="font-mono text-[11px] text-accent font-semibold">{exp.company}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 font-mono text-[9px] text-white/45 uppercase tracking-wider self-start sm:self-auto">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    {exp.desc}
                  </p>

                  {/* Bullet accomplishments */}
                  <ul className="space-y-1.5 pt-2">
                    {exp.bullets.map((bullet, bidx) => (
                      <li key={bidx} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                        <span className="text-accent font-black mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Empty column buffer spacing for alignment on Desktop */}
                <div className="hidden md:block w-[46%]" />

              </div>
            );
          })}

        </div>
      </section>

      {/* --- CONTACT DIRECT SECTION --- */}
      <section id="contact" className="py-24 px-4 md:px-8 max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] tracking-widest text-accent uppercase font-black">
            SYS_CONTACT_FORM
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Launch Your Inquiry
          </h2>
        </div>

        {/* Contact Container Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Form Side */}
          <div className="lg:col-span-7 glass border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">YOUR NAME</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full bg-white/5 border border-white/5 focus:border-accent/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 outline-none transition-all focus:bg-white-[0.02]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/5 focus:border-accent/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 outline-none transition-all focus:bg-white-[0.02]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">TRANSMISSION MESSAGE</label>
                <textarea 
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell me about your coordination needs, marketing ideas, or moderator projects..."
                  className="w-full bg-white/5 border border-white/5 focus:border-accent/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-white/20 outline-none transition-all focus:bg-white-[0.02] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className="w-full py-4 rounded-xl bg-accent hover:bg-accent/85 font-mono text-xs tracking-widest uppercase font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {formStatus === 'idle' && (
                  <>
                    <Send size={13} />
                    <span>Launch Message</span>
                  </>
                )}
                {formStatus === 'sending' && (
                  <span>TRANSMITTING INQUIRY...</span>
                )}
                {formStatus === 'success' && (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>TRANSMISSION SECURED</span>
                  </>
                )}
              </button>

              {formStatus === 'success' && (
                <p className="text-center font-mono text-[10px] text-emerald-400">
                  Thank you! Ranik will respond via email as soon as possible.
                </p>
              )}

            </form>
          </div>

          {/* Social details panel */}
          <div className="lg:col-span-5 flex flex-col justify-between glass border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">DIRECT DIRECTORY</span>
              <h3 className="text-xl font-bold">Connect via official directories</h3>
              <p className="text-xs text-white/50 leading-relaxed font-mono">
                My platforms are monitored constantly. Feel free to connect directly through social endpoints.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              <a 
                href="https://www.linkedin.com/in/ranik-sen" 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={hoverSound}
                onClick={clack}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between h-28 group"
              >
                <Linkedin size={20} className="text-accent group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/60">LinkedIn</span>
              </a>

              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={hoverSound}
                onClick={clack}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between h-28 group"
              >
                <Facebook size={20} className="text-[#3b5998] group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/60">Facebook</span>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={hoverSound}
                onClick={clack}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between h-28 group"
              >
                <Github size={20} className="text-white group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/60">GitHub</span>
              </a>

              <a 
                href="mailto:raniksen202024@gmail.com" 
                onMouseEnter={hoverSound}
                onClick={clack}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between h-28 group"
              >
                <Mail size={20} className="text-red-400 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/60">Email Desk</span>
              </a>

            </div>

            <div className="font-mono text-[10px] text-white/30 text-center">
              SECURED CONNECTION PROTOCOLS ACTIVE
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 mt-20 pt-10 pb-16 text-center space-y-4">
        <p className="font-mono text-xs text-white/40 tracking-wider">
          &copy; {new Date().getFullYear()} RANIK SEN. CHITTAGONG, BANGLADESH.
        </p>
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
          COORDINATED WITH PASSION • POWERED BY REACT, TAILWIND V4 & MOTION
        </p>
      </footer>

      <AboutMeModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} muted={muted} />
    </div>
  );
}
