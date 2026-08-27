# Private Campaign Analytics Design

## Purpose
Add a private, free-tier-compatible analytics subsystem to the existing campaign site without redesigning or replacing campaign content, forms, donation links, QR destinations, or RBBCSC research/search. Remove only the public-facing visitor counter while continuing private collection.

## Privacy and retention
No invasive fingerprinting and no attempt to identify individual people. Use a random first-party anonymous visitor ID and session ID. Raw public client IP is sensitive: use it server-side for enrichment and retain raw IP for no more than 30 days; longer-lived analytics retain anonymous IDs and derived city/state/country, ASN, network organization and classification. Retain aggregate/anonymous campaign analytics through the campaign plus approximately 90 days, subject to free-tier storage limits.

## Collection architecture
A lightweight sitewide browser tracker sends page views and meaningful events to a Netlify Function. The collector adds trusted server/request metadata, bot classification and network/location enrichment available from Netlify request context/headers. It stores append-only event records in Netlify Blobs. Public clients can submit constrained analytics events but cannot read analytics records.

## Authentication
`/admin/analytics` is a private dashboard shell. Login credentials are never committed. `ANALYTICS_ADMIN_PASSWORD` and `ANALYTICS_SESSION_SECRET` are Netlify environment variables. Login is verified by a Netlify Function and issues a signed Secure, HttpOnly, SameSite=Strict cookie. Every analytics read/export API verifies that cookie server-side. Authentication is not URL hiding or client-only JavaScript.

## Events
Collect page views, navigation/CTA interactions, document/PDF opens, outbound links, donation clicks, contact/email/phone/copy/share actions, research searches/results, meeting/video/transcript clicks, scroll milestones 25/50/75/100 once per page view, and approximate active-visible engagement time. Donation click never means completed donation.

## Attribution
Capture standard UTM parameters and first/referring source. Preserve existing QR destinations. Future QR campaigns add query parameters to the same destination, e.g. `?utm_source=qr&utm_medium=yard_sign&utm_campaign=2026_general`.

## Research integration
RBBCSC search emits search term, result count and source-specific result-click events. Source types: Video Transcript, Minutes, Agenda, Budget, Personnel, Other Document. Anonymous session ID links search and click sequences.

## Network classification
Classify only from reliable network metadata: educational/institutional, government, business/corporate, residential ISP, cellular/mobile, hosting/cloud, VPN/proxy when reliably indicated, or unknown. Display registered organization/network names when available. A `Possible RBBCSC-associated network` label requires explicit reliable ASN/network organization evidence associated with RBBCSC; Bloomington/Ellettsville geography or Smithville/AT&T/Comcast/Verizon alone is never sufficient. This is organizational association only, never proof of an individual or district-owned device.

## Bots
Reliably recognized crawlers, social preview bots, uptime monitors and obvious automated traffic are marked `isBot` and excluded from primary human metrics, with a separate bot report.

## Dashboard
Authenticated dashboard supports Today, 7-day, 30-day, all-time and custom ranges; summary cards; page/event/search/document/meeting/transcript/special-ed/safeguard/budget/write-in/donation/outbound/referral/location/device/network/organization/scroll/engagement reports; anonymous recent activity and session journeys; campaign/UTM/QR performance; health/status; and admin-only CSV exports.

## Security
No analytics secrets, passwords, raw logs or read credentials in public HTML/JS/GitHub. Collector validates event names/field lengths and does not accept a client-supplied IP as trusted. Read/export endpoints are authenticated. Raw IP is never returned to ordinary public endpoints. Dashboard uses no third-party tracking service.

## Cost/limitations
Use existing Netlify hosting, Functions and `@netlify/blobs`. Do not subscribe to paid services. Network enrichment is limited to reliable metadata available free from the hosting/request environment; unavailable ASN/proxy detail is shown as unavailable rather than guessed.

## Preservation and release gate
Keep existing URL, QR destination, mobile design, campaign pages, forms, donation functionality and board-search work. Remove public visitor counter only. Before production: test collector, events, research integration, scroll/engagement, referrer/UTM/QR, bot handling, network non-misclassification, authentication/read API denial, secret exposure, existing forms/donation/QR, mobile and production deployment. Do not claim live success until verified on Netlify production.