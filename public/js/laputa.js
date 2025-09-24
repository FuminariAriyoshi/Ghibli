(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_laputa',
    imageSelector: '.image_laputa',
    textSelector: '.laputa',
  });
})();
