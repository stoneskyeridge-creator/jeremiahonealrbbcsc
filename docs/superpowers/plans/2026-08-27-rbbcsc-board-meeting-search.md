# RBBCSC Board Meeting Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a transparent client-side RBBCSC board-record search that searches official written records by default and optionally searches timestamped public meeting transcripts.

**Architecture:** Add a dedicated `board-search.html` page backed by a normalized static JSON archive and a small browser search module. Keep ingestion/build logic separate from browser logic, preserve original source URLs, and label transcript provenance/speaker confidence. Link the new page from `resources.html` without redesigning unrelated pages.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, Node.js test/build scripts, JSON, Netlify static hosting.

**Spec:** `docs/superpowers/specs/2026-08-27-rbbcsc-board-meeting-search-design.md`

## Global Constraints

- Official Records is enabled by default; transcript search is disabled by default.
- Transcript results must display the approved research-aid disclaimer and never be presented as official minutes.
- Speaker names must never be invented; confidence is `identified`, `likely`, or `unknown`.
- Every indexed record preserves an original public source URL.
- Video results show a timestamp and only use timestamped deep links when the source supports them.
- Existing resources links, forms, donation flows, campaign pages, Facebook feed, and visitor counter remain intact.
- No AI/editorial summaries of meeting statements.
- Missing/unavailable content is reported rather than fabricated.
- Mobile controls and result cards must not require horizontal scrolling.
- Deployment occurs only after tests and the five required validation searches are reviewed.

---

### Task 1: Search Engine and Data Contract

**Files:**
- Create: `assets/board-search.js`
- Create: `tests/board-search.test.js`

**Interfaces:**
- Produces: `BoardSearch.search(records, query, options) -> result[]`, `BoardSearch.highlight(text, query) -> string`, `BoardSearch.videoLink(record) -> string`.
- Record fields: `id`, `meetingDate`, `meetingTitle`, `sourceType`, `sourceLabel`, `sourceUrl`, `videoUrl`, `timestampSeconds`, `timestampLabel`, `speakerName`, `speakerConfidence`, `text`, `transcriptMethod`, `official`.

- [ ] Write failing Node tests covering case-insensitive phrase/name matching, official-only default, optional transcript inclusion, source filtering, exact/phrase ranking, overlapping transcript dedupe, HTML-safe highlighting, and YouTube timestamp URLs.
- [ ] Run `node tests/board-search.test.js` and verify failure because the module does not exist.
- [ ] Implement a dependency-free UMD-style `BoardSearch` module usable by both Node tests and the browser. Normalize apostrophes/case for matching but return original text. Escape HTML before inserting `<mark>` around query tokens/phrases. Treat `video-transcript` as excluded unless `includeTranscripts === true`.
- [ ] Run `node tests/board-search.test.js`; expect all assertions to pass.
- [ ] Commit with message `feat: add board record search engine`.

### Task 2: Archive Data and Coverage Metadata

**Files:**
- Create: `data/meetings.json`
- Create: `data/search-records.json`
- Create: `tests/board-data.test.js`

**Interfaces:**
- Consumes the record contract from Task 1.
- Produces browser-loadable meeting coverage metadata and searchable records with source provenance.

- [ ] Write a failing validation test that requires unique IDs, valid ISO dates, allowed source types, nonempty original source URLs, `official:false` for transcripts, timestamps for transcript segments, valid speaker-confidence values, and meeting coverage fields for written docs/video/transcript status.
- [ ] Run `node tests/board-data.test.js`; expect failure because data files do not exist.
- [ ] Seed the archive only with verified public records. Include known CATS meeting/video metadata and source-provided transcript segments where timestamp/provenance can be supported. Written records must be marked `official:true`; transcripts `official:false` and method `publisher-transcript`, `publisher-caption`, or `automated-stt`. Unknown speakers use `speakerName:null` and `speakerConfidence:"unknown"`.
- [ ] Run the data validation test; expect pass.
- [ ] Commit with message `data: add verified RBBCSC meeting search archive`.

### Task 3: Search Page UI

**Files:**
- Create: `board-search.html`
- Create: `tests/board-search-page.test.js`

**Interfaces:**
- Consumes `assets/board-search.js`, `data/meetings.json`, and `data/search-records.json`.
- Produces a responsive search interface with source toggle, filters, result cards, coverage notice, highlights, timestamps, and original-source links.

