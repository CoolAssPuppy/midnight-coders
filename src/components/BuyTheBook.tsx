import Link from "next/link";
import { BUY_LINKS } from "@/lib/buy-links";
import { RetailerLink } from "@/components/RetailerLink";

/* Amazon is the single campaign CTA. Other purchase routes stay available as
   deliberately quiet text links so restoring their prominence is a local
   component change, not a checkout or payments change. */
const BUTTON_CLASS =
  "px-6 py-3 text-xs tracking-wider uppercase rounded text-center transition-colors border border-white/50 bg-white/[0.1] text-white hover:bg-white/[0.18] hover:border-white/70";

const SECONDARY_LINK_CLASS =
  "underline underline-offset-2 transition-colors text-white/30 hover:text-white/60";

type BuyTheBookProps = {
  /** Show the BookLife pull quote beneath the buttons. Homepage only. */
  showPullQuote?: boolean;
  /**
   * Anchor id. Override it when a page carries the CTA twice, so the second
   * copy does not repeat an id the first one already owns.
   */
  id?: string;
  /** Turn the share link off on /socials, where it would point at itself. */
  showShareLink?: boolean;
  /**
   * Tighter vertical rhythm. The homepage holds its last stage in a fixed,
   * viewport-centred column, so every pixel here comes out of the countdown at
   * the top or the logos at the bottom.
   */
  isCompact?: boolean;
};

export function BuyTheBook({
  showPullQuote = false,
  id = "buy",
  showShareLink = true,
  isCompact = false,
}: BuyTheBookProps): React.ReactElement {
  const primaryLink = BUY_LINKS.find((link) => link.prominence === "primary");
  const secondaryLinks = BUY_LINKS.filter(
    (link) => link.prominence === "secondary",
  );

  return (
    <section
      id={id}
      className={`${isCompact ? "py-6" : "py-10"} flex flex-col items-center scroll-mt-24`}
    >
      <p
        className={`text-xs tracking-[0.15em] uppercase ${isCompact ? "mb-4" : "mb-5"}`}
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Get the book
      </p>
      {primaryLink?.href && primaryLink.retailer && (
        <RetailerLink
          href={primaryLink.href}
          retailer={primaryLink.retailer}
          className={BUTTON_CLASS}
        >
          {primaryLink.label}
        </RetailerLink>
      )}

      <p
        className="mt-2 text-[9px] tracking-wide"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-white/20">Other options: </span>
        {secondaryLinks.map((link, index) => (
          <span key={link.label}>
            {index > 0 && <span className="text-white/15"> · </span>}
            {link.href && link.retailer ? (
              <RetailerLink
                href={link.href}
                retailer={link.retailer}
                className={SECONDARY_LINK_CLASS}
              >
                {link.label}
              </RetailerLink>
            ) : link.href ? (
              <Link href={link.href} className={SECONDARY_LINK_CLASS}>
                {link.label}
              </Link>
            ) : (
              <span className="text-white/15">{link.label}</span>
            )}
          </span>
        ))}
      </p>

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

      {showShareLink && (
        <Link
          href="/socials"
          className={`${isCompact ? "mt-5" : "mt-7"} text-[10px] tracking-[0.18em] uppercase underline underline-offset-4 transition-colors text-white/30 hover:text-white/60`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Tell your friends
        </Link>
      )}
    </section>
  );
}
