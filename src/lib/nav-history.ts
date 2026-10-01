/**
 * Lightweight in-app navigation memory.
 *
 * Next.js does not tell a page which page the visitor came from, so we keep the
 * last two in-app paths in sessionStorage. This lets "Back" controls pop the
 * browser history (router.back) when the previous page really was the target,
 * instead of pushing a brand new entry. Pushing a new entry is what made
 * List -> Detail -> "Back to list" -> Detail ... pile up in the history stack.
 */

const KEY = "afadmin:nav";

type NavMemory = {
  previous: string | null;
  current: string | null;
};

function read(): NavMemory {
  try {
    const raw = window.sessionStorage.getItem(KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NavMemory>;

      return {
        previous: parsed.previous ?? null,
        current: parsed.current ?? null,
      };
    }
  } catch {
    /* storage unavailable (private mode) — fall through */
  }

  return { previous: null, current: null };
}

export function recordNavigation(pathname: string): void {
  try {
    const memory = read();

    if (memory.current === pathname) return;

    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ previous: memory.current, current: pathname }),
    );
  } catch {
    /* ignore */
  }
}

/** True when the page the visitor was on immediately before this one is `pathname`. */
export function cameFrom(pathname: string): boolean {
  return read().previous === pathname;
}

/**
 * Go "back" to `fallback`. If the visitor just came from there, pop history so
 * the stack does not grow; otherwise replace the current entry so we never add
 * a duplicate.
 */
export function goBackTo(
  router: { back: () => void; replace: (href: string) => void },
  fallback: string,
): void {
  if (cameFrom(fallback)) {
    router.back();

    return;
  }

  router.replace(fallback);
}