- [ ] Write a failing static-page test asserting the search input, default-off transcript checkbox, exact approved disclaimer text, six source filters, results container, coverage container, script reference, and mobile viewport metadata.
- [ ] Run `node tests/board-search-page.test.js`; expect failure because page does not exist.
- [ ] Build `board-search.html` in the campaign site's existing dark/gold/cream visual language. Load JSON with `fetch`, search only after user input, show counts for official/transcript matches, display speaker status only for transcript records, and render a clear error if archive JSON cannot load.
- [ ] Ensure source links use `target="_blank" rel="noopener"`; use `textContent` for metadata and only inject the escaped output of `BoardSearch.highlight` into excerpts.
- [ ] Run page and engine tests; expect pass.
- [ ] Commit with message `feat: add RBBCSC board meeting search page`.

### Task 4: Resources Integration and Regression Protection

**Files:**
- Modify: `resources.html`
- Create: `tests/resources-regression.test.js`
- Existing regression: `tests/forms-detection.test.js`

**Interfaces:**
- Produces a prominent link from Public Records to `board-search.html` while preserving every existing external resource link.

- [ ] Write a failing regression test that snapshots/validates the existing RBBCSC, CATS, YouTube, Gateway, DLGF, NCES, IN*SOURCE, and IDOE URLs and requires a `board-search.html` link. Require replacement of the outdated sentence `No campaign-generated search results` with transparent copy explaining that the search indexes/excerpts original public sources and does not provide campaign/AI summaries.
- [ ] Run `node tests/resources-regression.test.js`; expect failure because the search link is absent.
- [ ] Add one search card/button to the School Board Records section without removing the existing cards/buttons. Update only the conflicting introductory copy.
- [ ] Run `node tests/resources-regression.test.js`, `node tests/forms-detection.test.js`, and board-search tests; expect pass.
- [ ] Commit with message `feat: link public records to board search`.

### Task 5: Archive Validation Queries

**Files:**
- Create: `scripts/validate-board-search.js`
- Create: `docs/board-search-validation.md`
- Modify data files only when additional source-verified records are discovered.

**Interfaces:**
- Consumes `BoardSearch.search` and `data/search-records.json`.
- Produces reproducible counts and evidence for `special education`, `Journeys`, `Stacy Pie`, `Jeremiah O’Neal`, and `Samantha Parker`.

- [ ] Write the validator to print, for each required query, official match count, transcript match count, transcript timestamps/source URLs, and whether the same meeting has a corresponding written-record match.
- [ ] Run `node scripts/validate-board-search.js`; capture actual results without adding fabricated records to make a query pass.
- [ ] Verify at least one spoken-content result whose term is absent from corresponding written records. If current verified archive cannot demonstrate this, record `NOT YET VERIFIED` in the validation document and do not claim acceptance.
- [ ] Document archive coverage, missing transcript coverage, and all five query outcomes in `docs/board-search-validation.md`.
- [ ] Re-run all tests and validator.
- [ ] Commit with message `test: validate board meeting archive searches`.

### Task 6: Link Health, Responsive Acceptance, and Release Gate

**Files:**
- Create: `scripts/check-board-links.js`
- Create: `tests/site-regression.test.js`
- Modify only defects discovered by verification.

**Interfaces:**
- Consumes source URLs and site files.
- Produces a release gate showing no broken internal search links, preserved campaign navigation, and a documented list of externally unavailable sources rather than silently replacing them.

- [ ] Add a test for internal page references and required campaign pages/forms/donation URLs.
- [ ] Add a source-link checker that reports HTTP failures distinctly from test failures; do not replace a public source with an unrelated URL.
- [ ] Run all Node tests and the five-query validator.
- [ ] Inspect `board-search.html` at desktop and <=700px layout rules for no horizontal scrolling, stacked controls/cards, readable labels/timestamps, and visible transcript disclaimer when enabled.
- [ ] Verify transcript mode is unchecked in source HTML and official labels remain unchanged when transcript mode is enabled.
- [ ] Commit with message `test: add board search release checks`.

### Task 7: Merge and Production Verification

**Files:**
- No new feature files unless production verification exposes a defect.

**Interfaces:**
- Produces the reviewed feature on `main` and Netlify production only after the release gate passes.

- [ ] Compare the feature branch against the pre-feature backup branch `backup/pre-board-transcript-search-2026-08-27` and confirm unrelated site files are unchanged except the intended `resources.html` integration.
- [ ] Run the complete test suite and validator one final time.
- [ ] Create/review a pull request into `main`; do not merge if the required spoken-only acceptance case is unverified or tests fail.
- [ ] After merge/deploy, open the production `board-search.html`, repeat the five searches, open at least one official source and one transcript source, verify transcript mode defaults off, and verify campaign home/resources/forms remain accessible.
- [ ] If production fails, revert `main` to the known-good backup commit/branch rather than attempting ad-hoc destructive edits.
