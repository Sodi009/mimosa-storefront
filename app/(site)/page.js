import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewsSection from "@/components/ReviewsSection";

const CATEGORIES = [
  {
    name: "Bags",
    handle: "bags",
    icon: (
      <path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z M9 8V6a3 3 0 0 1 6 0v2" />
    ),
  },
  {
    name: "Tops",
    handle: "tops",
    icon: (
      <path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-2L8 4Z" />
    ),
  },
  {
    name: "Dresses",
    handle: "dresses",
    icon: (
      <path d="M9 3h6l1 3-2 1 4 13H6l4-13-2-1 1-3Z M10 3l2 2 2-2" />
    ),
  },
  {
    name: "Bottoms",
    handle: "bottoms",
    icon: (
      <path d="M7 3h10L17 21H13L13 6H11L11 21H7Z" />
    ),
  },
  {
    name: "Innerwears",
    handle: "innerwear",
    icon: (
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4 6.4 4c2 0 3.6 1.2 4.6 2.8C12 5.2 13.6 4 15.6 4c4 0 5.9 4 4.4 7.7-2.5 4.7-10 9.3-10 9.3Z" />
    ),
  },
  {
    name: "Shoes",
    handle: "shoes",
    icon: (
      <path d="M3 16c0-1 1-2 2-2s1.5.5 2.5.5S9 13 10 12c1-1 2-1 3 0 1.5 1.5 3 2 5 2 1.5 0 3 1 3 3v1H3v-2Z" />
    ),
  },
  {
    name: "Accessories",
    handle: "accessories",
    icon: (
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    ),
  },
  {
    name: "Supplements",
    handle: "supplements",
    icon: (
      <path d="M8.3 15.7 15.7 8.3a3.3 3.3 0 1 1 4.7 4.7l-7.4 7.4a3.3 3.3 0 1 1-4.7-4.7Z M10.8 10.8l3.1 3.1" />
    ),
  },
  {
    name: "Beauty & Cosmetic",
    handle: "beauty-cosmetics",
    icon: (
      <path d="M9 2h6l-1 6-2 2-2-2-1-6Z M10 10h4v10a2 2 0 0 1-2 2 2 2 0 0 1-2-2V10Z" />
    ),
  },
  {
    name: "Hair Tools",
    handle: "hair-tools",
    icon: (
      <path d="M6 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z M7.5 8.3 19 19 M7.5 15.7 19 5" />
    ),
  },
  {
    name: "Foods",
    handle: "foods",
    icon: (
      <path d="M5 2v7a2 2 0 0 0 2 2v11 M5 2v6 M8 2v6 M11 2v7a2 2 0 0 1-2 2 M17 2c-2.5 1-4 3.5-4 6.5 0 2.3 1.3 3.8 3 4.3V21" />
    ),
  },
  {
    name: "Contact Lens and Glasses",
    handle: "contact-lens-glasses",
    icon: (
      <path d="M2 13a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z M14 13a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z M10 12h4 M1 11l1.5-4 M23 11l-1.5-4" />
    ),
  },
  {
    name: "Sister Hood Bras",
    handle: "sister-hood-bras",
    icon: (
      <path d="M12 2.5 14.2 8.8 21 9l-5.4 4.4L17.6 20 12 16.3 6.4 20l2-6.6L3 9l6.8-.2 2.2-6.3Z" />
    ),
  },
  {
    name: "Wallet",
    handle: "wallet",
    icon: (
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z M15.5 11h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a2 2 0 0 1 0-4Z" />
    ),
  },
];

