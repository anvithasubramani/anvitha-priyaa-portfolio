
// ANVITHA PRIYAA — PORTFOLIO INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {

  // Smooth reveal animations
  const revealElements = document.querySelectorAll(
    ".section, .project-card, .skills-grid > div, .education-row"
  );

  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });

  // Dynamic footer year
  const footer = document.querySelector("footer");

  if (footer) {
    const yearText = footer.querySelector("span:first-child");

    if (yearText) {
      yearText.textContent =
        `© ${new Date().getFullYear()} ANVITHA PRIYAA V S`;
    }
  }

  // Active navigation link
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  const navLinks = document.querySelectorAll(
    ".header nav a[href^='#']"
  );

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentSection}`
      );
    });
  });

  // Current year and page loaded
  document.body.classList.add("loaded");

});
