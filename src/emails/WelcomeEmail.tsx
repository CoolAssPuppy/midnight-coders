import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
}

export function WelcomeEmail({ firstName }: WelcomeEmailProps): React.ReactElement {
  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
          `}
        </style>
      </Head>
      <Preview>Welcome to The Midnight Coder&apos;s Children - A novel by Prashant Sridharan</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Starfield header effect */}
          <Section style={headerSection}>
            <div style={starfieldOverlay} />
            <Heading style={titleSmall}>The</Heading>
            <Heading style={titleLarge}>Midnight Coder&apos;s</Heading>
            <Heading style={titleLarge}>Children</Heading>
            <Text style={authorText}>by Prashant Sridharan</Text>
          </Section>

          {/* Golden divider */}
          <Hr style={goldenDivider} />

          {/* Main content */}
          <Section style={contentSection}>
            <Text style={greeting}>Dear {firstName},</Text>

            <Text style={paragraph}>
              Thank you for joining us on this journey into a world where
              family secrets hold the key to saving civilization itself.
            </Text>

            <Text style={paragraph}>
              When <em style={emphasis}>The Midnight Coder&apos;s Children</em> releases
              in September 2026, you will be among the first to know. Until then,
              we will share exclusive glimpses into the world of Gayathri Ramaswamy
              and the children she left behind.
            </Text>

            {/* Teaser quote box */}
            <Section style={quoteBox}>
              <Text style={quoteText}>
                &ldquo;What appears to be a family recipe book reveals itself to be
                something else entirely - a cipher designed to be solved only
                by those who truly knew her.&rdquo;
              </Text>
            </Section>

            <Text style={paragraph}>
              A propulsive thriller about trust, legacy, and the fragile bonds
              that hold both families and civilizations together.
            </Text>

            <Text style={signoff}>
              With anticipation,
            </Text>
            <Text style={signature}>
              Bodhi Press
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={footerDivider} />
          <Section style={footer}>
            <Text style={footerText}>
              Coming September 2026
            </Text>
            <Text style={copyright}>
              &copy; 2026 Bodhi Press. All rights reserved.
            </Text>
            <Text style={unsubscribeText}>
              You received this email because you signed up at{" "}
              <Link href="https://midnightcoderschildren.com" style={link}>
                midnightcoderschildren.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const body = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    "'Cormorant Garamond', 'Times New Roman', Times, Georgia, serif",
  margin: "0",
  padding: "0",
};

const container = {
  backgroundColor: "#121212",
  margin: "0 auto",
  maxWidth: "600px",
  border: "1px solid #222",
};

const headerSection = {
  backgroundColor: "#0a0a0a",
  backgroundImage:
    "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 70%)",
  padding: "48px 40px 40px",
  textAlign: "center" as const,
  position: "relative" as const,
};

const starfieldOverlay = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='20' cy='30' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='80' cy='15' r='0.5' fill='%23ffffff' fill-opacity='0.5'/%3E%3Ccircle cx='150' cy='45' r='1' fill='%23ffffff' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='80' r='0.5' fill='%23ffffff' fill-opacity='0.4'/%3E%3Ccircle cx='120' cy='90' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='180' cy='120' r='0.5' fill='%23ffffff' fill-opacity='0.5'/%3E%3Ccircle cx='60' cy='150' r='1' fill='%23ffffff' fill-opacity='0.2'/%3E%3Ccircle cx='100' cy='170' r='0.5' fill='%23ffffff' fill-opacity='0.4'/%3E%3Ccircle cx='160' cy='180' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
  opacity: 0.6,
};

const titleSmall = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "24px",
  fontWeight: "400" as const,
  letterSpacing: "2px",
  margin: "0 0 4px",
  padding: "0",
};

const titleLarge = {
  color: "#ffffff",
  fontSize: "36px",
  fontWeight: "400" as const,
  letterSpacing: "1px",
  lineHeight: "1.1",
  margin: "0",
  padding: "0",
};

const authorText = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "16px",
  fontStyle: "italic" as const,
  marginTop: "16px",
  marginBottom: "0",
};

const goldenDivider = {
  borderTop: "2px solid #fcde09",
  margin: "0",
};

const contentSection = {
  padding: "40px",
};

const greeting = {
  color: "#fcde09",
  fontSize: "22px",
  fontWeight: "400" as const,
  marginBottom: "24px",
};

const paragraph = {
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "17px",
  lineHeight: "1.7",
  marginBottom: "20px",
};

const emphasis = {
  fontStyle: "italic" as const,
  color: "#ffffff",
};

const quoteBox = {
  backgroundColor: "rgba(252, 222, 9, 0.08)",
  borderLeft: "3px solid #fcde09",
  margin: "32px 0",
  padding: "24px 28px",
};

const quoteText = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "16px",
  fontStyle: "italic" as const,
  lineHeight: "1.8",
  margin: "0",
};

const signoff = {
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "16px",
  marginTop: "32px",
  marginBottom: "4px",
};

const signature = {
  color: "#fcde09",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0",
};

const footerDivider = {
  borderTop: "1px solid #333",
  margin: "0",
};

const footer = {
  padding: "32px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#fcde09",
  fontSize: "14px",
  letterSpacing: "2px",
  margin: "0 0 16px",
  textTransform: "uppercase" as const,
};

const copyright = {
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "12px",
  margin: "0 0 8px",
};

const unsubscribeText = {
  color: "rgba(255, 255, 255, 0.3)",
  fontSize: "11px",
  margin: "0",
};

const link = {
  color: "rgba(255, 255, 255, 0.5)",
  textDecoration: "underline",
};

export default WelcomeEmail;
