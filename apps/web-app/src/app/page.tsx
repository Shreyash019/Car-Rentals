'use client';

import { greet } from '@repo/common';

export default function Home() {
  return (
    <main>
      <h1>{greet('Next.js App')}</h1>
    </main>
  );
}
