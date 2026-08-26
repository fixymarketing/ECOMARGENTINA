(function () {
  'use strict';

  var modal = document.getElementById('effix-benefit-modal');
  if (!modal) return;

  var closeButton = document.getElementById('effix-benefit-close');
  var overlay = document.getElementById('effix-benefit-overlay');
  var communityCta = document.getElementById('effix-community-cta');
  var card = modal.querySelector('.effix-benefit-card');
  var sessionKey = 'ecom_arg_effix_benefit_dismissed';
  var previousFocus = null;

  function wasDismissed() {
    try {
      return window.sessionStorage.getItem(sessionKey) === 'true';
    } catch (error) {
      return false;
    }
  }

  function rememberDismissal() {
    try {
      window.sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      // The popup can still close when storage is unavailable.
    }
  }

  function openBenefit() {
    if (wasDismissed()) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('effix-benefit-open');
    window.requestAnimationFrame(function () {
      if (card) card.focus();
    });
  }

  function closeBenefit() {
    if (modal.hidden) return;
    rememberDismissal();
    modal.hidden = true;
    document.body.classList.remove('effix-benefit-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  if (closeButton) closeButton.addEventListener('click', closeBenefit);
  if (overlay) overlay.addEventListener('click', closeBenefit);
  if (communityCta) communityCta.addEventListener('click', closeBenefit);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) closeBenefit();
  });

  window.setTimeout(openBenefit, 600);
})();
