import { Link } from "wouter";
import { ArrowRight, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import { useSeo, buildFaqJsonLd } from "@/hooks/useSeo";
import { ASSETS, SITE, LOCAL_BUSINESS_JSONLD } from "@/lib/site";

const NEIGHBORHOOD_FAQS = [
  {
    q: "Do you serve Henderson and Green Valley?",
    a: "Yes. We regularly see EBOO / EBO3 patients from Henderson and Green Valley, typically a 20–30 minute drive from the Las Vegas metro core. Book online or email us to arrange a time.",
  },
  {
    q: "Do you serve Summerlin and the northwest valley?",
    a: "Yes. Patients from Summerlin, Centennial Hills, and the northwest Las Vegas valley are welcome. We schedule appointments by blood volume and session length, so reach out and we'll find a convenient slot.",
  },
  {
    q: "What about North Las Vegas, Spring Valley, and Enterprise?",
    a: "We serve the entire Las Vegas–Paradise metro, including North Las Vegas, Spring Valley, Enterprise, and the wider Clark County area. There is no separate travel fee — pricing is per session.",
  },
  {
    q: "Is EBOO therapy available to visitors traveling to Las Vegas?",
    a: "Yes. Many patients combine EBOO / EBO3 with a trip to Las Vegas. Complete the eligibility quiz in advance so screening is handled before you arrive and your session is ready to go.",
  },
];

const SERVICE_AREAS = [
  "Las Vegas",
  "Henderson",
  "North Las Vegas",
  "Paradise",
  "Summerlin",
  "Spring Valley",
  "Enterprise",
  "Greater Clark County",
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Physician-supervised",
    body: "Every EBOO / EBO3 session is screened and supervised by clinical staff, with continuous monitoring from line to line.",
  },
  {
    icon: Clock,
    title: "One comprehensive session",
    body: "Filtration, oxygenation, ozonation, and UVBI run in a single closed loop — roughly 45–120 minutes depending on volume.",
  },
  {
    icon: MapPin,
    title: "Serving the Las Vegas metro",
    body: "Convenient for patients across Las Vegas, Henderson, Summerlin, and the wider Clark County area.",
  },
];

export default function EbooLasVegas() {
  useSeo({
    title: "EBOO Treatment Near You in Las Vegas, NV | rEBOOtBlood",
    description:
      "Looking for EBOO treatment near you in Las Vegas? Book physician-supervised EBO3 ozone blood therapy serving the Las Vegas–Henderson metro.",
    jsonLd: [LOCAL_BUSINESS_JSONLD, buildFaqJsonLd(NEIGHBORHOOD_FAQS)],
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ASSETS.clinicInterior}
            alt="Calm, modern clinic interior for blood therapy in Las Vegas"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow>Las Vegas, Nevada</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              EBOO treatment near you <span className="text-gradient-garnet">in Las Vegas</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Physician-supervised EBO3 / EBOO ozone blood therapy for patients across the Las Vegas–Henderson
              metro. Filter, oxygenate, and ozonate your blood in a single monitored session.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/eligibility?interest=eboo">
                <Button size="lg" className="btn-press w-full sm:w-auto">
                  Check eligibility <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <a href={SITE.emailHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-press w-full border-border bg-background/30 sm:w-auto"
                >
                  <Mail className="mr-1.5 h-4 w-4" /> Email our team
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY HERE */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Why rEBOOtBlood</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">EBOO therapy, done carefully</h2>
            <p className="mt-4 text-muted-foreground">
              Also searched as EBO2 therapy, EBO3, or a "blood oil change" — here is what a session with us
              involves in the Las Vegas area.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card/50 p-7">
                <r.icon className="h-8 w-8 text-[color:var(--gold)]" />
                <h3 className="mt-4 text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Service Area</Eyebrow>
            <h2 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
              <MapPin className="h-8 w-8 text-[color:var(--gold)]" /> Where we serve
            </h2>
            <p className="mt-4 text-muted-foreground">
              We welcome patients from across the Las Vegas metro and Clark County.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-muted-foreground"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Want the full protocol, device, and pricing detail? See the{" "}
            <Link href="/eboo" className="text-[color:var(--gold)] underline-offset-4 hover:underline">
              EBO3 / EBOO therapy page
            </Link>{" "}
            and{" "}
            <Link href="/eboo/cost" className="text-[color:var(--gold)] underline-offset-4 hover:underline">
              EBOO cost & packages
            </Link>
            .
          </p>
        </div>
      </section>

      {/* NEIGHBORHOOD FAQ */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Local questions</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Serving your neighborhood</h2>
            <p className="mt-4 text-muted-foreground">
              Common questions from patients across the Las Vegas valley.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {NEIGHBORHOOD_FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="text-lg font-medium">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Considering EBOO therapy in Las Vegas?"
        sub="Check eligibility in two minutes, or email our team to ask about scheduling and what to expect."
      />
      <ContactSection />
    </SiteLayout>
  );
}
