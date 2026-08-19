# Website playbook (movers)

Same hosting and QA rules as the restaurant sites. Delivery dropdowns become **Contact** (phone, email, HireAHelper). Menu becomes **Services**. Reservations become the **Book** tab with a live hourly estimate.

## Hosting that stayed up

BrewPage `POST /api/sites?ns={name}&ttl=30` with a ZIP `archive`. Public HTTPS. Use `.../index.html`. Skip `.nojekyll`. JPEG/PNG/CSS/JS/HTML only. Insert `<base href>` when the pathname has no extension.

Avoid: Harvis (Safe Browsing), Surge (HTTP 451), Netlify anonymous (password wall).

## QA

Homepage hero + CSS, service filters, Book estimate + empty-form copy, gallery lightbox, hours + map, Contact dropdown, ~390px Pages nav.
