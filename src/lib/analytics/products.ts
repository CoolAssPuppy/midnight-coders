import type { Product } from "./types";

export const PRODUCTS: Record<string, Product> = {
  digitalEdition: {
    item_id: "midnight-coders-digital",
    item_name: "The Midnight Coder's Children (Digital Edition)",
    item_category: "Ebook",
    price: 14.99,
    currency: "USD",
  },
} as const;
