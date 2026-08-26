// ECOM ARGENTINA — shared site behavior

// === REVEAL ON SCROLL ===
let _revealObserver = null;

(function () {
  if (!('IntersectionObserver' in window)) return;

  const SELECTORS = [
    '.hero__content',
    '.argentina-market__title',
    '.stat',
    '.stat--card',
    '.argentina-market__desc',
    '.argentina-market__benefit',
    '.otras__left',
    '.video-card',
    '.oradores-hero__left',
    '.orador-featured',
    '.orador-card',
    '.oradores-cta__left',
    '.agenda-hero__top',
    '.sponsors-hero__title',
    '.sponsor-tier',
    '.mapa-hero__top',
    '.mapa-hero__map',
    '.faq-section__heading',
    '.faq-item',
    '.tickets-hero__left',
    '.ticket-card',
    '.oradores-cta__top',
  ];

  _revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        _revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(SELECTORS.join(',')).forEach((el) => {
    el.classList.add('reveal');
    const siblings = el.parentElement.querySelectorAll(':scope > ' + el.tagName + ', :scope > .video-card, :scope > .orador-card, :scope > .ticket-card, :scope > .faq-item');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0 && idx <= 4) el.classList.add(`reveal-delay-${idx}`);
    _revealObserver.observe(el);
  });
})();

function revealEl(el) {
  el.classList.add('reveal');
  if (_revealObserver) _revealObserver.observe(el);
  else el.classList.add('is-visible');
}

document.addEventListener('DOMContentLoaded', () => {

  // === HAMBURGER ===
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    if (menuOverlay) menuOverlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    if (menuOverlay) menuOverlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
  }

  // === ACTIVE NAV ===
  const norm = p => p.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const currentPath = norm(window.location.pathname);
  document.querySelectorAll('.header__nav a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && norm(href) === currentPath) a.setAttribute('aria-current', 'page');
  });

  // === COUNTDOWN CLOSE ===
  const cdClose = document.querySelector('.cd-float__close');
  if (cdClose) {
    cdClose.addEventListener('click', () => {
      document.querySelector('.cd-float').classList.add('is-dismissed');
    });
  }

  // === COUNTDOWN ===
  // Target: 16 de octubre de 2026, Medellín, Colombia (UTC-5)
  const TARGET = new Date('2026-10-16T00:00:00-05:00').getTime();

  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = TARGET - Date.now();
    if (!dEl || diff <= 0) return;
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);

  // === AGENDA EN VIVO TIMER ===
  const vivoEls = document.querySelectorAll('.js-vivo-time');
  if (vivoEls.length) {
    function tickVivo() {
      const now = new Date();
      const bsas = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).format(now);
      vivoEls.forEach(el => el.textContent = bsas);
    }
    tickVivo();
    setInterval(tickVivo, 1000);
  }

  // === AGENDA DINÁMICA ===
  initAgenda();

  // === ORADOR FEATURED CAROUSEL ===
  const oradorPhotos = document.querySelectorAll('.orador-featured__photo');
  const oradorInfos  = document.querySelectorAll('.orador-featured__info');
  const oradorDots   = document.querySelectorAll('.orador-dot');
  if (oradorPhotos.length > 0) {
    let oradorCurrent = 0;
    function oradorShow(i) {
      oradorPhotos.forEach((el, j) => el.classList.toggle('is-active', j === i));
      oradorInfos.forEach((el, j)  => el.classList.toggle('is-active', j === i));
      oradorDots.forEach((el, j)   => el.classList.toggle('is-active', j === i));
    }
    oradorShow(0);
    setInterval(() => { oradorCurrent = (oradorCurrent + 1) % oradorPhotos.length; oradorShow(oradorCurrent); }, 3000);
  }

  // === MODAL YOUTUBE ===
  const ytModal   = document.getElementById('yt-modal');
  const ytIframe  = document.getElementById('yt-iframe');
  const ytOverlay = document.getElementById('yt-overlay');
  const ytClose   = document.getElementById('yt-close');

  function openYT(videoId) {
    ytIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    ytModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeYT() {
    ytModal.hidden = true;
    ytIframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-yt-id]').forEach(el => {
    el.addEventListener('click', () => {
      const videoId = el.dataset.ytId;
      if (!videoId) return;
      openYT(videoId);
    });
  });

  if (ytOverlay) ytOverlay.addEventListener('click', closeYT);
  if (ytClose)   ytClose.addEventListener('click', closeYT);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeYT(); });

  // === SLIDER UNIFICADO ===
  function initSlider(track, dotBtns) {
    if (!track || !dotBtns.length) return;
    const last = dotBtns.length - 1;
    function itemWidth() {
      const item = track.querySelector(':scope > *');
      if (!item) return 1;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 12;
      return item.offsetWidth + gap;
    }
    function syncDots() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const idx = maxScroll > 0
        ? Math.round((track.scrollLeft / maxScroll) * last)
        : 0;
      dotBtns.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
    track.addEventListener('scroll', syncDots, { passive: true });
    dotBtns.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const left = i === last
          ? track.scrollWidth - track.clientWidth
          : i * itemWidth();
        track.scrollTo({ left, behavior: 'smooth' });
      });
    });
    syncDots();
  }

  document.querySelectorAll('.otras__cards').forEach(track => {
    const dotsEl = track.parentElement?.querySelector('.otras__dots');
    if (dotsEl) initSlider(track, Array.from(dotsEl.querySelectorAll('.otras__dot')));
  });

  const orGrid = document.querySelector('.oradores-grid');
  const orDotsEl = orGrid?.parentElement?.querySelector('.oradores-grid__dots');
  if (orGrid && orDotsEl) {
    initSlider(orGrid, Array.from(orDotsEl.querySelectorAll('.oradores-grid__dot')));
  }

  // === ACCORDION FAQ ===
  document.querySelectorAll('.faq-item__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

});

