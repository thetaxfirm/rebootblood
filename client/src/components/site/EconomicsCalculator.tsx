import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

/**
 * Interactive MSO partner economics calculator.
 * Grounded in the partnership proposal: the partner clinic earns a 30% revenue
 * share + cost-of-goods reimbursement + nursing/clinical labor reimbursement;
 * rEBOOtBlood (MSO) retains the remainder to fund the placed device, marketing,
 * billing, and platform. All inputs are user-editable; defaults are illustrative.
 */

const TIERS = [
  { id: "3L", label: "3L", price: 1000 },
  { id: "4.5L", label: "4.5L", price: 1250 },
  { id: "6L", label: "6L", price: 1500 },
] as const;

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function EconomicsCalculator() {
  const [tierId, setTierId] = useState<(typeof TIERS)[number]["id"]>("4.5L");
  const [price, setPrice] = useState(1250);
  const [cogs, setCogs] = useState(180);
  const [laborHours, setLaborHours] = useState(1.75);
  const [laborRate, setLaborRate] = useState(68);
  const [sharePct, setSharePct] = useState(30);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(8);

  const selectTier = (id: (typeof TIERS)[number]["id"]) => {
    setTierId(id);
    const t = TIERS.find((x) => x.id === id);
    if (t) setPrice(t.price);
  };

  const m = useMemo(() => {
    const labor = laborHours * laborRate;
    const revShare = (sharePct / 100) * price;
    const clinicPerSession = revShare + cogs + labor;
    const msoPerSession = price - clinicPerSession;
    const sessionsPerMonth = sessionsPerWeek * 4.3;
    return {
      labor,
      revShare,
      clinicPerSession,
      msoPerSession,
      clinicPct: price > 0 ? (clinicPerSession / price) * 100 : 0,
      msoPct: price > 0 ? (msoPerSession / price) * 100 : 0,
      monthlyGross: price * sessionsPerMonth,
      monthlyClinic: clinicPerSession * sessionsPerMonth,
      monthlyMso: msoPerSession * sessionsPerMonth,
      annualClinic: clinicPerSession * sessionsPerMonth * 12,
      annualMso: msoPerSession * sessionsPerMonth * 12,
      sessionsPerMonth,
    };
  }, [price, cogs, laborHours, laborRate, sharePct, sessionsPerWeek]);

  const negativeMso = m.msoPerSession < 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* INPUTS */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
        <h3 className="text-xl">Your inputs</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Defaults are illustrative — replace them with your clinic's real consumable cost and loaded labor rate.
        </p>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Volume tier &amp; list price</Label>
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTier(t.id)}
                  className={`btn-press rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    tierId === t.id
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10 text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block font-medium">{t.label}</span>
                  <span className="block text-xs opacity-80">{usd(t.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calc-price">Session price (USD)</Label>
            <Input
              id="calc-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calc-cogs">Cost of goods per session (consumables, USD)</Label>
            <Input
              id="calc-cogs"
              type="number"
              min={0}
              value={cogs}
              onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calc-hours">Nurse hours / session</Label>
              <Input
                id="calc-hours"
                type="number"
                min={0}
                step={0.25}
                value={laborHours}
                onChange={(e) => setLaborHours(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calc-rate">Loaded rate / hr (USD)</Label>
              <Input
                id="calc-rate"
                type="number"
                min={0}
                value={laborRate}
                onChange={(e) => setLaborRate(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Clinic revenue share</Label>
              <span className="text-sm font-medium text-[color:var(--gold)]">{sharePct}%</span>
            </div>
            <Slider value={[sharePct]} min={0} max={60} step={1} onValueChange={(v) => setSharePct(v[0])} />
            <p className="text-xs text-muted-foreground">Program standard is 30%. Adjust to model scenarios.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sessions per week</Label>
              <span className="text-sm font-medium text-[color:var(--gold)]">{sessionsPerWeek}/wk</span>
            </div>
            <Slider value={[sessionsPerWeek]} min={1} max={30} step={1} onValueChange={(v) => setSessionsPerWeek(v[0])} />
          </div>
        </div>
      </div>

      {/* OUTPUTS */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
          <h3 className="text-xl">Per-session split</h3>
          <div className="mt-5 space-y-3 text-sm">
            <Row label="Gross patient revenue" value={usd(price)} strong />
            <Row label={`Clinic revenue share (${sharePct}%)`} value={usd(m.revShare)} />
            <Row label="Cost of goods reimbursed" value={usd(cogs)} />
            <Row label={`Nursing/clinical time (${laborHours} hr × ${usd(laborRate)})`} value={usd(m.labor)} />
            <div className="my-2 h-px bg-border" />
            <Row
              label="Total to partner clinic"
              value={`${usd(m.clinicPerSession)} (${m.clinicPct.toFixed(0)}%)`}
              strong
              accent="gold"
            />
            <Row
              label="Retained by rEBOOtBlood (MSO)"
              value={`${usd(m.msoPerSession)} (${m.msoPct.toFixed(0)}%)`}
              strong
            />
          </div>

          {/* Split bar */}
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-[color:var(--gold)]"
              style={{ width: `${Math.max(0, Math.min(100, m.clinicPct))}%` }}
            />
            <div
              className="h-full bg-[color:var(--garnet)]"
              style={{ width: `${Math.max(0, Math.min(100, m.msoPct))}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Clinic</span>
            <span>MSO</span>
          </div>

          {negativeMso && (
            <p className="mt-4 rounded-lg border border-[color:var(--garnet)]/40 bg-[color:var(--garnet)]/10 p-3 text-xs text-foreground">
              At these inputs the clinic's reimbursed costs exceed the MSO's retained revenue. Adjust price, COGS, labor,
              or share to find a sustainable structure.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
          <h3 className="text-xl">Monthly projection</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            At {sessionsPerWeek} sessions/week (~{m.sessionsPerMonth.toFixed(0)} per month) on one placed device.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Stat label="Gross / mo" value={usd(m.monthlyGross)} />
            <Stat label="Clinic / mo" value={usd(m.monthlyClinic)} accent="gold" />
            <Stat label="MSO / mo" value={usd(m.monthlyMso)} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <Stat label="Clinic / yr" value={usd(m.annualClinic)} accent="gold" />
            <Stat label="MSO / yr" value={usd(m.annualMso)} />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Planning illustration only. Figures depend on actual consumable costs, labor rates, cash/payer mix, package
          uptake, and achieved utilization. This is not financial, tax, or legal advice; revenue-share, equipment-placement,
          and MSO arrangements must be reviewed by qualified healthcare counsel before launch.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: "gold";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      <span
        className={`tabular-nums ${strong ? "font-semibold" : ""}`}
        style={accent === "gold" ? { color: "var(--gold)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "gold" }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="text-lg font-semibold tabular-nums" style={accent === "gold" ? { color: "var(--gold)" } : undefined}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
