import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Loader2,
  Eye,
  RefreshCw,
  FileText,
  Users,
  ScrollText,
  LogOut,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  STATUS_LABELS,
  TREATMENT_INTEREST_LABELS,
  type WorkflowStatus,
} from "@shared/forms";

const STATUSES: WorkflowStatus[] = ["new", "reviewing", "contacted", "scheduled", "closed"];

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const tone: Record<WorkflowStatus, string> = {
    new: "bg-[oklch(0.5_0.13_25)]/25 text-[color:var(--gold)] border-[color:var(--gold)]/30",
    reviewing: "bg-muted text-muted-foreground border-border",
    contacted: "bg-muted text-muted-foreground border-border",
    scheduled: "bg-[oklch(0.5_0.13_150)]/20 text-emerald-300 border-emerald-500/30",
    closed: "bg-muted text-muted-foreground border-border",
  };
  return <Badge variant="outline" className={tone[status]}>{STATUS_LABELS[status]}</Badge>;
}

function fmt(d: Date | string | number) {
  return new Date(d).toLocaleString();
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="max-w-sm rounded-2xl border border-border bg-card/60 p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-[color:var(--gold)]" />
          <h1 className="mt-4 text-2xl">Staff sign-in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area contains protected patient information and is restricted to authorized staff.
          </p>
          <Button className="btn-press mt-6 w-full" onClick={() => (window.location.href = getLoginUrl())}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="max-w-sm rounded-2xl border border-border bg-card/60 p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-[color:var(--garnet)]" />
          <h1 className="mt-4 text-2xl">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) does not have administrator access to patient data. Please contact the
            clinic administrator.
          </p>
          <Button variant="outline" className="btn-press mt-6 w-full border-border" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <AdminPanel email={user.email ?? ""} onLogout={logout} />;
}

function AdminPanel({ email, onLogout }: { email: string; onLogout: () => void }) {
  const counts = trpc.admin.dashboardCounts.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[color:var(--gold)]" />
            <span className="font-serif text-lg">rEBOOtBlood · Care Team Console</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            <Button variant="outline" size="sm" className="btn-press border-border" onClick={onLogout}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
          <p>
            Patient information is encrypted at rest and decrypted only when you open a record. Every list, view,
            and status change is recorded in the audit log. Handle all information in accordance with your HIPAA
            policies.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Questionnaires" value={counts.data?.submissionsTotal} icon={FileText} />
          <StatCard label="Leads" value={counts.data?.leadsTotal} icon={Users} />
          <StatCard label="New / unworked" value={(counts.data ? counts.data.submissionsNew + counts.data.leadsNew : undefined)} icon={RefreshCw} />
        </div>

        <Tabs defaultValue="submissions" className="mt-8">
          <TabsList>
            <TabsTrigger value="submissions"><FileText className="mr-1.5 h-4 w-4" /> Submissions</TabsTrigger>
            <TabsTrigger value="leads"><Users className="mr-1.5 h-4 w-4" /> Leads</TabsTrigger>
            <TabsTrigger value="audit"><ScrollText className="mr-1.5 h-4 w-4" /> Audit log</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions" className="mt-6"><SubmissionsTab /></TabsContent>
          <TabsContent value="leads" className="mt-6"><LeadsTab /></TabsContent>
          <TabsContent value="audit" className="mt-6"><AuditTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value?: number; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-[color:var(--gold)]" />
      </div>
      <p className="mt-2 font-serif text-3xl">{value ?? "—"}</p>
    </div>
  );
}

/* ----------------------------- Submissions ----------------------------- */

