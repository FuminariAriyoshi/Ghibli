gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

const SCALE_RATIO = 89 / 79;

// Set initial scale so images animate from the same baseline
gsap.set('.image', { scale: 1 / SCALE_RATIO });

(function setupAnimationAPI() {
  if (typeof window === 'undefined') return;

  const initializedBlocks = new WeakSet();

  const SECTION_CONFIGS = [
    { blockSelector: '.block_wind', imageSelector: '.image_wind', textSelector: '.wind', markers: true },
    { blockSelector: '.block_kimitati', imageSelector: '.image_kimitati', textSelector: '.kimitati', markers: true },
    { blockSelector: '.block_laputa', imageSelector: '.image_laputa', textSelector: '.laputa', markers: true },
    { blockSelector: '.block_kaguya', imageSelector: '.image_kaguya', textSelector: '.kaguya', markers: true },
    { blockSelector: '.block_kiki', imageSelector: '.image_kiki', textSelector: '.kiki', markers: true },
    { blockSelector: '.block_howl', imageSelector: '.image_howl', textSelector: '.howl', markers: true },
  ];

  function resolveElement(root, selector, fallback) {
    if (!selector) return fallback ?? null;
    if (selector instanceof Element) return selector;
    if (!root) return fallback ?? null;

    return root.matches(selector)
      ? root
      : root.querySelector(selector) ?? fallback ?? null;
  }

  function createSectionAnimation({
    blockSelector,
    imageSelector,
    textSelector,
    markers = true,
  }) {
    if (typeof gsap === 'undefined') return;

    gsap.utils.toArray(blockSelector).forEach((block) => {
      if (!(block instanceof Element) || initializedBlocks.has(block)) return;

      const container =
        block.closest('section, .container') ?? block.parentElement ?? block;

      const image =
        resolveElement(block, imageSelector) ??
        resolveElement(container, imageSelector);

      const text =
        resolveElement(container, textSelector) ??
        resolveElement(block.parentElement, textSelector);

      if (!image || !text) return;

      initializedBlocks.add(block);

      gsap.set(image, { scale: 1 / SCALE_RATIO });

      const tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: 'top 80%',
          end: 'center 50%',
          scrub: true,
          markers,
        },
      });

      tlIn.to(image, { scale: 1, ease: 'expo.in', duration: 1 }, 0);
      tlIn.to(text, { opacity: 1, ease: 'expo.in', duration: 1 }, 0);

      const tlOut = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: 'center 50%',
          end: 'bottom 20%',
          scrub: true,
          markers,
        },
      });

      tlOut.to(image, { scale: 1 / SCALE_RATIO, ease: 'expo.out', duration: 1 }, 0);
      tlOut.to(text, { opacity: 0, ease: 'expo.out', duration: 1 }, 0);
    });
  }

  function initializeSectionAnimations(configs = SECTION_CONFIGS) {
    configs.forEach((config) => createSectionAnimation(config));
  }

  const api = window.GhibliAnimations || {};
  api.SECTION_CONFIGS = SECTION_CONFIGS;
  api.createSectionAnimation = createSectionAnimation;
  api.initializeSectionAnimations = initializeSectionAnimations;
  window.GhibliAnimations = api;
})();
