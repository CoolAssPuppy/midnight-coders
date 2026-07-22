/**
 * A product in the catalog for ecommerce event tracking.
 * Prices are in major units (dollars); each destination converts as needed.
 */
export interface Product {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  currency: string;
}

/**
 * Any analytics destination must implement this interface.
 * Add a destination by creating a module in `destinations/` that exports an
 * object satisfying this type, then register it in the array in `index.ts`.
 * Each destination is responsible for filtering out events it does not care
 * about.
 */
export interface AnalyticsDestination {
  readonly name: string;
  send(event: string, properties: Record<string, unknown>): void;
  identify?(userId: string, traits?: Record<string, unknown>): void;
}
