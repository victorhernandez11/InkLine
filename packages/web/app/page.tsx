import { redirect } from 'next/navigation';

/**
 * Root route — send visitors to the landing page.
 * Once Supabase is configured and the cloud dashboard is ready, this will
 * become a server component that checks auth and routes accordingly.
 */
export default function RootPage() {
  redirect('/landing');
}
