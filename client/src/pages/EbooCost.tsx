import { Link, useLocation } from "wouter";
import { goToContact } from "@/lib/goToContact";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import { useSeo, buildFaqJsonLd } from "@/hooks/useSeo";
import { ASSETS, EBO3_VOLUME_TIERS, PLASMAPHERESIS_TIERS } from "@/lib/site";

const money = (n: number) => `$${n.toLocaleString()}`;

const INCLUDED = [
  "Pre-treatment consultation and screening review",
  "Physician-supervised, single-use sterile closed-loop circuit",
  "Continuous in-session monitoring by clinical staff",
  "Whole-blood filtration, oxygenation, ozonation, and UVBI in one session",
  "Post-session aftercare guidance and follow-up review",
];

const COST_FAQS = [
  {
    q: "How much does EBOO therapy cost in Las Vegas?",
    a: "EBOO / EBO3 sessions are priced by treated blood volume: a single 3L session starts at $1,000, 4.5L at $1,250, and 6L at $1,500. Packages of 3 or 6 sessions lower the per-session cost. Final pricing is confirmed during your consultation.",
  },
  {
    q: "Is EBOO therapy covered by insurance?",
    a: "EBOO and EBO3 are investigational wellness therapies and are generally not covered by insurance. They are offered on a self-pay basis. We can outline package options during your consultation.",
  },
  {
    q: "Why is a package cheaper per session?",
    a: "Many programs use a series of sessions rather than a single visit, so package pricing reflects a planned course of care and reduces the effective per-session cost. Your clinician will recommend a plan based on your goals.",
  },
  {
    q: "What does the price include?",
    a: "Pricing covers the supervised procedure itself — the single-use circuit, filtration, oxygenation/ozonation, UVBI, and in-session monitoring — along with your consultation and follow-up review. Any optional add-ons are discussed up front.",
  },
];

export default function EbooCost() {
  const [, navigate] = useLocation();
  useSeo({
    title: "EBOO Therapy Cost in Las Vegas | EBO3 Pricing & Packages",
    description:
      "How much does EBOO therapy cost in Las Vegas? See EBO3 session and package pricing by blood volume, what's included, and how to check eligibility.",
    jsonLd: buildFaqJsonLd(COST_FAQS),
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ASSETS.heroAbstract}
            alt="Abstract visualization of oxygenated blood flow"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              EBOO therapy cost <span className="text-gradient-garnet">in Las Vegas</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Transparent, self-pay pricing for EBO3 / EBOO ozone blood therapy. Cost scales with the blood
              volume treated per session, and multi-session packages lower the per-session price.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/eligibility?interest=eboo">
                <Button size="lg" className="btn-press w-full sm:w-auto">
                  Check eligibility <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Button
                  size="lg"
                  variant="outline"
                  className="btn-press w-full border-border bg-background/30 sm:w-auto"
                  onClick={() => goToContact(navigate)}
                >
                  Book Consultation
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TABLE */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>EBO3 / EBOO Pricing</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Cost by blood volume</h2>
            <p className="mt-4 text-muted-foreground">
              Each tier treats a larger blood volume in one continuous session. Prices below are self-pay and
              confirmed at consultation.
            </p>
          </div>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card/60">
                  <th className="px-5 py-4 font-medium">Volume</th>
                  <th className="px-5 py-4 font-medium">Session length</th>
                  <th className="px-5 py-4 font-medium">Single session</th>
                  <th className="px-5 py-4 font-medium">Package of 3</th>
                  <th className="px-5 py-4 font-medium">Package of 6</th>
                </tr>
              </thead>
              <tbody>
                {EBO3_VOLUME_TIERS.map((t) => (
                  <tr key={t.key} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-4 font-medium text-foreground">{t.label}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.duration}</td>
                    <td className="px-5 py-4">{money(t.single)}</td>
                    <td className="px-5 py-4">{money(t.pkg3)}</td>
                    <td className="px-5 py-4">{money(t.pkg6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Package prices reflect the total for the full series. Plasmapheresis is priced separately
            (Core {PLASMAPHERESIS_TIERS[0].price}, Complete {PLASMAPHERESIS_TIERS[1].price}).
          </p>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What's Included</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Every session covers</h2>
            <p className="mt-4 text-muted-foreground">
              Pricing is for the supervised procedure and the care around it — no surprise line items.
            </p>
          </div>
          <ul className="space-y-4">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="max-w-2xl">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <HelpCircle className="h-8 w-8 text-[color:var(--gold)]" /> Cost FAQ
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {COST_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand
        heading="Ready to talk pricing for your goals?"
        sub="Check eligibility in two minutes, or book a consultation to map a session plan and confirm cost."
      />
      <ContactSection />
    </SiteLayout>
  );
}
