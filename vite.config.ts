import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Production builds get a CSP that forbids ALL network requests (connect-src 'none'),
// so even a compromised dependency cannot send patient data anywhere.
// Skipped in dev because Vite's HMR needs a websocket.
const lockdownCsp = (): Plugin => ({
  name: 'lockdown-csp',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace(
      '<!--CSP-->',
      `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'">`,
    ),
});

export default defineConfig({
  plugins: [react(), lockdownCsp()],
  test: { environment: 'node' },
});
