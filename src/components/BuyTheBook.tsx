import Link from "next/link";
import { BUY_LINKS } from "@/lib/buy-links";
import { RetailerLink } from "@/components/RetailerLink";

const BUTTON_CLASS =
  "px-6 py-3 text-xs tracking-wider uppercase rounded text-center transition-colors border border-white/35 bg-white/[0.06] text-white/85 hover:bg-white/[0.12] hover:text-white hover:border-white/50";

type BuyTheBookProps = {
  /** Show the BookLife pull quote beneath the buttons. Homepage only. */
  showPullQuote?: boolean;
};

export function BuyTheBook({
  showPullQuote = false,
}: BuyTheBookProps): React.ReactElement {
  return (
    <section id="buy" className="py-10 flex flex-col items-center scroll-mt-24">
      <p
        className="text-xs tracking-[0.15em] uppercase mb-5"
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Get the book
      </p>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {BUY_LINKS.map((link) => (
          <span key={link.label} className="flex flex-col items-center">
            {link.href && link.retailer ? (
              <RetailerLink
                href={link.href}
                retailer={link.retailer}
                className={BUTTON_CLASS}
              >
                {link.label}
              </RetailerLink>
            ) : link.href ? (
              <Link href={link.href} className={BUTTON_CLASS}>
                {link.label}
              </Link>
            ) : (
              <>
                <span
                  className="px-6 py-3 text-xs tracking-wider uppercase rounded cursor-default text-center"
                  style={{
                    color: "rgba(255, 255, 255, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="text-[9px] tracking-widest uppercase mt-1.5"
                  style={{ color: "rgba(255, 255, 255, 0.15)" }}
                >
                  Coming soon
                </span>
              </>
            )}
          </span>
        ))}
      </div>

      {showPullQuote && (
        <blockquote className="mt-8 max-w-md text-center">
          <p
            className="text-sm md:text-base italic leading-relaxed"
            style={{
              color: "#DCDCAA",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            &ldquo;A brisk financial thriller buoyed by a powerful emotional
            throughline.&rdquo;
          </p>
          <footer
            className="text-[10px] tracking-[0.2em] uppercase mt-2"
            style={{
              color: "rgba(220, 220, 170, 0.55)",
              fontFamily: "var(--font-mono)",
            }}
          >
            BookLife
          </footer>
        </blockquote>
      )}
    </section>
  );
}
