/* --------------------------------------------------------開始スクロール*/

export let startScrolling = false;

export function enableScrolling() {
  startScrolling = true;
}

export function disableScrolling() {
  startScrolling = false;
}

Webflow.push(function () {
  enableScrolling();

  const target = document.querySelector("#container_laputa");
  const half = target.offsetTop + target.offsetHeight / 2 - window.innerHeight / 2;

  gsap.to(window, {
    duration: 2,
    scrollTo: { y: half },
    ease: "back.out(2)",
    onComplete: () => disableScrolling()
  });
});
/* --------------------------------------------------------スクロール判定*/

const sections = document.querySelectorAll(".container"); // セクションの配列
let scrollIndex = 1; // 現在のセクション番号
let isScrolling = false; // スクロール中かどうかのフラグ

const scrollToIndex = (index) => {
  if (index < 0) index = 0;
  if (index >= sections.length) index = sections.length - 1;

  const target = sections[index];
  const y = target.offsetTop + target.offsetHeight / 2 - window.innerHeight / 2;

  isScrolling = true;
  gsap.to(window, {
    duration: 0.6,
    scrollTo: { y },
    ease: "power2.inOut",
    onComplete: () => isScrolling = false
  });
};

window.addEventListener("wheel", (e) => {
  e.preventDefault(); // ← これで通常スクロール完全停止

  if (isScrolling) return; // アニメーション中は無視

  if (e.deltaY > 0 && scrollIndex < sections.length - 1) {
    scrollIndex++;
    scrollToIndex(scrollIndex);
  } else if (e.deltaY < 0 && scrollIndex > 0) {
    scrollIndex--;
    scrollToIndex(scrollIndex);
  }
}, { passive: false });

// --------------------------------------------------------無限スクロール

