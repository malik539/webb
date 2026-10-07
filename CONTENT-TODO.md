# Remaining items before go-live

All approved copy from https://smilehub.webbpediatricdentistry.com/new-patient has been placed verbatim
(minor punctuation/capitalization adjustments only). Run `python3 scripts/check-content.py` for the live list.

## Copy

- **Financing & Flexible Payment Plans** card: the source page repeats the digital X-ray sentence under this
  heading (a copy error on the source). The card currently holds a bracketed slot; supply the correct
  financing copy or remove the card.
- **Google rating**: the source shows both a static "★★★★★ 5.0 • 100+ Google Reviews" line and a live
  widget reading "4.9 (112)". The page uses the widget figure, 4.9 · 112 Google Reviews. Confirm which to show.
- Hero bullet "Call Now to Schedule" is rendered as the lead-in of the hero note under the buttons rather than
  as a checkmark bullet, since it is a call to action, not a trust point.

## Images

- Any additional approved treatment / office / team imagery for the services and technology sections
  (hero: child in dental chair; doctor: Dr. Webb portrait; final CTA: Dr. Webb reading to a child)

## Integration

- LeadConnector / GHL form endpoint: set `FORM_ENDPOINT` in `assets/js/main.js` (field names already mirror the
  source form: first_name, last_name, email, phone, new_patient, message, consent), or drop the existing GHL
  embed inside `.form-card`.
- Existing tracking snippets (two `TRACKING` comments in `index.html`).
