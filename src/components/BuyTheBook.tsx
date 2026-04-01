const BUY_LINKS = [
  { label: "Buy on Amazon", href: "#" },
  { label: "Buy on Barnes & Noble", href: "#" },
  { label: "Buy Direct from Author", href: "#" },
];

export function BuyTheBook(): React.ReactElement {
  return (
    <section className="py-10 flex flex-col items-center">
      <p
        className="text-xs tracking-[0.15em] uppercase mb-5"
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Get the book
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {BUY_LINKS.map((link) => (
          <span key={link.label} className="flex flex-col items-center">
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
          </span>
        ))}
      </div>
    </section>
  );
}
