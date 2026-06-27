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

## Enhancement: tier triage + quiz confirm + conversion events (requested)
- [x] Admin Leads: add a Tier filter (dropdown of known tiers + "Any") and a sortable Tier column for triage
- [x] Quiz review step: surface the selected tier (from notes/param) so visitors confirm it before submitting
- [x] Lightweight conversion event on "Book this tier" / "Check eligibility for this tier" clicks (tier + source captured server-side)
- [x] Admin view for tier-conversion events (counts by tier) + vitest coverage

## Enhancement: tier-interest date range filter (requested)
- [x] Add date-range filter (7d / 30d / 90d / All time) to admin "Tier interest" tab; server-side aggregation respects the range + vitest coverage

## Enhancement: per-page SEO + sitemap/robots (requested)
- [x] Add per-route document head (title + meta description) for EBO3, Plasmapheresis, Learn pages via a reusable SEO/head helper
- [x] Add descriptive alt text to all images on EBO3, Plasmapheresis, Learn pages (and shared components used there)
- [x] Add public/robots.txt (allow crawl + sitemap reference)
- [x] Add public/sitemap.xml covering funnel pages (/, /eboo, /plasmapheresis, /learn, /eligibility, /partners, /privacy, /terms)

## Enhancement: JSON-LD + sitemap freshness (requested)
- [x] Add site-wide MedicalBusiness JSON-LD (name, url, phone, email, areaServed, etc.)
- [x] Add per-article Article JSON-LD on Learning Center article pages (headline, datePublished/dateModified, author, publisher, mainEntityOfPage)
- [x] Update sitemap.xml to use bound custom domain (rebootblood.manus.space) and add <lastmod> dates

## Enhancement: FAQPage JSON-LD + canonical (requested)
- [x] Add FAQPage JSON-LD to EBO3 (/eboo) and Plasmapheresis (/plasmapheresis) built from existing FAQ content
- [x] Add per-route <link rel="canonical"> via the useSeo hook (absolute URL from SITE.url + current path)

## Enhancement: complete canonical coverage (gap fix)
- [x] Derive canonical origin in useSeo.ts from SITE.url (single source of truth) instead of a hardcoded string
- [x] Add useSeo (title + description + canonical) to Home, Eligibility, Partners, Privacy, Terms
- [x] Fix empty alt on Partners clinic-interior hero image
- [x] Verify per-route canonical output on /, /partners, /privacy (and existing /eboo, /plasmapheresis, /learn, article)

## Enhancement: SEO-targeted EBOO pages (Las Vegas keyword strategy, requested)
- [x] Optimize /eboo hub meta (title/description) for "eboo therapy / eboo treatment" + add synonym line (EBO2/EBO3/blood oil change)
- [x] Add EBOO cost page (/eboo/cost) targeting eboo treatment cost / eboo therapy cost / eboo cost / ebo2 therapy cost
- [x] Add EBOO near-me / Las Vegas local page (/eboo/las-vegas) with MedicalBusiness/MedicalClinic JSON-LD (address, areaServed, geo, telephone)
- [x] Add Learn page: what-is-eboo-therapy (FAQPage JSON-LD)
- [x] Add Learn page: ebo2-vs-eboo comparison (introduces/brands EBO3 tier)
- [x] Add Learn page: blood-oil-change curiosity->conversion bridge
- [x] Register all new routes + nav links, update sitemap.xml, typecheck + tests, verify live, checkpoint

