# Website playbook (contractors)

Same hosting and QA rules as the restaurant and mover sites. Delivery dropdowns become **Contact** (phone, email, Google, license lookup). Menu becomes **Services**. Reservations become the **Quote** tab. Do not invent square-foot rates or licenses.

## Hosting that stayed up

BrewPage `POST /api/sites?ns={name}&ttl=30` with a ZIP `archive`. Public HTTPS. Use `.../index.html`. Skip `.nojekyll`. JPEG/PNG/CSS/JS/HTML only. Insert `<base href>` when the pathname has no extension.

Avoid: Harvis (Safe Browsing), Surge (HTTP 451), Netlify anonymous (password wall).

## QA

Homepage hero + CSS, service filters, Quote empty-form copy, gallery lightbox, hours + map, Contact dropdown, ~390px Pages nav.
