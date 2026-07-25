import { Section } from "react-email";

import { Layout } from "./_components/Layout";
import {
  DetailRow,
  FallbackLink,
  Notice,
  Paragraph,
  Title,
} from "./_components/blocks";
import { formatReleaseDate } from "./_components/theme";

export interface PreorderConfirmationProps {
  firstName: string;
  /** Permanent, signed. Refuses to serve the file until release day. */
  downloadUrl: string;
  releaseDateIso: string;
  amount: string | null;
  orderReference: string;
  purchasedOn: string;
  /** Hosted Stripe receipt. Null when the charge could not be read. */
  receiptUrl: string | null;
}

/**
 * Sent the moment a pre-order completes, before the book exists.
 *
 * The link is included even though it will not work yet. Per the design note
 * in `lib/download-token.ts` the token is permanent, so this email is the
 * buyer's durable copy of it.
 */
export function PreorderConfirmation({
  firstName,
  downloadUrl,
  releaseDateIso,
  amount,
  orderReference,
  purchasedOn,
  receiptUrl,
}: PreorderConfirmationProps): React.ReactElement {
  const releaseDate = formatReleaseDate(releaseDateIso);
  const greeting = firstName.trim().length > 0 ? `${firstName}, your` : "Your";

  return (
    <Layout preview={`Your copy unlocks ${releaseDate}.`}>
      <Title>{greeting} pre-order is confirmed</Title>

      <Notice>
        The book is not out yet. It releases on {releaseDate}, and the link
        below will not open until then.
      </Notice>

      <Paragraph>
        The link is permanent. Keep this email and it will work on the day. I
        will send a reminder.
      </Paragraph>

      <Section style={{ margin: "24px 0 8px" }}>
        <DetailRow label="Order" value={orderReference} />
        {amount ? <DetailRow label="Amount" value={amount} /> : null}
        <DetailRow label="Purchased" value={purchasedOn} />
        {receiptUrl ? (
          <DetailRow label="Receipt" value="View receipt" href={receiptUrl} />
        ) : null}
        <DetailRow label="Unlocks" value={releaseDate} />
      </Section>

      <FallbackLink href={downloadUrl} />
    </Layout>
  );
}

export default PreorderConfirmation;
