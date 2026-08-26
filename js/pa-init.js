// Inicialización de Plausible Analytics — externalizada para cumplir CSP (script-src 'self').
// Stub + cola: cuando carga el script real (/u/p.js, async) procesa esta config.
window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init({ endpoint: "/u/event" });
