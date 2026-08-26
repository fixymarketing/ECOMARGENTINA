// Video de la misión EFFIX 2026: arranca en el segundo 20 y reproduce automáticamente.
(function () {
  var missionVideo = document.getElementById('effix-video');
  if (!missionVideo) return;
  missionVideo.addEventListener('loadedmetadata', function () {
    missionVideo.currentTime = 20;
    missionVideo.play();
  });
  missionVideo.load();
})();
