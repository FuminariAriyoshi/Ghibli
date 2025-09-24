(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_kaguya',
    imageSelector: '.image_kaguya',
    textSelector: '.kaguya',
  });
})();
