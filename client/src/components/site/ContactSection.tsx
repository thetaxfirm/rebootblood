import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { SITE } from "@/lib/site";
import type { TreatmentInterest } from "@shared/forms";

const INTEREST_LABELS: Record<TreatmentInterest, string> = {
  eboo: "EBO3 / EBOO",
  plasmapheresis: "Plasmapheresis",
  both: "Both treatments",
  unsure: "Not sure yet",
};

const VALID_INTERESTS: TreatmentInterest[] = ["eboo", "plasmapheresis", "both", "unsure"];

function readBookingParams(searchStr: string) {
  const params = new URLSearchParams(searchStr || (typeof window !== "undefined" ? window.location.search : ""));
  const rawInterest = params.get("interest");
  const interest = rawInterest && VALID_INTERESTS.includes(rawInterest as TreatmentInterest)
    ? (rawInterest as TreatmentInterest)
    : null;
  const tier = params.get("tier");
  return { interest, tier };
}

export default function ContactSection() {
  const search = useSearch();

  // Read "Book this tier" deep-link params (?interest=&tier=) synchronously on
  // first render so the Select and message start with the correct values and
  // never depend on effect timing or the controlled Select re-rendering late.
  const initial = readBookingParams(search);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<TreatmentInterest>(initial.interest ?? "unsure");
  const [message, setMessage] = useState(initial.tier ? `I'm interested in: ${initial.tier}.` : "");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const [prefilledTier, setPrefilledTier] = useState<string | null>(initial.tier);

  // Also react to in-app navigations that change the query string without a
  // full remount (e.g. clicking a "Book this tier" link while already on the page).
  useEffect(() => {
    const { interest: i, tier } = readBookingParams(search);
    if (i) setInterest(i);
    if (tier) {
      setPrefilledTier(tier);
      setMessage((prev) => (prev ? prev : `I'm interested in: ${tier}.`));
    }
  }, [search]);

  const submit = trpc.intake.submitLead.useMutation({
    onSuccess: () => {
      setDone(true);
      toast.success("Request received. Our care team will reach out shortly.");
    },
    onError: (e) => toast.error(e.message || "Something went wrong. Please try again."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Please provide consent to be contacted.");
      return;
    }
    submit.mutate({
      name,
      email,
      phone,
      treatmentInterest: interest,
      message,
      source: "request_appointment",
      consentContact: true,
    });
  };

  return (
    <section id="contact" className="relative scroll-mt-24 border-t border-border/70 py-20 md:py-28">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow text-[color:var(--gold)]">Request an Appointment</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Begin with a private consultation</h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Speak with our care team about EBO3 / EBOO and plasmapheresis. We'll review your goals, answer
            your questions, and determine whether you're a candidate — with safety screening at every step.
          </p>

          <div className="mt-8 space-y-4">
            <a href={SITE.phoneHref} className="flex items-center gap-3 text-lg">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card">
                <Phone className="h-5 w-5 text-[color:var(--gold)]" />
              </span>
              {SITE.phoneDisplay}
            </a>
            <a href={SITE.emailHref} className="flex items-center gap-3 text-lg">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card">
                <Mail className="h-5 w-5 text-[color:var(--gold)]" />
              </span>
              {SITE.email}
            </a>
          </div>

          <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
            This form is an inquiry only and is not a medical record. Please do not include sensitive clinical
            details here. Formal informed consent is reviewed and signed with a licensed provider before any
            procedure.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
          {done ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-[color:var(--gold)]" />
              <h3 className="mt-4 text-2xl">Thank you</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                Your request has been received and our care team has been notified. We'll be in touch within
                one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Full name</Label>
                  <Input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-phone">Phone</Label>
                  <Input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email">Email</Label>
                <Input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              {prefilledTier && (
                <div className="flex items-start gap-2 rounded-lg border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-3.5 py-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                  <span className="text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{prefilledTier}</span>
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <Label>Treatment of interest</Label>
                <Select value={interest} onValueChange={(v) => setInterest(v as TreatmentInterest)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select">{INTEREST_LABELS[interest]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eboo">{INTEREST_LABELS.eboo}</SelectItem>
                    <SelectItem value="plasmapheresis">{INTEREST_LABELS.plasmapheresis}</SelectItem>
                    <SelectItem value="both">{INTEREST_LABELS.both}</SelectItem>
                    <SelectItem value="unsure">{INTEREST_LABELS.unsure}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-msg">How can we help?</Label>
                <Textarea id="c-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us briefly about your wellness goals." />
              </div>
              <label className="flex items-start gap-3 rounded-lg border border-border/70 bg-background/40 p-3.5">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  I consent to be contacted by {SITE.name} by phone, text, or email regarding my inquiry. I
                  understand this form is not for medical emergencies.
                </span>
              </label>
              <Button type="submit" className="btn-press w-full" size="lg" disabled={submit.isPending}>
                {submit.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Request Appointment"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
