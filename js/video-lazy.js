/* Carga diferida de los videos de fondo: el archivo se descarga recien
   cuando la seccion esta por entrar en pantalla. Hasta entonces se ve el poster. */
(function () {
  var vids = [].slice.call(document.querySelectorAll('video[data-lazy]'));
  if (!vids.length) return;

  function load(v) {
    if (v.getAttribute('data-loaded')) return;
    v.setAttribute('data-loaded', '1');
    [].forEach.call(v.querySelectorAll('source[data-src]'), function (s) {
      s.src = s.getAttribute('data-src');
    });
    v.load();
    if (v.autoplay) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  if (!('IntersectionObserver' in window)) { vids.forEach(load); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '400px 0px' });

  vids.forEach(function (v) { io.observe(v); });
})();
