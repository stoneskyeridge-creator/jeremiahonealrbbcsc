# RBBCSC Board Meeting Search — Transcript Archive Design

## Purpose

Upgrade the campaign site's RBBCSC Board Meeting Search so residents can search both official written records and the spoken content of public RBBCSC/CATS board meeting videos without confusing automated transcripts with official district records.

The existing campaign site, navigation, resources, forms, donation links, and unrelated pages must remain intact.

## User Experience

The search page will present one search box with two source modes:

1. **Official Records** — enabled by default. Searches published minutes, agendas, budgets, notices, and other written public records.
2. **Include Meeting Audio & Transcripts** — disabled by default. When enabled, the same query also searches transcript records derived from public RBBCSC/CATS/YouTube meeting recordings.

When transcript search is enabled, display this disclaimer prominently near the control:

> **About transcript results:** Meeting-audio transcripts are provided as a research aid and may be automatically generated. They are not official RBBCSC meeting minutes and may contain transcription errors. Users should verify important statements by listening to the linked original public meeting recording.

After a search, users may further filter results by source type: **All, Minutes, Agenda, Budget, Video Transcript, Other Official Record**.

## Search Result Requirements

Each result must display:

- Meeting date
- Source label such as `Minutes`, `Agenda`, `Budget`, `Video Transcript`, or `Other Official Record`
- Speaker name only when reliably supported
- Speaker status when applicable: `Identified`, `Likely / unconfirmed`, or `Speaker not reliably identified`
- Matching excerpt
- Search term highlighted in the excerpt
- Video timestamp for transcript results
- Link to the original public source
- For video results, a timestamped URL when the source platform supports deep linking; otherwise link to the original meeting page/video and display the timestamp for manual navigation

The interface must never imply that a transcript is an official district record.

## Speaker Identification Rules

Speaker names must not be invented.

Speaker identity may be marked `Identified` only when supported by reliable evidence such as:

- The speaker states their own name clearly in the recording
- An on-screen lower-third or title identifies the speaker
- The chair or another participant clearly introduces the speaker
- A contemporaneous official record reliably ties the speaker to the timestamp

If evidence points toward a name but does not meet the reliable threshold, display `Likely / unconfirmed: <name>`.

If identity cannot be supported, display `Speaker not reliably identified`.

## Archive Scope

Ingest as many publicly available RBBCSC board meeting records as practical from:

- CATS public government-meeting archive
- RBBCSC public board records
- RBBCSC/board YouTube playlist where available
- Publicly available meeting attachments such as agendas and minutes

The ingestion system must preserve the original public URL for every indexed source.

Coverage metadata should record which meetings have:

- Official written documents
- Video
- Captions supplied by the source platform
- Automatically generated transcript
- Partial transcript only
- No usable transcript

The search UI should communicate archive coverage rather than imply completeness.

## Transcript Generation

Preferred order:

1. Use existing reliable captions/transcripts supplied by the public video source when available.
2. If no usable transcript exists, generate an automated transcript from the public meeting audio.
3. Store timestamped transcript segments rather than one unstructured block.

Automated transcript content must be labeled `Video Transcript` and the archive record must include a field indicating whether the transcript was source-provided or automatically generated.

Do not silently correct uncertain words or names. Preserve uncertainty when necessary.

## Data Model

Use a normalized static dataset committed to the repository so browser search is fast and does not require transcribing meetings at query time.

Suggested logical record shape:

```json
{
  "id": "2026-05-19-video-0042",
  "meetingDate": "2026-05-19",
  "meetingTitle": "RBBCSC School Board Meeting",
  "sourceType": "video-transcript",
  "sourceLabel": "Video Transcript",
  "sourceUrl": "https://...",
  "videoUrl": "https://...",
  "timestampSeconds": 4472,
  "timestampLabel": "1:14:32",
  "speakerName": "Stacy Pie",
  "speakerConfidence": "identified",
  "text": "...",
  "transcriptMethod": "automated",
  "official": false
}
```

