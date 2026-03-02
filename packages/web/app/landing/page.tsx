'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const BAR_DATA = [
  { h: 30,  date: '2/14', color: 'rgba(139,92,246'  },
  { h: 55,  date: '2/15', color: 'rgba(59,130,246'  },
  { h: 45,  date: '2/16', color: 'rgba(16,185,129'  },
  { h: 80,  date: '2/17', color: 'rgba(59,130,246'  },
  { h: 65,  date: '2/18', color: 'rgba(139,92,246'  },
  { h: 20,  date: '2/19', color: 'rgba(16,185,129'  },
  { h: 90,  date: '2/20', color: 'rgba(59,130,246'  },
  { h: 75,  date: '2/21', color: 'rgba(59,130,246'  },
  { h: 60,  date: '2/22', color: 'rgba(139,92,246'  },
  { h: 85,  date: '2/23', color: 'rgba(59,130,246'  },
  { h: 100, date: '2/24', color: 'rgba(16,185,129'  },
  { h: 70,  date: '2/25', color: 'rgba(59,130,246'  },
  { h: 88,  date: '2/26', color: 'rgba(16,185,129'  },
  { h: 95,  date: '2/27', color: 'rgba(59,130,246'  },
];

const PROJECTS = [
  { name: 'All Projects',  color: '#d4621a', active: true, words: '84.2k' },
  { name: 'The Novel',     color: '#3b82f6', words: '52.3k' },
  { name: 'Blog Posts',    color: '#10b981', words: '18.7k' },
  { name: 'Short Stories', color: '#8b5cf6', words: '13.2k' },
];

const SESSIONS = [
  { date: 'Today',     project: 'The Novel',  words: '1,240', color: '#3b82f6', note: 'Got through the confrontation scene' },
  { date: 'Yesterday', project: 'Blog Posts', words: '860',   color: '#10b981', note: 'Draft of the productivity post' },
  { date: 'Feb 23',   project: 'The Novel',  words: '2,100', color: '#3b82f6', note: 'Chapter 7 outline and first draft' },
];

const FEATURES = [
  { icon: '📊', bg: 'rgba(59,130,246,0.18)',  glow: 'rgba(59,130,246,0.25)',  title: 'Visual Progress',    desc: 'Bar charts across any time range. See your output at a glance and spot trends before they become slumps.' },
  { icon: '📁', bg: 'rgba(16,185,129,0.18)',  glow: 'rgba(16,185,129,0.25)',  title: 'Project Tracking',   desc: 'Color-code novels, blog posts, scripts, essays. Each project keeps its own sessions, stats, and history.' },
  { icon: '🔥', bg: 'rgba(212,98,26,0.18)',   glow: 'rgba(212,98,26,0.25)',   title: 'Streaks & Momentum', desc: 'Build a daily habit with current and longest streak tracking. A 30-day streak is a powerful motivator.' },
  { icon: '✏️', bg: 'rgba(139,92,246,0.18)',  glow: 'rgba(139,92,246,0.25)',  title: 'Session Notes',      desc: 'Add a quick note to any session. Log what you wrote about, what felt hard, what came easy.' },
  { icon: '🌙', bg: 'rgba(100,116,139,0.18)', glow: 'rgba(100,116,139,0.2)',  title: 'Dark Mode',          desc: 'Write late into the night. InkLine looks just as good in dark mode as it does in the warm daylight theme.' },
  { icon: '⚡', bg: 'rgba(245,158,11,0.18)',  glow: 'rgba(245,158,11,0.25)',  title: 'Works Offline',      desc: 'The lite version lives entirely in your browser. No account, no server, no setup. Just open and start logging.' },
];

const WRITER_STATS = [
  { value: 66,   display: '66',  label: 'days to form a habit, according to research', color: '#d4621a' },
  { value: 500,  display: '500', label: 'words a day, a novel in 6 months',            color: '#8b5cf6' },
  { value: 80,   display: '80K', label: 'words between you and a finished draft',      color: '#3b82f6' },
  { value: 1,    display: '1',   label: 'session logged changes everything',           color: '#10b981' },
];

