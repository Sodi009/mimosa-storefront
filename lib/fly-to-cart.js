// A small "added to cart" confirmation: the product photo flies from
// where it was on the page to whichever cart icon is currently visible
// (bottom nav on mobile, header on desktop), then the icon pulses. Pure
// DOM/CSS — no React state needed, since it's a one-off visual effect
// that outlives the triggering component's render.
export function flyToCart(imageUrl, sourceRect) {
  if (typeof window === "undefined" || !imageUrl || !sourceRect || !sourceRect.width) return;

  const target = [".bottom-nav-cart", ".cart-toggle"]
    .map((sel) => document.querySelector(sel))
    .find((el) => el && el.getBoundingClientRect().width > 0);
  if (!target) return;

  const targetRect = target.getBoundingClientRect();

  const flyer = document.createElement("img");
  flyer.src = imageUrl;
  flyer.className = "fly-to-cart-ghost";
  flyer.style.left = `${sourceRect.left}px`;
  flyer.style.top = `${sourceRect.top}px`;
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;
  document.body.appendChild(flyer);

  const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  requestAnimationFrame(() => {
    flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
    flyer.style.opacity = "0.25";
  });

  flyer.addEventListener(
    "transitionend",
    () => {
      flyer.remove();
      target.classList.add("cart-pulse");
      setTimeout(() => target.classList.remove("cart-pulse"), 350);
    },
    { once: true }
  );

  // Safety net: if transitionend never fires for some reason, don't leave
  // the ghost element stuck on the page forever.
  setTimeout(() => flyer.remove(), 1200);
}
