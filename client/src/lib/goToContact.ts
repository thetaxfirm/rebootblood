/**
 * Centralized, deterministic "go to the contact form" navigation.
 *
 * Why this exists: the contact form lives at `<section id="contact">` on the
 * home route. Links use `/#contact` (sometimes with query params like
 * `?interest=eboo&tier=...#contact`). wouter's location does not track the
 * hash, so clicking such a link while already on `/` may not change wouter's
 * path and may not fire a native `hashchange` — leaving the user stuck at the
 * top of the page ("Book Consultation does nothing").
 *
 * This helper performs the route change (via the provided wouter `navigate`)
 * when needed, updates the URL (preserving any query string), and then scrolls
 * to the contact section with a short retry loop to cover the case where the
 * section paints after navigation.
 */

const CONTACT_ID = "contact";

function scrollToContact(smoothFirst: boolean) {
  let attempts = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const tick = () => {
    const el = document.getElementById(CONTACT_ID);
    if (el) {
      el.scrollIntoView({
        behavior: attempts === 0 ? (smoothFirst ? "smooth" : "auto") : "smooth",
        block: "start",
      });
      return;
    }
    if (attempts++ < 40) {
      timer = setTimeout(tick, 60);
    }
  };
  tick();
  return () => timer && clearTimeout(timer);
}

/**
 * @param navigate wouter's navigate function (from `useLocation()[1]`)
 * @param query optional query string to apply (e.g. "interest=eboo&tier=...").
 *              Pass without a leading "?".
 */
export function goToContact(
  navigate: (to: string, opts?: { replace?: boolean }) => void,
  query?: string,
) {
  const onHome = window.location.pathname === "/";
  const target = `/${query ? `?${query}` : ""}#${CONTACT_ID}`;

  if (!onHome) {
    // Cross-page: route to home (with any query), then scroll once mounted.
    navigate(target);
    // Reflect the hash in the URL so deep-linking/back behaves correctly.
    if (window.location.hash !== `#${CONTACT_ID}`) {
      try {
        window.history.replaceState(
          window.history.state,
          "",
          target,
        );
      } catch {
        /* no-op: replaceState can throw in rare sandboxed contexts */
      }
    }
    scrollToContact(false);
    return;
  }

  // Already on home: update query (if any) + hash without a full reload, then
  // scroll deterministically.
  if (query !== undefined) {
    navigate(target, { replace: false });
  }
  if (window.location.hash !== `#${CONTACT_ID}`) {
    try {
      window.history.replaceState(window.history.state, "", target);
    } catch {
      /* no-op */
    }
  }
  scrollToContact(true);
}
