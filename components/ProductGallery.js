"use client";

import { useState } from "react";

export default function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

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
