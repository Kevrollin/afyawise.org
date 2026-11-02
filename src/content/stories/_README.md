# Stories

Add one Markdown file per real story, for example `2026-11-karama-mothers-group.md`:

```md
---
title: Mothers' group starts antenatal walks to Karama Dispensary
summary: One short sentence a funder can read in five seconds.
date: 2026-11-20
place: Karama Ward, Tigania East
program: maternal-child-health
image: ./images/mothers-group.jpg # optional
imageAlt: Five women walking on a red-earth road toward the dispensary # required with an image
consent: # required with any photo of a person
  given: true
  by: Group chairperson, on behalf of all five women (written form on file)
  date: 2026-11-18
  scope: AfyaWise website and funder reports
status: confirmed # TODO_CONFIRM drafts are hidden in production
---

Two to four short paragraphs. Who, where, what changed, and what happens next.
```

Rules:

- Real people and real events only. No composite or invented stories.
- Photos need written consent. Never photograph patients during care, or children without a guardian's consent.
- Use first names only, unless the person asks to be named in full.
- Once the first `confirmed` story exists, `/stories` and the **Stories** nav item appear automatically. Point the `/blog` redirects in `src/config/redirects.mjs` at `/stories` at the same time.
