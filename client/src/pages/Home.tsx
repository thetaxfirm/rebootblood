import { Link } from "wouter";
import {
  ArrowRight,
  Droplets,
  Activity,
  ShieldCheck,
  Sparkles,
  Microscope,
  HeartPulse,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import GuideCapture from "@/components/site/GuideCapture";
import ContactSection from "@/components/site/ContactSection";
import { ASSETS, SITE, PLASMAPHERESIS_TIERS, EBO3_VOLUME_TIERS } from "@/lib/site";

const money = (n: number) => `$${n.toLocaleString()}`;

const HERO_CONDITIONS = [
  "Long COVID",
  "Lyme Disease",
  "Autoimmune",
  "Cardiovascular",
  "Chronic Fatigue",
  "Mold / Toxin",
  "Longevity",
] as const;

const HOME_BENEFITS = [
  { title: "Cardiovascular & circulation", body: "Cleaner oxygen delivery and improved endothelial function." },
  { title: "Long COVID & post-viral", body: "Targets microclots, microvascular inflammation, and brain fog." },
  { title: "Inflammation", body: "Designed to recalibrate the inflammatory response." },
  { title: "Energy & cognition", body: "Mitochondrial output may rise as inflammatory drag falls." },
  { title: "Autoimmune balance", body: "Aims to interrupt the self-attacking cycle without suppression." },
  { title: "Detox & toxin clearance", body: "Clears metals, mycotoxins, and oxidized compounds." },
  { title: "Chronic infection", body: "Integrated UVBI helps inactivate circulating pathogens." },
  { title: "Longevity", body: "Reduced senescent burden and sharper repair signaling." },
];

function TreatmentCard({
  tone,
  eyebrow,
  title,
  body,
  points,
  href,
  image,
}: {
  tone: "garnet" | "gold";
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  image: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:border-[color:var(--garnet)]/50" style={{ transitionTimingFunction: "var(--ease-out)" }}>
      <div className="relative h-44 overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease-out)" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
      </div>
      <div className="p-7">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h3 className="mt-3 text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
        <ul className="mt-5 space-y-2">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone === "gold" ? "var(--gold)" : "var(--garnet)" }} />
              {p}
            </li>
          ))}
        </ul>
        <Link href={href}>
          <Button variant="outline" className="btn-press mt-6 w-full border-border bg-background/40">
            Explore {title} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.heroAbstract} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        </div>

        <div className="container relative flex min-h-[92vh] flex-col justify-center pt-28 pb-20">
          <div className="max-w-3xl reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
              Powered by the {SITE.deviceName} · ISO 13485
            </div>
            <h1 className="mt-6 text-balance text-5xl leading-[1.05] md:text-7xl">
              Reboot your blood.{" "}
              <span className="text-gradient-garnet">Restore your vitality.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Advanced EBO3 / EBOO ozone blood therapy and therapeutic plasmapheresis — dialysis-style
              procedures designed to modulate inflammation, support immune function, and advance whole-body
              wellness at the cellular level.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact">
                <Button size="lg" className="btn-press w-full sm:w-auto">
                  Book Consultation <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/eligibility">
                <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/30 sm:w-auto">
                  Take Eligibility Quiz
                </Button>
              </Link>
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-background/40 p-5 backdrop-blur">
              <p className="text-sm font-medium text-foreground">What are you looking to address?</p>
              <p className="mt-1 text-xs text-muted-foreground">Pick one to start your eligibility quiz with it pre-filled.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {HERO_CONDITIONS.map((c) => (
                  <Link key={c} href={`/eligibility?condition=${encodeURIComponent(c)}`}>
                    <button className="btn-press rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm text-foreground/90 transition-colors hover:border-[color:var(--garnet)]/60 hover:text-foreground">
                      {c}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {[
                { icon: ShieldCheck, label: "Safety-first screening" },
                { icon: Microscope, label: "ISO 13485 platform" },
                { icon: HeartPulse, label: "Physician-informed protocols" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[color:var(--gold)]" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DUAL TREATMENT OVERVIEW */}
      <section className="relative py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Two Advanced Therapies</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">One destination for blood-level renewal</h2>
            <p className="mt-5 text-muted-foreground">
              Whether your focus is detoxification, inflammation, immunity, or longevity, our two flagship
              therapies work at the level of the blood itself — and can be combined into a personalized program.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            <TreatmentCard
              tone="garnet"
              eyebrow="Ozone · Oxygen · UVBI"
              title="EBO3 / EBOO"
              image={ASSETS.heroAbstract}
              body="An advanced, dialysis-style ozone therapy that continuously filters, oxygenates, and ozonates your blood outside the body — our EBO3 protocol also integrates UVBI for a comprehensive whole-blood approach."
              points={[
                "Continuous filtration of the whole blood volume",
                "Oxygenation + ozonation + 5-lamp UVBI",
                "Targets inflammation, immunity, and detox",
              ]}
              href="/eboo"
            />
            <TreatmentCard
              tone="gold"
              eyebrow="Therapeutic Plasma Exchange"
              title="Plasmapheresis"
              image={ASSETS.plasmaAbstract}
              body="A therapeutic plasma exchange that separates and removes plasma carrying inflammatory mediators, autoantibodies, and accumulated toxins — replacing it to effectively 'reset' the fluid your cells live in."
              points={[
                "Separates and replaces plasma volume",
                "Core and Complete program tiers",
                "Supports autoimmune, detox, and longevity goals",
              ]}
              href="/plasmapheresis"
            />
          </div>
        </div>
      </section>

      {/* EBO3 PRICING BLOCK */}
      <section className="border-t border-border/70 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="garnet">EBO3 / EBOO Sessions</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Transparent EBO3 pricing</h2>
            <p className="mt-5 text-muted-foreground">
              Pricing scales with how much of your blood volume you choose to treat per session. Multi-session
              packages lower the per-session cost — see the full breakdown on the EBO3 / EBOO page.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-7 md:grid-cols-3">
            {EBO3_VOLUME_TIERS.map((vol) => {
              const featured = vol.key === "4.5L";
              return (
                <div
                  key={vol.key}
                  className={`relative flex flex-col rounded-2xl border bg-card/60 p-8 ${
                    featured ? "border-[color:var(--garnet)]/60" : "border-border"
                  }`}
                >
                  {featured && (
                    <span className="absolute right-6 top-6 rounded-full border border-[color:var(--garnet)]/50 bg-[color:var(--garnet)]/10 px-3 py-1 text-xs font-medium text-[color:var(--garnet)]">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-2xl">{vol.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{vol.blurb}</p>
                  <p className="mt-5 text-sm text-muted-foreground">From</p>
                  <p className="font-serif text-4xl tabular-nums">{money(vol.single)}</p>
                  <p className="text-sm text-muted-foreground">per session</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-[color:var(--gold)]" /> {vol.duration} per session
                  </p>
                  <p className="mt-4 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                    Packages: 3 for {money(vol.pkg3)} &middot; 6 for {money(vol.pkg6)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/eboo#pricing">
              <Button variant="outline" className="btn-press border-border bg-background/40">
                See full EBO3 pricing & packages <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* PLASMAPHERESIS PRICING TIERS */}
      <section className="border-t border-border/70 bg-card/20 py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold">Plasmapheresis Programs</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Choose Core or Complete</h2>
            <p className="mt-5 text-muted-foreground">
              Two therapeutic plasma exchange programs — start with a single foundational exchange, or commit to a
              comprehensive multi-session protocol with an optional EBO3 add-on.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-7 md:grid-cols-2">
            {PLASMAPHERESIS_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border bg-card/60 p-8 ${
                  tier.featured ? "border-[color:var(--gold)]/60" : "border-border"
                }`}
              >
                {tier.featured && (
                  <span className="absolute right-6 top-6 rounded-full border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-3 py-1 text-xs font-medium text-[color:var(--gold)]">
                    Most comprehensive
                  </span>
                )}
                <h3 className="text-2xl">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                <p className="mt-5 text-4xl font-medium">{tier.price}</p>
                <ul className="mt-6 space-y-3">
                  {tier.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/plasmapheresis#pricing" className="mt-auto pt-7">
                  <Button
                    variant={tier.featured ? "default" : "outline"}
                    className={`btn-press w-full ${tier.featured ? "" : "border-border bg-background/40"}`}
                  >
                    View {tier.name} details <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            Final pricing and protocol are confirmed during your consultation and may vary based on your
            individualized plan. See the Plasmapheresis page for full details.
          </p>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-y border-border/70 bg-card/30 py-16">
        <div className="container grid gap-10 sm:grid-cols-3">
          {[
            { icon: Droplets, title: "Whole-blood approach", body: "Therapies that work systemically, at the level of the blood and plasma — not just symptom by symptom." },
            { icon: ShieldCheck, title: "Safety at every step", body: "Comprehensive screening including G6PD status, medical history, and contraindication review before any session." },
            { icon: Activity, title: "Personalized protocols", body: "Programs tailored to your goals and labs, with the option to combine EBO3 and plasmapheresis." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background/50">
                <Icon className="h-6 w-6 text-[color:var(--gold)]" />
              </span>
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONDENSED BENEFITS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow tone="gold">Where It May Help</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl">Blood-level support across eight areas</h2>
            <p className="mt-5 text-muted-foreground">
              EBO3 works in the bloodstream itself. These are the areas people most often explore — see the full,
              detailed breakdown on the EBO3 / EBOO page. For educational purposes only; individual responses vary.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="text-base font-medium leading-tight">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/eboo">
              <Button variant="outline" className="btn-press border-border bg-background/40">
                See all potential benefits <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GuideCapture />
      <ContactSection />
    </SiteLayout>
  );
}
