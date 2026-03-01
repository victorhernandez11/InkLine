'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SUPABASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Shown when .env.local isn't set up yet
function NotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-xl text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>InkLine</h1>
        <p className="mb-6" style={{ color: 'var(--dim)', fontSize: 14 }}>Sign in to your account</p>
        <div className="rounded-lg p-4 mb-6 text-left" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--ink)', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>⚙️ Supabase not configured</p>
          <p style={{ color: 'var(--medium)', lineHeight: 1.6, fontSize: 13 }}>
            Add your credentials to{' '}
            <code style={{ background: 'var(--border)', padding: '1px 5px', borderRadius: 3, fontFamily: 'monospace', fontSize: 11 }}>packages/web/.env.local</code>{' '}
            to enable cloud sync.
          </p>
          <pre style={{ marginTop: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: 'var(--medium)', lineHeight: 1.7, overflowX: 'auto' as const }}>{`NEXT_PUBLIC_SUPABASE_URL=your_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_key`}</pre>
        </div>
        <Link href="/lite" style={{ display: 'block', padding: '11px 0', background: 'var(--orange)', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 10 }}>
          Use the free version instead →
        </Link>
        <Link href="/landing" style={{ fontSize: 13, color: 'var(--dim)', textDecoration: 'none' }}>← Back to landing page</Link>
      </div>
    </div>
  );
}

// Full login form — only rendered when Supabase IS configured
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError('Check your email for a confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ background: 'var(--surface)' }}>
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}
        >
          InkLine
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--dim)' }}>
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border outline-none transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--dim)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 rounded-md border outline-none transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded"
              style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white font-medium transition-opacity disabled:opacity-50"
            style={{ background: 'var(--orange)' }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--dim)' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 rounded-md border font-medium transition-colors hover:opacity-90"
          style={{ borderColor: 'var(--border)', color: 'var(--medium)', background: 'white' }}
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--dim)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="underline"
            style={{ color: 'var(--orange)' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>

        <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/lite" style={{ fontSize: 13, color: 'var(--dim)', textDecoration: 'none' }}>
            Use without an account →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Page entry point
export default function LoginPage() {
  if (!SUPABASE_CONFIGURED) return <NotConfigured />;
  return <LoginForm />;
}
