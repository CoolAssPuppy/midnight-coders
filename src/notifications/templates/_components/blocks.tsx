import { Button, Heading, Link, Section, Text } from "react-email";

import { color, font } from "./theme";

/** The book speaking. Serif, per the two-voices rule in PRODUCT.md. */
export function Title({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <Heading style={titleStyle}>{children}</Heading>;
}

export function Paragraph({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <Text style={paragraphStyle}>{children}</Text>;
}

/**
 * The machine speaking: a labelled row of order facts.
 *
 * Rendered as text rows rather than a table because every value here is short,
 * and a two-column table collapses unpredictably on narrow mobile clients.
 */
export function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}): React.ReactElement {
  return (
    <Text style={detailRowStyle}>
      <span style={detailLabelStyle}>{label}: </span>
      {href ? (
        <Link href={href} style={detailLinkStyle}>
          {value}
        </Link>
      ) : (
        <span style={detailValueStyle}>{value}</span>
      )}
    </Text>
  );
}

/**
 * The one thing the buyer must not miss.
 *
 * Used for the release date on a pre-order. Design principle 4: say the
 * awkward thing plainly, because a buyer who does not know the book is not out
 * yet writes to support instead.
 */
export function Notice({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Section style={noticeStyle}>
      <Text style={noticeTextStyle}>{children}</Text>
    </Section>
  );
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    // Outlook ignores padding on a table cell often enough that the gap below
    // the button is set on the button itself as well.
    <Section style={{ padding: "8px 0 28px" }}>
      <Button href={href} style={buttonStyle}>
        {children}
      </Button>
    </Section>
  );
}

/**
 * The same destination as the button, spelled out.
 *
 * Some clients strip or mangle button markup, and a buyer who cannot see the
 * button still needs a way to reach their file.
 */
export function FallbackLink({ href }: { href: string }): React.ReactElement {
  return (
    <Text style={fallbackStyle}>
      If the button does not work, paste this into your browser:
      <br />
      <Link href={href} style={fallbackLinkStyle}>
        {href}
      </Link>
    </Text>
  );
}

const titleStyle = {
  color: color.ink,
  fontFamily: font.serif,
  fontSize: "26px",
  fontWeight: 400,
  lineHeight: "1.3",
  margin: "0 0 20px",
};

const paragraphStyle = {
  color: color.inkDim,
  fontFamily: font.mono,
  fontSize: "14px",
  lineHeight: "1.75",
  margin: "0 0 16px",
};

const detailRowStyle = {
  borderBottom: `1px solid ${color.border}`,
  fontFamily: font.mono,
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0",
  padding: "10px 0",
};

const detailLabelStyle = {
  color: color.comment,
  display: "inline-block",
  minWidth: "160px",
};

const detailValueStyle = {
  color: color.numeral,
};

const detailLinkStyle = {
  color: color.teal,
  textDecoration: "underline",
};

const noticeStyle = {
  backgroundColor: color.surface,
  borderLeft: `3px solid ${color.teal}`,
  margin: "24px 0",
  padding: "16px 18px",
};

const noticeTextStyle = {
  color: color.ink,
  fontFamily: font.mono,
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0",
};

const buttonStyle = {
  backgroundColor: color.teal,
  marginBottom: "12px",
  borderRadius: "4px",
  color: color.midnight,
  display: "inline-block",
  fontFamily: font.mono,
  fontSize: "14px",
  fontWeight: 600,
  padding: "14px 28px",
  textDecoration: "none",
};

const fallbackStyle = {
  color: color.comment,
  fontFamily: font.mono,
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "16px 0 0",
  wordBreak: "break-all" as const,
};

const fallbackLinkStyle = {
  color: color.teal,
  textDecoration: "underline",
};
