import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSETS, SITE } from "@/lib/site";

export default function CtaBand({
  heading = "Ready to take the next step?",
  sub = "Book a private consultation or check your eligibility in a few minutes.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-border/70">
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="h-full w-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${ASSETS.ctaBand})` }}
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div className="container relative flex flex-col items-center gap-6 py-16 text-center md:py-20">
        <h2 className="max-w-2xl text-3xl md:text-4xl">{heading}</h2>
        <p className="max-w-xl text-muted-foreground">{sub}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/#contact">
            <Button size="lg" className="btn-press w-full sm:w-auto">
              Request Appointment <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/eligibility">
            <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/40 sm:w-auto">
              Take Eligibility Quiz
            </Button>
          </Link>
        </div>
        <a href={SITE.phoneHref} className="mt-1 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Phone className="h-4 w-4 text-[color:var(--gold)]" /> Or call {SITE.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
