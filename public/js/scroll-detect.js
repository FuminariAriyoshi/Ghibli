const animationAPI = (typeof window !== 'undefined' && window.GhibliAnimations) || {};
const SECTION_CONFIGS = animationAPI.SECTION_CONFIGS || [];
const initializeSectionAnimations =
  animationAPI.initializeSectionAnimations || (() => {});

export let startScrolling = false;

export function enableScrolling() {
  startScrolling = true;
}

export function disableScrolling() {
  startScrolling = false;
}

const SECTION_WRAPPER_SELECTOR = '.section';
const REPEAT_START_SELECTOR = SECTION_CONFIGS[0]?.blockSelector ?? '.block_wind';
const REPEAT_END_SELECTOR =
  SECTION_CONFIGS.find((config) => config.blockSelector === '.block_kiki')?.blockSelector ??
  '.block_kiki';
const ANCHOR_BLOCK_SELECTOR = '.block_howl';
const CLONE_ATTRIBUTE = 'data-loop-clone';
const BOTTOM_SENTINEL_ATTRIBUTE = 'data-loop-bottom-sentinel';
const TOP_SENTINEL_ATTRIBUTE = 'data-loop-top-sentinel';

const state = {
  sections: [],
  scrollIndex: 0,
  isWheelAnimating: false,
  wrapper: null,
  wheelAttached: false,
  template: [],
  anchorSection: null,
  bottomObserver: null,
  bottomSentinel: null,
  topObserver: null,
  topSentinel: null,
  topInitialized: false,
  resizeRaf: null,
};

function stripIds(element) {
  if (element.hasAttribute('id')) {
    element.removeAttribute('id');
  }

  element.querySelectorAll('[id]').forEach((node) => {
    node.removeAttribute('id');
  });
}

function placeBeforeAnchor(wrapper, node, anchor) {
  if (anchor && anchor.parentNode === wrapper) {
    wrapper.insertBefore(node, anchor);
  } else {
    wrapper.appendChild(node);
  }
}

function createSentinel(attribute) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute(attribute, 'true');
  sentinel.style.position = 'relative';
  sentinel.style.width = '1px';
  sentinel.style.height = '1px';
  sentinel.style.marginTop = '1px';
  return sentinel;
}

function updateSections() {
  if (!state.wrapper) return;
  state.sections = Array.from(state.wrapper.querySelectorAll(':scope > section'));

  const activeIndex = getClosestSectionIndex();
  if (activeIndex !== -1) {
    state.scrollIndex = activeIndex;
  }
}

function getClosestSectionIndex() {
  if (!state.sections.length) return -1;

  const viewportCenter = window.scrollY + window.innerHeight / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  state.sections.forEach((section, index) => {
    const sectionCenter = section.offsetTop + section.offsetHeight / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function getSectionOffset(section) {
  return section.offsetTop + section.offsetHeight / 2 - window.innerHeight / 2;
}

function scrollToIndex(index) {
  if (typeof gsap === 'undefined') return;
  if (!state.sections.length) return;

  if (index < 0) index = 0;
  if (index >= state.sections.length) index = state.sections.length - 1;

  const target = state.sections[index];
  if (!target) return;

  state.scrollIndex = index;
  state.isWheelAnimating = true;

  gsap.to(window, {
    duration: 0.6,
    scrollTo: { y: getSectionOffset(target) },
    ease: 'power2.inOut',
    onComplete: () => {
      state.isWheelAnimating = false;
    },
  });
}

function handleWheel(event) {
  if (event.defaultPrevented || startScrolling) return;
  if (!state.sections.length) return;

  if (state.isWheelAnimating) {
    event.preventDefault();
    return;
  }

  event.preventDefault();

  updateSections();

  const currentIndex = getClosestSectionIndex();
  if (currentIndex !== -1) {
    state.scrollIndex = currentIndex;
  }

  if (event.deltaY > 0 && state.scrollIndex < state.sections.length - 1) {
    scrollToIndex(state.scrollIndex + 1);
  } else if (event.deltaY < 0 && state.scrollIndex > 0) {
    scrollToIndex(state.scrollIndex - 1);
  }
}

function attachWheelListener() {
  if (state.wheelAttached) return;

  window.addEventListener('wheel', handleWheel, { passive: false });
  state.wheelAttached = true;
}

function cloneTemplateSections({ template, insertBefore, anchor }) {
  if (!state.wrapper || !template.length) return [];

  const clones = [];

  if (insertBefore) {
    template
      .slice()
      .reverse()
      .forEach((section) => {
        const clone = section.cloneNode(true);
        clone.setAttribute(CLONE_ATTRIBUTE, 'true');
        stripIds(clone);
        state.wrapper.insertBefore(clone, insertBefore);
        clones.unshift(clone);
      });
  } else {
    template.forEach((section) => {
      const clone = section.cloneNode(true);
      clone.setAttribute(CLONE_ATTRIBUTE, 'true');
      stripIds(clone);
      placeBeforeAnchor(state.wrapper, clone, anchor);
      clones.push(clone);
    });
  }

  initializeSectionAnimations();

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

  return clones;
}

function setupBottomLoop(template) {
  const sentinel = createSentinel(BOTTOM_SENTINEL_ATTRIBUTE);
  state.bottomSentinel = sentinel;

  const placeSentinel = () => {
    if (!state.wrapper) return;
    if (sentinel.parentNode) {
      sentinel.parentNode.removeChild(sentinel);
    }
    placeBeforeAnchor(state.wrapper, sentinel, state.anchorSection);
  };

  state.bottomObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        state.bottomObserver?.unobserve(sentinel);
        cloneTemplateSections({ template, anchor: state.anchorSection });
        updateSections();
        state.scrollIndex = getClosestSectionIndex();
        placeSentinel();
        state.bottomObserver?.observe(sentinel);
      });
    },
    { rootMargin: '1000px' },
  );

  placeSentinel();
  state.bottomObserver.observe(sentinel);
}

