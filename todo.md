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
- [x] Add pure, tested helper stripAuthParams in shared/stripAuthParams.ts (removes code/state/scope/authuser/prompt/error/error_description, preserves other params + hash)
- [x] Call it via history.replaceState on mount in SiteLayout (public routes) and Admin (admin)
- [x] Added vitest coverage for the helper
- [x] tsc + vitest green; checkpoint f7d06781

## Integration: LinkArtemis article sync -> Learning Center (SUPERSEDED — see "Option A" + auto-publish + daily cron sections below)
- [x] Store LINKARTEMIS_API_KEY as a server-side secret (env.ts wiring)
- [x] Daily auto-sync built per periodic-updates pattern: POST /api/scheduled/syncLinkArtemis in server/_core/scheduled.ts, mounted in server/_core/index.ts before Vite fallthrough
- [x] synced_articles table (remote id, slug, title, excerpt, meta_description, hero image, keywords, content_html, status, source, timestamps) + migration pushed
- [x] Server LinkArtemis API client (list + detail) with error handling (server/_core/linkartemis.ts)
- [x] Sync helper: idempotent upsert-by-remote-id; pure mapping helper unit-tested
- [x] tRPC adminProcedure: content.runSync / content.listSynced / content.setStatus (audit-logged)
- [x] Public tRPC: content.listPublished + content.getPublishedBySlug for Learning Center
- [x] Admin "Articles" tab: Sync now, preview drawer, Publish/Hide/Re-queue
- [x] Learning Center: render published synced articles via SyncedArticleLayout (SEO/JSON-LD + medical disclaimer)
- [x] Scheduled daily sync (heartbeat) — POST /api/scheduled/syncLinkArtemis, daily cron created (task_uid MBsuHnFDuvYQDaLK4tpNnf, 09:00 UTC)
- [x] tsc + vitest green; live sync verified end-to-end; checkpoint eb4eaedd

## Integration: LinkArtemis article sync (DUPLICATE — fully covered by the sections above and below)
- [x] Store LINKARTEMIS_API_KEY as a server-side secret (done)
- [x] Daily auto-sync handler + cron created (done; see section above)
- [x] synced_articles table + server client + sync helper (done)
- [x] tRPC admin: runSync / listSynced / setStatus; public: listPublished + getPublishedBySlug (done)
- [x] Admin "Articles" tab + render published in Learning Center (done)
- [x] Scheduled daily sync; tsc + vitest; verified live; checkpoint eb4eaedd

## Bug: "Book Consultation" button does nothing on /#contact (requested) (FIXED — see goToContact helper)
- [x] Implemented shared goToContact() helper (client/src/lib/goToContact.ts) for reliable scroll/navigate to #contact
- [x] Wired goToContact() across all CTAs: Navbar, Home, Eboo, Plasmapheresis, Learn, EbooCost, CtaBand, ArticleLayout, Eligibility
- [x] Checkpoint f7d06781 saved after wiring goToContact across all CTAs

## Notification content: push contact + intent to owner (care@rebootblood.clinic) — Option 1
- [x] Fix "Book Consultation" scroll-to-#contact across all CTAs (shared goToContact helper)
- [x] Build a shared notification-body formatter (contact + intent; exclude sensitive health-screening answers for questionnaire)
- [x] submitLead: include name, email, phone, interest, source, selected tier, message in notification body
- [x] submitQuestionnaire: include name, email, phone, preferred contact, location, age, interest, EBO3 volume, goals + note that health screening answers are in the secure dashboard
- [x] Guide form ("Talk to Our Team") routes through submitLead — covered by the same formatter
- [x] Unit tests for the notification-body formatter (4 tests; verifies health answers excluded)
- [x] tsc + vitest green (47 tests); checkpoint


## Integration: LinkArtemis article sync (Option A — review-before-publish)
- [x] Add `synced_articles` DB table (remote id, slug, title, excerpt, meta_description, hero image, keywords, content_html, status pending/published/hidden, source, timestamps, lastSyncedAt) + push migration
- [x] Store `LINKARTEMIS_API_KEY` as a server secret (env.ts wiring)
- [x] Server LinkArtemis client (list + get) in server/_core/linkartemis.ts
- [x] Pure HTML sanitizer for incoming article HTML (allowlist tags/attrs, strip scripts) — sanitize-html
- [x] db.ts helpers: upsertSyncedArticle, listSyncedArticles, getPublishedSyncedArticleBySlug, setSyncedArticleStatus
- [x] Pure sync mapper + idempotent upsert-by-remote-id helper (tests)
- [x] tRPC admin procedures: content.listSynced, content.runSync, content.setStatus (audit-logged); public content.getPublishedBySlug + content.listPublished
- [x] Mount content router in routers.ts
- [x] Unit tests: sanitizer, sync mapper/upsert, slug-namespacing/collision guard, status transitions (18 unit + 1 live)
- [x] Admin "Articles" tab: Sync now, list, preview drawer, Publish/Hide/Re-queue
- [x] Learning Center: render published synced articles ("From our blog" section + /learn/:slug sanitized-HTML renderer w/ SEO + JSON-LD + disclaimer); hand-authored slugs take priority
- [x] Verify tsc + vitest (66 tests); live sync run (fetched 1, inserted 1, published + public read OK); checkpoint; report
- [x] (Follow-up DONE) Scheduled daily auto-sync via heartbeat implemented: POST /api/scheduled/syncLinkArtemis + daily cron (task_uid MBsuHnFDuvYQDaLK4tpNnf, 09:00 UTC), verified end-to-end; checkpoint eb4eaedd

