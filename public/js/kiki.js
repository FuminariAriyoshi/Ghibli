(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_kiki',
    imageSelector: '.image_kiki',
    textSelector: '.kiki',
  });
})();
