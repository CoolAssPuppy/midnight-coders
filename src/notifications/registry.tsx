import { defineRegistry, forType } from "./engine";

import { PreorderConfirmation } from "./templates/PreorderConfirmation";
import { PurchaseDelivery } from "./templates/PurchaseDelivery";
import { ReleaseAvailable } from "./templates/ReleaseAvailable";
import type { Notification } from "./types";

/**
 * The single place a notification type is bound to what the buyer receives.
 *
 * Subjects live here rather than inside templates so the whole set can be read
 * at once. Inbox lines are the only part of an email most people see, and they
 * are easier to keep consistent in a list than spread across several files.
 */
export const REGISTRY = defineRegistry<Notification>([
  forType<Notification, "preorder.confirmed">("preorder.confirmed", {
    subject: () => "Your pre-order is confirmed",
    render: (n) => <PreorderConfirmation {...n.data} />,
  }),
  forType<Notification, "purchase.delivered">("purchase.delivered", {
    subject: () => "Your copy of The Midnight Coder's Children",
    render: (n) => <PurchaseDelivery {...n.data} />,
  }),
  forType<Notification, "release.available">("release.available", {
    subject: () => "The Midnight Coder's Children is out",
    render: (n) => <ReleaseAvailable {...n.data} />,
  }),
]);
