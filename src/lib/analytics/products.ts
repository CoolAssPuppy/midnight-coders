import type { Product } from "./types";

export const PRODUCTS: Record<string, Product> = {
  paperback: {
    item_id: "B0H9BLKH9M",
    item_name: "The Midnight Coder's Children",
    item_category: "Paperback",
    price: 18.99,
    currency: "USD",
  },
  digitalEdition: {
    item_id: "midnight-coders-digital",
    item_name: "The Midnight Coder's Children (Digital Edition)",
    item_category: "Ebook",
    price: 14.99,
    currency: "USD",
  },
} as const;
