(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const navLinks = [...document.querySelectorAll('#primary-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Buka menu navigasi');
    nav.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Buka menu navigasi' : 'Tutup menu navigasi');
    nav?.classList.toggle('is-open', !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      navLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });

    sections.forEach((section) => observer.observe(section));
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // The CV controls appear only when the real PDF exists beside the page.
  fetch('assets/docs/cv-nabil-pradipta.pdf', { method: 'HEAD', cache: 'no-store' })
    .then((response) => {
      if (!response.ok) return;
      document.querySelectorAll('[data-cv-link]').forEach((link) => { link.hidden = false; });
      const resume = document.querySelector('[data-cv-section]');
      if (resume) resume.hidden = false;
    })
    .catch(() => {
      // Local-file previews or offline servers may not support HEAD requests.
      // In that case the CV controls remain hidden instead of linking to a dead file.
    });
})();
