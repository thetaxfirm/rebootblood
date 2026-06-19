import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import EconomicsCalculator from "@/components/site/EconomicsCalculator";
import { ASSETS } from "@/lib/site";

export default function Calculator() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.heroAbstract} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-12 md:pt-44 md:pb-16">
          <div className="max-w-3xl reveal">
            <Link
              href="/partners"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Partner Program
            </Link>
            <Eyebrow tone="gold">Partner Economics Calculator</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl leading-[1.08] md:text-5xl">
              Model your clinic's <span className="text-gradient-garnet">EBO3 revenue</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Estimate what a placed {`"EBOO O3 Research Device 2026"`} could add to your practice. The clinic earns a
              revenue share plus reimbursement of consumables and nursing time — with no equipment cost and no
              marketing spend.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container">
          <EconomicsCalculator />
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <h2 className="text-2xl md:text-3xl">Like what you see?</h2>
            <p className="max-w-xl text-muted-foreground">
              Start a conversation with our partnerships team — no commitment, just a fit and market-demand check.
            </p>
            <Link href="/partners#inquire">
              <Button size="lg" className="btn-press mt-2">
                Become a Partner Clinic <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
