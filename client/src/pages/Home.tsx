import { Link } from "wouter";
import {
  ArrowRight,
  Droplets,
  Activity,
  ShieldCheck,
  Sparkles,
  Microscope,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import GuideCapture from "@/components/site/GuideCapture";
import ContactSection from "@/components/site/ContactSection";
import { ASSETS, SITE } from "@/lib/site";

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

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
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

      <GuideCapture />
      <ContactSection />
    </SiteLayout>
  );
}
