# RBBCSC Complete Transcript Search Design

**Goal:** Add the complete uploaded RBBCSC meeting transcript archive to the existing public-record search without changing the campaign homepage or Netlify forms.

## Architecture

The uploaded Whisper archive contains one meeting JSON and one plain-text transcript per meeting. Build compact year-based JSON shards under `data/transcript-shards/`, with one searchable record per meeting containing the full transcript text plus meeting date/title/CATS source metadata. Append those shard references to the existing `data/search-index.json` manifest so the current browser-only search can search them when the transcript toggle is enabled.

Add a standalone `transcript.html` viewer that loads one transcript record by year and CATS meeting id and displays the complete text with a link to the original CATS recording. Update `board-search.html` so complete-transcript matches provide both `READ FULL TRANSCRIPT` and `OPEN ORIGINAL MEETING RECORDING` links. Existing official-record search, public-record resources, homepage content, analytics, and Netlify forms remain untouched.

## Data model

Each complete transcript record uses:

- `id`: `cats-<cats_id>`
- `meetingDate`: ISO `YYYY-MM-DD`
- `meetingTitle`: meeting title from the archive metadata
- `sourceType`: `video-transcript`
- `sourceLabel`: `Complete Meeting Transcript`
- `sourceUrl`: original CATS meeting URL
- `videoUrl`: original CATS meeting URL
- `transcriptUrl`: local viewer URL, e.g. `transcript.html?year=2026&id=16312`
- `text`: complete Whisper transcript text
- `official`: `false`
- `completeTranscript`: `true`

## User experience

Search remains opt-in for transcripts. The existing transcript disclaimer remains visible when enabled. Results from the uploaded archive are labeled `Complete Meeting Transcript`; they show a matching excerpt, a `READ FULL TRANSCRIPT` link, and an original-recording link. The transcript viewer clearly states that machine-generated transcripts are research aids and should be verified against the recording.

## Constraints

- No AI/API dependency and no recurring cost.
- Entirely static Netlify/GitHub hosting.
- Preserve current campaign homepage and both Netlify forms.
- Do not alter or replace official RBBCSC/CATS records; always link back to the original recording.
- Search coverage reflects the uploaded archive and may include transcription errors.