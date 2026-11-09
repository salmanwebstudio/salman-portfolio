"use strict";
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
function closeMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.innerHTML = '<span aria-hidden="true">☰</span>';
}
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    menuToggle.innerHTML = open
      ? '<span aria-hidden="true">✕</span>'
      : '<span aria-hidden="true">☰</span>';
  });
  navLinks
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuToggle.contains(e.target)
    )
      closeMenu();
  });
}
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const revealElements = document.querySelectorAll(
  ".hero-content,.hero-visual,.section-heading,.about-card,.detail-card,.skill-card,.service-card,.project-card,.process-card,.experience-note,.contact-info,.project-form",
);
if ("IntersectionObserver" in window && !reduceMotion) {
  revealElements.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
  );
  revealElements.forEach((el) => observer.observe(el));
}
const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
if (
  "IntersectionObserver" in window &&
  sectionLinks.length &&
  sections.length
) {
  const obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }),
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((section) => obs.observe(section));
}
// Static enquiry form: opens the visitor's email app; no data is stored or sent by this site.
const form = document.getElementById("projectForm");
const status = document.getElementById("formStatus");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const name = String(d.get("name") || "").trim();
    const email = String(d.get("email") || "").trim();
    const project = String(d.get("project") || "").trim();
    const message = String(d.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio enquiry: ${project}`);
    const body = encodeURIComponent(`Hello Salman,

My name is ${name}.
Email: ${email}
Project type: ${project}

Project details:
${message}

Regards,
${name}`);
    if (status)
      status.textContent =
        "Your email application should open with the enquiry prepared. Please review and send it from there.";
    window.location.href = `mailto:salmansajid4782@gmail.com?subject=${subject}&body=${body}`;
  });
}
const copyright = document.querySelector(".footer-bottom p");
if (copyright)
  copyright.textContent = `© ${new Date().getFullYear()} Salman Sajid. All rights reserved.`;

document.querySelectorAll(".website-preview").forEach((card) => {

    const image = card.querySelector("img");

    if (!image) return;

    card.addEventListener("mouseenter", () => {

        const container = card.querySelector(".website-scroll");

        const maxScroll = image.offsetHeight - container.offsetHeight;

        image.animate(
            [
                { transform: "translateY(0)" },
                { transform: `translateY(-${Math.max(0, maxScroll)}px)` }
            ],
            {
                duration: 10000,
                easing: "linear",
                fill: "forwards"
            }
        );

    });

    card.addEventListener("mouseleave", () => {
        image.getAnimations().forEach(animation => animation.cancel());
    });

});