function SubmissionsTab() {
  const [status, setStatus] = useState<WorkflowStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const list = trpc.admin.listSubmissions.useQuery({
    status: status === "all" ? undefined : status,
  });

  const exportCsv = trpc.admin.exportSubmissions.useMutation({
    onSuccess: (res) => {
      if (!res.count) return toast.info("No records to export");
      downloadCsv(res.csv, `submissions-${Date.now()}.csv`);
      toast.success(`Exported ${res.count} record(s)`);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <FilterSelect value={status} onChange={setStatus} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-press border-border" disabled={exportCsv.isPending} onClick={() => exportCsv.mutate({ status: status === "all" ? undefined : status })}>
            {exportCsv.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />} Export CSV
          </Button>
          <Button variant="outline" size="sm" className="btn-press border-border" onClick={() => list.refetch()}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <RecordTable
        loading={list.isLoading}
        rows={list.data ?? []}
        emptyLabel="No questionnaire submissions yet."
        onOpen={setOpenId}
        showSource={false}
      />

      <SubmissionDrawer
        publicId={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => {
          utils.admin.listSubmissions.invalidate();
          utils.admin.dashboardCounts.invalidate();
        }}
      />
    </div>
  );
}

function SubmissionDrawer({
  publicId,
  onClose,
  onChanged,
}: {
  publicId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const detail = trpc.admin.getSubmission.useQuery({ publicId: publicId ?? "" }, { enabled: !!publicId });
  const setStatus = trpc.admin.setSubmissionStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      detail.refetch();
      onChanged();
    },
    onError: (e) => toast.error(e.message),
  });

  const p = detail.data?.payload;

  return (
    <Sheet open={!!publicId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif">Patient submission</SheetTitle>
          <SheetDescription>Reference {publicId}</SheetDescription>
        </SheetHeader>

        {detail.isLoading && (
          <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        )}

        {p && detail.data && (
          <div className="mt-6 space-y-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Select
                value={detail.data.status}
                onValueChange={(v) => publicId && setStatus.mutate({ publicId, status: v as WorkflowStatus })}
              >
                <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Field label="Name">{p.firstName} {p.lastName}</Field>
            <Field label="Email">{p.email}</Field>
            <Field label="Phone">{p.phone}</Field>
            <Field label="Preferred contact">{p.preferredContact}</Field>
            {(p.city || p.state) && <Field label="Location">{[p.city, p.state].filter(Boolean).join(", ")}</Field>}
            <Field label="Treatment interest">{TREATMENT_INTEREST_LABELS[detail.data.treatmentInterest]}</Field>

            <div className="h-px bg-border" />
            <Field label="Age">{p.age}</Field>
            {p.biologicalSex && <Field label="Biological sex">{p.biologicalSex}</Field>}
            <Field label="Known G6PD deficiency"><Flag v={p.knownG6PDDeficiency} danger={p.knownG6PDDeficiency === "yes"} /></Field>
            <Field label="Pregnant / nursing"><Flag v={p.pregnantOrNursing} danger={p.pregnantOrNursing === "yes"} /></Field>
            <Field label="Bleeding/clotting disorder"><Flag v={p.bleedingOrClottingDisorder} danger={p.bleedingOrClottingDisorder === "yes"} /></Field>
            <Field label="Recent cardiac/stroke event"><Flag v={p.recentCardiacOrStrokeEvent} danger={p.recentCardiacOrStrokeEvent === "yes"} /></Field>
            {p.currentMedications && <Field label="Medications">{p.currentMedications}</Field>}

            <div className="h-px bg-border" />
            {p.conditions.length > 0 && <Field label="Conditions">{p.conditions.join(", ")}{p.conditionsOther ? `; ${p.conditionsOther}` : ""}</Field>}
            {p.symptoms.length > 0 && <Field label="Symptoms">{p.symptoms.join(", ")}</Field>}
            {p.symptomDuration && <Field label="Symptom duration">{p.symptomDuration}</Field>}
            {p.goals.length > 0 && <Field label="Goals">{p.goals.join(", ")}</Field>}
            {p.additionalNotes && <Field label="Notes">{p.additionalNotes}</Field>}

            <div className="h-px bg-border" />
            <Field label="Consent">
              Educational info: {p.consentTreatmentInfo ? "Yes" : "No"} · Privacy: {p.consentPrivacy ? "Yes" : "No"} · Contact: {p.consentContact ? "Yes" : "No"}
            </Field>
            <Field label="Submitted">{fmt(p.submittedAt)}</Field>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------- Leads -------------------------------- */

function LeadsTab() {
  const [status, setStatus] = useState<WorkflowStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const list = trpc.admin.listLeads.useQuery({ status: status === "all" ? undefined : status });

  const exportCsv = trpc.admin.exportLeads.useMutation({
    onSuccess: (res) => {
      if (!res.count) return toast.info("No records to export");
      downloadCsv(res.csv, `leads-${Date.now()}.csv`);
      toast.success(`Exported ${res.count} record(s)`);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <FilterSelect value={status} onChange={setStatus} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-press border-border" disabled={exportCsv.isPending} onClick={() => exportCsv.mutate({ status: status === "all" ? undefined : status })}>
            {exportCsv.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />} Export CSV
          </Button>
          <Button variant="outline" size="sm" className="btn-press border-border" onClick={() => list.refetch()}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <RecordTable
        loading={list.isLoading}
        rows={list.data ?? []}
        emptyLabel="No leads captured yet."
        onOpen={setOpenId}
        showSource
      />

      <LeadDrawer
        publicId={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => {
          utils.admin.listLeads.invalidate();
          utils.admin.dashboardCounts.invalidate();
        }}
      />
    </div>
  );
}

function LeadDrawer({ publicId, onClose, onChanged }: { publicId: string | null; onClose: () => void; onChanged: () => void }) {
  const detail = trpc.admin.getLead.useQuery({ publicId: publicId ?? "" }, { enabled: !!publicId });
  const setStatus = trpc.admin.setLeadStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      detail.refetch();
      onChanged();
    },
    onError: (e) => toast.error(e.message),
  });
  const p = detail.data?.payload;

  return (
    <Sheet open={!!publicId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif">Lead</SheetTitle>
          <SheetDescription>Reference {publicId}</SheetDescription>
        </SheetHeader>
        {detail.isLoading && <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
        {p && detail.data && (
          <div className="mt-6 space-y-5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Select value={detail.data.status} onValueChange={(v) => publicId && setStatus.mutate({ publicId, status: v as WorkflowStatus })}>
                <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Field label="Name">{p.name}</Field>
            <Field label="Email">{p.email}</Field>
            {p.phone && <Field label="Phone">{p.phone}</Field>}
            <Field label="Interest">{TREATMENT_INTEREST_LABELS[detail.data.treatmentInterest]}</Field>
            <Field label="Source">{detail.data.source}</Field>
            {p.message && <Field label="Message">{p.message}</Field>}
            <Field label="Consent to contact">{p.consentContact ? "Yes" : "No"}</Field>
            <Field label="Submitted">{fmt(p.submittedAt)}</Field>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------- Audit log ------------------------------ */

function AuditTab() {
  const logs = trpc.admin.listAuditLogs.useQuery({ limit: 200 });
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.isLoading && (
            <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
          )}
          {logs.data?.length === 0 && (
            <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No audit entries yet.</TableCell></TableRow>
          )}
          {logs.data?.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{fmt(l.createdAt)}</TableCell>
              <TableCell className="text-xs">{l.actorName ?? l.actorOpenId ?? "—"}</TableCell>
              <TableCell className="text-xs"><code className="rounded bg-muted px-1.5 py-0.5">{l.action}</code></TableCell>
              <TableCell className="text-xs">{l.targetId ?? l.targetType}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{l.detail ?? ""}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ------------------------------- Shared UI ------------------------------ */

function FilterSelect({ value, onChange }: { value: WorkflowStatus | "all"; onChange: (v: WorkflowStatus | "all") => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as WorkflowStatus | "all")}>
      <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

type Row = {
  publicId: string;
  treatmentInterest: keyof typeof TREATMENT_INTEREST_LABELS;
  status: WorkflowStatus;
  source?: string;
  createdAt: Date | string | number;
};

function RecordTable({
  loading,
  rows,
  emptyLabel,
  onOpen,
  showSource,
}: {
  loading: boolean;
  rows: Row[];
  emptyLabel: string;
  onOpen: (id: string) => void;
  showSource: boolean;
}) {
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Interest</TableHead>
            {showSource && <TableHead>Source</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow><TableCell colSpan={showSource ? 6 : 5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" /></TableCell></TableRow>
          )}
          {!loading && rows.length === 0 && (
            <TableRow><TableCell colSpan={showSource ? 6 : 5} className="py-10 text-center text-muted-foreground">{emptyLabel}</TableCell></TableRow>
          )}
          {rows.map((r) => (
            <TableRow key={r.publicId}>
              <TableCell className="font-mono text-xs">{r.publicId}</TableCell>
              <TableCell className="text-sm">{TREATMENT_INTEREST_LABELS[r.treatmentInterest]}</TableCell>
              {showSource && <TableCell className="text-xs text-muted-foreground">{r.source}</TableCell>}
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{fmt(r.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="btn-press border-border" onClick={() => onOpen(r.publicId)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{children}</p>
    </div>
  );
}

function Flag({ v, danger }: { v: string; danger?: boolean }) {
  return <span className={danger ? "font-medium text-[color:var(--garnet)]" : ""}>{v}</span>;
}
