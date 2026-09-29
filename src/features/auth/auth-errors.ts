export function toAuthErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : '';
  const message = raw.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Email or password doesn’t match.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirm your email, then sign in.';
  }

  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'That email already has an account. Try signing in.';
  }

  if (message.includes('user already registered')) {
    return 'That email already has an account. Try signing in.';
  }

  if (message.includes('password should be') || message.includes('password is known')) {
    return raw;
  }

  if (
    message.includes('rate limit') ||
    message.includes('over_email_send_rate_limit') ||
    message.includes('for security purposes')
  ) {
    return 'Too many attempts. Wait a minute and try again.';
  }

  if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
    return 'Connection issue. Check your network and try again.';
  }

  if (message.includes('not configured')) {
    return 'Couldn’t reach the server. Try again in a moment.';
  }

  if (raw) {
    return raw;
  }

  return 'Something went wrong. Try again.';
}
