import { Layout } from "./_components/Layout";
import { FallbackLink, Paragraph, PrimaryButton, Title } from "./_components/blocks";
import { formatReleaseDate } from "./_components/theme";

export interface ReleaseAvailableProps {
  firstName: string;
  downloadUrl: string;
  releaseDateIso: string;
}

/**
 * Sent once, on release day, to everyone who pre-ordered.
 *
 * Strictly a courtesy. The token in the buyer's original confirmation is
 * permanent and starts working on its own, so nothing breaks if this fails.
 */
export function ReleaseAvailable({
  firstName,
  downloadUrl,
  releaseDateIso,
}: ReleaseAvailableProps): React.ReactElement {
  const greeting = firstName.trim().length > 0 ? `${firstName}, it` : "It";

  return (
    <Layout preview="The Midnight Coder's Children is out. Your copy is unlocked.">
      <Title>{greeting} is out</Title>

      <Paragraph>
        The Midnight Coder&apos;s Children released today,{" "}
        {formatReleaseDate(releaseDateIso)}. You pre-ordered, so your copy is
        paid for and the link now works.
      </Paragraph>

      <PrimaryButton href={downloadUrl}>Download the book</PrimaryButton>

      <Paragraph>Thank you for reading!</Paragraph>

      <FallbackLink href={downloadUrl} />
    </Layout>
  );
}

export default ReleaseAvailable;