// === AGENDA DINÁMICA ===

const ESCENARIO_CLASS = {
  'Auditorio Principal': 'principal',
  'Escenario Principal': 'principal',
  'Sala':               'sala',
  'Taller':             'taller',
  'Workshop':           'taller',
  'Palco':              'principal',
  'Palco Sur':          'principal',
  'Main Stage':         'mainstage',
  'Aprende':            'aprende',
  'Acelera':            'acelera',
  'Escala':             'escala',
  'Streaming':          'streaming',
};
const AVATAR_COLORS = ['yellow', 'blue', 'purple', 'green'];

function _agInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
function _agAvatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function _agCalLink(titulo, horario, escenario, speaker) {
  const [h, m] = (horario || '09:00').split(':').map(Number);
  const pad2 = n => String(n).padStart(2, '0');
  const start = `20260910T${pad2(h)}${pad2(m)}00`;
  const endM  = (m + 45) % 60;
  const endH  = h + Math.floor((m + 45) / 60);
  const end   = `20260910T${pad2(endH)}${pad2(endM)}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent(titulo)}`
    + `&dates=${start}/${end}`
    + `&ctz=America%2FArgentina%2FBuenos_Aires`
    + `&details=${encodeURIComponent('Speaker: ' + speaker)}`
    + `&location=${encodeURIComponent(escenario)}`;
}

