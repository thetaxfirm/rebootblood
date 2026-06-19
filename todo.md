# rEBOOtBlood.com — Project TODO

## Design System & Theming
- [x] Premium dark editorial theme (garnet/ink base, gold accent, Fraunces serif + Inter sans pairing)
- [x] Global tokens in index.css + Google Fonts in index.html
- [x] Shared section/layout primitives, animations under 300ms with custom easing

## Public Funnel Pages
- [x] Top navigation with logo, treatment links, phone, "Book Consultation" CTA
- [x] Hero landing: bold headline, dual-treatment overview, CTAs "Book Consultation" + "Take Eligibility Quiz"
- [x] EBO3/EBOO detail: 3-step process, EBOO O3 Research Device 2026 specs, benefits, conditions, pricing
- [x] EBO3/EBOO Safety & Contraindications section (absolute: G6PD deficiency; relative list; screening; short-term effects; when to seek urgent care; references)
- [x] EBO3/EBOO "How to Prepare for Your Session" section (consult, G6PD test, pause blood thinners, hydrate, light meal, dress, rest, disclose illness, ask questions)
- [x] Plasmapheresis detail: procedure explained, 4-step clinical path, Core & Complete tiers, pricing
- [x] Treatment FAQ accordions (one per treatment)
- [x] Lead capture / gated guide form ("Talk to Our Team") — owner notification on every submit (HARD REQ)
- [x] Booking CTA sections throughout: phone number + contact form + "Request Appointment" flow
- [x] Why choose us / trust section (value strip on home)
- [x] Medical disclaimer + compliance footer (educational-only, FDA disclaimer, assumption-of-risk, privacy/terms links) — all 4 required
- [x] Privacy Policy page
- [x] Terms of Service page

## Eligibility Questionnaire (multi-step)
- [x] Step: health history
- [x] Step: conditions
- [x] Step: symptoms
- [x] Step: treatment goals
- [x] Step: contact information
- [x] Explicit, separately-labeled consent checkboxes (NOT bundled into submit) (HARD REQ)
- [x] Consent language aligned with informed-consent doc + note that formal informed consent is signed in-clinic with provider
- [x] Progress indicator + validation + review/submit

## HIPAA-aligned Backend
- [x] Encrypt all questionnaire submissions at rest (AES-256-GCM, app-layer)
- [x] Encrypt lead capture PII at rest
- [x] Role-based access control — admin only can view patient data
- [x] Audit log table: record every access (view/list/decrypt/status) event with actor, target, action, timestamp, hashed IP (IP hashed by design so the audit log itself stores no raw PII)
- [x] Audited CSV export flow for submissions/leads from admin dashboard (every export logged)
- [x] Owner notification fires on every lead capture submission (HARD REQ)
- [x] Owner notification on questionnaire submission (operational alert)

## Admin Dashboard
- [x] Admin-only route guard
- [x] List + filter questionnaire submissions
- [x] Detail view (decrypts on access, writes audit log)
- [x] View lead capture submissions
- [x] Audit log viewer
- [x] Submission status management

## Testing & Delivery
- [x] Vitest: encryption round-trip
- [x] Vitest: RBAC enforcement (non-admin blocked)
- [x] Vitest: audit log written on access
- [x] Vitest: owner notification fires on lead submit
- [x] Vitest: questionnaire submission persists encrypted
- [x] Verify flows + screenshots
- [x] End-to-end live submit test (questionnaire + lead) — owner notification confirmed; DB scan shows 0 plaintext leaks
- [x] Checkpoint + deliver with HIPAA compliance documentation

## Exact-string constraints (must verify)
- [x] Device name appears exactly: "EBOO O3 Research Device 2026"
- [x] Tier names appear exactly: "Core" and "Complete"

## Enhancement: EBO3 volume selector, pricing, aftercare (requested)
- [x] EBO3 volume selector (3L / 4.5L / 6L) updating duration + price together
- [x] Apply pricing: single $1000/$1250/$1500; pkg3 $2700/$3300/$3750; pkg6 $4500/$5500/$6600
- [x] Show session length in pricing cards
- [x] Pass chosen volume into eligibility questionnaire (prefill via ?volume=)
- [x] Aftercare / what-to-expect section (post-session recovery window)