// ── Intersection observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// ── Reveal style helper ──────────────────────────────────────────────────────
function reveal(inView: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(28px)',
    transition: `opacity 0.72s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.72s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
  };
}

export default function LandingPage() {
  const [scrolled, setScrolled]       = useState(false);
  const [scrollPct, setScrollPct]     = useState(0);
  const [heroReady, setHeroReady]     = useState(false);
  const [tilt, setTilt]               = useState({ x: 0, y: 0 });
  const [mouse, setMouse]             = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  // Section in-view refs
  const [statsRef,    statsInView]    = useInView(0.2);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [howRef,      howInView]      = useInView(0.1);
  const [pricingRef,  pricingInView]  = useInView(0.1);
  const [ctaRef,      ctaInView]      = useInView(0.2);
  const [barsRef,     barsInView]     = useInView(0.4);

  // Counter animation for stats
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  useEffect(() => {
    if (!statsInView) return;
    const targets = WRITER_STATS.map(s => s.value);
    const duration = 1400;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounters(targets.map(t => Math.round(t * ease)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [statsInView]);

  // Hero entrance
  useEffect(() => {
    const id = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(id);
  }, []);

  // Nav scroll + progress
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const el = document.documentElement;
      setScrollPct(el.scrollTop / (el.scrollHeight - el.clientHeight));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global mouse for hero parallax
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  // Mockup 3D tilt
  const onMockupMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = mockupRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2))  / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    setTilt({ x: dy * -5, y: dx * 5 });
  };
  const onMockupLeave = () => setTilt({ x: 0, y: 0 });

  const navBg   = scrolled ? 'rgba(245,242,237,0.94)' : 'rgba(12,6,2,0.6)';
  const navBdr  = scrolled ? 'var(--border)' : 'rgba(255,255,255,0.07)';
  const logoClr = scrolled ? 'var(--ink)'    : '#f5f2ed';
  const linkClr = scrolled ? 'var(--medium)' : 'rgba(245,242,237,0.65)';

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)', color: 'var(--medium)', minHeight: '100vh' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow: 0 0 8px rgba(244,131,74,0.9); opacity: 1; }
          50%     { box-shadow: 0 0 16px rgba(244,131,74,0.4); opacity: 0.6; }
        }
        @keyframes floatMockup {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-10px); }
        }
        @keyframes drawLine {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gradientFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes badgeShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* ── SCROLL PROGRESS BAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 2,
        background: 'linear-gradient(90deg, var(--orange), #ff9054)',
        transformOrigin: 'left',
        transform: `scaleX(${scrollPct})`,
        transition: 'transform 0.08s linear',
        opacity: scrollPct > 0.01 ? 1 : 0,
        pointerEvents: 'none',
      }} />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${navBdr}`, transition: 'background 0.35s, border-color 0.35s' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: logoClr, letterSpacing: '-0.5px', transition: 'color 0.35s' }}>InkLine</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ padding: '7px 18px', fontSize: 13, color: linkClr, textDecoration: 'none', borderRadius: 6, fontWeight: 500, transition: 'color 0.35s' }}>Sign In</Link>
            <Link
              href="/login"
              style={{ padding: '8px 20px', fontSize: 13, background: 'var(--orange)', color: 'white', borderRadius: 7, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 10px rgba(212,98,26,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(212,98,26,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(212,98,26,0.4)'; }}
            >Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(150deg, #0c0602 0%, #160a04 50%, #0f0703 100%)', position: 'relative', overflow: 'hidden', padding: '160px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '15%', width: 900, height: 700, background: 'radial-gradient(ellipse, rgba(212,98,26,0.38) 0%, transparent 60%)', pointerEvents: 'none', animation: 'floatMockup 8s ease-in-out infinite', transform: `translate(${mouse.x * -28}px, ${mouse.y * -18}px)`, transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ position: 'absolute', top: '5%', right: '0%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(180,50,10,0.22) 0%, transparent 65%)', pointerEvents: 'none', animation: 'floatMockup 10s ease-in-out infinite reverse', transform: `translate(${mouse.x * 22}px, ${mouse.y * 14}px)`, transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(105deg, rgba(212,98,26,0.12) 0%, rgba(244,131,74,0.28) 40%, rgba(212,98,26,0.12) 80%)',
            backgroundSize: '200% 100%',
            border: '1px solid rgba(212,98,26,0.3)',
            borderRadius: 24, padding: '7px 18px', marginBottom: 36,
            opacity: heroReady ? 1 : 0,
            animation: heroReady ? 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0s both, badgeShimmer 3.5s ease-in-out 0.8s infinite' : 'none',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f4834a', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#f4834a' }}>Daily Writing Tracker</span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 700,
            lineHeight: 1.0, letterSpacing: '-2.5px', color: '#f5f2ed', marginBottom: 32,
            animation: heroReady ? 'fadeUp 0.72s cubic-bezier(0.4,0,0.2,1) 0.12s both' : 'none',
          }}>
            Turn every word<br />
            <span style={{ background: 'linear-gradient(90deg, #ff9054 0%, #d4621a 30%, #ff6b35 60%, #ff9054 100%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic', animation: heroReady ? 'gradientFlow 5s ease-in-out infinite' : 'none' }}>
              into momentum.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 19, lineHeight: 1.75, color: 'rgba(245,242,237,0.62)', maxWidth: 520, margin: '0 auto 48px',
            animation: heroReady ? 'fadeUp 0.72s cubic-bezier(0.4,0,0.2,1) 0.26s both' : 'none',
          }}>
            Log your writing sessions, track word counts across multiple projects, and watch your streaks grow. One session at a time.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 120,
            animation: heroReady ? 'fadeUp 0.72s cubic-bezier(0.4,0,0.2,1) 0.38s both' : 'none',
          }}>
            <Link
              href="/login"
              style={{ padding: '15px 34px', background: 'var(--orange)', color: 'white', borderRadius: 9, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 24px rgba(212,98,26,0.5)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 36px rgba(212,98,26,0.65)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(212,98,26,0.5)'; }}
            >Sign Up →</Link>
            <Link
              href="/lite"
              style={{ padding: '15px 34px', background: 'rgba(245,242,237,0.07)', border: '1px solid rgba(245,242,237,0.14)', color: 'rgba(245,242,237,0.8)', borderRadius: 9, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s, border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,242,237,0.13)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,242,237,0.28)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,242,237,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,242,237,0.14)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
            >Try for Free</Link>
          </div>
        </div>

        {/* Floating mockup */}
        <div
          ref={mockupRef}
          onMouseMove={onMockupMove}
          onMouseLeave={onMockupLeave}
          style={{
            position: 'relative', zIndex: 1, width: '100%', maxWidth: 960,
            animation: heroReady ? 'fadeUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.52s both' : 'none',
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.12s ease-out',
            cursor: 'default',
          }}
        >
          <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 160, background: 'radial-gradient(ellipse, rgba(212,98,26,0.35) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
          <div style={{ background: '#1a0e08', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 -2px 0 rgba(255,255,255,0.05) inset, 0 40px 120px rgba(0,0,0,0.7)' }}>
            <div style={{ background: '#120a05', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#6b3030' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#6b5a20' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#2a5a30' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '4px 10px', fontSize: 11, color: 'rgba(245,242,237,0.35)', maxWidth: 280, margin: '0 auto' }}>inkline.app</div>
            </div>
            <div style={{ display: 'flex', minHeight: 340 }}>
              <div style={{ width: 196, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '20px 12px', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: 'rgba(245,242,237,0.9)', marginBottom: 18, paddingLeft: 8 }}>Projects</div>
                {PROJECTS.map((p) => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, background: p.active ? 'rgba(212,98,26,0.85)' : 'transparent', marginBottom: 2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.active ? 'rgba(255,255,255,0.9)' : p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: p.active ? 'white' : 'rgba(245,242,237,0.6)', fontWeight: p.active ? 600 : 400, flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: 10, color: p.active ? 'rgba(255,255,255,0.65)' : 'rgba(245,242,237,0.3)', fontFamily: 'var(--font-number)' }}>{p.words}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, padding: '18px 22px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                  {[{ label: 'Total Words', value: '84,210', sub: 'all time' }, { label: 'This Week', value: '3,740', sub: '↑ 12%' }, { label: 'Current Streak', value: '14 days', sub: 'keep it up!' }, { label: 'Sessions', value: '62', sub: 'logged' }].map((s) => (
                    <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '11px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: 9, color: 'rgba(245,242,237,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontFamily: 'var(--font-number)', fontSize: 17, fontWeight: 700, color: '#f4834a', lineHeight: 1.2 }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: 'rgba(245,242,237,0.3)', marginTop: 2 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Bar chart — animated */}
                <div ref={barsRef} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '13px 15px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(245,242,237,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Words per Day. Last 14 Days.</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
                    {BAR_DATA.map((item, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 7, color: i === 13 ? '#f4834a' : 'rgba(245,242,237,0.25)', fontWeight: i === 13 ? 700 : 400, overflow: 'hidden' }}>{item.date}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 68 }}>
                    {BAR_DATA.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: barsInView ? `${item.h}%` : '0%',
                          background: i === 13 ? `${item.color},0.9)` : `${item.color},0.4)`,
                          borderRadius: '2px 2px 0 0',
                          transition: `height 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {SESSIONS.map((row, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 14px', background: i % 2 === 1 ? 'rgba(255,255,255,0.03)' : 'transparent', fontSize: 11 }}>
                      <span style={{ width: 65, color: 'rgba(245,242,237,0.45)', flexShrink: 0 }}>{row.date}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(245,242,237,0.8)', fontWeight: 500 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0, display: 'inline-block' }} />
                          {row.project}
                        </span>
                        <span style={{ fontSize: 9, color: 'rgba(245,242,237,0.3)', paddingLeft: 11, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.note}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-number)', color: '#f4834a', fontWeight: 700, flexShrink: 0 }}>{row.words} words</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section ref={statsRef} style={{ background: 'var(--bg)', padding: '88px 28px 96px', position: 'relative', zIndex: 1, marginTop: -28 }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <p style={{ ...reveal(statsInView), textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(46,33,24,0.3)', marginBottom: 52 }}>
            Become the writer you want to be
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {WRITER_STATS.map((s, i) => (
              <div key={i} style={{ ...reveal(statsInView, 0.1 + i * 0.08), textAlign: 'center', padding: '16px 24px', borderLeft: i > 0 ? '1px solid rgba(46,33,24,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 10 }}>
                  {/* Show animated counter, keep K suffix for 80K */}
                  {i === 2 ? `${counters[i]}K` : counters[i]}
                </div>
                <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.4, maxWidth: 120, margin: '0 auto' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} style={{ background: 'linear-gradient(180deg, #0a0604 0%, #0d0908 100%)', position: 'relative', overflow: 'hidden', padding: '100px 28px 120px' }}>
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(59,130,246,0.13) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '0%', right: '-8%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(16,185,129,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '30%', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ ...reveal(featuresInView, 0), fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(212,98,26,0.7)', marginBottom: 16 }}>Built for writers</p>
            <h2 style={{ ...reveal(featuresInView, 0.1), fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: '#f5f2ed', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Everything you need to<br />build a writing habit.
            </h2>
            <p style={{ ...reveal(featuresInView, 0.2), fontSize: 17, color: 'rgba(245,242,237,0.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              No clutter, no distractions.<br />Just the numbers that keep you writing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                onMouseEnter={() => setHoveredCard(f.title)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  ...reveal(featuresInView, 0.1 + i * 0.07),
                  background: hoveredCard === f.title ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 18, padding: '34px 30px',
                  transform: featuresInView
                    ? (hoveredCard === f.title ? 'translateY(-5px)' : 'none')
                    : 'translateY(28px)',
                  boxShadow: hoveredCard === f.title ? `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${f.glow}` : 'none',
                  transition: 'background 0.25s, transform 0.25s, box-shadow 0.25s, opacity 0.72s cubic-bezier(0.4,0,0.2,1), translate 0.72s cubic-bezier(0.4,0,0.2,1)',
                  cursor: 'default',
                }}
              >
                <div style={{ width: 54, height: 54, borderRadius: 15, background: f.bg, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, transition: 'transform 0.25s', transform: hoveredCard === f.title ? 'scale(1.1)' : 'scale(1)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#f5f2ed', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.72, color: 'rgba(245,242,237,0.5)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howRef} style={{ background: 'var(--bg)', padding: '120px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 320, background: 'radial-gradient(ellipse, rgba(212,98,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 88 }}>
            <p style={{ ...reveal(howInView, 0), fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Get started in minutes</p>
            <h2 style={{ ...reveal(howInView, 0.1), fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px' }}>
              Simple by design.
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
            {[
              { num: '1', title: 'Log a session',   desc: 'After writing, open InkLine and enter the date, project, word count, and an optional note. Takes under 30 seconds.' },
              { num: '2', title: 'Watch it add up', desc: 'Your stats update instantly. See your total words, daily averages, and streak grow with every entry you log.' },
              { num: '3', title: 'Stay consistent', desc: 'Consistency beats intensity. InkLine makes it easy to see your patterns. Protect them.' },
            ].map((s, i) => (
              <div
                key={s.num}
                style={{ ...reveal(howInView, 0.15 + i * 0.15), flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
              >
                {/* Connector */}
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: 27, left: '50%', height: 2, zIndex: 0,
                    width: howInView ? '100%' : '0%',
                    background: 'linear-gradient(90deg, rgba(212,98,26,0.5) 0%, rgba(212,98,26,0.15) 100%)',
                    transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${0.4 + i * 0.2}s`,
                  }} />
                )}
                {/* Circle */}
                <div
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    width: 56, height: 56, borderRadius: '50%', background: 'var(--orange)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 28, position: 'relative', zIndex: 1, flexShrink: 0,
                    boxShadow: hoveredStep === i
                      ? '0 0 0 12px rgba(212,98,26,0.18), 0 16px 36px rgba(212,98,26,0.45)'
                      : '0 0 0 6px rgba(212,98,26,0.12), 0 8px 24px rgba(212,98,26,0.3)',
                    transform: hoveredStep === i ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    cursor: 'default',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-number)', fontSize: 22, fontWeight: 700, color: 'white' }}>{s.num}</span>
                </div>
                <div style={{ padding: '0 28px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.72, color: 'var(--medium)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section ref={pricingRef} style={{ background: 'linear-gradient(180deg, #0d0908 0%, #100a05 100%)', position: 'relative', overflow: 'hidden', padding: '0 28px 120px' }}>
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(212,98,26,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '100px 0 72px', position: 'relative', zIndex: 1 }}>
          <div style={{ ...reveal(pricingInView, 0), fontFamily: 'var(--font-heading)', fontSize: 72, color: 'rgba(212,98,26,0.22)', lineHeight: 0.6, marginBottom: 28, fontStyle: 'italic', userSelect: 'none' as const }}>"</div>
          <blockquote style={{ ...reveal(pricingInView, 0.1), fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.4vw, 26px)', fontStyle: 'italic', color: 'rgba(245,242,237,0.68)', lineHeight: 1.7, marginBottom: 24 }}>
            A writer who waits for ideal conditions under which to work will die without putting a word on paper.
          </blockquote>
          <cite style={{ ...reveal(pricingInView, 0.2), fontSize: 11, color: 'rgba(245,242,237,0.25)', fontStyle: 'normal', letterSpacing: '2px', textTransform: 'uppercase' as const }}>E.B. White</cite>
        </div>

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ ...reveal(pricingInView, 0.1), fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'rgba(212,98,26,0.7)', marginBottom: 16 }}>Pricing</p>
            <h2 style={{ ...reveal(pricingInView, 0.2), fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: '#f5f2ed', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Start free.<br />Upgrade for $4.99/mo.
            </h2>
            <p style={{ ...reveal(pricingInView, 0.3), fontSize: 17, color: 'rgba(245,242,237,0.42)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Your writing lives in your browser at no cost. Add cloud sync when your words matter too much to lose.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 860, margin: '0 auto' }}>
            {/* Free */}
            <div
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 64px rgba(0,0,0,0.35)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              style={{ ...reveal(pricingInView, 0.25), background: 'rgba(255,255,255,0.05)', borderRadius: 22, padding: '44px 38px', display: 'flex', flexDirection: 'column' as const, border: '1px solid rgba(255,255,255,0.09)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, opacity 0.72s cubic-bezier(0.4,0,0.2,1), translate 0.72s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' as const, color: 'rgba(245,242,237,0.38)', background: 'rgba(255,255,255,0.08)', padding: '5px 14px', borderRadius: 20, marginBottom: 22 }}>Free</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 46, fontWeight: 700, color: '#f5f2ed', lineHeight: 1, marginBottom: 6 }}>$0</div>
              <p style={{ fontSize: 13, color: 'rgba(245,242,237,0.28)', marginBottom: 36 }}>Forever. No credit card.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column' as const, gap: 15, flex: 1 }}>
                {['Unlimited writing sessions', 'Up to 5 projects', 'Charts, streaks & stats', 'Session notes', 'Dark mode', 'Works offline', 'No account needed'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, color: 'rgba(245,242,237,0.65)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(74,159,78,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#6ecf73', fontWeight: 800, fontSize: 11 }}>✓</span>
                    </span>
                    {f}
                  </li>
                ))}
                {['Sync across devices', 'Access from any browser', 'Automatic cloud backup'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, color: 'rgba(245,242,237,0.22)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'rgba(245,242,237,0.22)' }}>–</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/lite"
                style={{ display: 'block', textAlign: 'center', padding: '15px 0', background: 'transparent', border: '1.5px solid rgba(245,242,237,0.18)', color: 'rgba(245,242,237,0.75)', borderRadius: 11, fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s, background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,242,237,0.4)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,242,237,1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(245,242,237,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,242,237,0.18)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,242,237,0.75)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >Try for Free →</Link>
            </div>

            {/* Cloud */}
            <div
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,98,26,0.4) inset'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(212,98,26,0.08) inset, 0 24px 64px rgba(0,0,0,0.4)'; }}
              style={{ ...reveal(pricingInView, 0.35), background: 'linear-gradient(145deg, #1a0c05 0%, #0f0703 100%)', borderRadius: 22, padding: '44px 38px', position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, border: '1px solid rgba(212,98,26,0.3)', boxShadow: '0 0 0 1px rgba(212,98,26,0.08) inset, 0 24px 64px rgba(0,0,0,0.4)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, opacity 0.72s cubic-bezier(0.4,0,0.2,1), translate 0.72s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <div style={{ position: 'absolute' as const, top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,98,26,0.6), transparent)' }} />
              <div style={{ position: 'absolute' as const, top: -1, right: 36, background: 'var(--orange)', color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, padding: '5px 16px', borderRadius: '0 0 10px 10px', boxShadow: '0 4px 14px rgba(212,98,26,0.45)' }}>Recommended</div>
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' as const, color: 'rgba(245,242,237,0.4)', background: 'rgba(255,255,255,0.07)', padding: '5px 14px', borderRadius: 20, marginBottom: 22 }}>Cloud</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 46, fontWeight: 700, color: '#f5f2ed', lineHeight: 1 }}>$4.99</span>
                <span style={{ fontSize: 15, color: 'rgba(245,242,237,0.4)', fontWeight: 500 }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(245,242,237,0.35)', marginBottom: 36 }}>Billed monthly. Cancel anytime.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column' as const, gap: 15, flex: 1 }}>
                {['Everything in Free', 'Unlimited projects', 'Sync across all devices', 'Access from any browser', 'Automatic cloud backup', 'Never lose your data'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, color: 'rgba(245,242,237,0.78)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(110,207,115,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#6ecf73', fontWeight: 800, fontSize: 11 }}>✓</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                style={{ display: 'block', textAlign: 'center', padding: '15px 0', background: 'var(--orange)', color: 'white', borderRadius: 11, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(212,98,26,0.45)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(212,98,26,0.65)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,98,26,0.45)'; }}
              >Sign Up for $4.99/mo →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} style={{ padding: '120px 28px', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ ...reveal(ctaInView, 0), fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 700, color: 'var(--ink)', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Start counting your<br />words today.
          </h2>
          <p style={{ ...reveal(ctaInView, 0.12), fontSize: 17, color: 'var(--medium)', marginBottom: 52, lineHeight: 1.72 }}>
            Free forever in your browser. Sync across devices for $4.99/month.
          </p>
          <div style={{ ...reveal(ctaInView, 0.24), display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/login"
              style={{ padding: '16px 36px', background: 'var(--orange)', color: 'white', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(212,98,26,0.38)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 36px rgba(212,98,26,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,98,26,0.38)'; }}
            >Sign Up →</Link>
            <Link
              href="/lite"
              style={{ padding: '16px 36px', background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--ink)', borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,33,24,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = ''; }}
            >Try for Free</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 28px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>InkLine</span>
          <span style={{ fontSize: 12, color: 'var(--dim)' }}>Built for writers who ship words daily.</span>
          <div style={{ display: 'flex', gap: 22 }}>
            <Link href="/login" style={{ fontSize: 12, color: 'var(--dim)', textDecoration: 'none' }}>Sign In</Link>
            <Link href="/login" style={{ fontSize: 12, color: 'var(--dim)', textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
