# Restaurant website playbook

Use this file when building the next restaurant site. One GitHub repo per restaurant, named after the place (example: `3-corner-restaurant`, `king-of-gyro`). Keep a copy of this playbook in the new repo, and read the previous restaurant repo plus its cloud-agent transcript before designing.

## What the user usually wants

- Full production site, not a mock
- Photos from the house site, Google, Yelp, DoorDash, and social — not generic stock if real plates exist
- Delivery dropdown: DoorDash, Uber Eats, Grubhub (real store URLs)
- Menu with in-house prices
- Hours, map, click-to-call
- A **working public HTTPS URL** that Chrome does not flag
- Do not return until it is live and checked in a browser

Match the room. 3 Corner is a Dominican restaurant + bar + liquor + grill with a black / white / gold salon — not a mid-tier gyro counter.

## Pages that worked

Home, Menu, About, Gallery, Hours & Location, custom 404.

Shared chrome on every page: logo, nav, Call, Order delivery dropdown, mobile **Pages** button.

## Stack

Static HTML / CSS / JS. Relative links. No build step. `display: grid` on menu rows must also set `[hidden] { display: none }` or category filters will not hide items. Strip `required` off reservation fields if you need a custom validation sentence.

## Hosting (what actually stayed up)

| Host | Result |
|---|---|
| **BrewPage** `POST /api/sites?ns={name}&ttl=30` with a ZIP `archive` | Public HTTPS URL. Use `.../index.html`. Skip `.nojekyll`. JPEG/PNG/CSS/JS/HTML only. |
| Cloudflare Workers `--assets --temporary` | Homepage 200; inner `.html` often 403 “Just a moment…” |
| Netlify `--allow-anonymous` | Live but **password-walled** (`My-Drop-Site`) |
| Surge | Can return HTTP 451 Unavailable |
| Harvis (`*.harvis.page`) | Chrome Safe Browsing “Dangerous site” |
| GitHub Pages | Needs `pages: write` on the repo; often not enabled |

BrewPage relative links break if the URL has no trailing slash and no `index.html`. Insert a `<base href>` when `pathname` has no file extension.

3 Corner live example: `https://brewpage.app/threecorner/8zPYlNbSYy/index.html`

## Research checklist

Address, phone, hours in America/New_York, cuisine, competitors within a few blocks, Yelp/Facebook/Tripadvisor, Grubhub/Uber Eats/DoorDash URLs, official photos first.

## QA before you come back

Homepage CSS and hero photo, menu filters, gallery lightbox close/prev/next, hours + map, empty reservation form copy, delivery dropdown, ~390px Pages nav, no Safe Browsing interstitial.
