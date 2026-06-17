import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
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
          <img src={SITE && "/manus-storage/logo_mark_b729685e.png"} alt="" className="h-8 w-8 object-contain" />
          <span className="font-serif text-xl tracking-tight">
            r<span className="text-gradient-garnet">EBOO</span>tBlood
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            {SITE.phoneDisplay}
          </a>
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
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-md px-2 py-3 text-left text-base text-foreground hover:bg-accent"
              >
                {l.label}
              </button>
            ))}
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 px-2 py-3 text-base text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <Button className="btn-press mt-2 w-full" onClick={() => go("/#contact")}>
              Book Consultation
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
