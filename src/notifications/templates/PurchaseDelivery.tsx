import { Section } from "react-email";

import { Layout } from "./_components/Layout";
import {
  DetailRow,
  FallbackLink,
  Paragraph,
  PrimaryButton,
  Title,
} from "./_components/blocks";

export interface PurchaseDeliveryProps {
  firstName: string;
  downloadUrl: string;
  amount: string | null;
  orderReference: string;
  purchasedOn: string;
  /** Hosted Stripe receipt. Null when the charge could not be read. */
  receiptUrl: string | null;
}

/** Sent when someone buys on or after release day, so the link works now. */
export function PurchaseDelivery({
  firstName,
  downloadUrl,
  amount,
  orderReference,
  purchasedOn,
  receiptUrl,
}: PurchaseDeliveryProps): React.ReactElement {
  const greeting = firstName.trim().length > 0 ? `${firstName}, your` : "Your";

  return (
    <Layout preview="Your copy of The Midnight Coder's Children is ready.">
      <Title>{greeting} copy is ready</Title>

      <PrimaryButton href={downloadUrl}>Download the book</PrimaryButton>

      <Paragraph>
        EPUB. It opens on a Kindle, an iPad, or anything else that reads books.
        The link is permanent, so keep this email.
      </Paragraph>

      <Section style={{ margin: "24px 0 8px" }}>
        <DetailRow label="Order" value={orderReference} />
        {amount ? <DetailRow label="Amount" value={amount} /> : null}
        <DetailRow label="Purchased" value={purchasedOn} />
        {receiptUrl ? (
          <DetailRow label="Receipt" value="View receipt" href={receiptUrl} />
        ) : null}
      </Section>

      <FallbackLink href={downloadUrl} />
    </Layout>
  );
}

export default PurchaseDelivery;