const _SVG_ESCENARIO = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`;
const _SVG_CALENDAR  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

const _TAB_COLORS = {
  mainstage: '#ffe600', aprende: '#22c55e',
  acelera: '#ef4444',   escala: '#38bdf8',
  principal: '#f97316', streaming: '#a855f7',
  sala: '#3b82f6',      taller: '#a855f7',
};

function _agRenderBlocks(blocks, filterEscenario) {
  let workBlocks = blocks;
  if (filterEscenario) {
    workBlocks = blocks
      .map(b => ({ ...b, items: b.items.filter(i => i.escenario === filterEscenario) }))
      .filter(b => b.items.length > 0);
  }

  return workBlocks.map(block => {
    const rows = block.items.map(item => {
      const cls      = ESCENARIO_CLASS[item.escenario] || 'principal';
      const speakers = item.speaker.split(',').map(s => s.trim()).filter(Boolean);
      const avatars  = speakers.map(s =>
        `<span class="agenda-avatar agenda-avatar--${_agAvatarColor(s)}">${_agInitials(s)}</span>`
      ).join('');
      const escenarioPill = filterEscenario
        ? ''
        : `<span class="agenda-escenario agenda-escenario--${cls}">${_SVG_ESCENARIO} ${item.escenario}</span>`;

      return `<div class="agenda-row" data-time="${item.horario}" data-title="${item.titulo.replace(/"/g,'&quot;')}" data-speaker="${item.speaker.replace(/"/g,'&quot;')}" data-escenario="${item.escenario.replace(/"/g,'&quot;')}">
          ${escenarioPill}
          <span class="agenda-row__time">${item.horario}</span>
          <span class="agenda-row__title">${item.titulo}</span>
          <div class="agenda-speaker"><div class="agenda-avatar-group">${avatars}</div><span class="agenda-speaker__name">${item.speaker}</span></div>
          <a class="agenda-row__btn" href="${_agCalLink(item.titulo, item.horario, item.escenario, item.speaker)}" target="_blank" rel="noopener" aria-label="Agregar al calendario">${_SVG_CALENDAR}</a>
        </div>`;
    }).join('');

    const count = block.items.length;
    return `<div class="agenda-block">
        <div class="agenda-block__header">
          <span class="agenda-block__hour">${block.hora}</span>
          <span class="agenda-block__count"><span class="agenda-block__count-num">${count}</span> CHARLA${count !== 1 ? 'S' : ''}</span><span class="agenda-block__line"></span>
        </div>
        <div class="agenda-block__rows">${rows}</div>
      </div>`;
  }).join('');
}

function _agBsAsMinutes() {
  const now = new Date();
  const bsas = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(now);
  const [h, m] = bsas.split(':').map(Number);
  return h * 60 + m;
}

function _agHorarioMinutes(horario) {
  const [h, m] = (horario || '00:00').split(':').map(Number);
  return h * 60 + m;
}

function _agFeaturedCard(item, status) {
  const cls      = ESCENARIO_CLASS[item.escenario] || 'principal';
  const dotColor = cls === 'mainstage' ? 'yellow' : cls === 'aprende' ? 'green' : cls === 'acelera' ? 'red' : cls === 'escala' ? 'cyan' : cls === 'streaming' ? 'purple' : cls === 'principal' ? 'blue' : 'yellow';
  const speakers = item.speaker.split(',').map(s => s.trim()).filter(Boolean);
  const avatars  = speakers.map(s =>
    `<span class="agenda-avatar agenda-avatar--${_agAvatarColor(s)}">${_agInitials(s)}</span>`
  ).join('');
  const statusCls = status === 'live' ? 'agenda-featured__status--live' : 'agenda-featured__status--next';
  const statusTxt = status === 'live' ? 'EN VIVO' : 'A CONTINUACIÓN';

  return `<div class="agenda-featured__card">
    <div class="agenda-featured__card-head">
      <span class="agenda-featured__escenario">
        <span class="agenda-featured__escenario-dot agenda-featured__escenario-dot--${dotColor}"></span>
        ${item.escenario.toUpperCase()}
      </span>
      <span class="agenda-featured__status ${statusCls}">${statusTxt}</span>
    </div>
    <h2 class="agenda-featured__title">${item.titulo}</h2>
    <div class="agenda-speaker">
      <div class="agenda-avatar-group">${avatars}</div>
      <span class="agenda-speaker__name">${item.speaker}</span>
    </div>
  </div>`;
}

function updateFeatured(allItems) {
  const featured = document.getElementById('agenda-featured');
  const liveTag  = document.getElementById('featured-live-tag');
  if (!featured) return;

  const nowMin = _agBsAsMinutes();

  const liveItems = allItems.filter(item => {
    const start = _agHorarioMinutes(item.horario);
    const end   = start + (item.duracion || 45);
    return nowMin >= start && nowMin < end;
  });

  const nextItem = allItems
    .filter(item => _agHorarioMinutes(item.horario) > nowMin)
    .sort((a, b) => _agHorarioMinutes(a.horario) - _agHorarioMinutes(b.horario))[0];

  // Actualizar tag
  if (liveTag) {
    liveTag.textContent = liveItems.length > 0
      ? `EN VIVO · ${liveItems.length} CHARLA${liveItems.length > 1 ? 'S' : ''}`
      : 'PRÓXIMAMENTE';
  }

  // Eliminar cards anteriores (dejar solo la time-col)
  featured.querySelectorAll('.agenda-featured__card').forEach(el => el.remove());

  if (liveItems.length === 0 && !nextItem) return;

  const cards = [
    ...liveItems.map(item => _agFeaturedCard(item, 'live')),
    ...(nextItem ? [_agFeaturedCard(nextItem, 'next')] : []),
  ].join('');

  featured.insertAdjacentHTML('beforeend', cards);
}

async function initAgenda() {
  const container = document.getElementById('agenda-schedule');
  if (!container) return;

  try {
    const res = await fetch(window.AGENDA_SRC || '/api/agenda');
    if (!res.ok) throw new Error('fetch error');
    const blocks = await res.json();
    if (!Array.isArray(blocks) || blocks.length === 0) {
      container.innerHTML = '<div class="agenda-loading">La agenda estará disponible próximamente.</div>';
      return;
    }

    // Aplanar todos los items para el featured
    const allItems = blocks.flatMap(b => b.items);
    updateFeatured(allItems);
    // Refrescar el featured cada minuto
    setInterval(() => updateFeatured(allItems), 60000);

    // Tabs por escenario (solo si existe #agenda-tabs en el DOM)
    const tabsContainer = document.getElementById('agenda-tabs');
    if (tabsContainer) {
      const escenarios = [...new Set(allItems.map(i => i.escenario))];
      tabsContainer.innerHTML = escenarios.map((esc, idx) => {
        const cls   = ESCENARIO_CLASS[esc] || 'principal';
        const color = _TAB_COLORS[cls] || '#ccc';
        return `<button class="agenda-tab${idx === 0 ? ' is-active' : ''}" data-escenario="${esc}">
          <span class="agenda-tab__num">${idx + 1}</span>
          <span class="agenda-tab__label">${esc}</span>
        </button>`;
      }).join('');

      document.querySelector('.agenda-schedule')?.classList.add('is-tabs-active');

      let activeEscenario = escenarios[0];

      function renderFiltered() {
        container.innerHTML = _agRenderBlocks(blocks, activeEscenario);
        container.querySelectorAll('.agenda-block').forEach(el => revealEl(el));
      }

      tabsContainer.querySelectorAll('.agenda-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          tabsContainer.querySelectorAll('.agenda-tab').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          activeEscenario = btn.dataset.escenario;
          renderFiltered();
        });
      });

      renderFiltered();
    } else {
      container.innerHTML = _agRenderBlocks(blocks);
      container.querySelectorAll('.agenda-block').forEach(el => revealEl(el));
    }
  } catch {
    container.innerHTML = '<div class="agenda-loading">La agenda estará disponible próximamente.</div>';
  }
}


// ====================================================
//  ANALYTICS — tracking de visitas de ECOM ARGENTINA
//  Envía un beacon a /api/track con UTMs, referrer y device.
//  La geolocalización la resuelve el servidor (Cloudflare).
// ====================================================
(function () {
  // No trackear el propio dashboard ni entornos automatizados
  if (location.pathname.startsWith('/admin')) return;
  if (navigator.webdriver) return;

  var LS_VID = 'ecom_arg_vid'; // visitor id persistente
  var SS_SID = 'ecom_arg_sid'; // session id
  var SS_UTM = 'ecom_arg_utm'; // UTMs de la sesión (primer toque)

  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function safeGet(store, key) { try { return store.getItem(key); } catch (e) { return null; } }
  function safeSet(store, key, val) { try { store.setItem(key, val); } catch (e) {} }

  // Visitor id + flag de nuevo
  var vid = safeGet(localStorage, LS_VID);
  var isNew = false;
  if (!vid) { vid = uuid(); isNew = true; safeSet(localStorage, LS_VID, vid); }

  // Session id
  var sid = safeGet(sessionStorage, SS_SID);
  if (!sid) { sid = uuid(); safeSet(sessionStorage, SS_SID, sid); }

  // UTMs: se capturan en el primer toque y se conservan durante la sesión
  var params = new URLSearchParams(location.search);
  var utm = {
    source:   params.get('utm_source'),
    medium:   params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    term:     params.get('utm_term'),
    content:  params.get('utm_content'),
  };
  var hasUTM = utm.source || utm.medium || utm.campaign || utm.term || utm.content;
  if (hasUTM) {
    safeSet(sessionStorage, SS_UTM, JSON.stringify(utm));
  } else {
    var stored = safeGet(sessionStorage, SS_UTM);
    if (stored) { try { utm = JSON.parse(stored); } catch (e) {} }
  }

  // Base común a todos los eventos
  function base() {
    return {
      vid: vid,
      sid: sid,
      path: location.pathname,
      referrer: document.referrer || null,
      utm: utm,
      language: navigator.language || null,
      timezone: (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : null,
    };
  }

  function send(extra) {
    var payload = base();
    for (var k in extra) payload[k] = extra[k];
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true });
      }
    } catch (e) { /* nunca romper el sitio por analytics */ }
  }

  // 1) Pageview
  send({ type: 'pageview', isNew: isNew });

  // 2) Eventos de click: inicio del recorrido de entrada y sitios externos
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return; // ignora mailto:, tel:, etc.

    // Click saliente a otro dominio
    if (url.hostname && url.hostname !== location.hostname) {
      send({ type: 'click', event: 'outbound', target: url.href, target_host: url.hostname.replace(/^www\./, '') });
      return;
    }
    // Click hacia los puntos de entrada y contacto de la home
    if (url.pathname === location.pathname && (url.hash === '#como-entrar' || url.hash === '#contacto')) {
      send({ type: 'click', event: 'market_entry', target: url.hash });
    }
  }, true); // captura: corre aunque el handler del link detenga la propagación
})();
