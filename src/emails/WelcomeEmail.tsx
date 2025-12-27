import {
  Body,
  Container,
  Head,
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
      <Head />
      <Preview>Welcome to The Midnight Coder&apos;s Children - A novel by Prashant Sridharan</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Code window header */}
          <Section style={windowHeader}>
            <span style={windowDot("#ff5f56")} />
            <span style={windowDot("#ffbd2e")} />
            <span style={windowDot("#27c93f")} />
            <span style={fileName}>welcome.tsx</span>
          </Section>

          {/* Main content as code */}
          <Section style={codeSection}>
            {/* Import statement */}
            <Text style={codeLine}>
              <span style={keyword}>import</span>
              <span style={punctuation}>{" { "}</span>
              <span style={variable}>reader</span>
              <span style={punctuation}>{" } "}</span>
              <span style={keyword}>from</span>
              <span style={string}>{` "midnightcoderschildren.com"`}</span>
              <span style={punctuation}>;</span>
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Comment block */}
            <Text style={comment}>{"// Welcome to The Midnight Coder's Children"}</Text>
            <Text style={comment}>{"// A novel by Prashant Sridharan"}</Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Function definition */}
            <Text style={codeLine}>
              <span style={keyword}>const</span>
              <span style={functionName}>{" greet"}</span>
              <span style={punctuation}>{" = ("}</span>
              <span style={variable}>{firstName}</span>
              <span style={punctuation}>{"): "}</span>
              <span style={typeStyle}>Promise</span>
              <span style={punctuation}>{"<"}</span>
              <span style={typeStyle}>void</span>
              <span style={punctuation}>{">"}</span>
              <span style={punctuation}>{" => {"}</span>
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Console log */}
            <Text style={codeLineIndent}>
              <span style={variable}>console</span>
              <span style={punctuation}>.</span>
              <span style={functionName}>log</span>
              <span style={punctuation}>(</span>
              <span style={string}>{`"Dear ${firstName},"`}</span>
              <span style={punctuation}>);</span>
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Comment paragraph */}
            <Text style={commentIndent}>
              {"// Thank you for joining us on this journey into a world"}
            </Text>
            <Text style={commentIndent}>
              {"// where family secrets hold the key to saving civilization."}
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            <Text style={commentIndent}>
              {"// When The Midnight Coder's Children releases in September 2026,"}
            </Text>
            <Text style={commentIndent}>
              {"// you will be among the first to know."}
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Quote block */}
            <Section style={quoteBlock}>
              <Text style={quoteComment}>{"/**"}</Text>
              <Text style={quoteComment}>
                {" * \"What appears to be a family recipe book reveals itself"}
              </Text>
              <Text style={quoteComment}>
                {" * to be something else entirely - a cipher designed to be"}
              </Text>
              <Text style={quoteComment}>
                {" * solved only by those who truly knew her.\""}
              </Text>
              <Text style={quoteComment}>{" */"}</Text>
            </Section>

            <Text style={emptyLine}>&nbsp;</Text>

            <Text style={commentIndent}>
              {"// A propulsive thriller about trust, legacy, and the fragile bonds"}
            </Text>
            <Text style={commentIndent}>
              {"// that hold both families and civilizations together."}
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Return statement */}
            <Text style={codeLineIndent}>
              <span style={keyword}>return</span>
              <span style={punctuation}>{" { "}</span>
              <span style={variable}>anticipation</span>
              <span style={punctuation}>:</span>
              <span style={typeStyle}>{" true"}</span>
              <span style={punctuation}>{" };"}</span>
            </Text>

            <Text style={codeLine}>
              <span style={punctuation}>{"}"}</span>
              <span style={punctuation}>;</span>
            </Text>

            <Text style={emptyLine}>&nbsp;</Text>

            {/* Export */}
            <Text style={codeLine}>
              <span style={keyword}>export default</span>
              <span style={functionName}>{" greet"}</span>
              <span style={punctuation}>;</span>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerComment}>
              {"// Coming September 2026"}
            </Text>
            <Text style={footerComment}>
              {"// (c) 2026 Bodhi Press. All rights reserved."}
            </Text>
            <Text style={footerComment}>
              {"// You signed up at "}
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
  fontFamily: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  margin: "0",
  padding: "20px",
};

const container = {
  backgroundColor: "#1e1e1e",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  overflow: "hidden",
};

const windowHeader = {
  backgroundColor: "#323233",
  padding: "12px 16px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const windowDot = (color: string) => ({
  display: "inline-block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: "8px",
});

const fileName = {
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "12px",
  marginLeft: "12px",
};

const codeSection = {
  padding: "24px",
};

const codeLine = {
  color: "#D4D4D4",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre" as const,
};

const codeLineIndent = {
  ...codeLine,
  paddingLeft: "24px",
};

const emptyLine = {
  fontSize: "14px",
  lineHeight: "0.8",
  margin: "0",
};

const keyword = {
  color: "#569CD6",
};

const variable = {
  color: "#9CDCFE",
};

const functionName = {
  color: "#DCDCAA",
};

const string = {
  color: "#CE9178",
};

const typeStyle = {
  color: "#4EC9B0",
};

const punctuation = {
  color: "#D4D4D4",
};

const comment = {
  color: "#6A9955",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const commentIndent = {
  ...comment,
  paddingLeft: "24px",
};

const quoteBlock = {
  backgroundColor: "rgba(106, 153, 85, 0.1)",
  borderLeft: "3px solid #6A9955",
  margin: "0",
  padding: "12px 16px",
  marginLeft: "24px",
};

const quoteComment = {
  color: "#6A9955",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic" as const,
};

const divider = {
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  margin: "0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerComment = {
  color: "#6A9955",
  fontSize: "12px",
  lineHeight: "1.8",
  margin: "0",
};

const link = {
  color: "#569CD6",
  textDecoration: "underline",
};

export default WelcomeEmail;
