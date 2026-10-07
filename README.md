# Webb Pediatric Dentistry — New Patient PPC Landing Page

A dependency-free, static landing page built for Google Ads traffic. Two conversion goals: **Request an Appointment** (form) and **Call 704-459-2843**.

```
index.html              The page
assets/css/styles.css   Brand design system + layout (Merriweather / Roboto, navy #014565, aqua #98d9d7, ice #e8f9fa)
assets/js/main.js       Sticky CTA, scroll reveal, form validation + submission, dataLayer events
assets/img/             Optimized responsive renditions (generated)
assets/src-images/      Original approved images (source of truth for the generator)
scripts/build-images.py Regenerates assets/img from assets/src-images
scripts/check-content.py Lists copy slots still awaiting source text; --strict fails if any remain
CONTENT-TODO.md         What still has to be filled in from the source landing page
```

## Run locally

```
python3 -m http.server 8080
# open http://localhost:8080/
# add ?markers=1 to outline copy slots that still need source text
```

## Before go-live

1. Resolve the open items in CONTENT-TODO.md (financing copy, which Google rating to show) and confirm
   `python3 scripts/check-content.py` reports no pending slots.
2. Wire the form: set `FORM_ENDPOINT` (and `FORM_METHOD`) at the top of `assets/js/main.js` to the
   existing LeadConnector / GHL endpoint (field names already mirror the source form), or drop the
   existing GHL embed inside `.form-card`. Submit a test lead.
3. Paste the existing tracking snippets (GTM / GA4 / Google Ads / Meta Pixel / call tracking) into the
   two marked `TRACKING` comments in `index.html`. The page pushes `phone_click`,
   `appointment_cta_click`, `appointment_form_submit` and `appointment_form_error` to `dataLayer`.
4. Swap in the Dr. Logan Webb portrait (and any additional approved images): drop originals in
   `assets/src-images/`, add them to `PHOTOS` in `scripts/build-images.py`, run the script, and update
   the `<img>` `src`/`srcset`.
5. Set the canonical URL / `robots` meta to match where the page is actually hosted.
6. Run `python3 scripts/check-content.py --strict`; it must exit 0.

## Authoritative business details (already applied everywhere)

- Phone **704-459-2843**, every call link uses `tel:7044592843`
- 3125 Springbank Ln Ste E, Charlotte, NC 28226
- Mon–Wed 7:30 AM – 4:30 PM · Thu 7:30 AM – 3:30 PM · Fri/Sat/Sun Closed
