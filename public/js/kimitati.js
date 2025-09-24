(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_kimitati',
    imageSelector: '.image_kimitati',
    textSelector: '.kimitati',
  });
})();
