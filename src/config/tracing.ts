/**
 * Initialize distributed tracing for the API process.
 *
 * Tracing is intentionally disabled in this workspace, but keeping this noop
 * preserves a stable startup hook for environments that wire in OpenTelemetry
 * or another tracer later.
 */
export function initTracing(): void {
  // Tracing is optional in this workspace; callers can safely invoke this noop.
}