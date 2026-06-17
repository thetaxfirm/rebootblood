import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SiteLayout, { Eyebrow } from "@/components/site/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE } from "@/lib/site";
import {
  CONDITION_OPTIONS,
  SYMPTOM_OPTIONS,
  GOAL_OPTIONS,
  type QuestionnaireInput,
  type TreatmentInterest,
} from "@shared/forms";

type FormState = {
  age: string;
  biologicalSex: "female" | "male" | "intersex" | "prefer_not" | "";
  knownG6PDDeficiency: "yes" | "no" | "unsure" | "";
  pregnantOrNursing: "yes" | "no" | "na" | "";
  bleedingOrClottingDisorder: "yes" | "no" | "unsure" | "";
  recentCardiacOrStrokeEvent: "yes" | "no" | "unsure" | "";
  currentMedications: string;
  conditions: string[];
  conditionsOther: string;
  symptoms: string[];
  symptomDuration: "lt1m" | "1to6m" | "6to12m" | "gt12m" | "na" | "";
  goals: string[];
  treatmentInterest: TreatmentInterest | "";
  additionalNotes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "either";
  city: string;
  state: string;
  consentTreatmentInfo: boolean;
  consentPrivacy: boolean;
  consentContact: boolean;
};

const INITIAL: FormState = {
  age: "",
  biologicalSex: "",
  knownG6PDDeficiency: "",
  pregnantOrNursing: "",
  bleedingOrClottingDisorder: "",
  recentCardiacOrStrokeEvent: "",
  currentMedications: "",
  conditions: [],
  conditionsOther: "",
  symptoms: [],
  symptomDuration: "",
  goals: [],
  treatmentInterest: "",
  additionalNotes: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "either",
  city: "",
  state: "",
  consentTreatmentInfo: false,
  consentPrivacy: false,
  consentContact: false,
};

