import nextConfig from 'eslint-config-next'

export default [
  // Ignore build artifacts
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  // Next.js recommended rules (includes React, TS, a11y, import)
  ...nextConfig,
]

