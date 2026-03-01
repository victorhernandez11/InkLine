import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allowlist of paths the `next` param may redirect to
const ALLOWED_NEXT_PATHS = ['/', '/dashboard', '/settings'];

// Simple in-memory rate limiter (resets on process restart)
const attempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;       // max attempts
const RATE_WINDOW = 60_000;  // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Rate-limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return new NextResponse('Too many requests', { status: 429 });
  }

  const code = searchParams.get('code');

  // Validate `next` — only allow known internal paths, never external URLs
  const rawNext = searchParams.get('next') ?? '/';
  const next = ALLOWED_NEXT_PATHS.includes(rawNext) ? rawNext : '/';

  if (code) {
    const supabase = createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
