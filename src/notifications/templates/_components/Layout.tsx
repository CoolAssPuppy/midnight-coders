import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

import { color, font } from "./theme";
import {
  LOGOTYPE_CONTENT_ID,
  LOGOTYPE_DISPLAY_HEIGHT,
  LOGOTYPE_DISPLAY_WIDTH,
} from "./logotype";

interface LayoutProps {
  /** Inbox preview line. Written per template; never a repeat of the subject. */
  preview: string;
  children: React.ReactNode;
}

/**
 * The shell every transactional email renders into.
 *
 * Deliberately plain. PRODUCT.md lists the faux-code-block treatment as an
 * anti-reference ("decorative rather than communicative"), so there is no
 * terminal chrome here: a receipt's job is to be read and believed.
 *
 * No unsubscribe link. These are transactional messages sent to someone who
 * has just paid, and CAN-SPAM exempts them from the unsubscribe and postal
 * address requirements. That exemption survives only while the content stays
 * transactional, so do not add promotional copy to these templates.
 */
export function Layout({ preview, children }: LayoutProps): React.ReactElement {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={maskStyle}>
            {/*
              Inlined as an attachment rather than linked: a remote URL only
              works once the asset is deployed. PNG rather than the site's SVG,
              which Gmail and Outlook will not render. Served at 2x and sized
              down so it stays sharp on retina. Most clients block images until
              the reader allows them, so the alt text carries the title alone.
            */}
            <Img
              src={`cid:${LOGOTYPE_CONTENT_ID}`}
              alt="The Midnight Coder's Children"
              width={LOGOTYPE_DISPLAY_WIDTH}
              height={LOGOTYPE_DISPLAY_HEIGHT}
              style={logotypeStyle}
            />
            <Text style={imprintStyle}>BODHI PRESS</Text>
          </Section>

          {children}

          <Hr style={dividerStyle} />

          <Section>
            <Text style={footerStyle}>
              You are receiving this because you bought{" "}
              <em style={{ fontFamily: font.serif }}>
                The Midnight Coder&apos;s Children
              </em>{" "}
              at{" "}
              <Link
                href="https://www.midnightcoderschildren.com"
                style={footerLinkStyle}
              >
                midnightcoderschildren.com
              </Link>
              .
            </Text>
            <Text style={footerStyle}>
              Questions about your order? Reply to this email and it reaches a
              person.
            </Text>
            <Text style={{ ...footerStyle, color: color.comment }}>
              &copy; 2026 Bodhi Press
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  backgroundColor: color.midnight,
  fontFamily: font.mono,
  margin: "0",
  padding: "24px 12px",
};

const containerStyle = {
  backgroundColor: color.midnight,
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
};

const maskStyle = {
  paddingBottom: "28px",
  textAlign: "center" as const,
};

const logotypeStyle = {
  display: "block",
  margin: "0 auto 18px",
  maxWidth: `${LOGOTYPE_DISPLAY_WIDTH}px`,
  width: "100%",
};

const imprintStyle = {
  color: color.comment,
  textAlign: "center" as const,
  fontFamily: font.mono,
  fontSize: "11px",
  letterSpacing: "0.18em",
  margin: "0",
};

const dividerStyle = {
  borderColor: color.border,
  borderStyle: "solid",
  borderWidth: "1px 0 0",
  margin: "36px 0 24px",
};

const footerStyle = {
  color: color.inkDim,
  fontFamily: font.mono,
  fontSize: "12px",
  lineHeight: "1.7",
  margin: "0 0 10px",
};

const footerLinkStyle = {
  color: color.teal,
  textDecoration: "underline",
};
