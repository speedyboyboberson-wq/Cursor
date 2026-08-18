(function () {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  const orderWrap = document.querySelector(".order-wrap");
  const orderBtn = document.getElementById("order-btn");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (orderBtn && orderWrap) {
    orderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const open = orderWrap.classList.toggle("open");
      orderBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!orderWrap.contains(e.target)) {
        orderWrap.classList.remove("open");
        orderBtn.setAttribute("aria-expanded", "false");
      }
    });
    orderBtn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        orderWrap.classList.remove("open");
        orderBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function nyNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  function isOpenAt(now) {
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 8 * 60 && mins < 23 * 60;
  }

  document.querySelectorAll("[data-open-status]").forEach((el) => {
    const now = nyNow();
    const open = isOpenAt(now);
    el.classList.toggle("closed", !open);
    const label = el.querySelector("[data-open-label]");
    if (label) {
      label.textContent = open ? "Open now · 8 AM–11 PM ET" : "Currently closed · opens 8 AM ET";
    }
  });

  const today = nyNow().getDay();
  document.querySelectorAll("[data-day]").forEach((row) => {
    if (Number(row.getAttribute("data-day")) === today) row.classList.add("today");
  });

  document.querySelectorAll("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      document.querySelectorAll("[data-category]").forEach((item) => {
        const cat = item.getAttribute("data-category") || "";
        item.hidden = value !== "all" && !cat.split(" ").includes(value);
      });
    });
  });

  const RATE = 175;
  const MIN_HOURS = 2;
  const form = document.getElementById("book-form");

  function estimateFrom(formEl) {
    const hours = Math.max(MIN_HOURS, Number(formEl.querySelector("[name=hours]")?.value || MIN_HOURS));
    const sameDay = formEl.querySelector("[name=timing]")?.value === "same-day";
    let total = hours * RATE;
    if (sameDay) total *= 1.2;
    return { hours, sameDay, total };
  }

  function renderEstimate(formEl) {
    const out = document.getElementById("estimate-total");
    const detail = document.getElementById("estimate-detail");
    if (!out || !formEl) return;
    const { hours, sameDay, total } = estimateFrom(formEl);
    out.textContent = "$" + Math.round(total).toLocaleString("en-US");
    detail.textContent = sameDay
      ? `${hours} hrs × $175 + 20% same-day · 2 movers`
      : `${hours} hrs × $175 · 2 movers · 2-hour minimum`;
  }

  if (form) {
    form.addEventListener("input", () => renderEstimate(form));
    form.addEventListener("change", () => renderEstimate(form));
    renderEstimate(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.getElementById("form-note");
      const name = form.querySelector("[name=name]").value.trim();
      const phone = form.querySelector("[name=phone]").value.trim();
      const email = form.querySelector("[name=email]").value.trim();
      const from = form.querySelector("[name=from]").value.trim();
      const to = form.querySelector("[name=to]").value.trim();
      const date = form.querySelector("[name=date]").value.trim();
      const size = form.querySelector("[name=size]").value.trim();
      const service = form.querySelector("[name=service]").value.trim();
      const hours = form.querySelector("[name=hours]").value.trim();
      const timing = form.querySelector("[name=timing]").value.trim();
      const message = form.querySelector("[name=message]").value.trim();
      if (!name || !phone || !from || !to) {
        if (note) note.textContent = "Please add your name, phone, starting address, and destination.";
        return;
      }
      const { total } = estimateFrom(form);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "n/a"}\nFrom: ${from}\nTo: ${to}\nDate: ${date || "flexible"}\nMove size: ${size || "n/a"}\nService: ${service || "n/a"}\nHours requested: ${hours}\nTiming: ${timing}\nEstimate (2 movers): $${Math.round(total)}\n\n${message}`
      );
      window.location.href = `mailto:info@fulltimemovers.com?subject=${encodeURIComponent("Move booking request")}&body=${body}`;
      if (note) note.textContent = "Opening your email to send the request. You can also call (888) 988-3885.";
    });
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const img = lightbox.querySelector("img");
    const caption = lightbox.querySelector("[data-caption]");
    const items = [...document.querySelectorAll("[data-lightbox]")];
    let index = 0;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const node = items[index];
      img.src = node.getAttribute("href");
      img.alt = node.getAttribute("data-caption") || "";
      if (caption) caption.textContent = node.getAttribute("data-caption") || "";
      lightbox.classList.add("open");
    };

    items.forEach((a, i) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        show(i);
      });
    });

    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.querySelector(".prev")?.addEventListener("click", () => show(index - 1));
    lightbox.querySelector(".next")?.addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") lightbox.classList.remove("open");
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }
})();
