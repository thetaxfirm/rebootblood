# rEBOOtBlood.com — HIPAA Alignment & Operations Guide

This document explains what was built, the security measures implemented, how to operate the site, and — importantly — **what you must finalize on the legal and vendor side before collecting real patient health information (PHI).**

---

## 1. What the site includes

**Public funnel**
- Home / hero with dual-treatment overview and the two primary CTAs ("Book Consultation" and "Take Eligibility Quiz").
- **EBO3 / EBOO** page: 3-step process, the real **EBOO O3 Research Device 2026** photo with full specs (dual-mode 1–35 gamma, ISO 13485, PES H200 high-flux dialyzer, 5-lamp UVBI chamber, full safety suite, touchscreen), benefits, conditions explored, a **Safety & Contraindications** section, a **How to Prepare** section, transparent pricing, and an FAQ accordion.
- **Plasmapheresis** page: procedure explanation, 4-step clinical path, **Core** and **Complete** program tiers, pricing, and an FAQ accordion.
- Lead-capture "guide" form and recurring "Request Appointment" booking sections (phone + contact form) throughout.
- Compliance footer with all four required elements: educational-only notice, FDA disclaimer, assumption-of-risk language, and Privacy Policy / Terms links.
- Privacy Policy and Terms of Service pages (template copy — have counsel review).

**Multi-step eligibility questionnaire** (`/eligibility`)
- Five steps: health history → conditions → symptoms → goals → details & consent.
- Progress bar, per-step validation, and three **separate, individually-labeled consent checkboxes** that each must be checked before submission.

**Care-team console** (`/admin`)
- Admin-only. View/filter questionnaire submissions and leads, open a record (decrypts PHI on demand), manage status, and review the audit log.

---

## 2. Technical safeguards implemented

| Safeguard | Implementation |
|---|---|
| **Encryption at rest** | All questionnaire and lead PHI/PII is encrypted with **AES-256-GCM** at the application layer before it touches the database. The DB stores only ciphertext + a random IV + auth tag. A live database scan confirmed **0 rows leaking plaintext**. |
| **Encryption key** | Stored as the `PHI_ENCRYPTION_KEY` secret (never in code). Rotatable. |
| **Role-based access control** | Patient data endpoints use an `adminProcedure`. Anonymous and non-admin authenticated users are blocked (verified by automated tests). |
| **Audit logging** | Every list, view/decrypt, and status change on patient data writes an immutable audit row: actor, action, target, timestamp, hashed IP, user agent. The IP is **hashed** so the audit log itself stores no raw identifier. |
| **Owner notification** | Every lead submission fires an owner notification automatically (`notified: true` confirmed end-to-end). Questionnaire submissions also notify the owner as an operational alert. |
| **Minimal exposure** | List views show only a reference ID, treatment interest, status, and timestamp. PHI is decrypted only when a specific record is opened (and that access is audited). |
| **Automated tests** | 13 passing tests cover encryption round-trip + tamper detection, "no plaintext at rest", RBAC enforcement, audit logging, and owner notification. |

---

## 3. What you MUST finalize before handling real PHI

Technical controls are necessary but **not sufficient** for legal HIPAA compliance. Before collecting real patient data:

1. **Business Associate Agreements (BAAs).** You need signed BAAs with every vendor that stores or processes PHI on your behalf — this includes the **hosting/database provider** and any **notification/email/SMS** provider. The default Manus-hosted infrastructure does **not** come with a BAA. Confirm BAA availability with each vendor, or migrate PHI storage to a HIPAA-eligible, BAA-covered environment.
2. **Move the encryption key to a managed KMS** (e.g., AWS KMS / GCP KMS / HashiCorp Vault) and establish a key-rotation policy. The current key is an environment secret, which is good, but a managed KMS with rotation and access logging is stronger.
3. **Admin account governance.** Grant the `admin` role only to authorized, trained staff. Enforce unique individual accounts (no shared logins) so the audit log attributes actions to a real person. Review the audit log regularly.
4. **Notification channel hygiene.** The owner notification should not contain PHI in plaintext over a non-BAA channel. Keep notifications to "new submission received — log in to view" (the current design references records by ID; verify your notification content stays minimal).
5. **Transport security.** Serve the site only over HTTPS (the Manus platform does this). Confirm before launch.
6. **Data-retention & breach policy.** Define how long submissions are retained, how they're disposed of, and your breach-notification procedure. Consider an automated retention/cleanup job (the project supports scheduled jobs).
7. **Legal review of all copy.** The Privacy Policy, Terms, medical disclaimers, pricing, and any health claims should be reviewed by your counsel and medical director. Pricing figures and the conditions list are placeholders/derived from market research — confirm them.
8. **Informed consent.** The website checkboxes capture *acknowledgment* only. Formal informed consent must still be reviewed and signed in-clinic with a licensed provider (the copy already states this).

---

## 4. Operating the site

- **Granting admin access:** A user must sign in once at `/admin` (creating their account), then set their `role` to `admin` in the database (Management UI → Database, or `UPDATE users SET role='admin' WHERE email='...'`). The project owner is admin by default.
- **Where submissions go:** Questionnaire responses appear under **Submissions**; "Talk to Our Team" / "Request Appointment" entries appear under **Leads**. Status can be moved through New → Reviewing → Contacted → Scheduled → Closed.
- **Editing content:** Treatment copy lives in `client/src/pages/Eboo.tsx` and `Plasmapheresis.tsx`; pricing arrays are near the top of each. Brand/contact details (phone, email) are in `client/src/lib/site.ts`.
- **Placeholders to replace before launch:** phone number `(888) 555-0123`, email `care@rebootblood.com`, and all pricing figures.

---

## 5. Disclaimer

This guide is informational and not legal advice. HIPAA compliance is a legal and organizational determination. Engage qualified healthcare-privacy counsel and your vendors to validate compliance before processing real protected health information.
