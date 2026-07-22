import type { Metadata } from "next";
import Link from "next/link";
import { PurchaseEvent } from "@/components/PurchaseEvent";
import { getStripeClient } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you | The Midnight Coder's Children",
  description: "Your pre-order is confirmed.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

const steps = [
  "Stripe has emailed your receipt.",
  "A separate email carries your personal download link. Keep it.",
  "That link unlocks on release day, 22 September 2026, and stays valid for a year after.",
];

export default async function BuySuccessPage({
  searchParams,
}: SuccessPageProps): Promise<React.ReactElement> {
  const { session_id: sessionId } = await searchParams;

  // Retrieved purely to recover the buyer's email for conversion matching.
  // A failure here must not break the confirmation page.
  let customerEmail: string | undefined;
  if (sessionId) {
    try {
      const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email ?? undefined;
    } catch {
      // Continue without the email.
    }
  }

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
      style={{ backgroundColor: "#0a1628" }}
    >
      {sessionId && (
        <PurchaseEvent transactionId={sessionId} customerEmail={customerEmail} />
      )}

      <div className="max-w-xl w-full">
        <pre
          className="text-left text-sm mb-10 p-4 rounded-lg overflow-x-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <code>
            <span style={{ color: "#4ec9b0" }}>order</span>
            <span style={{ color: "#d4d4d4" }}>.</span>
            <span style={{ color: "#DCDCAA" }}>status</span>
            {"\n"}
            <span style={{ color: "#d4d4d4" }}>{"=> "}</span>
            <span style={{ color: "#ce9178" }}>&quot;confirmed&quot;</span>
          </code>
        </pre>

        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#4EC9B0", fontFamily: "var(--font-mono)" }}
        >
          Thank you
        </h1>

        <p className="text-lg mb-10" style={{ color: "#d4d4d4" }}>
          Your pre-order is in. Here is what happens next.
        </p>

        <ol className="text-left space-y-4 mb-12">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4 text-sm">
              <span
                style={{ color: "#B5CEA8", fontFamily: "var(--font-mono)" }}
                aria-hidden="true"
              >
                {index + 1}.
              </span>
              <span style={{ color: "#d4d4d4" }}>{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-sm mb-8" style={{ color: "#6A9955" }}>
          {"// No download email within a few minutes? Check spam, then reply to your Stripe receipt."}
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: "#4EC9B0",
            color: "#0a1628",
            fontFamily: "var(--font-mono)",
          }}
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
