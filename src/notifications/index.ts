import { createNotifier } from "./engine";

import { REGISTRY } from "./registry";
import {
  LOGOTYPE_BASE64,
  LOGOTYPE_CONTENT_ID,
} from "./templates/_components/logotype";
import type { Notification } from "./types";

export type { Notification, NotificationType, NotifyResult } from "./types";

/**
 * This site's notification engine.
 *
 * The plumbing (transport, rendering, idempotency, error classification,
 * sandbox mode) lives in the local `engine/` module. What stays here is
 * everything specific to Midnight Coders: which events exist, what each one
 * says, and how it looks.
 */
export const notify = createNotifier<Notification>({
  registry: REGISTRY,
  from: () => {
    const sender = process.env.MAIL_FROM;
    if (!sender) {
      throw new Error("MAIL_FROM environment variable is not set");
    }

    return sender;
  },
  replyTo: () => process.env.MAIL_REPLY_TO || undefined,
  attachments: () => [
    {
      filename: "logotype.png",
      content: LOGOTYPE_BASE64,
      contentId: LOGOTYPE_CONTENT_ID,
    },
  ],
});
