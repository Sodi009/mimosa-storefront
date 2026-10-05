"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

// Keeps the homepage from turning into a very long scroll of reviews —
// the rest are still visible via the Facebook link above the list.
const MAX_VISIBLE = 6;

function maskName(name) {
  const trimmed = (name || "").trim();
  if (trimmed.length <= 2) return trimmed;
  return `${trimmed[0]}***${trimmed[trimmed.length - 1]}`;
}

export default function TestimonialsSection({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);

  function handleNewReview(review) {
    setReviews((prev) => [review, ...prev]);
  }

  const visible = reviews.slice(0, MAX_VISIBLE);
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / count : 0;
  const roundedStars = Math.round(average);

  return (
    <>
      <ReviewForm onSubmitted={handleNewReview} />

      <div className="section-head">
        <h2>What customers say</h2>
        <a
          href="https://www.facebook.com/people/Mimosa-BKK-Collection/61571651470942/"
          target="_blank"
          rel="noopener noreferrer"
        >
          See all on Facebook
        </a>
      </div>

      {count > 0 && (
        <div className="shein-reviews-summary">
          <span className="shein-reviews-average">{average.toFixed(2)}</span>
          <span className="shein-reviews-stars">
            {"★".repeat(roundedStars)}
            {"☆".repeat(5 - roundedStars)}
          </span>
          <span className="shein-reviews-count">({count})</span>
        </div>
      )}

      <div className="shein-reviews">
        {visible.map((t, i) => {
          const stars = t.rating || 5;
          return (
            <div className="shein-review-row" key={`${t.name}-${i}`}>
              <div className="shein-review-head">
                <span className="shein-review-name">{maskName(t.name)}</span>
                <span className="shein-review-stars">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </span>
              </div>
              <p className="shein-review-text">{t.text}</p>
              {t.photo_url && <img src={t.photo_url} alt="" className="shein-review-photo" />}
            </div>
          );
        })}
      </div>
    </>
  );
}
