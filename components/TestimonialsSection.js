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
      <ReviewForm onSubmitted={handleNewReview} />
    </>
  );
}
