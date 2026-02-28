'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  { icon: '📊', bg: 'rgba(59,130,246,0.18)',  title: 'Visual Progress',    desc: 'Bar charts across any time range. See your output at a glance and spot trends before they become slumps.' },
  { icon: '📁', bg: 'rgba(16,185,129,0.18)',  title: 'Project Tracking',   desc: 'Color-code novels, blog posts, scripts, essays. Each project keeps its own sessions, stats, and history.' },
  { icon: '🔥', bg: 'rgba(212,98,26,0.18)',   title: 'Streaks & Momentum',     desc: 'Build a daily habit with current and longest streak tracking. A 30-day streak is a powerful motivator.' },
  { icon: '✏️', bg: 'rgba(139,92,246,0.18)',  title: 'Session Notes',          desc: 'Add a quick note to any session. Log what you wrote about, what felt hard, what came easy.' },
  { icon: '🌙', bg: 'rgba(100,116,139,0.18)', title: 'Dark Mode',              desc: 'Write late into the night. InkLine looks just as good in dark mode as it does in the warm daylight theme.' },
  { icon: '⚡', bg: 'rgba(245,158,11,0.18)',  title: 'Works Offline',          desc: 'The lite version lives entirely in your browser. No account, no server, no setup. Just open and start logging.' },
];

