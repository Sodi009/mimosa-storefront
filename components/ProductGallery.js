"use client";

import { useEffect, useState } from "react";

export default function ProductGallery({ images, title, variantImageUrl }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  // When the selected variant (e.g. a color/style) has its own photo,
  // jump the gallery to that image instead of leaving it on whatever
  // was showing before.
  useEffect(() => {
    if (!variantImageUrl) return;
    const idx = images.findIndex((img) => img.url === variantImageUrl);
    if (idx !== -1) setActiveIndex(idx);
  }, [variantImageUrl, images]);

  return (
    <div>
      <div className="pdp-gallery-main">
        {active && <img src={active.url} alt={active.altText || title} />}
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
