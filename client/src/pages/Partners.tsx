import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  PackageCheck,
  Megaphone,
  Receipt,
  Stethoscope,
  ShieldCheck,
  TrendingUp,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import EconomicsCalculator from "@/components/site/EconomicsCalculator";
import { trpc } from "@/lib/trpc";
import { ASSETS, SITE } from "@/lib/site";

const VALUE_PROPS = [
  {
    icon: PackageCheck,
    title: "No equipment cost",
    body: "We place and maintain the EBOO O3 Research Device 2026 in your clinic — zero capital outlay, zero service burden.",
  },
  {
    icon: Megaphone,
    title: "We bring the patients",
    body: "rEBOOtBlood owns the marketing funnel, content hub, and brand. Screened, motivated patients are routed to you.",
  },
  {
    icon: Receipt,
    title: "We handle billing & admin",
    body: "Intake, scheduling, payment collection, records, and patient support all run on our HIPAA-aligned platform.",
  },
  {
    icon: TrendingUp,
    title: "You monetize idle capacity",
    body: "Turn existing chairs, hours, and nursing staff into a new premium revenue line — revenue share + COGS + nurse time.",
  },
];

const RESP = [
  { who: "rEBOOtBlood (MSO)", icon: Building2, items: ["Patient acquisition & marketing", "Eligibility screening & intake", "Device supply, install & service", "Billing, records & support", "HIPAA-aligned platform + BAA"] },
  { who: "Partner Clinic (Provider)", icon: Stethoscope, items: ["Licensed clinicians deliver care", "Final candidacy decision", "Treatment space & safe environment", "Stocks & uses consumables", "On-site PHI safeguards per BAA"] },
];

export default function Partners() {
  const [clinic, setClinic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cityState, setCityState] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);

  const submit = trpc.intake.submitLead.useMutation({
    onSuccess: () => {
      setDone(true);
      toast.success("Inquiry received. Our partnerships team will be in touch.");
    },
    onError: (e) => toast.error(e.message || "Something went wrong. Please try again."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Please provide consent to be contacted.");
      return;
    }
    const message = [
      `PARTNER CLINIC INQUIRY`,
      `Clinic / practice: ${clinic || "—"}`,
      `Market (city, state): ${cityState || "—"}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    submit.mutate({
      name,
      email,
      phone,
      treatmentInterest: "both",
      message,
      source: "partner_inquiry",
      consentContact: true,
    });
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.clinicInterior} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background" />
        </div>
        <div className="container relative pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-3xl reveal">
            <Eyebrow tone="gold">Partner Clinic Program</Eyebrow>
            <h1 className="mt-4 text-balance text-5xl leading-[1.05] md:text-6xl">
              A turnkey EBO3 revenue line — <span className="text-gradient-garnet">we supply everything but the care</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              rEBOOtBlood is a Management Services Organization. We place the device, drive the patients, and run billing
              and administration. Your licensed clinicians deliver the treatment and keep full clinical control — and
              your clinic earns a revenue share plus reimbursed consumables and nursing time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#inquire">
                <Button size="lg" className="btn-press w-full sm:w-auto">
                  Become a Partner Clinic <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </a>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="btn-press w-full border-border bg-background/30 sm:w-auto">
                  Open the Economics Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Why Partner</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Close to risk-free expansion</h2>
            <p className="mt-4 text-muted-foreground">
              The expensive, scalable assets — the funnel, the brand, the device, the admin platform — are ours. The
              geographically-bound assets — staff, space, and care — are yours. You add a differentiated therapy without
              capital, marketing, or administrative burden.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card/60 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background/50">
                  <v.icon className="h-5 w-5 text-[color:var(--gold)]" />
                </span>
                <h3 className="mt-4 text-lg">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section className="border-y border-border/70 bg-card/30 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow>Clean Separation</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Who does what</h2>
            <p className="mt-4 text-muted-foreground">
              We provide non-clinical management services and equipment. Your clinic and its licensed clinicians retain
              independent professional judgment over every patient's care. That boundary is the foundation of the
              program's compliance posture.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {RESP.map((r) => (
              <div key={r.who} className="rounded-2xl border border-border bg-card/60 p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/50">
                    <r.icon className="h-5 w-5 text-[color:var(--gold)]" />
                  </span>
                  <h3 className="text-xl">{r.who}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <Eyebrow tone="gold">Run the Numbers</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Partner economics calculator</h2>
            <p className="mt-4 text-muted-foreground">
              Model your split per session and your monthly and annual projection on one placed device. Defaults are
              illustrative — enter your real consumable cost and loaded nurse rate.
            </p>
          </div>
          <div className="mt-12">
            <EconomicsCalculator />
          </div>
        </div>
      </section>

      {/* COMPLIANCE NOTE */}
      <section className="border-t border-border/70 py-14">
        <div className="container">
          <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-border bg-card/50 p-6">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[color:var(--gold)]" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Compliance first.</strong> The program is designed with risk-reduction
              built in — an MSO services-fee structure (not a clinical fee-split), clinic-owned clinical decisions, a
              cash-pay basis excluding federal beneficiaries, fair-market-value compensation, and a mandatory Business
              Associate Agreement with HIPAA-aligned encryption, role-based access, and audit logging. These structures
              are common in the industry but must be reviewed and adapted by qualified healthcare regulatory counsel in
              each operating state before any agreement is signed.
            </p>
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="inquire" className="scroll-mt-24 border-t border-border/70 py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow tone="gold">Become a Partner</Eyebrow>
            <h2 className="mt-3 text-4xl md:text-5xl">Start the conversation</h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Tell us about your practice. We'll run a quick fit and market-demand check and, if there's a match, walk
              you through onboarding — agreement and BAA review, device install and staff training, and a soft launch
              with our funnel pointed at your location.
            </p>
            <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
              This form is a business inquiry only. Please do not include any patient information. It is not an offer or
              a binding agreement; any partnership is subject to counsel review and a signed management services
              agreement.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
            {done ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-[color:var(--gold)]" />
                <h3 className="mt-4 text-2xl">Thank you</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Your inquiry has been received and our partnerships team has been notified. We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="p-clinic">Clinic / practice name</Label>
                  <Input id="p-clinic" required value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Vitality Integrative Medicine" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-name">Your name</Label>
                    <Input id="p-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-phone">Phone</Label>
                    <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-email">Email</Label>
                  <Input id="p-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@clinic.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-loc">Market (city, state)</Label>
                  <Input id="p-loc" value={cityState} onChange={(e) => setCityState(e.target.value)} placeholder="Austin, TX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-notes">Tell us about your practice</Label>
                  <Textarea id="p-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Specialty, patient volume, nursing capacity, interest in EBO3…" />
                </div>
                <label className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/40 p-3.5">
                  <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    I consent to be contacted by {SITE.name} regarding the partner program by phone, text, or email.
                  </span>
                </label>
                <Button type="submit" className="btn-press w-full" size="lg" disabled={submit.isPending}>
                  {submit.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Submit Partner Inquiry"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
