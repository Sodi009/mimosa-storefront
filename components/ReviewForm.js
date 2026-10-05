"use client";

import { useState } from "react";
import { submitReview, getReviewUploadUrl } from "@/lib/reviews";
import { supabasePublic } from "@/lib/supabase-public";
import { compressImage } from "@/lib/compress-image";

export default function ReviewForm({ productId, onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const { path, token, publicUrl } = await getReviewUploadUrl(compressed.name);
      const { error: uploadError } = await supabasePublic.storage
        .from("review-images")
        .uploadToSignedUrl(path, token, compressed);
      if (uploadError) throw new Error(uploadError.message);
      setPhotoUrl(publicUrl);
    } catch {
      setError("Couldn't upload that photo — you can still submit without it.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !text.trim() || rating === 0) {
      setError("Please add your name, a star rating, and a short review.");
      return;
    }

    setSubmitting(true);
    const result = await submitReview({
      name: name.trim(),
      rating,
      text: text.trim(),
      productId,
      photoUrl: photoUrl || undefined,
    });
    setSubmitting(false);

    if (result.success) {
      onSubmitted?.({ name: name.trim(), rating, text: text.trim(), photo_url: photoUrl || null });
      setName("");
      setRating(0);
      setText("");
      setPhotoUrl("");
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
      <div className="review-photo-field">
        {photoUrl ? (
          <div className="review-photo-preview">
            <img src={photoUrl} alt="" />
            <button type="button" onClick={() => setPhotoUrl("")}>Remove</button>
          </div>
        ) : (
          <label className="btn-secondary review-photo-btn">
            {uploadingPhoto ? "Uploading…" : "Add a photo (optional)"}
            <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploadingPhoto} hidden />
          </label>
        )}
      </div>
      {error && <p className="track-error">{error}</p>}
      <button type="submit" className="btn-primary" disabled={submitting || uploadingPhoto}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
