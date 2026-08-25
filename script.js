(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const themeToggle = document.getElementById("themeToggle");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const backToTop = document.getElementById("backToTop");
  const year = document.getElementById("year");
  const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const revealItems = [...document.querySelectorAll(".reveal")];

  const preferredTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (preferredTheme === "light" || preferredTheme === "dark") {
    root.dataset.theme = preferredTheme;
  } else {
    root.dataset.theme = systemPrefersLight ? "light" : "dark";
  }

  function updateThemeLabel() {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  }

  updateThemeLabel();

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("portfolio-theme", nextTheme);
    updateThemeLabel();
  });

  function setMenu(open) {
    menuButton.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  menuButton.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle("scrolled", scrollY > 18);
    backToTop.classList.toggle("visible", scrollY > 650);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    revealObserver.observe(item);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = visible.target.id;

      navLinks.forEach((link) => {
        const matches = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", matches);

        if (matches) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      threshold: [0.18, 0.35, 0.55],
      rootMargin: "-18% 0px -55% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  year.textContent = new Date().getFullYear();
})();
