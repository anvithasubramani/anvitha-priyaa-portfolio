
/* =========================================
   ANVITHA PRIYAA VELLAL SUBRAMANI
   Personal Portfolio — JavaScript
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. Automatic footer year */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* 2. Mobile navigation */

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
      }
    });
  }


  /* 3. Scroll reveal animations */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* 4. Active navigation link while scrolling */

  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const sectionId = entry.target.getAttribute("id");

            navItems.forEach((link) => {

              const isActive =
                link.getAttribute("href") === `#${sectionId}`;

              link.classList.toggle("active", isActive);

            });

          }

        });

      },
      {
        rootMargin: "-35% 0px -55% 0px"
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* 5. GitHub repository directory */

  const githubUsername = "anvithasubramani";

  const githubGrid = document.getElementById("github-grid");
  const githubStatus = document.getElementById("github-status");

  const searchInput = document.getElementById("github-search");
  const languageFilter = document.getElementById("language-filter");
  const sortFilter = document.getElementById("sort-filter");

  let repositories = [];

  async function fetchRepositories() {

    if (!githubGrid || !githubStatus) return;

    githubStatus.textContent = "Loading GitHub repositories...";

    githubGrid.innerHTML = "";

    try {

      const allRepositories = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {

        const response = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?type=owner&per_page=100&page=${page}&sort=updated`
        );

        if (!response.ok) {

          if (response.status === 403) {
            throw new Error(
              "GitHub rate limit reached. Please try again later."
            );
          }

          throw new Error(
            `Unable to load repositories (${response.status}).`
          );

        }

        const pageData = await response.json();

        allRepositories.push(...pageData);

        hasMore = pageData.length === 100;
        page++;

      }

      repositories = allRepositories.filter((repo) => !repo.fork);

      populateLanguageFilter();
      displayRepositories();

    } catch (error) {

      console.error("GitHub API error:", error);

      githubStatus.textContent =
        error.message ||
        "Unable to load GitHub repositories. Please visit my GitHub profile.";

      githubGrid.innerHTML = `
        <div class="github-card">
          <h3>Explore my GitHub</h3>
          <p>View my public repositories, experiments and technical projects.</p>
          <a href="https://github.com/${githubUsername}"
             target="_blank"
             rel="noopener noreferrer">
            Visit GitHub profile ↗
          </a>
        </div>
      `;

    }

  }


  /* 6. Populate programming language filter */

  function populateLanguageFilter() {

    if (!languageFilter) return;

    const languages = [
      ...new Set(
        repositories
          .map((repo) => repo.language)
          .filter(Boolean)
      )
    ].sort();

    languageFilter.innerHTML =
      `<option value="all">All languages</option>`;

    languages.forEach((language) => {

      const option = document.createElement("option");

      option.value = language;
      option.textContent = language;

      languageFilter.appendChild(option);

    });

  }


  /* 7. Display repository cards */

  function displayRepositories() {

    if (!githubGrid || !githubStatus) return;

    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const selectedLanguage = languageFilter
      ? languageFilter.value
      : "all";

    const selectedSort = sortFilter
      ? sortFilter.value
      : "updated";

    let filteredRepositories = repositories.filter((repo) => {

      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm) ||
        (repo.description || "").toLowerCase().includes(searchTerm) ||
        (repo.language || "").toLowerCase().includes(searchTerm);

      const matchesLanguage =
        selectedLanguage === "all" ||
        repo.language === selectedLanguage;

      return matchesSearch && matchesLanguage;

    });


    /* Sorting */

    if (selectedSort === "stars") {

      filteredRepositories.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );

    } else if (selectedSort === "name") {

      filteredRepositories.sort(
        (a, b) => a.name.localeCompare(b.name)
      );

    } else {

      filteredRepositories.sort(
        (a, b) =>
          new Date(b.updated_at) - new Date(a.updated_at)
      );

    }


    /* Empty state */

    if (filteredRepositories.length === 0) {

      githubGrid.innerHTML = `
        <div class="github-card">
          <h3>No repositories found</h3>
          <p>Try another search term or language filter.</p>
        </div>
      `;

      githubStatus.textContent = "No matching repositories.";

      return;

    }


    /* Render repository cards */

    githubGrid.innerHTML = "";

    filteredRepositories.forEach((repo) => {

      const card = document.createElement("article");

      card.className = "github-card";

      const title = document.createElement("h3");

      const link = document.createElement("a");

      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;

      title.appendChild(link);


      const description = document.createElement("p");

      description.textContent =
        repo.description || "Explore this project on GitHub.";


      const meta = document.createElement("div");

      meta.className = "github-meta";


      const language = document.createElement("span");

      language.textContent = repo.language || "Other";


      const stars = document.createElement("span");

      stars.textContent = `★ ${repo.stargazers_count}`;


      meta.appendChild(language);
      meta.appendChild(stars);

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);

      githubGrid.appendChild(card);

    });

    githubStatus.textContent =
      `Showing ${filteredRepositories.length} of ${repositories.length} public repositories.`;

  }


  /* 8. GitHub filter events */

  if (searchInput) {
    searchInput.addEventListener("input", displayRepositories);
  }

  if (languageFilter) {
    languageFilter.addEventListener("change", displayRepositories);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", displayRepositories);
  }


  /* 9. Load GitHub repositories */

  fetchRepositories();


  /* 10. Current year and page initialisation complete */

  console.log(
    "Portfolio loaded successfully — Anvitha Priyaa Vellal Subramani"
  );

});
