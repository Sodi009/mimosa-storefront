"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

// Keeps the homepage from turning into a very long scroll of reviews —
// the rest are still visible via the Facebook link above the list.
const MAX_VISIBLE = 6;

export default function TestimonialsSection({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);

  function handleNewReview(review) {
    setReviews((prev) => [review, ...prev]);
  }

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
      <div className="testimonial-grid">
        {reviews.slice(0, MAX_VISIBLE).map((t, i) => {
          const stars = t.rating || 5;
          return (
            <div className="testimonial-card" key={`${t.name}-${i}`}>
              <div className="testimonial-stars">
                {"★".repeat(stars)}
                {"☆".repeat(5 - stars)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <p className="testimonial-name">— {t.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