## Enhancement: custom domain www.rebootblood.clinic + nav + local FAQ (requested)
- [x] Update SITE.url / canonical origin to https://www.rebootblood.clinic across SITE constants + useSeo
- [x] Update sitemap.xml URLs to www.rebootblood.clinic (+ refresh lastmod) and robots.txt sitemap reference
- [x] Update any JSON-LD absolute URLs (MedicalBusiness/MedicalClinic url, logo, sameAs) to the new domain
- [x] Grep for any remaining manus.space references in client code and fix (none remain)
- [x] Add "Cost" + "Locations" nav entries (EBOO submenu) reachable from every page
- [x] Add neighborhood FAQ ("Do you serve Henderson/Summerlin?") on /eboo/las-vegas with FAQPage JSON-LD
- [x] Update contact email to care@rebootblood.clinic site-wide
- [x] Remove all published clinic phone references (display, tel: links, JSON-LD telephone, CTAs) — kept lead-form phone input + consent wording per user
- [x] Typecheck + tests + verify live, save checkpoint
- [x] Guide user through publish + Google Search Console sitemap submission

## Bugfix: strip OAuth params (?code=, state, etc.) from address bar after login (requested)
- [ ] Add pure, tested helper stripAuthParamsFromUrl(url) in shared/ that removes code/state/scope/authuser/prompt/error/error_description, preserves other params + hash
- [ ] Call it via history.replaceState on mount in SiteLayout (public routes) and DashboardLayout (admin)
- [ ] Add vitest coverage for the helper
- [ ] Typecheck + tests, verify in preview, save checkpoint

## Integration: LinkArtemis article sync -> Learning Center (review-before-publish) (requested)
- [ ] Store LINKARTEMIS_API_KEY as a server-side secret (not exposed to client)
- [ ] Read references/periodic-updates.md before building the scheduled sync
- [ ] Add la_articles table (la_id, title, slug, excerpt, meta_description, hero_image_url, keywords, language_code, content_html, content_markdown, status: pending/published/hidden, syncedAt, publishedAt)
- [ ] Server: LinkArtemis API client (list + detail) using X-API-Key, with rate-limit/error handling
- [ ] Server: sync helper that upserts new completed articles as status=pending; pure mapping helper unit-tested
- [ ] tRPC adminProcedure: la.sync (manual trigger), la.list (by status), la.setStatus (publish/hide)
- [ ] Public tRPC: list published la_articles + get by slug for Learning Center
- [ ] Admin UI: "Synced articles" tab with Sync now, preview, Publish/Hide actions
- [ ] Learning Center: render published synced articles via existing ArticleLayout (SEO/JSON-LD + medical disclaimer)
- [ ] Scheduled daily sync (heartbeat) pulling new articles into pending queue
- [ ] tsc + vitest, verify live sync (0 articles today -> empty state), checkpoint

## Integration: LinkArtemis article sync -> Learning Center (review-before-publish) (requested)
- [ ] Store LINKARTEMIS_API_KEY as a server-side secret (not exposed to client)
- [ ] Read references/periodic-updates.md before building the scheduled sync
- [ ] Add la_articles table + server client + sync helper (pending queue)
- [ ] tRPC admin: la.sync / la.list / la.setStatus; public: list published + get by slug
- [ ] Admin UI "Synced articles" tab + render published in Learning Center via ArticleLayout
- [ ] Scheduled daily sync; tsc + vitest; verify live; checkpoint

## Bug: "Book Consultation" button does nothing on /#contact (requested)
- [ ] Reproduce on home + other pages, find why #contact does not scroll to contact form
- [ ] Fix navbar/CTA so Book Consultation reliably scrolls to / navigates to the contact section
- [ ] Verify in preview on home and a sub-page; checkpoint

## Notification content: push contact + intent to owner (care@rebootblood.clinic) — Option 1
- [x] Fix "Book Consultation" scroll-to-#contact across all CTAs (shared goToContact helper)
- [x] Build a shared notification-body formatter (contact + intent; exclude sensitive health-screening answers for questionnaire)
- [x] submitLead: include name, email, phone, interest, source, selected tier, message in notification body
- [x] submitQuestionnaire: include name, email, phone, preferred contact, location, age, interest, EBO3 volume, goals + note that health screening answers are in the secure dashboard
- [x] Guide form ("Talk to Our Team") routes through submitLead — covered by the same formatter
- [x] Unit tests for the notification-body formatter (4 tests; verifies health answers excluded)
- [x] tsc + vitest green (47 tests); checkpoint
