"use client";

import { useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 40;

export default function ProductGallery({ images, title, variantImageUrl }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const active = images[activeIndex];

  // When the selected variant (e.g. a color/style) has its own photo,
  // jump the gallery to that image instead of leaving it on whatever
  // was showing before.
  useEffect(() => {
    if (!variantImageUrl) return;
    const idx = images.findIndex((img) => img.url === variantImageUrl);
    if (idx !== -1) setActiveIndex(idx);
  }, [variantImageUrl, images]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) {
      setActiveIndex((i) => Math.min(i + 1, images.length - 1));
    } else {
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
  }

  return (
    <div className="pdp-gallery">
      <div
        className="pdp-gallery-main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {active && <img src={active.url} alt={active.altText || title} />}
        {images.length > 1 && (
          <span className="pdp-gallery-counter">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="pdp-thumbs">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              className={`pdp-thumb ${i === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={img.url} alt={img.altText || ""} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
