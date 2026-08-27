# Private Campaign Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add secure private campaign analytics, event/research attribution, network classification, reporting and exports while removing only the public visitor counter.

**Architecture:** A sitewide vanilla-JS tracker POSTs constrained events to Netlify Functions, which enrich and store append-only records in Netlify Blobs. Separate authenticated Functions issue/verify signed HttpOnly admin sessions and provide dashboard reports/CSV; `/admin/analytics.html` contains no secrets and cannot obtain data without the server cookie.

**Tech Stack:** Static HTML/CSS/JS, Node.js Netlify Functions, `@netlify/blobs`, Web Crypto/Node crypto, Netlify environment variables.

**Spec:** `docs/superpowers/specs/2026-08-27-private-campaign-analytics-design.md`

## Global Constraints
- Keep this free; no paid subscription without approval.
- Raw IP retention: maximum 30 days.
- Anonymous/aggregate retention: campaign plus approximately 90 days, subject to free-tier capacity.
- No invasive fingerprinting or individual identification.
- No secrets/passwords/raw analytics data in public code or GitHub.
- Ordinary local ISP/geography must never be labeled RBBCSC without explicit reliable network evidence.
- Donation clicks are not completed donations.
- Preserve existing site, URL, QR destination, forms, donation flow and board-search work.
- Public visitor counter must be removed while private page-view collection continues.

---

### Task 1: Event schema, validation and classification
**Files:** Create `netlify/functions/_analytics-core.js`; create `tests/analytics-core.test.js`.
**Interfaces:** `sanitizeEvent(input)`, `classifyBot(userAgent)`, `classifyNetwork(meta)`, `engagementBucket(seconds)`, `parseAttribution(url,referrer)`.
- [ ] Write failing Node assertions for allowed event fields/lengths, bot UA detection, local-ISP non-RBBCSC behavior, explicit RBBCSC organization association, engagement buckets and UTM/QR attribution.
- [ ] Run `node tests/analytics-core.test.js`; expect module-not-found failure.
- [ ] Implement pure dependency-free helpers; reject unknown oversized payload fields and ignore client IP fields.
- [ ] Run test; expect pass.
- [ ] Commit `feat: add analytics event validation`.

### Task 2: Secure collector and Blob storage
**Files:** Create `netlify/functions/analytics-collect.js`; create `netlify/functions/_analytics-store.js`; create `tests/analytics-collector.test.js`.
**Interfaces:** `appendEvent(event, requestMeta)` stores event by timestamp/random ID in Blob store `private-campaign-analytics`; collector accepts POST only and returns `{ok:true}` without exposing stored data.
- [ ] Test GET rejection, malformed JSON, valid constrained POST, server-derived request metadata and bot flagging with a mocked store.
- [ ] Run test and verify failure.
- [ ] Implement collector/store using `@netlify/blobs`; derive trusted IP/location/network headers/context only server-side; store `rawIpExpiresAt` 30 days from receipt.
- [ ] Run test; expect pass.
- [ ] Commit `feat: collect private campaign analytics`.

### Task 3: Sitewide tracker
**Files:** Create `assets/analytics.js`; modify `netlify/edge-functions/home-enhancements.js`; create `tests/analytics-client.test.js`.
**Interfaces:** `window.CampaignAnalytics.track(name,properties)` POSTs to `/.netlify/functions/analytics-collect`.
- [ ] Test source for anonymous visitor/session IDs, page view, click taxonomy, scroll 25/50/75/100 dedupe, visibility-aware active-time heartbeat/final event, UTM/referrer capture and no fingerprint APIs.
- [ ] Run test; verify failure.
- [ ] Implement tracker and inject/load it sitewide through existing enhancement mechanism without changing campaign layout.
- [ ] Remove rendered public visitor-counter markup/calls while preserving analytics collection.
- [ ] Run client and existing regression tests; expect pass.
- [ ] Commit `feat: add private sitewide analytics tracking`.

### Task 4: RBBCSC research analytics integration
**Files:** Modify `board-search.html`; modify `assets/board-search.js` only if result metadata hook is required; create `tests/research-analytics.test.js`.
**Interfaces:** Emit `research_search` `{term,resultCount}` and `research_result_click` `{term,resultId,sourceType,meetingDate,targetKind}`.
- [ ] Test the six required source labels and event hooks for searches and transcript/document/video clicks.
- [ ] Run test; verify failure.
- [ ] Add hooks after results render and before result navigation; no query text is sent anywhere except private collector.
- [ ] Run board-search and research analytics tests; expect pass.
- [ ] Commit `feat: track board research engagement`.