const TESTIMONIALS = [
  {
    name: "Htet Htet Wai",
    text: "Honestly, I really recommend this page. I'm so happy with the products I received — everything was packed nicely, the quality is really good, and the products are exactly as shown. The seller is also very kind and helpful, and I really appreciate how they answered my questions and helped me choose the right products. I'll definitely order again.",
  },
  {
    name: "Elizabeth Bennet",
    text: "Quality is the best and price is affordable. Highly recommend this page.",
  },
  {
    name: "Min Khant Naing",
    text: "Fair price. Good customer service.",
  },
  {
    name: "War War Hlaing",
    text: "ဒီထက်ပိုပြီး အောင်မြင်ပါစေရှင့်။ ပို့စ်တင်တိုင်း ဝင်ကြည့်ဖြစ်တယ်။ အိတ်တွေရဲ့ quality ကို အရမ်းကြိုက်တယ်🤍",
  },
  {
    name: "Wai Lwin Soe",
    text: "Quality ကောင်း၊ ဝန်ဆောင်မှုကောင်း၊ ယုံကြည်စိတ်ချရသော ဈေးနှုန်းတန်သော page လေး အောင်မြင်ပါစေ။",
  },
  {
    name: "Dar Dar Soe",
    text: "ပစ္စည်းမှန် ဈေးတန်သော online shop page လေးပါ။",
  },
  {
    name: "Aung Kyaw Myint",
    text: "ယုံကြည်စိတ်ချရတဲ့ page လေးပါ။ ပစ္စည်းအရည်အသွေးကောင်း စျေးနှုန်းချိုသာပါတယ်။",
  },
  {
    name: "Thet Phoo Wai",
    text: "page ကတင်သမျှ အကုန်ကြိုက်တယ်။ ဒီထက်မက အောင်မြင်ပါစေ 🤎",
  },
  {
    name: "Myint Mo Oo",
    text: "ဈေးမှန်ပြီး quality ရှိတဲ့ အိတ်တွေတစ်စုထုရနိုင်မယ့် page မှန်ကန်စိတ်ချရပါတယ်ရှင့် ❤️",
  },
  {
    name: "Moe Phyu Phyu Zaw",
    text: "Customer service ကောင်းပြီး Quality လည်း စိတ်ချရတဲ့ page လေး ဒီထက်မက အောင်မြင်ပါစေ ❤️",
  },
  {
    name: "April May",
    text: "ပစ္စည်းမှန် ဈေးတန်တဲ့အပြင် Quality လဲ ပြောစရာမလိုတဲ့ ဆိုင်လေးမို့ ယုံကြည်ပြီး ဝယ်လို့ရပါတယ်နော် 🥰",
  },
  {
    name: "Ngwe Lwin Soe",
    text: "တင်မျှရောင်းသမျှ အကုန်ရောင်းထွက်ပါစေ။ ပစ္စည်းလေးတွေမြင်ရတာ စိတ်ကျေနပ်ဖြစ်ပါတယ်။",
  },
];

export default async function HomePage() {
  let products = [];
  let configError = null;

  try {
    products = await getProducts({ first: 8 });
  } catch (err) {
    configError = err.message;
  }

  return (
    <main className="wrap">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">Mimosa BKK Collection</p>
          <h1>Your BKK wardrobe awaits in Dubai.</h1>
          <p>
            Curated finds sourced and packed in Bangkok, delivered straight to your door
            in Dubai. Add what you like to your bag, send your order on WhatsApp, and
            we'll confirm stock before you pay.
          </p>
          <a href="/collections/all" className="btn-primary">
            Shop the collection
          </a>
        </div>
        <div className="hero-image">
          <div className="hero-image-inner">
            {products[0]?.featuredImage && (
              <img src={products[0].featuredImage.url} alt={products[0].featuredImage.altText || ""} />
            )}
          </div>
        </div>
      </section>

      <div className="section-head">
        <h2>Shop by category</h2>
      </div>
      <div className="category-rail">
        {CATEGORIES.map((cat) => (
          <a key={cat.handle} href={`/collections/${cat.handle}`} className="category-rail-item">
            <span className="category-rail-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {cat.icon}
              </svg>
            </span>
            <span className="category-rail-name">{cat.name}</span>
          </a>
        ))}
      </div>

      <section className="how-it-works">
        <div className="how-step">
          <span className="how-step-num">01</span>
          <p className="how-step-title">Browse &amp; add to bag</p>
          <p className="how-step-desc">Pick what you like from the collection below.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">02</span>
          <p className="how-step-title">Send on WhatsApp</p>
          <p className="how-step-desc">Your bag becomes a message — just hit send.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">03</span>
          <p className="how-step-title">Confirm &amp; pay</p>
          <p className="how-step-desc">We confirm stock, then arrange bank transfer.</p>
        </div>
        <div className="how-step">
          <span className="how-step-num">04</span>
          <p className="how-step-title">Delivered in Dubai</p>
          <p className="how-step-desc">Track your order anytime on our tracking page.</p>
        </div>
      </section>

      <div className="section-head">
        <h2>New in</h2>
        <a href="/collections/all">View all</a>
      </div>

      {configError && (
        <p style={{ color: "var(--muted)", paddingBottom: 40 }}>
          Products will appear here once added in the admin panel. ({configError})
        </p>
      )}

      {!configError && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Suspense fallback={<TestimonialsSection initialReviews={TESTIMONIALS} />}>
        <ReviewsSection curatedReviews={TESTIMONIALS} />
      </Suspense>
    </main>
  );
}