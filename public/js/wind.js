(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_wind',
    imageSelector: '.image_wind',
    textSelector: '.wind',
  });
})();
