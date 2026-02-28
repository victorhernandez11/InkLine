'use client';

import dynamic from 'next/dynamic';

// Dynamically import the lite App with SSR disabled — it uses localStorage
// which only exists in the browser, not on the server.
const LiteApp = dynamic(() => import('../../../lite/src/App'), { ssr: false });

export default function LitePage() {
  return <LiteApp />;
}
