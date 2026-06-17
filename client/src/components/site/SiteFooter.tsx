import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-[oklch(0.14_0.012_25)]">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/manus-storage/logo_mark_b729685e.png" alt="" className="h-8 w-8 object-contain" />
              <span className="font-serif text-xl tracking-tight">
                r<span className="text-gradient-garnet">EBOO</span>tBlood
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Advanced EBO3 / EBOO ozone blood therapy and therapeutic plasmapheresis, delivered with a
              premium, safety-first standard of care.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
              <a href={SITE.emailHref} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-muted-foreground">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href.startsWith("/#") ? "/" : l.href} className="text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/eligibility" className="text-muted-foreground hover:text-foreground">
                  Take the Eligibility Quiz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-muted-foreground">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer — all four required elements */}
        <div className="mt-12 space-y-4 rounded-lg border border-border/60 bg-card/40 p-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground/90">Educational information only.</strong> The content on this
            website is provided for general educational and informational purposes only and is not medical
            advice. It is not intended for self-diagnosis or to replace consultation with a qualified licensed
            healthcare provider. Always seek the advice of your physician regarding any medical condition.
          </p>
          <p>
            <strong className="text-foreground/90">FDA disclaimer.</strong> These statements and therapies have
            not been evaluated by the U.S. Food and Drug Administration. The services described are not intended
            to diagnose, treat, cure, or prevent any disease. EBOO, EBO3, ozone, UVBI, and plasmapheresis
            services are offered as supportive wellness and research-oriented procedures and are not a
            substitute for emergency care or treatment from your primary medical team.
          </p>
          <p>
            <strong className="text-foreground/90">Assumption of risk.</strong> Results cannot be guaranteed and
            individual responses vary. As with any procedure involving the circulatory system, these therapies
            carry inherent risks. By engaging our services you acknowledge that you have been informed of the
            potential risks and benefits, that you voluntarily assume the risks associated with treatment, and
            that formal informed consent is reviewed and signed with a licensed provider before any procedure.
          </p>
          <p>
            By using this site you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link> and{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.domain}. All rights reserved.</p>
          <p>EBOO O3 Research Device 2026 · ISO 13485 certified platform</p>
        </div>
      </div>
    </footer>
  );
}
