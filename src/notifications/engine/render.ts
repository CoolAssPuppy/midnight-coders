import { render } from "react-email";

export interface RenderedEmail {
  html: string;
  text: string;
}

/**
 * Render a template to the two bodies every message carries.
 *
 * A plaintext alternative is not optional. Some clients refuse to display HTML
 * at all, spam filters read its absence as a signal, and a receipt that cannot
 * be read is a support ticket.
 */
export async function renderEmail(
  element: React.ReactElement,
): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { html, text };
}
