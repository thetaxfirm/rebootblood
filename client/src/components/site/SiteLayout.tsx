import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "./Navbar";
import SiteFooter from "./SiteFooter";

/**
 * Scrolls to the element matching the current URL hash (e.g. /eboo#pricing).
 * wouter does not manage the hash, so we read it from window.location and react
 * to both initial mount and `hashchange` events. A few retries cover the case
 * where the target section mounts slightly after this layout.
 */
function useScrollToHash() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));

    let attempts = 0;
    let raf = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Instant on initial navigation so the page lands on the section
        // reliably (smooth scroll can be skipped if the target paints late).
        el.scrollIntoView({ behavior: attempts === 0 ? "auto" : "smooth", block: "start" });
        return;
      }
      if (attempts++ < 15) {
        raf = window.setTimeout(tryScroll, 60);
      }
    };
    tryScroll();

    return () => window.clearTimeout(raf);
  }, [location]);

  useEffect(() => {
    const onHashChange = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
}

export default function SiteLayout({ children }: { children: ReactNode }) {
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
