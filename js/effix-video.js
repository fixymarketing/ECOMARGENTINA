// Video de la misión EFFIX 2026: arranca desde el principio y reproduce automáticamente.
(function () {
  var missionVideo = document.getElementById('effix-video');
  if (!missionVideo) return;
  missionVideo.addEventListener('loadedmetadata', function () {
    missionVideo.play();
  });
  missionVideo.load();
})();