const WRITER_STATS = [
  { value: '66',  label: 'days to form a habit, according to research', color: '#d4621a' },
  { value: '500', label: 'words a day, a novel in 6 months',            color: '#8b5cf6' },
  { value: '80K', label: 'words between you and a finished draft',      color: '#3b82f6' },
  { value: '1',   label: 'session logged changes everything',           color: '#10b981' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Always light mode on landing page, independent of dashboard preference
    document.documentElement.setAttribute('data-theme', 'light');
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg   = scrolled ? 'rgba(245,242,237,0.94)' : 'rgba(12,6,2,0.6)';
  const navBdr  = scrolled ? 'var(--border)' : 'rgba(255,255,255,0.07)';
  const logoClr = scrolled ? 'var(--ink)'    : '#f5f2ed';
  const linkClr = scrolled ? 'var(--medium)' : 'rgba(245,242,237,0.65)';

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--bg)', color: 'var(--medium)', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${navBdr}`, transition: 'background 0.35s, border-color 0.35s' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: logoClr, letterSpacing: '-0.5px', transition: 'color 0.35s' }}>InkLine</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ padding: '7px 18px', fontSize: 13, color: linkClr, textDecoration: 'none', borderRadius: 6, fontWeight: 500, transition: 'color 0.35s' }}>Sign In</Link>
            <Link href="/login" style={{ padding: '8px 20px', fontSize: 13, background: 'var(--orange)', color: 'white', borderRadius: 7, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 10px rgba(212,98,26,0.4)' }}>Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── DARK HERO ── */}
      <section style={{ background: 'linear-gradient(150deg, #0c0602 0%, #160a04 50%, #0f0703 100%)', position: 'relative', overflow: 'hidden', padding: '160px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '15%', width: 900, height: 700, background: 'radial-gradient(ellipse, rgba(212,98,26,0.38) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', right: '0%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(180,50,10,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,98,26,0.15)', border: '1px solid rgba(212,98,26,0.3)', borderRadius: 24, padding: '7px 18px', marginBottom: 36 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f4834a', display: 'inline-block', boxShadow: '0 0 8px rgba(244,131,74,0.8)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#f4834a' }}>Daily Writing Tracker</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-2.5px', color: '#f5f2ed', marginBottom: 32 }}>
            Turn every word<br />
            <span style={{ background: 'linear-gradient(90deg, #ff9054 0%, #d4621a 55%, #a83d0a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>
              into momentum.
            </span>
          </h1>

          <p style={{ fontSize: 19, lineHeight: 1.75, color: 'rgba(245,242,237,0.62)', maxWidth: 520, margin: '0 auto 48px' }}>
            Log your writing sessions, track word counts across multiple projects, and watch your streaks grow. One session at a time.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 120 }}>
            <Link href="/login" style={{ padding: '15px 34px', background: 'var(--orange)', color: 'white', borderRadius: 9, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 24px rgba(212,98,26,0.5)' }}>
              Sign Up →
            </Link>
            <Link href="/lite" style={{ padding: '15px 34px', background: 'rgba(245,242,237,0.07)', border: '1px solid rgba(245,242,237,0.14)', color: 'rgba(245,242,237,0.8)', borderRadius: 9, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              Try for Free
            </Link>
          </div>
        </div>

        {/* Floating mockup */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 960 }}>
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
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '13px 15px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(245,242,237,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Words per Day. Last 14 Days.</div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
                    {BAR_DATA.map((item, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 7, color: i === 13 ? '#f4834a' : 'rgba(245,242,237,0.25)', fontWeight: i === 13 ? 700 : 400, overflow: 'hidden' }}>{item.date}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 68 }}>
                    {BAR_DATA.map((item, i) => (
                      <div key={i} style={{ flex: 1, height: `${item.h}%`, background: i === 13 ? `${item.color},0.9)` : `${item.color},0.4)`, borderRadius: '2px 2px 0 0' }} />
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

      {/* ── STATS STRIP — light, colored numbers pop on parchment ── */}
      <section style={{ background: 'var(--bg)', padding: '88px 28px 96px', position: 'relative', zIndex: 1, marginTop: -28 }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(46,33,24,0.3)', marginBottom: 52 }}>
            Become the writer you want to be
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {WRITER_STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 24px', borderLeft: i > 0 ? '1px solid rgba(46,33,24,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 10 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.4, maxWidth: 120, margin: '0 auto' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — dark, badge cards, no divider from stats ── */}
      <section style={{ background: 'linear-gradient(180deg, #0a0604 0%, #0d0908 100%)', position: 'relative', overflow: 'hidden', padding: '100px 28px 120px' }}>
        {/* Mesh blobs — project colors */}
        <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(59,130,246,0.13) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '0%', right: '-8%', width: 600, height: 600, background: 'radial-gradient(ellipse, rgba(16,185,129,0.10) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '30%', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(212,98,26,0.7)', marginBottom: 16 }}>Built for writers</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: '#f5f2ed', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Everything you need to<br />build a writing habit.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(245,242,237,0.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              No clutter, no distractions.<br />Just the numbers that keep you writing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '34px 30px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 15, background: f.bg, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
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
      <section style={{ background: 'var(--bg)', padding: '120px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle warm glow at top */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 320, background: 'radial-gradient(ellipse, rgba(212,98,26,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 88 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Get started in minutes</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-1px' }}>
              Simple by design.
            </h2>
          </div>

          {/* Steps with numbered circles and connectors */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
            {[
              { num: '1', title: 'Log a session',   desc: 'After writing, open InkLine and enter the date, project, word count, and an optional note. Takes under 30 seconds.' },
              { num: '2', title: 'Watch it add up', desc: 'Your stats update instantly. See your total words, daily averages, and streak grow with every entry you log.' },
              { num: '3', title: 'Stay consistent', desc: 'Consistency beats intensity. InkLine makes it easy to see your patterns. Protect them.' },
            ].map((s, i) => (
              <div key={s.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                {/* Connector line (not on last) */}
                {i < 2 && (
                  <div style={{ position: 'absolute', top: 27, left: '50%', width: '100%', height: 2, background: 'linear-gradient(90deg, rgba(212,98,26,0.5) 0%, rgba(212,98,26,0.15) 100%)', zIndex: 0 }} />
                )}
                {/* Circle */}
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative', zIndex: 1, boxShadow: '0 0 0 6px rgba(212,98,26,0.12), 0 8px 24px rgba(212,98,26,0.3)', flexShrink: 0 }}>
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

      {/* ── PRICING — dark, quote folded in as moody intro ── */}
      <section style={{ background: 'linear-gradient(180deg, #0d0908 0%, #100a05 100%)', position: 'relative', overflow: 'hidden', padding: '0 28px 120px' }}>
        {/* Subtle orange glow in the middle */}
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(212,98,26,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Quote intro */}
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '100px 0 72px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 72, color: 'rgba(212,98,26,0.22)', lineHeight: 0.6, marginBottom: 28, fontStyle: 'italic', userSelect: 'none' as const }}>"</div>
          <blockquote style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(18px, 2.4vw, 26px)', fontStyle: 'italic', color: 'rgba(245,242,237,0.68)', lineHeight: 1.7, marginBottom: 24 }}>
            A writer who waits for ideal conditions under which to work will die without putting a word on paper.
          </blockquote>
          <cite style={{ fontSize: 11, color: 'rgba(245,242,237,0.25)', fontStyle: 'normal', letterSpacing: '2px', textTransform: 'uppercase' as const }}>E.B. White</cite>
        </div>

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'rgba(212,98,26,0.7)', marginBottom: 16 }}>Pricing</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 700, color: '#f5f2ed', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Start free.<br />Upgrade for $4.99/mo.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(245,242,237,0.42)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Your writing lives in your browser at no cost. Add cloud sync when your words matter too much to lose.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 860, margin: '0 auto' }}>
            {/* Free — glass card on dark */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 22, padding: '44px 38px', display: 'flex', flexDirection: 'column' as const, border: '1px solid rgba(255,255,255,0.09)' }}>
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
              <Link href="/lite" style={{ display: 'block', textAlign: 'center', padding: '15px 0', background: 'transparent', border: '1.5px solid rgba(245,242,237,0.18)', color: 'rgba(245,242,237,0.75)', borderRadius: 11, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Try for Free →
              </Link>
            </div>

            {/* Cloud */}
            <div style={{ background: 'linear-gradient(145deg, #1a0c05 0%, #0f0703 100%)', borderRadius: 22, padding: '44px 38px', position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, border: '1px solid rgba(212,98,26,0.3)', boxShadow: '0 0 0 1px rgba(212,98,26,0.08) inset, 0 24px 64px rgba(0,0,0,0.4)' }}>
              <div style={{ position: 'absolute' as const, top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,98,26,0.6), transparent)' }} />
              <div style={{ position: 'absolute' as const, top: -1, right: 36, background: 'var(--orange)', color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, padding: '5px 16px', borderRadius: '0 0 10px 10px', boxShadow: '0 4px 14px rgba(212,98,26,0.45)' }}>
                Recommended
              </div>
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
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '15px 0', background: 'var(--orange)', color: 'white', borderRadius: 11, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 20px rgba(212,98,26,0.45)' }}>
                Sign Up for $4.99/mo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '120px 28px', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 700, color: 'var(--ink)', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.1 }}>
            Start counting your<br />words today.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--medium)', marginBottom: 52, lineHeight: 1.72 }}>
            Free forever in your browser. Sync across devices for $4.99/month.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ padding: '16px 36px', background: 'var(--orange)', color: 'white', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(212,98,26,0.38)' }}>
              Sign Up →
            </Link>
            <Link href="/lite" style={{ padding: '16px 36px', background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--ink)', borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
              Try for Free
            </Link>
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
