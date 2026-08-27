/* Mapa de la feria — zoom, paneo y foco en el stand */
(function () {
  var vp = document.getElementById('mapa-viewport');
  var svg = document.getElementById('mapa-svg');
  var g = document.getElementById('mapa-zoomable');
  if (!vp || !svg || !g) return;

  var VB = { w: 6124, h: 2700 };
  var state = { scale: 1, x: 0, y: 0 };
  var MIN = 1, MAX = 7;
  var label = document.getElementById('mapa-zoom-label');

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function limit() {
    var maxX = (state.scale - 1) * VB.w;
    var maxY = (state.scale - 1) * VB.h;
    state.x = clamp(state.x, -maxX, 0);
    state.y = clamp(state.y, -maxY, 0);
  }

  function apply(anim) {
    limit();
    g.classList.toggle('no-anim', !anim);
    g.setAttribute('transform', 'translate(' + state.x.toFixed(1) + ' ' + state.y.toFixed(1) + ') scale(' + state.scale.toFixed(3) + ')');
    if (label) label.textContent = Math.round(state.scale * 100) + '%';
  }

  function zoomAt(factor, cx, cy, anim) {
    var prev = state.scale;
    var next = clamp(prev * factor, MIN, MAX);
    if (next === prev) return;
    // mantener el punto (cx,cy) del viewBox fijo
    state.x = cx - (cx - state.x) * (next / prev);
    state.y = cy - (cy - state.y) * (next / prev);
    state.scale = next;
    apply(anim !== false);
  }

  function center() { return { cx: (VB.w / 2 - state.x) / state.scale, cy: (VB.h / 2 - state.y) / state.scale }; }

  var zin = document.getElementById('mapa-zoom-in');
  var zout = document.getElementById('mapa-zoom-out');
  var reset = document.getElementById('mapa-reset');
  var goto_ = document.getElementById('mapa-goto');

  if (zin) zin.addEventListener('click', function () { var c = center(); zoomAt(1.5, c.cx * state.scale + state.x, c.cy * state.scale + state.y); });
  if (zout) zout.addEventListener('click', function () { var c = center(); zoomAt(1 / 1.5, c.cx * state.scale + state.x, c.cy * state.scale + state.y); });
  if (reset) reset.addEventListener('click', function () { state = { scale: 1, x: 0, y: 0 }; apply(true); });

  function focusStand() {
    var el = document.getElementById('stand-ar');
    if (!el) return;
    var b = el.getBBox();
    var s = 3.4;
    state.scale = s;
    state.x = VB.w / 2 - (b.x + b.width / 2) * s;
    state.y = VB.h / 2 - (b.y + b.height / 2) * s;
    apply(true);
  }
  if (goto_) goto_.addEventListener('click', focusStand);

  // rueda del mouse (con ctrl o sobre el mapa)
  vp.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) < 1) return;
    e.preventDefault();
    var r = vp.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width * VB.w;
    var py = (e.clientY - r.top) / r.height * VB.h;
    zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, px, py, false);
  }, { passive: false });

  // paneo con mouse / touch
  var drag = null;
  function down(e) {
    var t = e.touches ? e.touches[0] : e;
    drag = { x: t.clientX, y: t.clientY, sx: state.x, sy: state.y };
    vp.classList.add('is-panning');
  }
  function move(e) {
    if (!drag) return;
    var t = e.touches ? e.touches[0] : e;
    var r = vp.getBoundingClientRect();
    var k = VB.w / r.width;
    state.x = drag.sx + (t.clientX - drag.x) * k;
    state.y = drag.sy + (t.clientY - drag.y) * k;
    apply(false);
    if (e.cancelable) e.preventDefault();
  }
  function up() { drag = null; vp.classList.remove('is-panning'); }

  vp.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  vp.addEventListener('touchstart', down, { passive: true });
  vp.addEventListener('touchmove', move, { passive: false });
  vp.addEventListener('touchend', up);

  // doble click / doble tap: acerca
  vp.addEventListener('dblclick', function (e) {
    var r = vp.getBoundingClientRect();
    zoomAt(1.8, (e.clientX - r.left) / r.width * VB.w, (e.clientY - r.top) / r.height * VB.h);
  });

  apply(false);
})();
