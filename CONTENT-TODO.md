# Content still required from the source landing page

The source page (https://smilehub.webbpediatricdentistry.com/new-patient) could not be fetched from the
build environment, so every piece of approved marketing copy that must be preserved verbatim is held in a
clearly bracketed slot marked `data-copy="pending"` in `index.html`. Nothing was invented to fill them.

Run `python3 scripts/check-content.py` for the live list. Slots, by section:

| Section | Slots |
| --- | --- |
| Hero | H1, intro paragraph, trust points 2–3 (confirm eyebrow + point 1 wording) |
| Appointment form | Intro copy (if any), **consent / SMS opt-in language**, field names to match the existing GHL form, button label |
| Trust / value | Section heading, supporting copy for 6 cards (card titles taken from the brief) |
| Services | Heading, intro, description + bullet items for Preventive, Restorative/Specialized, Emergency, Sedation/Special Needs |
| Meet Dr. Logan Webb | Bio paragraphs; confirm credential badges (board certification, DDS UNC Chapel Hill, MUSC residency / chief resident, Charlotte native) |
| Care by age | Intro (if any), copy for Infants & Toddlers, Children & Preteens, Teens & Adolescents, Special Needs |
| Technology | Heading, intro, names + descriptions of the technologies named on the source page (3 cards scaffolded; add/remove as needed) |
| First visit | Intro (if any), descriptions under the 5 steps |
| Insurance & payment | Heading, intro, Insurance / Payment Options / Financing copy (accepted plans only if explicitly listed) |
| Reviews | Heading, Google rating + review count (only if displayed on source), 3 review texts + reviewer names |
| Final CTA | Supporting copy under "Schedule Your Child's Appointment" |

Items marked `data-copy="verify"` are factual statements published by the practice (board certification,
Diplomate status, education) that should be checked against the source page's wording.

## Images still needed

- Dr. Logan Webb portrait (currently the doctor section uses the school-visit community photo)
- Any additional approved treatment / office / team imagery for the services and technology sections

## Integration still needed

- LeadConnector / GHL form endpoint (`FORM_ENDPOINT` in `assets/js/main.js`) or the existing embed
- Existing tracking snippets (two `TRACKING` comments in `index.html`)
