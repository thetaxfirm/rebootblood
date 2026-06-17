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
- [ ] (Optional) Audited CSV export flow for submissions/leads from admin dashboard
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
- [ ] Checkpoint + deliver with HIPAA compliance documentation

## Exact-string constraints (must verify)
- [x] Device name appears exactly: "EBOO O3 Research Device 2026"
- [x] Tier names appear exactly: "Core" and "Complete"
