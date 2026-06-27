import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EBOO_SUBNAV, NAV_LINKS, SITE } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ebooOpen, setEbooOpen] = useState(false);
  const [, navigate] = useLocation();
  const ebooRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the EBOO dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ebooRef.current && !ebooRef.current.contains(e.target as Node)) {
        setEbooOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setEbooOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
      }
    } else {
      navigate(href);
      window.scrollTo({ top: 0 });
    }
  };

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setEbooOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setEbooOpen(false), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/70"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      <nav className="container flex h-16 items-center justify-between md:h-20">
        <button onClick={() => go("/")} className="flex items-center gap-2.5">
          <img src="/manus-storage/logo_mark_b729685e.png" alt="rEBOOtBlood logo" className="h-8 w-8 object-contain" />
          <span className="font-serif text-xl tracking-tight">
            r<span className="text-gradient-garnet">EBOO</span>tBlood
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) =>
            l.href === "/eboo" ? (
              <div
                key={l.href}
                ref={ebooRef}
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setEbooOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={ebooOpen}
                  className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${ebooOpen ? "rotate-180" : ""}`}
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                </button>
                <div
                  role="menu"
                  className={`absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 origin-top rounded-xl border border-border/70 bg-popover p-1.5 text-popover-foreground shadow-xl transition-all duration-200 ${
                    ebooOpen
                      ? "pointer-events-auto scale-100 opacity-100"
                      : "pointer-events-none scale-95 opacity-0"
                  }`}
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  {EBOO_SUBNAV.map((s) => (
                    <button
                      key={s.href}
                      role="menuitem"
                      onClick={() => go(s.href)}
                      className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="text-xs text-muted-foreground">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </button>
            ),
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button className="btn-press" onClick={() => go("/#contact")}>
            Book Consultation
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/70 bg-background/95 backdrop-blur-md md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) =>
              l.href === "/eboo" ? (
                <div key={l.href} className="flex flex-col">
                  <button
                    onClick={() => go(l.href)}
                    className="rounded-md px-2 py-3 text-left text-base text-foreground hover:bg-accent"
                  >
                    {l.label}
                  </button>
                  <div className="ml-3 flex flex-col border-l border-border/60 pl-3">
                    {EBOO_SUBNAV.filter((s) => s.href !== "/eboo").map((s) => (
                      <button
                        key={s.href}
                        onClick={() => go(s.href)}
                        className="rounded-md px-2 py-2.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={l.href}
                  onClick={() => go(l.href)}
                  className="rounded-md px-2 py-3 text-left text-base text-foreground hover:bg-accent"
                >
                  {l.label}
                </button>
              ),
            )}
            <Button className="btn-press mt-2 w-full" onClick={() => go("/#contact")}>
              Book Consultation
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
