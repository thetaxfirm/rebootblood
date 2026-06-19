import { Link } from "wouter";
import {
  ArrowRight,
  Droplets,
  Filter,
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
  Clock,
  HeartPulse,
} from "lucide-react";
import { useState } from "react";
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
import { ASSETS, SITE, EBO3_VOLUME_TIERS } from "@/lib/site";

const STEPS = [
  {
    icon: Droplets,
    title: "Draw",
    body: "Using two IV lines placed by your clinician, blood is gently drawn into a sterile, single-use closed-loop circuit. The flow is continuous and controlled — no rush, no improvisation.",
  },
  {
    icon: Filter,
    title: "Filter",
    body: "Blood passes through a PES H200 high-flux dialyzer membrane that filters inflammatory debris, oxidized lipids, and circulating waste — the core whole-blood filtration stage of the protocol.",
  },
  {
    icon: Wind,
    title: "Oxygenate & ozonate",
    body: "A precision oxygen-ozone exchange charges the blood across an adjustable 1–35 gamma range, designed to support cellular respiration and oxygen delivery.",
  },
  {
    icon: Sun,
    title: "UVBI cycle",
    body: "The flow then passes through a 5-lamp UVBI light chamber, where ultraviolet blood irradiation is applied for integrated photo-oxidative exposure within the same closed loop.",
  },
  {
    icon: RefreshCw,
    title: "Return",
    body: "The treated, oxygen-rich blood is continuously returned to your body. A typical EBO3 session runs about 45–120 minutes depending on whether you treat 3L, 4.5L, or 6L, under continuous monitoring throughout.",
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

const BENEFIT_DETAILS = [
  { area: "Cardiovascular & circulation", body: "Cleaner oxygen delivery, reduced oxidative load, and improved endothelial function may ease the burden on organs that depend on healthy circulation." },
  { area: "Blood pressure & vascular tone", body: "Better microcirculation and endothelial response may support a healthier baseline blood pressure." },
  { area: "Long COVID & post-viral", body: "Aims to address the microclots, microvascular inflammation, and circulating residue associated with lingering post-COVID fatigue, brain fog, and breathlessness." },
  { area: "Inflammation", body: "Designed to help recalibrate the inflammatory response without immunosuppression." },
  { area: "Energy & cognition", body: "As inflammatory drag falls, mitochondrial output may rise — and cognition often tends to follow." },
  { area: "Autoimmune balance", body: "Intended to help interrupt the self-attacking cycle and recalibrate immune memory, without broad suppression." },
  { area: "Chronic infection & immune load", body: "Integrated UV exposure may help inactivate circulating pathogens while immune capacity rebuilds and load drops." },
  { area: "Detox & toxin clearance", body: "Supports the clearance of heavy metals, mycotoxins, and oxidized compounds through controlled oxidation." },
  { area: "Longevity & healthy aging", body: "May reduce senescent burden and sharpen repair signaling, areas reflected in biological-age markers." },
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

const VOLUMES = EBO3_VOLUME_TIERS;

const money = (n: number) => `$${n.toLocaleString()}`;

const AFTERCARE = [
  { title: "First few hours", body: "Plan to rest. Mild fatigue, lightheadedness, or a slight headache can occur as your body responds — this is usually short-lived." },
  { title: "Hydrate & refuel", body: "Drink plenty of water and have a light, nourishing meal. Avoid alcohol and strenuous exercise for the remainder of the day." },
  { title: "Rest of the day", body: "Keep your schedule light and prioritize good sleep. Many people feel back to normal — often more energized — by the next morning." },
  { title: "Following days", body: "Resume normal activity as you feel ready. We'll review how you responded and confirm timing for any subsequent sessions in your protocol." },
  { title: "IV site care", body: "Keep the IV site clean and dry. Minor bruising or tenderness is normal and typically resolves within a few days." },
  { title: "When to call us", body: "Contact us for persistent or worsening symptoms; seek emergency care for chest pain, severe shortness of breath, or fainting that does not resolve." },
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
  const [volIdx, setVolIdx] = useState(1);
  const vol = VOLUMES[volIdx];
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
            <h2 className="mt-3 text-4xl md:text-5xl">Inside the loop — five continuous steps</h2>
            <p className="mt-4 text-muted-foreground">
              EBO3 runs as a sealed, single-use closed loop. From line to line the cycle runs roughly 45–120 minutes
              under continuous clinical monitoring — your blood is drawn, treated, and returned without interruption.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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

      {/* POTENTIAL BENEFITS BY AREA */}
      <section className="border-t border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">Potential Benefits by Area</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">Where EBO3 may help</h2>
            <p className="mt-4 text-muted-foreground">
              EBO3 works in the bloodstream itself. Below are the areas of interest people most often explore,
              with what the protocol is designed to address in each. Provided for educational purposes only —
              not a claim of treatment or cure, and individual responses vary.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BENEFIT_DETAILS.map((b, i) => (
              <div key={b.area} className="rounded-2xl border border-border bg-background/50 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--gold)]/40 font-serif text-sm text-[color:var(--gold)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-medium leading-tight">{b.area}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-background/50 p-6">
            <p className="text-sm font-medium text-foreground">How the mechanism maps to these benefits</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Each potential benefit traces back to the three things EBO3 does to your blood outside the body.
              <strong className="text-foreground/90"> Filtration</strong> through the H200 high-flux membrane removes
              inflammatory debris, oxidized lipids, and circulating waste — the basis for the detox, inflammation,
              and cardiovascular effects. <strong className="text-foreground/90">Ozonation &amp; oxygenation</strong>
              charge red blood cells with reactive oxygen, supporting microcirculation, mitochondrial energy, and
              cognition. <strong className="text-foreground/90">UVBI</strong> exposure in the 5-lamp chamber helps
              inactivate circulating pathogens, supporting immune and post-viral recovery. Provided for educational
              purposes only; individual responses vary.
            </p>
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

      {/* AFTERCARE */}
      <section className="border-t border-border/70 py-20 md:py-28">
        <div className="container">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-[color:var(--gold)]" />
            <Eyebrow tone="gold">Aftercare & What to Expect</Eyebrow>
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl md:text-4xl">Your recovery window</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            EBO3 has little to no downtime for most people. Here's what the hours and days after your session
            typically look like, and how to support a smooth recovery.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AFTERCARE.map((a) => (
              <div key={a.title} className="rounded-2xl border border-border bg-card/50 p-6">
                <p className="font-medium">{a.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + VOLUME SELECTOR */}
      <section id="pricing" className="scroll-mt-24 border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Investment</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">EBO3 session pricing</h2>
            <p className="mt-4 text-muted-foreground">
              Choose how much of your blood volume you'd like treated. Session length and pricing update with your
              selection. Personalized programs are confirmed after your consultation and screening.
            </p>
          </div>

          {/* Volume selector */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background/50 p-2">
              {VOLUMES.map((v, i) => {
                const active = i === volIdx;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setVolIdx(i)}
                    aria-pressed={active}
                    className={`btn-press rounded-xl px-3 py-4 text-center transition-colors ${
                      active
                        ? "bg-[color:var(--garnet)] text-[color:var(--garnet-foreground)]"
                        : "text-muted-foreground hover:bg-card/70"
                    }`}
                  >
                    <span className="block font-serif text-2xl">{v.key}</span>
                    <span className={`mt-0.5 block text-xs ${active ? "text-[color:var(--garnet-foreground)]/80" : "text-muted-foreground"}`}>
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-[color:var(--gold)]" /> Session length: <strong className="text-foreground">{vol.duration}</strong>
              </span>
              <span className="hidden text-border sm:inline">|</span>
              <span className="text-sm text-muted-foreground">{vol.blurb}</span>
            </div>
          </div>

          {/* Pricing cards driven by selected volume */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Single Session", price: vol.single, per: "per session", points: [`One full ${vol.key} EBO3 session`, "Pre-session safety screening", "In-session monitoring"], featured: false },
              { name: "Package of 3", price: vol.pkg3, per: `${money(Math.round(vol.pkg3 / 3))} / session`, points: [`Three ${vol.key} EBO3 sessions`, "Progress check-ins", "Best for an initial protocol"], featured: true },
              { name: "Package of 6", price: vol.pkg6, per: `${money(Math.round(vol.pkg6 / 6))} / session`, points: [`Six ${vol.key} EBO3 sessions`, "Comprehensive protocol", "Maximum value per session"], featured: false },
            ].map((p) => (
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
                <p className="mt-2 font-serif text-4xl tabular-nums">{money(p.price)}</p>
                <p className="text-sm text-muted-foreground">{p.per}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-[color:var(--gold)]" /> {vol.duration} per session · {vol.key}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /> {pt}
                    </li>
                  ))}
                </ul>
                <Link href={`/eligibility?volume=${encodeURIComponent(vol.key)}`}>
                  <Button variant={p.featured ? "default" : "outline"} className={`btn-press mt-6 w-full ${p.featured ? "" : "border-border bg-background/40"}`}>
                    Request Appointment
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
            Pricing shown is for the selected {vol.key} volume tier and is provided for informational purposes.
            Final pricing and protocol are confirmed after your consultation and screening.
          </p>
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
