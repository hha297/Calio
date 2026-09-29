export function reportError(error: unknown, context?: Record<string, string>) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('[calio]', message, context ?? {});
}
