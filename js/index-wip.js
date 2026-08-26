// Index WIP — Stats bar: contador animado desde 0
(function () {
  var statsBar = document.querySelector('.argentina-market__stats-bar');
  if (!statsBar) return;

  var nums = statsBar.querySelectorAll('.stat__num[data-count]');
  if (!nums.length) return;

  function animate(el, target, duration) {
    var start = performance.now();
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    // Estado inicial en 0
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(tick);
  }

  var fired = false;
  function run() {
    if (fired) return;
    fired = true;
    nums.forEach(function (el) {
      animate(el, parseInt(el.dataset.count, 10), 1600);
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(statsBar);
  } else {
    run();
  }
})();

// Home — Ecosystem verticals + image lightbox
(function () {
  var VERTICALS = [
    { number: '01', title: 'EMPRESA', description: 'Estructura societaria y operación local.', image: 'placeholders/ph-eco-01.svg' },
    { number: '02', title: 'IMPORTACIÓN', description: 'Ingreso de producto y operación internacional.', image: 'placeholders/ph-eco-02.svg' },
    { number: '03', title: 'PAGOS', description: 'Cobros y medios de pago locales.', image: 'placeholders/ph-eco-03.svg' },
    { number: '04', title: 'E-COMMERCE', description: 'Marketplaces, tienda e integraciones.', image: 'placeholders/ph-eco-04.svg' },
    { number: '05', title: 'MARKETING', description: 'Demanda, adquisición y comunicación local.', image: 'placeholders/ph-eco-05.svg' },
    { number: '06', title: 'LOGÍSTICA', description: 'Fulfillment, distribución y última milla.', image: 'placeholders/ph-eco-06.svg' },
    { number: '07', title: 'OPERACIÓN', description: 'Atención, cambios, devoluciones y postventa.', image: 'placeholders/ph-eco-07.svg' },
    { number: '08', title: 'ESCALA', description: 'Datos, automatización y crecimiento.', image: 'placeholders/ph-eco-08.svg' }
  ];
  var IMAGE_BASE = 'images/';
  var grid = document.getElementById('ecosystem-grid');
  if (!grid) return;

  VERTICALS.forEach(function (vertical, index) {
    var card = document.createElement('a');
    card.className = 'ecosystem__item';
    card.href = '#';
    card.dataset.index = index;
    card.setAttribute('aria-label', vertical.title + ': ' + vertical.description);

    var image = document.createElement('img');
    image.src = IMAGE_BASE + vertical.image;
    image.alt = '';
    image.loading = 'lazy';

    var content = document.createElement('span');
    content.className = 'ecosystem__item-content';
    content.innerHTML = '<span class="ecosystem__item-number">' + vertical.number + '</span>' +
      '<strong>' + vertical.title + '</strong>' +
      '<span>' + vertical.description + '</span>';

    card.appendChild(image);
    card.appendChild(content);
    grid.appendChild(card);
  });

  var lightbox = document.getElementById('hlb');
  var lightboxImage = document.getElementById('hlb-img');
  var closeButton = document.getElementById('hlb-close');
  var previousButton = document.getElementById('hlb-prev');
  var nextButton = document.getElementById('hlb-next');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = IMAGE_BASE + VERTICALS[currentIndex].image;
    lightboxImage.alt = VERTICALS[currentIndex].title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showPrevious() {
    openLightbox((currentIndex - 1 + VERTICALS.length) % VERTICALS.length);
  }

  function showNext() {
    openLightbox((currentIndex + 1) % VERTICALS.length);
  }

  grid.addEventListener('click', function (event) {
    var card = event.target.closest('.ecosystem__item');
    if (!card) return;
    event.preventDefault();
    openLightbox(parseInt(card.dataset.index, 10));
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', showPrevious);
  nextButton.addEventListener('click', showNext);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrevious();
    if (event.key === 'ArrowRight') showNext();
  });
})();
