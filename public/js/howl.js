(function () {
  const api = window.GhibliAnimations;
  if (!api || typeof api.createSectionAnimation !== 'function') return;

  api.createSectionAnimation({
    blockSelector: '.block_howl',
    imageSelector: '.image_howl',
    textSelector: '.howl',
  });
})();
