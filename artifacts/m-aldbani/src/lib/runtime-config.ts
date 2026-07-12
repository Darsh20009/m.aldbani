/**
 * Public (non-secret) client IDs like Google/Apple's OAuth client IDs need to
 * differ per deploy target. Vite's `import.meta.env.VITE_*` only works when
 * the value is available at *build* time, which Render's Docker builds don't
 * provide (see Dockerfile comment). The server injects the real values into
 * `window.__RUNTIME_CONFIG__` on every request (see api-server's app.ts), so
 * prefer that at runtime and fall back to the Vite build-time value for local
 * dev / any environment that does support build-time env vars.
 */
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      GOOGLE_CLIENT_ID?: string;
      APPLE_CLIENT_ID?: string;
      APPLE_REDIRECT_URI?: string;
    };
  }
}

export function getGoogleClientId(): string {
  return (
    window.__RUNTIME_CONFIG__?.GOOGLE_CLIENT_ID ||
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
    ""
  );
}

export function getAppleClientId(): string {
  return (
    window.__RUNTIME_CONFIG__?.APPLE_CLIENT_ID ||
    (import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined) ||
    ""
  );
}

export function getAppleRedirectUri(): string {
  return (
    window.__RUNTIME_CONFIG__?.APPLE_REDIRECT_URI ||
    (import.meta.env.VITE_APPLE_REDIRECT_URI as string | undefined) ||
    window.location.origin
  );
}
