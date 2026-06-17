import { useState } from "react";
import { Download, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { SITE } from "@/lib/site";

export default function GuideCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);

  const submit = trpc.intake.submitLead.useMutation({
    onSuccess: () => {
      setDone(true);
      toast.success("Thank you — your guide is on the way.");
    },
    onError: (e) => toast.error(e.message || "Please try again."),
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
      treatmentInterest: "unsure",
      message: "Requested the blood therapy guide.",
      source: "guide_download",
      consentContact: true,
    });
  };

  return (
    <section className="border-t border-border/70 py-20 md:py-28">
      <div className="container">
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-[oklch(0.2_0.03_25)]">
          <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" /> Free Patient Guide
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl">
                The Complete Guide to Advanced Blood Therapies
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                A clear, physician-informed overview of EBO3 / EBOO and plasmapheresis — how they work, who
                they may help, safety and screening, what to expect, and how to prepare. Talk to our team and
                we'll send it to you.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {[
                  "How EBO3 / EBOO and plasmapheresis differ",
                  "Safety, screening, and contraindications explained",
                  "What a typical session and protocol looks like",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--gold)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background/50 p-6 md:p-7">
              {done ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-12 w-12 text-[color:var(--gold)]" />
                  <h3 className="mt-3 text-xl">Check your inbox</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our team has been notified and will follow up with your guide and next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="g-name">Full name</Label>
                    <Input id="g-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-email">Email</Label>
                    <Input id="g-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="g-phone">Phone (optional)</Label>
                    <Input id="g-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                  <label className="flex items-start gap-3 rounded-lg border border-border/70 bg-card/40 p-3">
                    <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      I consent to receive the guide and to be contacted by {SITE.name} about my inquiry.
                    </span>
                  </label>
                  <Button type="submit" className="btn-press w-full" size="lg" disabled={submit.isPending}>
                    {submit.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Talk to Our Team"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
