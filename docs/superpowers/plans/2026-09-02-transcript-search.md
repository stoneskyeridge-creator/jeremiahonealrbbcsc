# RBBCSC Complete Transcript Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all uploaded RBBCSC meeting transcripts searchable from the existing board-record search and readable on the campaign website.

**Architecture:** Convert the uploaded Whisper JSON/TXT pairs into one full-text search record per meeting, sharded by year. Add those shard files to the existing search manifest, add a transcript reader page, and minimally extend the current search result renderer with a local full-transcript link.

**Tech Stack:** Static HTML/CSS/JavaScript, JSON, GitHub Pages-style static assets deployed by Netlify.

**Spec:** `docs/superpowers/specs/2026-09-02-transcript-search-design.md`

## Global Constraints

- No AI/API dependency and no recurring cost.
- Preserve the current homepage and Netlify forms.
- Transcript results must remain clearly labeled as unofficial/machine-generated research aids.
- Every transcript viewer must link to the original CATS recording when available.

---

### Task 1: Build complete transcript shards

**Files:**
- Create: `data/transcript-shards/<year>.json`
- Modify: `data/search-index.json`

**Interfaces:**
- Produces search records with `completeTranscript:true`, `transcriptUrl`, full `text`, meeting metadata, and original CATS URL.

- [ ] Generate one record per uploaded meeting from its Whisper JSON and TXT files.
- [ ] Group records by meeting year and write deterministic JSON shards.
- [ ] Verify record count equals uploaded transcript count and every record has non-empty text.
- [ ] Append transcript shard metadata to `data/search-index.json` without removing existing official/search shards.
- [ ] Commit data files.

### Task 2: Add the full transcript viewer

**Files:**
- Create: `transcript.html`

**Interfaces:**
- Consumes: `year` and `id` query parameters plus `data/transcript-shards/<year>.json`.

- [ ] Validate the intended page contract with a failing static assertion before creation.
- [ ] Create the viewer with campaign styling, disclaimer, complete transcript text, meeting metadata, and original CATS link.
- [ ] Validate missing/invalid parameters produce a readable error state.
- [ ] Commit the viewer.

### Task 3: Link transcript results from search

**Files:**
- Modify: `board-search.html`

**Interfaces:**
- Consumes: record `transcriptUrl` and `completeTranscript` fields.

- [ ] Write a failing static assertion that complete-transcript results do not yet expose a local transcript link.
- [ ] Add `READ FULL TRANSCRIPT →` for records containing `transcriptUrl` while preserving the original recording link.
- [ ] Avoid showing a fake speaker-identification badge for meeting-level complete transcript records.
- [ ] Run static assertions to verify both links and disclaimer behavior remain present.
- [ ] Commit the search UI change.

### Task 4: Verification

**Files:**
- Verify: `data/search-index.json`, transcript shards, `transcript.html`, `board-search.html`

- [ ] Search generated shards for known terms such as `special education` and confirm matches occur across multiple years where present.
- [ ] Verify all local transcript URLs resolve to an existing record.
- [ ] Verify existing official shard references remain in the manifest.
- [ ] Verify homepage `index.html` is unchanged by this feature.
- [ ] Verify the production branch contains the complete data and UI changes.