## Content: adapt "Is EBOO Therapy Safe?" article from myrevived.com (review-before-publish, requested)
- [x] Rewrite article to rebootblood voice; removed other clinic name, address, phone, Dr. name, outbound links/images (banned-term scan clean)
- [x] Keep safety/FDA framing + contraindications + FAQ; aligned disclaimer (educational, non-claim, investigational)
- [x] Insert as a PENDING article in the review queue (source=manual) so user reviews before publishing
- [x] Verified stored + listed as pending; renders at /learn/is-eboo-therapy-safe-fda-risks once published (slug router serves any published synced article); NOT auto-published
- [x] No source code changed (data-only insert via existing helpers); tsc/tests unaffected; checkpoint; report

## Feature: daily LinkArtemis auto-sync (Heartbeat cron, review-before-publish preserved)
- [x] Add /api/scheduled/syncLinkArtemis handler: cron-auth (sdk.authenticateRequest, user.isCron), inline syncLinkArtemis(), idempotent, try/catch JSON error
- [x] Mount handler in server/_core/index.ts before Vite/static fallthrough (verified: POST returns 403 for non-cron)
- [x] Unit test for the handler (4 tests: rejects non-cron, auth-throw, runs sync, 500 JSON error)
- [x] tsc clean + vitest green (70 tests)
- [x] Checkpoint; user deployed (published to production)
- [x] Created daily cron via manus-heartbeat (0 0 9 * * * UTC, task_uid MBsuHnFDuvYQDaLK4tpNnf, enabled); verified end-to-end with a one-time trigger (HTTP 200, summary fetched=1 updated=1 errors=0) then deleted the temp cron; prod endpoint guarded (403 unauth)

## Change: auto-publish synced articles (Option b)
- [x] Sync upsert: force status=published on insert AND on update (overrides pending/hidden) — Option b
- [x] Set publishedAt when auto-publishing if not already set (preserves earlier publish time)
- [x] Keep admin Hide control (manual Hide still works post-publish); updated Articles tab copy to reflect auto-publish
- [x] tsc clean + vitest green (70 tests); sync test still valid (injects own upsert stub)
- [x] Ran live sync: LinkArtemis article auto-published; manual "Is EBOO Therapy Safe?" published; both render at /learn/:slug (verified screenshots)
- [x] Checkpoint; ask user to redeploy (auto-publish change must ship to prod for the daily cron); report

