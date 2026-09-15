# Mimosa BKK — Storefront

A headless storefront: your own design, product data pulled live from Shopify's
Storefront API, and checkout handled over WhatsApp instead of Shopify's payment flow.

**How checkout works:** a customer adds items to their bag, taps "Order via WhatsApp,"
and WhatsApp opens with a prefilled message listing what they want. They hit send, you
reply on WhatsApp to confirm stock, and once confirmed they pay by bank transfer. No
payment gateway is wired up — Shopify is used purely as your product catalog (and,
optionally, your inventory/order records if you keep using its admin).

## 1. Get your Shopify Storefront API token

1. In your Shopify admin: **Settings → Apps and sales channels → Develop apps**
2. Click **Create an app**, name it (e.g. "Storefront"), click **Configure Storefront API scopes**
3. Enable at least: `unauthenticated_read_product_listings`, `unauthenticated_read_products`
4. Install the app, then copy the **Storefront API access token** it gives you
5. Your store domain is the `your-store.myshopify.com` one, found in Settings → Domains

## 2. Set up locally

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in:
- `SHOPIFY_STORE_DOMAIN` — your `.myshopify.com` domain
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — the token from step 1
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — the number orders should land on (digits only, with country code, no `+`)

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 3. Add products

Add products in your Shopify admin as usual (Products → Add product). They'll show up
on the storefront automatically — no code changes needed. To feature a curated set,
create a Collection in Shopify and link to `/collections/<collection-handle>`.

## 4. Customize

- **Colors/fonts/spacing:** `app/globals.css` — all design tokens are CSS variables at the top
- **Hero copy:** `app/page.js`
- **WhatsApp message wording:** `lib/whatsapp.js`
- **Nav links:** `components/Header.js`

## 5. Deploy

Easiest path is [Vercel](https://vercel.com) (built by the Next.js team, free tier is
enough for this): push this folder to a GitHub repo, import it in Vercel, add the same
three environment variables in the Vercel project settings, deploy.

## Project structure

```
app/
  layout.js              root layout, fonts, cart provider
  page.js                homepage
  products/[handle]/     product detail page
  collections/[handle]/  collection listing ("all" = every product)
  globals.css            design tokens + all styling
components/
  Header.js, Footer.js, ProductCard.js, AddToCartButton.js, CartDrawer.js
lib/
  shopify.js             Storefront API queries (products, collections)
  cart-context.js        local cart state (bag), persisted to localStorage
  whatsapp.js            builds the WhatsApp order message + link
```
