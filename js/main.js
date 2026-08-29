(function () {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  const orderWrap = document.querySelector(".order-wrap");
  const orderBtn = document.getElementById("order-btn");
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
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

  function chicagoNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  }

  document.querySelectorAll("[data-open-status]").forEach((el) => {
    const label = el.querySelector("[data-open-label]");
    if (label) label.textContent = "Call for a site visit · Twin Cities";
  });

  const today = chicagoNow().getDay();
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

  const form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.getElementById("form-note");
      const name = form.querySelector("[name=name]").value.trim();
      const phone = form.querySelector("[name=phone]").value.trim();
      const email = form.querySelector("[name=email]").value.trim();
      const site = form.querySelector("[name=site]").value.trim();
      const project = form.querySelector("[name=project]").value.trim();
      const size = form.querySelector("[name=size]").value.trim();
      const when = form.querySelector("[name=when]").value.trim();
      const message = form.querySelector("[name=message]").value.trim();
      if (!name || !phone || !site) {
        if (note) note.textContent = "Please add your name, phone, and the job-site address.";
        return;
      }
      const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "n/a"}\nJob site: ${site}\nProject: ${project}\nSize / notes: ${size || "n/a"}\nTiming: ${when || "flexible"}\n\n${message}`;
      const mailto = `mailto:juan@alvaradoconcrete.com?subject=${encodeURIComponent("Concrete quote request")}&body=${encodeURIComponent(body)}`;
      if (note) note.textContent = "Opening your email to Juan. You can also call (612) 644-0335.";
      window.location.assign(mailto);
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
    items.forEach((a, i) => a.addEventListener("click", (e) => { e.preventDefault(); show(i); }));
    lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.querySelector(".prev")?.addEventListener("click", () => show(index - 1));
    lightbox.querySelector(".next")?.addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") lightbox.classList.remove("open");
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }
})();
