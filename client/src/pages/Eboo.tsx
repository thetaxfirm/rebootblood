import { Link } from "wouter";
import {
  ArrowRight,
  Droplets,
  Sun,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Activity,
  Gauge,
  Wind,
  Thermometer,
  Volume2,
  Heart,
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
import { ASSETS, SITE } from "@/lib/site";

const STEPS = [
  {
    icon: Droplets,
    title: "Draw & circulate",
    body: "Using two IV lines, blood is gently drawn and routed through a sterile, closed-loop circuit — a dialysis-style process that keeps blood moving continuously and safely.",
  },
  {
    icon: Sun,
    title: "Filter, oxygenate, ozonate & UVBI",
    body: "Blood passes through a PES H200 high-flux dialyzer where it is oxygenated and ozonated, then through a 5-lamp UVBI light chamber for integrated ultraviolet exposure.",
  },
  {
    icon: RefreshCw,
    title: "Return purified blood",
    body: "The treated, oxygen-rich blood is continuously returned to your body. A typical EBO3 session takes about 45–120 minutes depending on whether you want to treat 3L, 4.5L or 6L of your blood treated, under monitoring throughout.",
  },
];

const SPECS = [
  { icon: Gauge, label: "Dual-mode operation", value: "EBOO mode (3–5 gamma) and EBO2 mode (20–30 gamma), with a full adjustable range of 1–35 gamma." },
  { icon: ShieldCheck, label: "ISO 13485 certification", value: "Built and certified to the ISO 13485 medical device quality standard." },
  { icon: Cpu, label: "PES Filter, H200 High Flux", value: "High-flux dialyzer membrane for efficient whole-blood filtration and exchange." },
  { icon: Sun, label: "5-lamp UVBI Light Chamber", value: "Integrated ultraviolet blood irradiation for combined photo-oxidative protocols." },
  { icon: Activity, label: "Touchscreen interface", value: "Intuitive protocol configuration and real-time session monitoring." },
];

const SAFETY_SUITE = [
  { icon: Droplets, label: "Overflow protection" },
  { icon: Volume2, label: "Voice prompts" },
  { icon: Thermometer, label: "Light temperature sensor" },
  { icon: Heart, label: "SPO2 monitor" },
  { icon: Wind, label: "Air / bubble sensor" },
];

const BENEFITS = [
  "Modulate systemic inflammation",
  "Support and balance immune response",
  "Aid detoxification at the cellular level",
  "Improve oxygen delivery to tissues",
  "Support healthy circulation",
  "Promote energy and overall vitality",
];

const CONDITIONS = [
  "Chronic fatigue & low energy",
  "Chronic inflammation",
  "Autoimmune conditions",
  "Lyme disease & chronic infection",
  "Long COVID / post-viral syndrome",
  "Cardiovascular & circulation concerns",
  "High cholesterol & lipids",
  "Cognitive concerns (brain fog)",
  "Mold, heavy metal & toxin exposure",
  "Neurological conditions",
  "Longevity & healthy aging",
  "Athletic recovery & performance",
];

const PRICING = [
  { name: "Single Session", price: "$1,200", per: "per session", points: ["One full EBO3 session", "Pre-session safety screening", "In-session monitoring"], featured: false },
  { name: "Package of 3", price: "$3,300", per: "$1,100 / session", points: ["Three EBO3 sessions", "Progress check-ins", "Best for an initial protocol"], featured: true },
  { name: "Package of 6", price: "$6,000", per: "$1,000 / session", points: ["Six EBO3 sessions", "Comprehensive protocol", "Maximum value per session"], featured: false },
];

const PREP = [
  "Complete a medical consultation and screening before your first session.",
  "Get tested for G6PD deficiency — a non-negotiable safety step.",
  "Pause non-prescription blood thinners (aspirin, ibuprofen, fish oil, vitamin E, ginkgo) only with provider approval — never stop prescriptions on your own.",
  "Stay well hydrated for 24 hours beforehand; limit alcohol and excess caffeine.",
  "Eat a light, healthy meal 1–2 hours before your appointment.",
  "Wear loose, short-sleeved clothing for easy IV access.",
  "Plan a restful day afterward and prioritize good sleep.",
  "Tell us about any recent illness, fever, or infection before your visit.",
];

const FAQS = [
  { q: "What is the difference between EBOO, EBO2, and EBO3?", a: "EBOO and EBO2 refer to extracorporeal blood oxygenation and ozonation at different ozone concentrations and flow configurations. Our EBO3 protocol is an advanced approach that filters the entire blood volume and integrates UVBI (ultraviolet blood irradiation) alongside oxygenation and ozonation. The EBOO O3 Research Device 2026 supports all of these in a single platform." },
  { q: "What is UVBI and why is it included?", a: "UVBI (ultraviolet blood irradiation) exposes blood to specific ultraviolet light wavelengths. In our EBO3 protocol it is paired with oxygenation and ozonation for a combined photo-oxidative approach. The device includes a 5-lamp UVBI light chamber for integrated UV exposure." },
  { q: "How long does a session take?", a: "A typical EBO3 session takes about 45–120 minutes depending on whether you want to treat 3L, 4.5L or 6L of your blood, during which your blood is continuously filtered, oxygenated, ozonated, exposed to UVBI, and returned. You'll be monitored throughout." },
  { q: "How is this different from an ozone IV or major autohemotherapy?", a: "Ozone IV and major autohemotherapy treat a limited volume of blood at a time. EBO3 / EBOO is a dialysis-style, continuous-flow process that filters and treats a far larger volume of blood in a single session, which is why it is considered a more comprehensive systemic approach." },
  { q: "Is EBOO FDA-approved?", a: "EBOO, EBO2, ozone, and UVBI therapies are not approved by the FDA to diagnose, treat, cure, or prevent any disease, and the EBOO O3 Research Device 2026 is positioned as a research-oriented platform. We offer these as supportive wellness procedures. Please review the disclaimers in our footer and discuss with your provider." },
  { q: "Will it hurt?", a: "Most patients experience only the minor discomfort of IV placement. Some may feel temporary fatigue, lightheadedness, or a mild headache afterward. Our team monitors you throughout and reviews what to expect during your consultation." },
];

export default function Eboo() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.heroAbstract} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/85 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow>EBO3 / EBOO Therapy</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              Whole-blood ozone therapy, <span className="text-gradient-garnet">elevated to EBO3</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              EBO3 is our advanced EBOO protocol — a continuous, dialysis-style therapy that filters your entire
              blood volume while oxygenating, ozonating, and exposing it to UVBI for a comprehensive systemic reset.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact">
                <Button size="lg" className="btn-press w-full sm:w-auto">Book Consultation <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              </Link>
              <Link href="/eligibility">
                <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/30 sm:w-auto">Take Eligibility Quiz</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Three continuous steps</h2>
            <p className="mt-4 text-muted-foreground">
              EBO3 runs as a closed, continuous loop — your blood is treated and returned without interruption.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card/60 p-7">
                <span className="font-serif text-5xl text-[color:var(--garnet)]/40">0{i + 1}</span>
                <s.icon className="mt-2 h-7 w-7 text-[color:var(--gold)]" />
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVICE */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Eyebrow tone="gold">The Platform</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">{SITE.deviceName}</h2>
            <p className="mt-4 text-muted-foreground">
              Our EBO3 protocols run on the {SITE.deviceName} — a fully closed-loop EBO2 RHP (Recirculatory
              Hemoperfusion) platform that bridges EBOO, EBO2, and extended ozone research protocols in a single,
              ISO 13485–certified system.
            </p>
            <div className="mt-8 space-y-4">
              {SPECS.map((s) => (
                <div key={s.label} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-background/60">
                    <s.icon className="h-5 w-5 text-[color:var(--gold)]" />
                  </span>
                  <div>
                    <p className="font-medium">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-background/50 p-5">
              <p className="text-sm font-medium">Comprehensive safety suite</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SAFETY_SUITE.map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground">
                    <s.icon className="h-3.5 w-3.5 text-[color:var(--gold)]" /> {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-3xl border border-border bg-background/40 p-6">
              <img src={ASSETS.device} alt={SITE.deviceName} className="mx-auto w-full max-w-md object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS + CONDITIONS */}
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Potential Benefits</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">What EBO3 is designed to support</h2>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--gold)]" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow tone="gold">Areas of Interest</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">Conditions people explore EBO3 for</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Listed for educational interest only — not a claim of treatment or cure. Eligibility is always
              determined individually with our care team.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <span key={c} className="rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY & CONTRAINDICATIONS */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-[color:var(--garnet)]" />
            <Eyebrow>Safety & Contraindications</Eyebrow>
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl md:text-4xl">Your safety is the first protocol</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            EBO3 / EBOO is offered as a supportive wellness service and is not a substitute for emergency care or
            treatment from your primary medical team. Every candidate is screened before any session.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--garnet)]/40 bg-[oklch(0.22_0.05_25)]/40 p-6">
              <p className="font-medium text-foreground">Absolute contraindication</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Significant <strong className="text-foreground/90">G6PD deficiency (favism)</strong> — due to the
                risk of hemolysis. A G6PD test is required when appropriate before treatment.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-6">
              <p className="font-medium">Relative contraindications</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Require medical clearance: bleeding or clotting disorders, low platelets, recent heart attack,
                recent hemorrhagic stroke, uncontrolled hyperthyroidism, pregnancy (especially first trimester),
                and alcohol intoxication.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-6">
              <p className="font-medium">Our screening</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We review your history, medications and supplements, prior reactions, and vitals, and order a G6PD
                lab when appropriate. Note: inhaled ozone is never therapeutic and is harmful to the lungs.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/50 p-6">
              <p className="font-medium">Common short-term effects</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Temporary fatigue or malaise, headache, or lightheadedness; possible nausea; and minor irritation
                at the IV site. These are usually mild and self-limited.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/50 p-6">
              <p className="font-medium">When to seek urgent care</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Severe shortness of breath, chest pain, fainting that does not resolve, severe IV-site swelling or
                redness, or any severe or abnormal symptom — seek emergency care immediately.
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            References: MedMasters, "Fundamentals of IV Ozone" (Dec 2023); CAM Cancer Consortium (NAFKAM),
            "Ozone therapy" (Nov 2025). Provided for educational purposes.
          </p>
        </div>
      </section>

      {/* HOW TO PREPARE */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">How to Prepare</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">Preparing for your session</h2>
            <p className="mt-4 text-muted-foreground">
              A little preparation helps your session go smoothly and safely. Our team will confirm your
              personalized instructions during your consultation.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PREP.map((p, i) => (
              <div key={p} className="flex gap-4 rounded-xl border border-border bg-card/50 p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-sm text-[color:var(--gold)]">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Investment</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">EBO3 session pricing</h2>
            <p className="mt-4 text-muted-foreground">
              Transparent pricing for our research-oriented EBO3 protocol. Personalized programs are confirmed
              after your consultation and screening.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-7 ${
                  p.featured
                    ? "border-[color:var(--garnet)]/60 bg-[oklch(0.22_0.04_25)]/40"
                    : "border-border bg-background/50"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-[color:var(--garnet)] px-3 py-1 text-xs font-medium text-[color:var(--garnet-foreground)]">
                    Most popular
                  </span>
                )}
                <p className="text-sm text-muted-foreground">{p.name}</p>
                <p className="mt-2 font-serif text-4xl">{p.price}</p>
                <p className="text-sm text-muted-foreground">{p.per}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /> {pt}
                    </li>
                  ))}
                </ul>
                <Link href="/#contact">
                  <Button variant={p.featured ? "default" : "outline"} className={`btn-press mt-6 w-full ${p.featured ? "" : "border-border bg-background/40"}`}>
                    Request Appointment
                  </Button>
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
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">EBO3 / EBOO FAQ</h2>
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

      <CtaBand heading="Explore whether EBO3 is right for you" sub="Start with a private consultation and safety screening with our care team." />
      <ContactSection />
    </SiteLayout>
  );
}
