"use client";

import { useRouter } from "next/navigation";

export default function CheckoutTopbar() {
  const router = useRouter();

  return (
    <div className="checkout-topbar">
      <div className="wrap">
        <button type="button" className="checkout-back-btn" onClick={() => router.back()}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
