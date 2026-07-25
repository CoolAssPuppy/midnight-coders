import type { ReactElement } from "react";

import type { BaseNotification, Registry, RegistryEntry } from "./types";

/**
 * Build one registry entry with its variant narrowed.
 *
 * Without this, every entry's callbacks receive the full notification union
 * and each template call needs a cast. Pairing the type string with its
 * handlers lets TypeScript infer which variant an entry is for.
 *
 *   export const REGISTRY = defineRegistry<Notification>([
 *     forType("training.purchased", {
 *       subject: () => "Your training is booked",
 *       render: (n) => <TrainingPurchase {...n.data} />,
 *     }),
 *   ]);
 */
export function forType<N extends BaseNotification, T extends N["type"]>(
  type: T,
  entry: {
    subject: (notification: Extract<N, { type: T }>) => string;
    render: (notification: Extract<N, { type: T }>) => ReactElement;
  },
): [T, RegistryEntry<Extract<N, { type: T }>>] {
  return [type, entry];
}

/**
 * Assemble entries into a registry.
 *
 * Deliberately not exhaustiveness-checked at runtime: a missing type is caught
 * by `Registry<N>` requiring a key per union member, and the notifier returns
 * a non-retryable error rather than throwing if one slips through anyway.
 */
export function defineRegistry<N extends BaseNotification>(
  entries: ReadonlyArray<[N["type"], RegistryEntry<never>]>,
): Registry<N> {
  return Object.fromEntries(entries) as Registry<N>;
}
