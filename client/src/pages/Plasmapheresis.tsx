import { Link, useLocation } from "wouter";
import { goToContact } from "@/lib/goToContact";
import {
  ArrowRight,
  ClipboardList,
  SlidersHorizontal,
  Repeat,
  LineChart,
  CheckCircle2,
  Beaker,
} from "lucide-react";
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
import { ASSETS, PLASMAPHERESIS_TIERS } from "@/lib/site";
import { useTierCta } from "@/hooks/useTierCta";

const PATH = [
  { icon: ClipboardList, title: "Consultation & labs", body: "We review your history and goals, confirm eligibility, and draw baseline labs to establish a safe, individualized starting point." },
  { icon: SlidersHorizontal, title: "Personalized protocol", body: "Your provider designs a protocol — plasma volume, number of sessions, and replacement fluid (such as albumin or saline) — tailored to you." },
  { icon: Repeat, title: "Exchange sessions", body: "During each monitored session (about 1.5–3 hours), plasma is separated and replaced while your blood cells are returned to you." },
  { icon: LineChart, title: "Follow-up & optimization", body: "We re-test, review your response, and integrate the results into your broader wellness plan — including optional EBO3 pairing." },
];

const BENEFITS = [
  "Remove circulating inflammatory mediators",
  "Reduce autoantibody and toxin burden",
  "Effectively 'reset' the plasma your cells live in",
  "Support detoxification pathways",
  "Complement autoimmune and longevity goals",
  "Pairs well with an EBO3 protocol",
];

const TIERS = PLASMAPHERESIS_TIERS;

const FAQS = [
  { q: "What is plasmapheresis / therapeutic plasma exchange?", a: "Plasmapheresis (therapeutic plasma exchange) is a procedure in which blood is drawn and separated into plasma and cells. The plasma — which carries inflammatory mediators, autoantibodies, and accumulated toxins — is removed and replaced with a replacement fluid such as albumin or saline, while your blood cells are returned to you." },
  { q: "How long does each session take?", a: "Each exchange session typically takes about 1.5 to 3 hours, depending on your personalized protocol and the plasma volume being exchanged. You are monitored throughout." },
  { q: "What is the difference between the Core and Complete programs?", a: "Core is a foundational program built around a single plasma exchange with consultation, baseline labs, and follow-up. Complete is a comprehensive, multi-session program with a fuller workup, a series of exchanges, an optional EBO3 add-on, and concierge follow-up." },
  { q: "Can plasmapheresis be combined with EBO3 / EBOO?", a: "Yes. Many patients pair therapeutic plasma exchange with EBO3 as part of a personalized program. Your provider will advise whether combining therapies is appropriate for your goals and health profile." },
  { q: "Is this a cure for disease?", a: "No. We offer plasmapheresis as a supportive wellness and research-oriented service. It is not approved by the FDA to diagnose, treat, cure, or prevent any disease. Eligibility and expectations are always reviewed individually with a licensed provider." },
];

export default function Plasmapheresis() {
  const [, navigate] = useLocation();
  const fireTierCta = useTierCta();
  useSeo({
    title: "Therapeutic Plasmapheresis & Plasma Exchange — rEBOOtBlood",
    description:
      "Therapeutic plasmapheresis (plasma exchange) separates and replaces plasma carrying inflammatory mediators, autoantibodies, and toxins.",
    jsonLd: buildFaqJsonLd(FAQS),
  });
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.plasmaAbstract} alt="Abstract visualization of plasma separation" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/85 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow tone="gold">Therapeutic Plasma Exchange</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              Reset the fluid <span className="text-gradient-garnet">your cells live in</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Plasmapheresis separates and removes plasma carrying inflammatory mediators, autoantibodies, and
              toxins — then replaces it — to support detoxification, autoimmune balance, and longevity goals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="btn-press w-full sm:w-auto" onClick={() => goToContact(navigate)}>Book Consultation <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              <Link href="/eligibility">
                <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/30 sm:w-auto">Take Eligibility Quiz</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROCEDURE EXPLAINED */}
      <section className="py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The Procedure</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">How plasma exchange works</h2>
            <p className="mt-5 text-muted-foreground">
              Blood is gently drawn and passed through a separator that divides it into plasma and cellular
              components. The plasma — the fluid that carries inflammatory signals, autoantibodies, and
              accumulated toxins — is removed and discarded, then replaced with a sterile replacement fluid such
              as albumin or saline. Your red cells, white cells, and platelets are returned to you throughout the
              session.
            </p>
            <p className="mt-4 text-muted-foreground">
              The result is a measurable "reset" of your plasma — reducing the circulating burden your cells are
              constantly exposed to.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border">
            <img src={ASSETS.clinicInterior} alt="rEBOOtBlood treatment suite interior" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* 4-STEP PATH */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">Your Clinical Path</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Four guided steps</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PATH.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-background/50 p-6">
                <span className="font-serif text-4xl text-[color:var(--gold)]/40">0{i + 1}</span>
                <s.icon className="mt-2 h-7 w-7 text-[color:var(--gold)]" />
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Potential Benefits</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">What plasma exchange may support</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Provided for educational interest only — not a claim of treatment or cure.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
                <span className="text-sm text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TIERS / PRICING */}
      <section id="pricing" className="scroll-mt-24 border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold">Program Tiers</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Choose Core or Complete</h2>
            <p className="mt-4 text-muted-foreground">
              Two clear pathways, each personalized after your consultation and screening.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl border p-8 ${
                  t.featured
                    ? "border-[color:var(--gold)]/50 bg-[oklch(0.24_0.04_70)]/30"
                    : "border-border bg-background/50"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-medium text-[oklch(0.2_0.02_70)]">
                    Most comprehensive
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-[color:var(--gold)]" />
                  <p className="font-serif text-2xl">{t.name}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                <p className="mt-4 font-serif text-4xl">{t.price}</p>
                <p className="text-xs text-muted-foreground">Starting from · personalized after consultation</p>
                <ul className="mt-6 space-y-2.5">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /> {pt}
                    </li>
                  ))}
                </ul>
                <Button
                    variant={t.featured ? "default" : "outline"}
                    className={`btn-press mt-7 w-full ${t.featured ? "" : "border-border bg-background/40"}`}
                    onClick={() => {
                      fireTierCta(`Plasmapheresis — ${t.name}`, "book", "plasmapheresis");
                      goToContact(
                        navigate,
                        `interest=plasmapheresis&tier=${encodeURIComponent(`Plasmapheresis — ${t.name}`)}`,
                      );
                    }}
                  >
                    Book this tier
                  </Button>
                <Link
                  href={`/eligibility?interest=plasmapheresis&tier=${encodeURIComponent(`Plasmapheresis — ${t.name}`)}`}
                  className="mt-2 block text-center text-xs font-medium text-[color:var(--gold)] underline-offset-4 hover:underline"
                  onClick={() => fireTierCta(`Plasmapheresis — ${t.name}`, "check_eligibility", "plasmapheresis")}
                >
                  Check eligibility for this tier
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="text-center">
            <Eyebrow tone="gold">Questions</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Plasmapheresis FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand heading="See if a plasma exchange program fits your goals" sub="Begin with a consultation and baseline labs with our care team." />
      <ContactSection />
    </SiteLayout>
  );
}
