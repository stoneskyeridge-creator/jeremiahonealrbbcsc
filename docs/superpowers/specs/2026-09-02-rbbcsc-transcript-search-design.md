# RBBCSC Transcript Search Design

## Goal
Make all 214 uploaded RBBCSC/CATS meeting transcripts (2012-2026) searchable from the campaign Public Records search without AI summaries or recurring service costs.

## Architecture
Keep the existing official-record search intact. Add a separate transcript archive generated from the uploaded Whisper JSON files. Each transcript record contains meeting date/title, CATS source URL, and complete transcript text. The browser loads transcript data only when the user enables transcript searching, searches locally, labels every transcript as unofficial/automatically generated, and links back to the original CATS recording.

## Data
Source: RBBCSC_TRANSCRIPTS_BACKUP.zip. Use 214 Whisper JSON transcripts. Preserve complete transcript text; do not publish .done files or duplicate VTT/TXT copies. Group data by year so browsers can load incrementally and future updates can replace only the affected year.

## UI
Retain board-search.html and its existing transcript opt-in checkbox/disclaimer. Coverage text will separately report official indexed records and complete meeting transcripts. Transcript hits show meeting date/title, excerpt around the query, transcript label, and original recording link.

## Safety / Integrity
Do not alter campaign contact or SEPAC forms. Do not treat Whisper text as official minutes. Do not infer speaker identity. Keep original-source links. Search is literal full-text search, not AI summarization.
