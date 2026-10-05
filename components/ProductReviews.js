"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";

export default function ProductReviews({ productId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);

  function handleNewReview(review) {
    setReviews((prev) => [review, ...prev]);
  }

  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / count : 0;
  const roundedStars = Math.round(average);

  return (
    <section className="product-reviews">
      <div className="section-head" style={{ paddingTop: 0 }}>
        <h2>Reviews</h2>
        {count > 0 && (
          <span className="product-reviews-summary">
            <span className="product-reviews-stars">
              {"★".repeat(roundedStars)}
              {"☆".repeat(5 - roundedStars)}
            </span>
            {average.toFixed(2)} ({count})
          </span>
        )}
      </div>

      <ReviewForm productId={productId} onSubmitted={handleNewReview} />

      {count === 0 ? (
        <p className="product-reviews-empty">No reviews yet — be the first to leave one.</p>
      ) : (
        <div className="product-reviews-list">
          {reviews.map((r, i) => {
            const stars = r.rating || 5;
            return (
              <div className="product-review-card" key={`${r.name}-${i}`}>
                <div className="product-review-head">
                  <span className="testimonial-stars">
                    {"★".repeat(stars)}
                    {"☆".repeat(5 - stars)}
                  </span>
                  <span className="product-review-name">{r.name}</span>
                </div>
                <p className="product-review-text">{r.text}</p>
                {r.photo_url && <img src={r.photo_url} alt="" className="product-review-photo" />}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
