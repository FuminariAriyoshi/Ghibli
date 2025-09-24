let x = 89 / 79;

import { startScrolling } from './scroll-detect.js';

if (!startScrolling) {
  let tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".block_laputa",
      start: "top 80%",
      end: "center 50%",
      scrub: true,
      markers: true

    }
  });

  tl1.to(".image_laputa", { scale: 1, ease: "expo.in", duration: 1 }, 0);
  tl1.to(".laputa", { opacity: 1, ease: "expo.in", duration: 1 }, 0);
} else {

  const tl0 = gsap.timeline({
    scrollTrigger: {
      trigger: ".block_wind",
      start: ""
    }
  })
  tl0.to(".image_wind", { scale: 1, ease: "expo.in", duration: 1 }, 0);
  tl0.to(".wind", { opacity: 1, ease: "expo.in", duration: 1 }, 0);
};

let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".block_laputa",
    start: "center 50%",
    end: "bottom 20%",
    scrub: true,
    markers: true

  }
});

tl2.to(".image_laputa", { scale: 1 / x, ease: "expo.out", duration: 1 }, 0);
tl2.to(".laputa", { opacity: 0, ease: "expo.out", duration: 1 }, 0);
