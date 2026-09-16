"use client";

import { useState } from "react";
import { submitReview } from "@/lib/reviews";

export default function ReviewForm({ onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !text.trim() || rating === 0) {
      setError("Please add your name, a star rating, and a short review.");
      return;
    }

    setSubmitting(true);
    const result = await submitReview({ name: name.trim(), rating, text: text.trim() });
    setSubmitting(false);

    if (result.success) {
      onSubmitted?.({ name: name.trim(), rating, text: text.trim() });
      setName("");
      setRating(0);
      setText("");
      setSuccess(true);
    } else {
      setError("Something went wrong submitting your review. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="review-form review-form-success">
        <p>Thanks for your review!</p>
        <button type="button" className="btn-secondary" onClick={() => setSuccess(false)}>
          Write another
        </button>
      </div>
    );
  }

  const activeRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <p className="option-label" style={{ marginBottom: 4 }}>
        Write a review
      </p>
      <div className="review-star-picker">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`review-star ${activeRating >= n ? "filled" : ""}`}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <input
        type="text"
        className="track-input"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="track-input review-textarea"
        placeholder="Tell us about your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      {error && <p className="track-error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
