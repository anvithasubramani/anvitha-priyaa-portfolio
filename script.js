/* =========================================
   ANVITHA PRIYAA VELLAL SUBRAMANI
   PORTFOLIO INTERACTIONS
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // Automatically update the copyright year.
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Accessible mobile navigation.
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav-links");

  if (toggle && nav) {

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(isOpen));

      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    // Close menu after selecting a navigation link.
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu with Escape key.
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });

    // Close menu when clicking outside.
    document.addEventListener("click", event => {
      if (
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close mobile menu when switching to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }

  // Subtle reveal-on-scroll animation.
  const revealItems = document.querySelectorAll(".reveal");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Ensure content remains visible if animation is unsupported.
  if (!("IntersectionObserver" in window) || reduceMotion) {

    revealItems.forEach(item => {
      item.classList.add("is-visible");
    });

  } else {

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });

  }

});
