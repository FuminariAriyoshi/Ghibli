let x = 89 / 79;

let tl1 = gsap.timeline({
  scrollTrigger: {
    trigger: ".block_kaguya",
    start: "top 80%",
    end: "center 50%",
    scrub: true,
    markers: true

  }
});

tl1.to(".image_kaguya", { scale: 1, ease: "expo.in", duration: 1 }, 0);
tl1.to(".kaguya", { opacity: 1, ease: "expo.in", duration: 1 }, 0);

let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".block_kaguya",
    start: "center 50%",
    end: "bottom 20%",
    scrub: true,
    markers: true

  }
});

tl2.to(".image_kaguya", { scale: 1 / x, ease: "expo.out", duration: 1 }, 0);
tl2.to(".kaguya", { opacity: 0, ease: "expo.out", duration: 1 }, 0);
