"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

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
        {reviews.map((t, i) => {
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
