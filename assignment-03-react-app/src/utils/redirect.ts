/**
 * Resolves a redirect target into an internal application route.
 *
 * Only same-app paths are allowed: the target must start with a single "/" and
 * must not contain ".." segments or a protocol-relative "//" prefix, which
 * could otherwise be abused as an open redirect. Anything else falls back to
 * the provided fallback route.
 *
 * @param target The raw redirect target to validate, or null when absent.
 * @param fallback The route to use when the target is missing or unsafe.
 */
export function resolveRedirect(target: string | null, fallback: string): string {
  if (target != null && target.startsWith('/') && !target.startsWith('//') && !target.includes('..')) {
    return target
  }

  return fallback
}