const STEPS = ["Health history", "Conditions", "Symptoms", "Goals", "Your details & consent"];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function RadioRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors ${
              value === o.value ? "border-[color:var(--garnet)] bg-[oklch(0.22_0.04_25)]/40" : "border-border bg-background/40"
            }`}
          >
            <RadioGroupItem value={o.value} /> {o.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function Eligibility() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>(INITIAL);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = trpc.intake.submitQuestionnaire.useMutation({
    onSuccess: () => {
      setDone(true);
      window.scrollTo({ top: 0 });
    },
    onError: (e) => toast.error(e.message || "Submission failed. Please review your answers."),
  });

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const canNext = useMemo(() => {
    if (step === 0) {
      return (
        f.age !== "" &&
        Number(f.age) >= 18 &&
        f.knownG6PDDeficiency !== "" &&
        f.pregnantOrNursing !== "" &&
        f.bleedingOrClottingDisorder !== "" &&
        f.recentCardiacOrStrokeEvent !== ""
      );
    }
    if (step === 3) return f.treatmentInterest !== "";
    return true;
  }, [step, f]);

  const next = () => {
    if (!canNext) {
      toast.error("Please complete the required fields to continue.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 120 });
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 120 });
  };

  const onSubmit = () => {
    if (!f.firstName || !f.lastName || !f.email || !f.phone) {
      toast.error("Please complete your contact details.");
      return;
    }
    if (!f.consentTreatmentInfo || !f.consentPrivacy || !f.consentContact) {
      toast.error("Please review and check all three consent items to submit.");
      return;
    }
    const payload: QuestionnaireInput = {
      age: Number(f.age),
      biologicalSex: f.biologicalSex || undefined,
      knownG6PDDeficiency: f.knownG6PDDeficiency as "yes" | "no" | "unsure",
      pregnantOrNursing: f.pregnantOrNursing as "yes" | "no" | "na",
      bleedingOrClottingDisorder: f.bleedingOrClottingDisorder as "yes" | "no" | "unsure",
      recentCardiacOrStrokeEvent: f.recentCardiacOrStrokeEvent as "yes" | "no" | "unsure",
      currentMedications: f.currentMedications,
      conditions: f.conditions,
      conditionsOther: f.conditionsOther,
      symptoms: f.symptoms,
      symptomDuration: f.symptomDuration || undefined,
      goals: f.goals,
      treatmentInterest: f.treatmentInterest as TreatmentInterest,
      additionalNotes: f.additionalNotes,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      phone: f.phone,
      preferredContact: f.preferredContact,
      city: f.city,
      state: f.state,
      consentTreatmentInfo: true,
      consentPrivacy: true,
      consentContact: true,
    };
    submit.mutate(payload);
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="pt-40 pb-28">
          <div className="container max-w-xl text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-[color:var(--gold)]" />
            <h1 className="mt-6 text-4xl">Thank you — we've received your questionnaire</h1>
            <p className="mt-4 text-muted-foreground">
              Your responses have been securely and confidentially recorded. A member of our care team will
              review your information and reach out within 24–48 hours to discuss your eligibility and next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button className="btn-press" onClick={() => navigate("/")}>Return Home</Button>
              <Button variant="outline" className="btn-press border-border bg-background/40" onClick={() => navigate("/#contact")}>
                Contact the Team
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="pt-36 pb-24 md:pt-44">
        <div className="container max-w-2xl">
          <div className="text-center">
            <Eyebrow>Eligibility Questionnaire</Eyebrow>
            <h1 className="mt-3 text-4xl md:text-5xl">See if you're a candidate</h1>
            <p className="mt-4 text-muted-foreground">
              A brief, confidential questionnaire. Someone from our team will follow up within 24–48 hours. This
              is for educational purposes only and is not a diagnosis or a substitute for medical care.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
            Your responses are encrypted at rest and accessible only to authorized care-team staff. Every access
            is logged.
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{STEPS[step]}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 md:p-8">
            {/* STEP 1 — HEALTH HISTORY */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl">Health history</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age <span className="text-[color:var(--garnet)]">*</span></Label>
                    <Input id="age" inputMode="numeric" value={f.age} onChange={(e) => set("age", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 45" />
                    {f.age !== "" && Number(f.age) < 18 && (
                      <p className="text-xs text-[color:var(--garnet)]">Patients must be 18 or older.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Biological sex</Label>
                    <Select value={f.biologicalSex} onValueChange={(v) => set("biologicalSex", v as FormState["biologicalSex"])}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="intersex">Intersex</SelectItem>
                        <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <RadioRow
                  label="Do you have known G6PD deficiency? *"
                  value={f.knownG6PDDeficiency}
                  onChange={(v) => set("knownG6PDDeficiency", v as FormState["knownG6PDDeficiency"])}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]}
                />
                <RadioRow
                  label="Are you currently pregnant or nursing? *"
                  value={f.pregnantOrNursing}
                  onChange={(v) => set("pregnantOrNursing", v as FormState["pregnantOrNursing"])}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "na", label: "Not applicable" }]}
                />
                <RadioRow
                  label="Do you have a bleeding or clotting disorder? *"
                  value={f.bleedingOrClottingDisorder}
                  onChange={(v) => set("bleedingOrClottingDisorder", v as FormState["bleedingOrClottingDisorder"])}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]}
                />
                <RadioRow
                  label="Any heart attack or stroke in the past 6 months? *"
                  value={f.recentCardiacOrStrokeEvent}
                  onChange={(v) => set("recentCardiacOrStrokeEvent", v as FormState["recentCardiacOrStrokeEvent"])}
                  options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]}
                />
                <div className="space-y-2">
                  <Label htmlFor="meds">Current medications & supplements</Label>
                  <Textarea id="meds" rows={3} value={f.currentMedications} onChange={(e) => set("currentMedications", e.target.value)} placeholder="List anything relevant, including blood thinners." />
                </div>
              </div>
            )}

            {/* STEP 2 — CONDITIONS */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl">Conditions</h2>
                <p className="text-sm text-muted-foreground">Select any that apply. This helps our team understand your situation — it is not a diagnosis.</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {CONDITION_OPTIONS.map((c) => (
                    <label key={c} className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${f.conditions.includes(c) ? "border-[color:var(--garnet)] bg-[oklch(0.22_0.04_25)]/40" : "border-border bg-background/40"}`}>
                      <Checkbox checked={f.conditions.includes(c)} onCheckedChange={() => set("conditions", toggle(f.conditions, c))} className="mt-0.5" />
                      <span className="text-muted-foreground">{c}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cond-other">Anything else?</Label>
                  <Textarea id="cond-other" rows={2} value={f.conditionsOther} onChange={(e) => set("conditionsOther", e.target.value)} placeholder="Other conditions or context (optional)." />
                </div>
              </div>
            )}

            {/* STEP 3 — SYMPTOMS */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl">Symptoms</h2>
                <p className="text-sm text-muted-foreground">Select any symptoms you're currently experiencing.</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {SYMPTOM_OPTIONS.map((s) => (
                    <label key={s} className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${f.symptoms.includes(s) ? "border-[color:var(--garnet)] bg-[oklch(0.22_0.04_25)]/40" : "border-border bg-background/40"}`}>
                      <Checkbox checked={f.symptoms.includes(s)} onCheckedChange={() => set("symptoms", toggle(f.symptoms, s))} className="mt-0.5" />
                      <span className="text-muted-foreground">{s}</span>
                    </label>
                  ))}
                </div>
                <RadioRow
                  label="How long have you experienced these symptoms?"
                  value={f.symptomDuration}
                  onChange={(v) => set("symptomDuration", v as FormState["symptomDuration"])}
                  options={[
                    { value: "lt1m", label: "< 1 month" },
                    { value: "1to6m", label: "1–6 months" },
                    { value: "6to12m", label: "6–12 months" },
                    { value: "gt12m", label: "> 12 months" },
                    { value: "na", label: "N/A" },
                  ]}
                />
              </div>
            )}

            {/* STEP 4 — GOALS */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-2xl">Your goals</h2>
                <p className="text-sm text-muted-foreground">What are you hoping to achieve?</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {GOAL_OPTIONS.map((g) => (
                    <label key={g} className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm transition-colors ${f.goals.includes(g) ? "border-[color:var(--garnet)] bg-[oklch(0.22_0.04_25)]/40" : "border-border bg-background/40"}`}>
                      <Checkbox checked={f.goals.includes(g)} onCheckedChange={() => set("goals", toggle(f.goals, g))} className="mt-0.5" />
                      <span className="text-muted-foreground">{g}</span>
                    </label>
                  ))}
                </div>
                <RadioRow
                  label="Which treatment are you most interested in? *"
                  value={f.treatmentInterest}
                  onChange={(v) => set("treatmentInterest", v as TreatmentInterest)}
                  options={[
                    { value: "eboo", label: "EBO3 / EBOO" },
                    { value: "plasmapheresis", label: "Plasmapheresis" },
                    { value: "both", label: "Both" },
                    { value: "unsure", label: "Not sure yet" },
                  ]}
                />
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional notes</Label>
                  <Textarea id="notes" rows={3} value={f.additionalNotes} onChange={(e) => set("additionalNotes", e.target.value)} placeholder="Anything else you'd like us to know (optional)." />
                </div>
              </div>
            )}

            {/* STEP 5 — DETAILS & CONSENT */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl">Your details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fn">First name <span className="text-[color:var(--garnet)]">*</span></Label>
                    <Input id="fn" value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ln">Last name <span className="text-[color:var(--garnet)]">*</span></Label>
                    <Input id="ln" value={f.lastName} onChange={(e) => set("lastName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="em">Email <span className="text-[color:var(--garnet)]">*</span></Label>
                    <Input id="em" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">Phone <span className="text-[color:var(--garnet)]">*</span></Label>
                    <Input id="ph" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={f.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Region</Label>
                    <Input id="state" value={f.state} onChange={(e) => set("state", e.target.value)} />
                  </div>
                </div>

                <RadioRow
                  label="Preferred contact method"
                  value={f.preferredContact}
                  onChange={(v) => set("preferredContact", v as FormState["preferredContact"])}
                  options={[{ value: "email", label: "Email" }, { value: "phone", label: "Phone" }, { value: "either", label: "Either" }]}
                />

                <div className="space-y-3 rounded-xl border border-border bg-background/40 p-5">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> Consent (please review each)
                  </p>
                  <label className="flex items-start gap-3">
                    <Checkbox checked={f.consentTreatmentInfo} onCheckedChange={(v) => set("consentTreatmentInfo", !!v)} className="mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      I understand the information provided about EBO3 / EBOO and plasmapheresis is educational
                      only, is not medical advice, and that formal informed consent is reviewed and signed with a
                      licensed provider before any procedure.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <Checkbox checked={f.consentPrivacy} onCheckedChange={(v) => set("consentPrivacy", !!v)} className="mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      I agree to the {SITE.name} <a href="/privacy" className="underline">Privacy Policy</a> and
                      consent to the secure handling of the health information I am providing.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <Checkbox checked={f.consentContact} onCheckedChange={(v) => set("consentContact", !!v)} className="mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      I consent to be contacted by {SITE.name} by phone, text, or email regarding my inquiry.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* NAV */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" className="btn-press" onClick={back} disabled={step === 0}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button className="btn-press" onClick={next}>
                  Continue <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button className="btn-press" onClick={onSubmit} disabled={submit.isPending}>
                  {submit.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>) : "Submit Questionnaire"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
