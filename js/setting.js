gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

let x = 89 / 79;

gsap.set(".image", { scale: 1 / x });