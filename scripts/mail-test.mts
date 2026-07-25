/** Sends one of every transactional email. Delete once reviewed. */
import { notify } from "../src/notifications/index.js";
import { RELEASE_DATE_ISO } from "../src/lib/stripe.js";
import type { Notification } from "../src/notifications/types.js";

const to = process.argv[2];
const stamp = Date.now();
const URL = "https://www.midnightcoderschildren.com/api/download/preview.signature";
const order = { amount: "$14.99", orderReference: "cs_live_9KpQm2Xt", purchasedOn: "July 25, 2026",
  receiptUrl: "https://pay.stripe.com/receipts/preview" };

const all: Notification[] = [
  { type: "preorder.confirmed", to,
    data: { firstName: "Prashant", downloadUrl: URL, releaseDateIso: RELEASE_DATE_ISO, ...order } },
  { type: "purchase.delivered", to,
    data: { firstName: "Prashant", downloadUrl: URL, ...order } },
  { type: "release.available", to,
    data: { firstName: "Prashant", downloadUrl: URL, releaseDateIso: RELEASE_DATE_ISO } },
];

for (const [i, n] of all.entries()) {
  const r = await notify(n, `preview-${stamp}-${i}`);
  console.log(`${r.ok ? "sent" : "FAILED"}  ${n.type}`);
}
