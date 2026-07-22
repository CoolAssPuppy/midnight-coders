import type { Metadata } from "next";
import Link from "next/link";
import { PurchaseEvent } from "@/components/PurchaseEvent";
import { ReleaseCountdown } from "@/components/ReleaseCountdown";
import { getStripeClient } from "@/lib/stripe";
import "../buy.css";
import "./success.css";

export const metadata: Metadata = {
  title: "Your pre-order is confirmed | The Midnight Coder's Children",
  description: "Your pre-order is confirmed.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

const steps: { when: string; what: string }[] = [
  {
    when: "Now",
    what: "Stripe has emailed your receipt. Nothing else is needed from you.",
  },
  {
    when: "15 September",
    what: "A download link arrives by email. EPUB, no DRM, yours to keep.",
  },
  {
    when: "Between now and then",
    what: "Nothing. Put it out of your mind. The email will find you.",
  },
];

export default async function BuySuccessPage({
  searchParams,
}: SuccessPageProps): Promise<React.ReactElement> {
  const { session_id: sessionId } = await searchParams;

  // Retrieved only to recover the buyer's email for conversion matching.
  // A failure here must never break the confirmation page.
  let customerEmail: string | undefined;
  if (sessionId) {
    try {
      const session =
        await getStripeClient().checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email ?? undefined;
    } catch {
      // Continue without it.
    }
  }

  return (
    <main id="main-content" className="buy thanks">
      {sessionId && (
        <PurchaseEvent transactionId={sessionId} customerEmail={customerEmail} />
      )}

      <div className="buy__inner thanks__inner">
        <p className="buy__timestamp buy__reveal buy__reveal--1">
          Order confirmed
        </p>

        <h1 className="thanks__title buy__reveal buy__reveal--1">
          You&rsquo;re in.
        </h1>

        <p className="thanks__lede buy__reveal buy__reveal--2">
          {customerEmail ? (
            <>
              Your copy is reserved against{" "}
              <span className="thanks__email">{customerEmail}</span>.
            </>
          ) : (
            <>Your copy is reserved.</>
          )}{" "}
          The book arrives 15 September.
        </p>

        <div className="buy__reveal buy__reveal--3">
          <ReleaseCountdown />
        </div>

        <ol className="thanks__timeline buy__reveal buy__reveal--4">
          {steps.map((step) => (
            <li className="thanks__step" key={step.when}>
              <span className="thanks__when">{step.when}</span>
              <span className="thanks__what">{step.what}</span>
            </li>
          ))}
        </ol>

        <div className="thanks__actions buy__reveal buy__reveal--4">
          <Link href="/excerpt" className="checkout__button thanks__cta">
            Read chapter one
          </Link>
          <Link href="/" className="buy__retailer">
            Back to the book
          </Link>
        </div>

        <p className="thanks__footnote">
          No email within a few minutes? Check spam, then reply to your Stripe
          receipt and I will sort it out personally.
        </p>
      </div>
    </main>
  );
}