Written-document records use the same searchable shape where possible, with `official: true` and no video timestamp unless the document is associated with one.

## Search Architecture

Use a static client-side search index because the current site is lightweight and hosted on Netlify.

The build/ingestion process produces:

- `data/meetings.json` — meeting/source metadata
- `data/search-records.json` or compact equivalent — normalized searchable records
- Transcript files split by meeting when useful for maintainability
- A browser-side search module that loads the index and returns ranked matches

The search implementation should support:

- Case-insensitive text search
- Exact-name searches
- Phrase matching when practical
- Source-type filtering
- Search-term highlighting
- Ranking exact/phrase matches ahead of weak partial matches
- Deduplication of overlapping transcript segments from the same timestamp area

The archive should be maintainable incrementally: adding a newly published meeting should not require redesigning the search page.

## Video Deep Links

For YouTube, construct timestamp links using supported time parameters.

For CATS or other hosts, use the closest supported deep-link mechanism. If the public player does not support URL timestamps, link to the meeting page/video and present the timestamp visibly with text such as `Jump to approximately 37:16 in the original recording`.

Never create a fake timestamped URL that the source does not support.

## Preservation of Existing Site

Do not redesign unrelated pages.

The existing `resources.html` public-record links remain available. The new search capability may be added as a dedicated board-search page linked from the resources page and/or embedded into the existing board-records area, but existing resource buttons must remain functional.

Existing forms, donation flows, Facebook feed, campaign priorities, visitor counter, and campaign pages are out of scope except for regression testing.

## Error Handling and Transparency

If a transcript cannot be generated or source media is unavailable:

- Keep the meeting metadata in the archive when possible
- Mark transcript status clearly
- Do not fabricate content

If speaker identity is uncertain, use the confidence labels above.

If timestamp linking is unsupported, show the timestamp without pretending the source link will seek automatically.

If a public source disappears after ingestion, keep the archived index metadata but visibly mark the external link unavailable only after verification; do not substitute an unrelated source.

## Validation Searches Before Deployment

Before deployment, run searches for:

- `special education`
- `Journeys`
- `Stacy Pie`
- `Jeremiah O’Neal`
- `Samantha Parker`

For each query, document:

- Number of official-record matches
- Number of video-transcript matches
- At least one timestamped spoken-content result when the term is verifiably present in meeting audio
- Whether the same term appears in the corresponding written agenda/minutes

The acceptance test specifically requires demonstrating at least one case where a spoken-audio result is returned even though that term is absent from the corresponding agenda/minutes. If no such case can be verified for one of the named test terms, report that fact rather than manufacturing a result.

## Mobile and Desktop Acceptance Criteria

Desktop:

- Search box and source toggle are clearly visible
- Results are readable and filterable
- Highlighted terms are visually distinct
- Timestamp links work where supported

Mobile:

- Controls fit without horizontal scrolling
- Result cards stack cleanly
- Source labels and timestamps remain readable
- Video links are easily tappable
- Transcript disclaimer remains visible when transcript mode is enabled

## Deployment and Live Verification

Do not deploy until local/repository tests pass and the validation searches have been reviewed.

After merging to `main` and deploying to Netlify:

- Verify the production page loads on desktop viewport
- Verify the production page loads on mobile viewport
- Repeat the five required searches against the live index
- Open at least one official-document result
- Open at least one video-transcript result
- Confirm transcript mode is off by default
- Confirm enabling transcript mode expands results without changing the official-record labels
- Confirm unrelated campaign pages remain accessible

## Non-Goals

This feature does not:

- Claim automated transcripts are official RBBCSC records
- Summarize or editorialize meeting statements as facts
- Infer speaker identities without evidence
- Replace the original CATS/RBBCSC/YouTube recordings
- Remove existing public-record links
- Modify unrelated campaign content or design

## Success Definition

A resident can search an issue once, see official written records by default, deliberately enable transcript search, and then discover relevant spoken board-meeting content—including public comment that may not appear in agendas or minutes—with transparent source labels, timestamps, speaker-confidence handling, and direct links back to the original public record.
