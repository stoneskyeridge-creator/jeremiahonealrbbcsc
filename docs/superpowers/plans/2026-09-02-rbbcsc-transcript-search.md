# RBBCSC Transcript Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add all 214 uploaded RBBCSC/CATS transcripts to the existing public-record search.

**Architecture:** Generate year-grouped transcript JSON from Whisper JSON, keep the official-record index unchanged, and load transcript shards only when transcript search is enabled. Search remains client-side and every transcript links to the original CATS recording.

**Tech Stack:** Static HTML, vanilla JavaScript, JSON, GitHub, Netlify.

**Spec:** `docs/superpowers/specs/2026-09-02-rbbcsc-transcript-search-design.md`

## Global Constraints
- Preserve existing homepage and Netlify forms.
- No AI summaries or paid API dependency.
- Transcript results are labeled unofficial and may contain transcription errors.
- Preserve original CATS source URLs.
- Include all 214 uploaded transcripts from 2012-2026.

---

### Task 1: Generate transcript archive
**Files:** Create `data/transcript-shards/YYYY.json` and `data/transcript-index.json`.
- [ ] Parse Whisper JSON meeting metadata and segments.
- [ ] Join all segments into complete searchable meeting text.
- [ ] Verify exactly 214 transcripts are represented.
- [ ] Verify every record has meeting title, date, source URL, and non-empty text.
- [ ] Commit generated archive.

### Task 2: Integrate transcript archive with search
**Files:** Modify `board-search.html`; reuse `assets/board-search.js`.
- [ ] Add a failing browser/search fixture proving a 2012 transcript term is unavailable before transcript archive loading.
- [ ] Load transcript index only when transcript checkbox is enabled.
- [ ] Search official shards plus transcript shards and merge results.
- [ ] Keep transcript disclaimer and original-recording links.
- [ ] Verify searches across 2012 and 2026 return transcript matches.
- [ ] Commit search integration.

### Task 3: Coverage and regression verification
**Files:** Modify `board-search.html` coverage copy if needed.
- [ ] Verify transcript count displays as 214 and coverage says 2012-2026.
- [ ] Verify official-record-only search still works with transcript checkbox off.
- [ ] Verify mobile layout remains usable.
- [ ] Verify homepage, SEPAC form, and campaign-contact form are untouched.
- [ ] Deploy through main and verify Netlify production search page.