## SEO: OG/Twitter tags + BreadcrumbList JSON-LD
- [x] Extend useSeo hook: emit og:* (title/description/type/url/image/site_name) + twitter:* (card/title/description/image) tags; manage/cleanup on unmount
- [x] Allow useSeo to accept multiple JSON-LD blocks (existing Article/Medical + new BreadcrumbList)
- [x] Hand-authored ArticleLayout: add OG/Twitter (article type, hero image) + BreadcrumbList (Home > Learning Center > article)
- [x] SyncedArticleLayout: add OG/Twitter (hero image) + BreadcrumbList
- [x] Use absolute URLs (https://www.rebootblood.clinic) for og:url/og:image/breadcrumb items (verified absolute in rendered DOM)
- [x] Added OG/Twitter to all public pages (every page calls useSeo → gets defaults); BreadcrumbList on Learn index
- [x] Extracted pure helpers to shared/seo.ts; unit-tested (8 tests: toAbsoluteUrl, buildBreadcrumbJsonLd, buildFaqJsonLd)
- [x] tsc clean + vitest green (78 tests); verified rendered <meta>/<script> via CDP on 3 pages (article: MedicalBusiness+Article+BreadcrumbList, 6 OG + 4 Twitter); checkpoint; report

## Content: adapt & publish 10 eboomedical.com articles (Option A — non-claim voice, cite author; skip 2 off-brand)
- [x] Skip off-brand: "Joe Rogan-linked clinic / BJJ star" (anti-EBOO + names competitor) and "Orlando Bloom" (promotes competing UK clinic)
- [x] does-eboo-treatment-really-work — adapted non-claim, cited Kim Look, inserted (slug does-eboo-really-work)
- [x] observed-reduction-in-urinary-toxin-eboo — case-report summary, cited source, inserted (slug eboo-urinary-toxin-case-report)
- [x] clinical-and-biological-implications-of-eboo-ozone-therapy — cited Di Paolo/Gaggiotti/Galli (PMID 16156950), inserted (slug eboo-clinical-biological-implications)
- [x] bryce-harper-tries-eboo-therapy — adapted, removed individual name + other-clinic identifiers, inserted (slug eboo-athlete-wellness-spotlight)
- [x] changing-the-game-for-sports-injury-recovery — adapted non-claim, inserted (slug athletes-and-eboo-recovery-trend)
- [x] eboo-therapy-as-the-oil-change-for-the-body — adapted non-claim, removed named physician/clinic, inserted (slug eboo-blood-oil-change-explainer)
- [x] does-eboo-remove-heavy-metals — adapted to investigational framing, inserted (slug eboo-remove-heavy-metals)
- [x] eboo-therapy-for-lyme-disease — adapted non-claim, cited source, inserted (slug eboo-and-lyme-supportive-care)
- [x] eboo-uv-light-therapy — softened aggressive stats, cited Biana Borchenko, inserted (slug eboo-uv-light-therapy-explained)
- [x] who-invented-eboo-therapy — adapted history piece, cited Ralph Montague, inserted (slug who-invented-eboo-therapy)
- [x] Verified render at /learn/:slug with disclaimer + author citation; competitor/celebrity names removed; tsc clean
- [x] Checkpoint fb2157d3 + report


## Content: publish 10 adapted eboomedical.com articles to Learning Center (requested)
- [x] Fetched all 12 source articles; identified authors (Kim Look, Jason DeLeon, Ralph Montague, Biana Borchenko; Di Paolo et al. for the research abstract)
- [x] User chose Option A (adapt to non-claim voice) and skip off-brand pieces
- [x] Skipped 2 off-brand posts (Joe Rogan/BJJ piece critical of EBOO + names competitor Ways2Well; Orlando Bloom piece promoting Clarify Clinics)
- [x] Added LearnByline type + optional byline field to LearnArticle in client/src/lib/learn.ts
- [x] Authored 10 adapted articles in EXTERNAL_ARTICLES (non-claim voice, competitor/celebrity names removed, FDA/educational framing); added to ALL_ARTICLES for routing
- [x] Rendered "Source & attribution" citation block in ArticleLayout when byline present
- [x] Surfaced articles in new "More on EBOO" section on Learn index (Learn.tsx)
- [x] tsc --noEmit clean; verified /learn index + 2 article pages render with citation + disclaimer via screenshot


## Integration: GoDaddy REST API (DNS + availability + registration) (requested)
- [x] Validate GoDaddy credentials against production API (domains list, availability, DNS records all HTTP 200)
- [x] Store GODADDY_API_KEY + GODADDY_API_SECRET as project secrets (server-side only); env.ts wired
- [x] Build GoDaddy API client (server/_core/godaddy.ts): list domains, check availability, suggest, get/replace/add DNS records
- [x] tRPC adminProcedure router (server/routers/godaddy.ts): status, listDomains, checkAvailability, suggestDomains, getRecords, replaceRecords, addRecords; wired into appRouter
- [x] Admin UI: "Domains" tab in /admin (domains list, availability search + suggestions, DNS record viewer + add-record form)
- [x] Vitest: pure helpers (auth header, hasCredentials, validateDnsRecord) + LIVE credential validation against production API (4/4 pass)
- [x] tsc clean + vitest green (82 tests incl. live GoDaddy auth); verified Domains tab renders in /admin; checkpoint + report
- Note: domain registration/purchase intentionally NOT one-click (avoids accidental charges); done on request


## SEO: enforce www as canonical host (requested)
- [x] Add pure helper canonicalRedirectTarget + canonicalHostRedirect middleware (server/_core/canonicalHost.ts): apex rebootblood.clinic -> 301 https://www.rebootblood.clinic, preserves path+query; leaves www / *.manus.space / localhost untouched
- [x] Wire middleware first in server/_core/index.ts (before body parser/routes)
- [x] Vitest coverage (server/canonicalHost.test.ts)
- [x] tsc clean + vitest green (91 tests incl. 9 canonicalHost); checkpoint saved
- [ ] User publishes; then re-verify apex->www 301 live after publish


## Email: automated delivery to care@rebootblood.clinic (requested)
- [x] Store SMTP_USER + SMTP_APP_PASSWORD as project secrets; add to env.ts
- [x] Install nodemailer; create email helper (server/_core/email.ts): Google Workspace SMTP, formatLeadEmail, formatQuestionnaireEmail
- [x] Wire sendEmail into submitLead + submitQuestionnaire (non-PHI contact + intent only; health-screening answers excluded per HIPAA)
- [x] Vitest: 4 formatter tests + LIVE SMTP credential verification (5/5 pass)
- [x] tsc clean + 96 tests pass; checkpoint
