import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep file tracing rooted on this package when nested under the Expo monorepo.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
