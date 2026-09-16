// Thin wrapper around Shopify's Storefront GraphQL API.
// No SDK dependency — just fetch. Keeps the bundle small and the behavior obvious.

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2024-10";

const endpoint = domain
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : null;

async function shopifyFetch({ query, variables }) {
  if (!endpoint || !token) {
    throw new Error(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local"
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    // Always fetch fresh so edits made in Shopify show up immediately —
    // traffic here is low enough that caching isn't worth the staleness.
    cache: "no-store",
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Shopify GraphQL errors:", json.errors);
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data;
}

const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export async function getProducts({ first = 12 } = {}) {
  const query = /* GraphQL */ `
    ${PRODUCT_CARD_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductCard
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { first } });
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle) {
  const query = /* GraphQL */ `
    query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        images(first: 8) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { handle } });
  return data.product;
}

// Auto-categorization by keyword match against the product title, so products
// show up under a category without ever needing to be tagged or assigned to a
// Shopify collection by hand.
export const CATEGORY_KEYWORDS = {
  bags: ["bag", "tote", "purse", "backpack", "handbag", "clutch", "satchel"],
  clothes: [
    "shirt", "tee", "t-shirt", "dress", "jacket", "pants", "trouser", "skirt",
    "blouse", "top", "coat", "jeans", "sweater", "hoodie", "cardigan", "romper",
  ],
  shoes: ["shoe", "sneaker", "boot", "heel", "sandal", "loafer", "flat", "slipper"],
  accessories: [
    "watch", "belt", "sunglasses", "jewelry", "necklace", "bracelet", "ring",
    "earring", "scarf", "hat", "wallet",
  ],
  innerwear: [
    "bra", "bralette", "underwear", "innerwear", "lingerie", "panty", "panties",
    "boxer", "brief", "briefs", "lace",
  ],
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole-word match, not plain substring — otherwise a keyword like "bra"
// would wrongly match "Bracelet" (accessories) since it's just a substring.
function titleMatchesKeyword(title, keyword) {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(title);
}

export async function getProductsByCategory(category, { first = 100 } = {}) {
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords) return [];

  const products = await getProducts({ first });
  return products.filter((product) =>
    keywords.some((keyword) => titleMatchesKeyword(product.title, keyword))
  );
}

export async function getCollectionByHandle(handle, { first = 24 } = {}) {
  const query = /* GraphQL */ `
    ${PRODUCT_CARD_FRAGMENT}
    query CollectionByHandle($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id
        title
        description
        products(first: $first) {
          edges {
            node {
              ...ProductCard
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch({ query, variables: { handle, first } });
  return data.collection;
}

