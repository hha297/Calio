/** Only auth callbacks at the configured route may create a Supabase session. */
export function isAuthCallbackUrl(url: string | null): url is string {
  if (!url) return false;
  const destination = url.split(/[?#]/, 1)[0]?.replace(/\/$/, '');
  return Boolean(destination && /(?:^|\/)auth\/callback$/.test(destination));
}