### Task 5: Admin authentication
**Files:** Create `netlify/functions/analytics-login.js`, `analytics-logout.js`, `_analytics-auth.js`; create `tests/analytics-auth.test.js`.
**Interfaces:** env `ANALYTICS_ADMIN_PASSWORD`, `ANALYTICS_SESSION_SECRET`; successful login sets `campaign_analytics_admin` Secure HttpOnly SameSite=Strict cookie; `requireAdmin(request)` verifies signed expiration.
- [ ] Test wrong password 401, absent env 503, valid login cookie attributes, tampered/expired cookie denial and logout clearing.
- [ ] Run test; verify failure.
- [ ] Implement timing-safe password comparison and HMAC-signed session token with 12-hour expiry; never return password/secret.
- [ ] Run test; expect pass.
- [ ] Commit `feat: secure analytics admin sessions`.

### Task 6: Authenticated report/query API and retention
**Files:** Create `netlify/functions/analytics-report.js`, `analytics-export.js`, `analytics-health.js`; modify `_analytics-store.js`; create `tests/analytics-report.test.js`.
**Interfaces:** authenticated GET report accepts bounded date/filter params; export returns CSV; health returns collector/storage/enrichment/search status; `purgeExpiredRawIps` removes raw IP after 30 days.
- [ ] Test unauthenticated 401 for all read/export endpoints, date bounds, human-vs-bot totals, summary windows, filters, journeys, campaign attribution, CSV escaping and raw-IP expiration.
- [ ] Run test; verify failure.
- [ ] Implement aggregation for requested reports and anonymous session journeys; expose raw IP only to authenticated admin and only while retained.
- [ ] Run test; expect pass.
- [ ] Commit `feat: add authenticated analytics reports`.

### Task 7: Private dashboard
**Files:** Create `admin/analytics.html`; create `assets/admin-analytics.js`; create `tests/analytics-dashboard.test.js`.
**Interfaces:** login form calls login Function; authenticated report requests populate summary cards, reports, filters, recent activity/session expansion, health and CSV controls.
- [ ] Test dashboard has no embedded credentials/secrets/raw data, contains login state, Today/7/30/all/custom filters, required report sections, health panel and export controls.
- [ ] Run test; verify failure.
- [ ] Implement responsive dashboard with accessible tables/cards and logout. Unauthenticated API response shows login rather than data.
- [ ] Run test; expect pass.
- [ ] Commit `feat: add private analytics dashboard`.

### Task 8: Security/preservation release gate
**Files:** Create `tests/analytics-security.test.js`; modify `netlify.toml` if headers/routing are needed; update `docs/private-analytics-operations.md`.
**Interfaces:** release test scans public files for forbidden secret names/values patterns, confirms public counter absent, collector read denied, admin APIs require auth, and existing campaign/form/donation/QR/search references remain.
- [ ] Write/run security and preservation tests plus all existing tests.
- [ ] Verify no public visitor counter text/DOM remains.
- [ ] Verify ordinary Smithville/AT&T/Comcast/Verizon metadata cannot produce RBBCSC label.
- [ ] Document required Netlify env vars, 30-day IP retention, attribution URL format, free-tier limitations and password rotation.
- [ ] Commit `test: add private analytics release gate`.

### Task 9: Production deployment and live verification
**Files:** No feature changes unless verification finds a defect.
**Interfaces:** production URL remains unchanged; dashboard target `/admin/analytics.html` (with `/admin/analytics` redirect/pretty URL when Netlify serves it).
- [ ] Compare against `backup/pre-private-analytics-2026-08-27` and confirm only intended analytics/search integration changes.
- [ ] Run complete test suite and board-search validation.
- [ ] Before merge, configure `ANALYTICS_ADMIN_PASSWORD` and `ANALYTICS_SESSION_SECRET` in Netlify environment; never commit their values.
- [ ] Merge only after authentication secrets exist and tests pass.
- [ ] Verify production public counter absent; public pages/mobile/forms/donation/QR/search/transcripts work; test visit/click/search/scroll/active/referrer/UTM/QR events appear privately; unauthenticated dashboard APIs return 401; authenticated dashboard/report/export work; bot and network classification behave conservatively.
- [ ] Record actual live results, dashboard URL, login instructions, storage, retention, enrichment status, free limitations, password-change steps and future UTM/QR syntax in operations doc/report to owner.