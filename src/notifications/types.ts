import type { NotifyResult } from "./engine";

/**
 * Every notification this site can emit.
 *
 * Call sites name an event and hand over its data. They do not choose a
 * template, a subject line, a sender, or a channel, so changing how a buyer is
 * notified never means editing the Stripe webhook.
 *
 * Email is the only channel today. The shape is deliberately channel-free so
 * adding a second one later is a change inside the engine rather than at every
 * call site.
 */

export interface PreorderConfirmedData {
  firstName: string;
  downloadUrl: string;
  releaseDateIso: string;
  amount: string | null;
  orderReference: string;
  purchasedOn: string;
  receiptUrl: string | null;
}

export interface PurchaseDeliveredData {
  firstName: string;
  downloadUrl: string;
  amount: string | null;
  orderReference: string;
  purchasedOn: string;
  receiptUrl: string | null;
}

export interface ReleaseAvailableData {
  firstName: string;
  downloadUrl: string;
  releaseDateIso: string;
}

export type Notification =
  | { type: "preorder.confirmed"; to: string; data: PreorderConfirmedData }
  | { type: "purchase.delivered"; to: string; data: PurchaseDeliveredData }
  | { type: "release.available"; to: string; data: ReleaseAvailableData };

export type NotificationType = Notification["type"];

export type { NotifyResult };
