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

  const HOURS = {
    0: [12 * 60, 26 * 60],
    1: [9 * 60, 26 * 60],
    2: [9 * 60, 25 * 60],
    3: [9 * 60, 25 * 60],
    4: [9 * 60, 25 * 60],
    5: [9 * 60, 26 * 60],
    6: [9 * 60, 26 * 60],
  };

  function nyNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  }

  function isOpenAt(now) {
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    if (mins < 4 * 60) {
      const prev = (day + 6) % 7;
      return mins + 24 * 60 < HOURS[prev][1];
    }
    return mins >= HOURS[day][0];
  }

  document.querySelectorAll("[data-open-status]").forEach((el) => {
    const now = nyNow();
    const open = isOpenAt(now);
    el.classList.toggle("closed", !open);
    const label = el.querySelector("[data-open-label]");
    if (label) {
      label.textContent = open ? "Open now in New Brunswick" : "Currently closed";
    }
  });

  const today = nyNow().getDay();
  document.querySelectorAll("[data-day]").forEach((row) => {
    if (Number(row.getAttribute("data-day")) === today) {
      row.classList.add("today");
    }
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

  const form = document.getElementById("reserve-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.getElementById("form-note");
      const name = form.querySelector("[name=name]").value.trim();
      const phone = form.querySelector("[name=phone]").value.trim();
      const party = form.querySelector("[name=party]").value.trim();
      const when = form.querySelector("[name=when]").value.trim();
      const topic = form.querySelector("[name=topic]")?.value.trim() || "Table reservation";
      const message = form.querySelector("[name=message]").value.trim();
      if (!name || !phone || !message) {
        if (note) note.textContent = "Please add your name, phone number, and a short message.";
        return;
      }
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nParty size: ${party || "n/a"}\nPreferred time: ${when || "n/a"}\nTopic: ${topic}\n\n${message}`
      );
      window.location.href = `mailto:3cornerrestaurantbarliquorgrill.shop@gmail.com?subject=${encodeURIComponent("Reservation request")}&body=${body}`;
      if (note) note.textContent = "Opening your email to send the request. You can also call (732) 543-1700.";
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