## Enhancement: Learning Center hub
- [x] /learn index page (hub) listing pillars + spokes, linked from navbar + footer
- [x] Pillar: What is EBO3/EBOO blood therapy (/learn/ebo3-eboo-blood-therapy)
- [x] Pillar: UVBI explained (/learn/uvbi-ultraviolet-blood-irradiation)
- [x] Pillar: Plasmapheresis & TPE (/learn/plasmapheresis-tpe)
- [x] Pillar: EBOO vs EBO2 vs EBO3 vs ozone IV (/learn/eboo-comparison-guide)
- [x] Condition spokes (7) mapped to questionnaire, each deep-linking quiz ?condition=
- [x] Article layout component (hero, body, medical-review/last-updated, FAQ, CTA into quiz)
- [x] FAQ accordions + non-claim/FDA disclaimer on every article
- [x] Internal linking: spokes->pillar, pillar->quiz/treatment
- [x] Research & Publications section: ozonedoctor.net papers + jmedicalcasereports.org case report, cited with honest framing, linking to source PDFs

## Enhancement: Partner program
- [x] Partner recruitment page (/partners) with sales-sheet content + apply CTA (routes to submitLead source=partner_inquiry)
- [x] Interactive partner economics calculator (price/volume, COGS, nurse time, utilization -> clinic & MSO split) at /calculator + embedded in /partners
- [x] Standalone partner sales sheet + outreach email doc (delivered as file: Partner-Outreach-Kit.md)

## Enhancement: Learning Center additional publications + partner refinements (requested)
- [x] Add 6 peer-reviewed ozone publications (chemo toxicity, asthma, musculoskeletal, CRPS, COVID-19 pneumonia, PAD) with verified citations + honest framing
- [x] Centralize calculator default revenue share in one place (PARTNER_PROGRAM.defaultRevenueSharePct in site.ts)
- [x] Add "Terms vary by market" note near the economics calculator
- [x] Separate partner_inquiry leads from patient leads in admin dashboard (sub-tabs + sourceGroup filter, scoped CSV export)
- [x] Vitest: leadMatchesSourceGroup separates partner inquiries from patient leads
- [x] Add "last reviewed" date to each publication card (PUBLICATIONS_LAST_REVIEWED constant + optional per-entry override)
- [x] Update Core plasmapheresis price to $6,500
- [x] Show both Core & Complete pricing tiers on Home page (shared PLASMAPHERESIS_TIERS in site.ts as single source of truth, consumed by Home + Plasmapheresis)
- [x] Add EBO3 pricing block on Home (3 volume tiers w/ from-price, duration, packages; shared EBO3_VOLUME_TIERS in site.ts consumed by Home + Eboo)
- [x] Deep-link Home pricing blocks to matching sections (/eboo#pricing, /plasmapheresis#pricing) via shared scroll-on-hash in SiteLayout + id="pricing" anchors
- [x] "Book this tier" buttons in all pricing sections (Home EBO3 + plasmapheresis, Eboo, Plasmapheresis) deep-linking to /#contact with ?interest= & ?tier= prefilled; ContactSection reads params synchronously to pre-select dropdown + prefill message + show selected chip

## Enhancement: tier persistence + UX polish + quiz pass-through (requested)
- [x] Persist selected tier into lead record (selectedTier in leadSchema + plaintext column) and show it in admin Leads list, detail, CSV export, and owner notification
- [x] Add subtle highlight + scroll-focus on the prefilled contact dropdown when arriving via a "Book this tier" link
- [x] Carry tier/volume through the Eligibility Quiz funnel (quiz reads ?interest=&tier=&volume=; tier persisted into submission notes)
- [x] Add real quiz entry points: "Check eligibility for this tier" links on every EBO3 + plasmapheresis pricing card -> /eligibility?interest=&volume=&tier=
- [x] Extract quiz prefill into pure shared/quizPrefill.ts helper (fills only empty fields, explicit interest overrides volume-implied)
- [x] Added vitest coverage: selectedTier persists on lead + surfaces to admin; quizPrefill helper pass-through (25 tests pass)