function setupTopLoop(template) {
  const sentinel = createSentinel(TOP_SENTINEL_ATTRIBUTE);
  state.topSentinel = sentinel;

  const placeSentinel = () => {
    if (!state.wrapper) return;
    if (sentinel.parentNode) {
      sentinel.parentNode.removeChild(sentinel);
    }

    const firstSection = state.wrapper.querySelector(':scope > section');
    if (firstSection) {
      state.wrapper.insertBefore(sentinel, firstSection);
    } else {
      state.wrapper.appendChild(sentinel);
    }
  };

  state.topObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (!state.topInitialized) {
          state.topInitialized = true;
          return;
        }

        state.topObserver?.unobserve(sentinel);

        const firstSection = state.wrapper?.querySelector(':scope > section');
        const clones = firstSection
          ? cloneTemplateSections({ template, insertBefore: firstSection })
          : [];

        const addedHeight = clones.reduce(
          (total, clone) => total + clone.getBoundingClientRect().height,
          0,
        );

        if (addedHeight > 0) {
          window.scrollTo({ top: window.scrollY + addedHeight });
        }

        updateSections();
        const currentIndex = getClosestSectionIndex();
        if (currentIndex !== -1) {
          state.scrollIndex = currentIndex;
        }

        placeSentinel();
        state.topObserver?.observe(sentinel);
      });
    },
    { rootMargin: '1000px' },
  );

  placeSentinel();
  state.topObserver.observe(sentinel);
}

function initInfiniteLoop() {
  state.wrapper = document.querySelector(SECTION_WRAPPER_SELECTOR);
  if (!state.wrapper) return;

  updateSections();
  attachWheelListener();

  const startIndex = state.sections.findIndex((section) =>
    section.querySelector(REPEAT_START_SELECTOR),
  );
  const endIndex = state.sections.findIndex((section) =>
    section.querySelector(REPEAT_END_SELECTOR),
  );

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) return;

  state.template = state.sections.slice(startIndex, endIndex + 1);
  state.anchorSection =
    state.wrapper.querySelector(ANCHOR_BLOCK_SELECTOR)?.closest('section') ?? null;

  setupTopLoop(state.template);
  setupBottomLoop(state.template);
}

function handleResize() {
  state.resizeRaf = null;
  updateSections();
  const currentIndex = getClosestSectionIndex();
  if (currentIndex !== -1) {
    state.scrollIndex = currentIndex;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

function initResizeListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('resize', () => {
    if (state.resizeRaf) {
      cancelAnimationFrame(state.resizeRaf);
    }
    state.resizeRaf = requestAnimationFrame(handleResize);
  });
}

function initAutoScroll() {
  if (typeof Webflow === 'undefined' || typeof Webflow.push !== 'function') {
    return;
  }

  Webflow.push(() => {
    enableScrolling();

    const target = document.querySelector('#container_laputa');
    if (!target || typeof gsap === 'undefined') {
      disableScrolling();
      return;
    }

    const offset = target.offsetTop + target.offsetHeight / 2 - window.innerHeight / 2;

    gsap.to(window, {
      duration: 2,
      scrollTo: { y: offset },
      ease: 'back.out(2)',
      onComplete: () => {
        disableScrolling();
        updateSections();
      },
    });
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfiniteLoop);
  } else {
    initInfiniteLoop();
  }
}

initResizeListener();
initAutoScroll();
