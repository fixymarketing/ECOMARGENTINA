document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    if (menuOverlay) menuOverlay.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      setMenu(!hamburger.classList.contains('is-open'));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    if (menuOverlay) menuOverlay.addEventListener('click', () => setMenu(false));
  }

  const normalizePath = (path) => path
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll('.header__nav a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && normalizePath(href) === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
});
