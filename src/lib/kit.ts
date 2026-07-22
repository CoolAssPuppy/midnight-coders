/**
 * Kit (ConvertKit) v3 API.
 *
 * Extracted from the subscribe route so the purchase webhook and the newsletter
 * form share one implementation. Note the v3 API takes the key in the JSON
 * body, not an Authorization header.
 */

const KIT_API_BASE = "https://api.convertkit.com/v3";

/** Newsletter form. Every subscriber flows through this. */
export const KIT_FORM_ID = "8927583";

/** Applied to everyone on the Midnight Coders list. */
export const KIT_MCC_TAG_ID = "13946969";

/** Advanced Reader Copy interest. */
export const KIT_BETA_TAG_ID = "13946978";

/**
 * Applied to buyers of the digital edition. Create this tag in Kit and put its
 * numeric id here, then trigger the delivery email off it.
 */
export const KIT_DIGITAL_PURCHASE_TAG_ID =
  process.env.KIT_DIGITAL_PURCHASE_TAG_ID ?? "";

export interface SubscribeParams {
  email: string;
  firstName?: string;
  formId?: string;
  fields?: Record<string, string>;
  tagIds?: string[];
}

/**
 * Subscribe an address to a Kit form, optionally tagging it and setting custom
 * fields. Throws on failure so callers can decide whether that is fatal.
 */
export async function subscribeToForm(params: SubscribeParams): Promise<void> {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    throw new Error("KIT_API_KEY environment variable is not set");
  }

  const formId = params.formId ?? KIT_FORM_ID;

  const response = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      api_key: apiKey,
      email: params.email,
      first_name: params.firstName ?? "",
      fields: params.fields,
      tags: params.tagIds,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Kit subscribe failed:", { formId, error: detail });
    throw new Error("Failed to subscribe to form");
  }
}
