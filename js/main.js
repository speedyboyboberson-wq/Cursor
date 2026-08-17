(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var orderWrap = document.querySelector(".order-wrap");
  var orderToggle = document.querySelector(".order-toggle");

    if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close site navigation" : "Open site navigation");
    });
  }

  if (orderWrap && orderToggle) {
    orderToggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = orderWrap.classList.toggle("open");
      orderToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!orderWrap.contains(event.target)) {
        orderWrap.classList.remove("open");
        orderToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        orderWrap.classList.remove("open");
        orderToggle.setAttribute("aria-expanded", "false");
        if (header) header.classList.remove("open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function sessionDay(date) {
    var minutes = date.getHours() * 60 + date.getMinutes();
    var day = date.getDay();
    if (minutes < 11 * 60) {
      return (day + 6) % 7;
    }
    return day;
  }

  function closeMinutesForDay(day) {
    return day === 5 || day === 6 ? 3 * 60 : 2 * 60;
  }

  function isOpenNow(date) {
    var minutes = date.getHours() * 60 + date.getMinutes();
    if (minutes >= 11 * 60) {
      return true;
    }
    return minutes < closeMinutesForDay(sessionDay(date));
  }

  function hoursLabel(date) {
    return closeMinutesForDay(sessionDay(date)) === 3 * 60
      ? "Open until 3:00 AM"
      : "Open until 2:00 AM";
  }

  var now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  var open = isOpenNow(now);
  document.querySelectorAll("[data-open-status]").forEach(function (el) {
    el.textContent = open ? "Open now · " + hoursLabel(now) : "Currently closed · Opens 11:00 AM";
  });
  document.querySelectorAll("[data-status-dot]").forEach(function (el) {
    el.classList.toggle("closed", !open);
  });

  var minutesNow = now.getHours() * 60 + now.getMinutes();
  var highlightDay =
    open && minutesNow < 11 * 60 ? sessionDay(now) : now.getDay();
  document.querySelectorAll("[data-hours-row]").forEach(function (row) {
    if (Number(row.getAttribute("data-hours-row")) === highlightDay) {
      row.classList.add("today");
    }
  });

  var tabs = document.querySelectorAll(".menu-tabs button");
  var cards = document.querySelectorAll("[data-category]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter");
      tabs.forEach(function (button) {
        button.setAttribute("aria-selected", button === tab ? "true" : "false");
      });
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  var lightbox = document.querySelector(".lightbox");
  var lightboxImage = document.querySelector(".lightbox img");
  var lightboxClose = document.querySelector(".lightbox-close");
  var lightboxTrigger = null;

  document.querySelectorAll("[data-lightbox]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;
      lightboxTrigger = button;
      lightboxImage.src = button.getAttribute("data-full") || button.querySelector("img").src;
      lightboxImage.alt = button.querySelector("img").alt || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.setAttribute("aria-modal", "true");
      if (lightboxClose) lightboxClose.focus();
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("aria-modal", "false");
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (event.key !== "Tab") return;
    event.preventDefault();
    if (lightboxClose) lightboxClose.focus();
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLightbox();
  });

  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var message = form.querySelector("#message");
      var status = form.querySelector(".form-status");
      var valid = name.value.trim() && phone.value.trim() && message.value.trim();
      if (!valid) {
        status.className = "form-status form-error";
        status.textContent = "Please add your name, phone number, and a short message.";
        return;
      }
      status.className = "form-status form-success";
      status.textContent =
        "Thanks, " +
        name.value.trim() +
        ". The counter confirms large orders by phone — call (732) 964-3400 and mention this note: " +
        message.value.trim().slice(0, 80);
      form.reset();
    });
  }
})();
