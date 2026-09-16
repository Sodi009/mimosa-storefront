import { getReviews } from "@/lib/reviews";
import TestimonialsSection from "./TestimonialsSection";

// Fetches customer-submitted reviews (from the same slow Google Apps Script
// backend as orders) separately from the rest of the homepage, so a slow
// response never blocks products/hero/categories from rendering.
export default async function ReviewsSection({ curatedReviews }) {
  const submittedReviews = await getReviews();
  return <TestimonialsSection initialReviews={[...submittedReviews, ...curatedReviews]} />;
}
