import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { hasAuthParams, stripAuthParamsFromUrl } from "@shared/stripAuthParams";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";

/**
 * Removes lingering OAuth callback params (e.g. ?code=...&state=...) from the
 * address bar after a sign-in redirect, without triggering a reload or losing
 * any non-auth query params / hash. Runs once on mount.
 */
function useStripAuthParams() {
  useEffect(() => {
    if (!hasAuthParams(window.location.search)) return;
    const cleaned = stripAuthParamsFromUrl(
      window.location.pathname + window.location.search + window.location.hash,
    );
    window.history.replaceState(window.history.state, "", cleaned);
  }, []);
}

/**
 * Scrolls to the element matching the current URL hash (e.g. /eboo#pricing,
 * /#contact).
 *
 * wouter's location does NOT include the hash, so we cannot rely on it alone:
 * clicking a `/#contact` link while already on `/` does not change wouter's
 * path and may not fire a native `hashchange`. We therefore:
 *  - re-run whenever wouter's path changes (cross-page nav to a hash target),
 *  - listen to native `hashchange` (in-page hash links), and
 *  - poll for the hash + target on mount, since long pages mount their bottom
 *    sections (e.g. the contact form) after this layout paints.
 */
function scrollToHashId(smooth: boolean) {
  const rawHash = window.location.hash;
  if (!rawHash || rawHash === "#") return false;
  const id = decodeURIComponent(rawHash.slice(1));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  return true;
}

function useScrollToHash() {
  const [location] = useLocation();

  // Retry loop: covers targets that mount/paint slightly after this layout.
  useEffect(() => {
    if (!window.location.hash) return;
    let attempts = 0;
    let timer = 0;
    const tick = () => {
      // Instant on the first successful attempt so the page lands reliably.
      if (scrollToHashId(attempts > 0)) return;
      if (attempts++ < 40) {
        timer = window.setTimeout(tick, 60);
      }
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [location]);

  // Native hash changes (e.g. an anchor/Link to /#contact while already on /).
  useEffect(() => {
    const onHashChange = () => {
      // The target is already in the DOM for in-page links, so smooth-scroll;
      // a short retry guards against conditionally rendered sections.
      let attempts = 0;
      let timer = 0;
      const tick = () => {
        if (scrollToHashId(true)) return;
        if (attempts++ < 20) timer = window.setTimeout(tick, 60);
      };
      tick();
      return () => window.clearTimeout(timer);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  useStripAuthParams();
  useScrollToHash();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Eyebrow({ children, tone = "garnet" }: { children: ReactNode; tone?: "garnet" | "gold" }) {
  return (
    <p className="eyebrow" style={{ color: tone === "gold" ? "var(--gold)" : "var(--garnet)" }}>
      {children}
    </p>
  );
}
