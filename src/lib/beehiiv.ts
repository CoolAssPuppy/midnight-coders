/**
 * beehiiv v2 API.
 *
 * Replaces Kit as the newsletter list. beehiiv owns the whole list lifecycle:
 * the confirmation email, the welcome sequence, and unsubscribes. This site
 * does not send its own "thanks for subscribing" message, because that would
 * arrive alongside beehiiv's and duplicate it. Transactional mail (purchases,
 * support, bookings) stays with the notification engine.
 *
 * Docs: https://developers.beehiiv.com/api-reference/subscriptions/create
 */

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

/** beehiiv rejects slow callers at 180 requests per minute per organization. */
const REQUEST_TIMEOUT_MS = 10_000;

export type SubscriptionStatus =
  | "validating"
  | "invalid"
  | "pending"
  | "active"
  | "inactive"
  | "needs_attention"
  | "paused";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface SubscribeParams {
  email: string;
  firstName?: string;
  lastName?: string;
  /** The page the form was submitted from, for attribution in beehiiv. */
  referringSite?: string;
  utm?: UtmParams;
  /**
   * Whether to force a confirmation step.
   *
   * Defaults to `"on"`, which is right for a public form: that endpoint is the
   * one place someone can pump fake addresses at your sending reputation.
   *
   * Pass `"not_set"` for a buyer who has just paid. They gave you the address
   * in a transaction rather than through an open form, so there is no abuse
   * vector to defend against, and whatever the publication is configured to do
   * should win.
   */
  doubleOptIn?: "on" | "off" | "not_set";
  /**
   * Whether beehiiv sends its welcome email.
   *
   * Off for buyers: they are already receiving a purchase confirmation, and a
   * welcome landing beside it reads as two emails for one action.
   */
  sendWelcomeEmail?: boolean;
  /**
   * Tags to apply after subscribing.
   *
   * beehiiv has no tags field on the create endpoint, so these go in a second
   * call. Unknown tags are created on the publication automatically.
   */
  tags?: readonly string[];
  /**
   * Extra beehiiv custom fields, beyond first and last name.
   *
   * Each name must already exist as a custom field on the publication;
   * beehiiv silently drops values for fields it does not recognise.
   */
  customFields?: Record<string, string>;
}

export type SubscribeResult =
  | { ok: true; id: string; status: SubscriptionStatus }
  | { ok: false; error: string; retryable: boolean };

interface BeehiivConfig {
  apiKey: string;
  publicationId: string;
}

function readConfig(): BeehiivConfig | null {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) return null;

  return { apiKey, publicationId };
}

/** Only include a custom field when there is something to put in it. */
function buildCustomFields(
  params: SubscribeParams,
): Array<{ name: string; value: string }> {
  const fields: Array<{ name: string; value: string }> = [];

  if (params.firstName?.trim()) {
    fields.push({ name: "First Name", value: params.firstName.trim() });
  }

  if (params.lastName?.trim()) {
    fields.push({ name: "Last Name", value: params.lastName.trim() });
  }

  for (const [name, value] of Object.entries(params.customFields ?? {})) {
    if (value.trim()) fields.push({ name, value: value.trim() });
  }

  return fields;
}

/**
 * Add someone to the newsletter.
 *
 * Never throws. The caller is a public form handler, and a beehiiv outage
 * should surface as a clean error rather than a stack trace.
 *
 * Two deliberate settings:
 *
 * `double_opt_override: "on"` forces a confirmation step regardless of how the
 * publication is configured. A public subscribe endpoint is the one place
 * someone can pump fake addresses at your sending reputation, and confirmation
 * is the defence that actually works.
 *
 * `reactivate_existing: true` lets someone who previously unsubscribed opt back
 * in by filling the form again. They still have to confirm, so this cannot
 * silently resurrect anyone.
 */
export async function subscribeToNewsletter(
  params: SubscribeParams,
): Promise<SubscribeResult> {
  const config = readConfig();

  if (!config) {
    return {
      ok: false,
      error: "BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID is not set",
      retryable: false,
    };
  }

  const customFields = buildCustomFields(params);

  try {
    const response = await fetch(
      `${BEEHIIV_API_BASE}/publications/${config.publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
          reactivate_existing: true,
          send_welcome_email: params.sendWelcomeEmail ?? true,
          double_opt_override: params.doubleOptIn ?? "on",
          referring_site: params.referringSite,
          utm_source: params.utm?.source,
          utm_medium: params.utm?.medium,
          utm_campaign: params.utm?.campaign,
          utm_term: params.utm?.term,
          utm_content: params.utm?.content,
          ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const detail = await readError(response);

      // 429 is the documented rate limit; 5xx is theirs, not ours. Everything
      // else is a bad request that retrying will not fix.
      const retryable = response.status === 429 || response.status >= 500;

      console.error(
        `beehiiv subscribe failed (${response.status}): ${detail}`,
      );

      return { ok: false, error: detail, retryable };
    }

    const body: unknown = await response.json();
    const data = extractSubscription(body);

    if (!data) {
      return {
        ok: false,
        error: "beehiiv returned an unrecognised response",
        retryable: true,
      };
    }

    if (params.tags?.length) {
      await applyTags(config, data.id, params.tags);
    }

    return { ok: true, id: data.id, status: data.status };
  } catch (cause) {
    // Timeouts and network failures land here. Worth retrying: the request may
    // never have reached beehiiv at all.
    const error = cause instanceof Error ? cause.message : String(cause);
    console.error(`beehiiv subscribe threw: ${error}`);

    return { ok: false, error, retryable: true };
  }
}

/**
 * Tag a subscription.
 *
 * Deliberately swallows its own failure. The subscribe already succeeded, and
 * losing a tag is a segmentation problem rather than a reason to tell a caller
 * their signup failed and have them try again.
 */
async function applyTags(
  config: BeehiivConfig,
  subscriptionId: string,
  tags: readonly string[],
): Promise<void> {
  try {
    const response = await fetch(
      `${BEEHIIV_API_BASE}/publications/${config.publicationId}/subscriptions/${subscriptionId}/tags`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: [...tags] }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      console.error(
        `beehiiv tagging failed (${response.status}) for ${subscriptionId}`,
      );
    }
  } catch (cause) {
    const error = cause instanceof Error ? cause.message : String(cause);
    console.error(`beehiiv tagging threw for ${subscriptionId}: ${error}`);
  }
}

/** beehiiv errors arrive as `{ errors: [{ message, code }] }`. */
async function readError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (
      typeof body === "object" &&
      body !== null &&
      "errors" in body &&
      Array.isArray((body as { errors: unknown }).errors)
    ) {
      const messages = (body as { errors: Array<{ message?: string }> }).errors
        .map((entry) => entry.message)
        .filter((message): message is string => typeof message === "string");

      if (messages.length > 0) return messages.join("; ");
    }

    return `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

function extractSubscription(
  body: unknown,
): { id: string; status: SubscriptionStatus } | null {
  if (typeof body !== "object" || body === null || !("data" in body)) {
    return null;
  }

  const data = (body as { data: unknown }).data;

  if (typeof data !== "object" || data === null) return null;

  const candidate = data as Record<string, unknown>;

  if (typeof candidate.id !== "string" || typeof candidate.status !== "string") {
    return null;
  }

  return {
    id: candidate.id,
    status: candidate.status as SubscriptionStatus,
  };
}
