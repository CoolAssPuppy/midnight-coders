import { BIO_COMPANIES, BIO_LOCATION } from "@/lib/bio";

type AuthorBioProps = {
  variant: "full" | "compact";
};

export function AuthorBio({ variant }: AuthorBioProps): React.ReactElement {
  if (variant === "compact") {
    return (
      <p
        className="text-sm leading-[1.75]"
        style={{
          color: "rgba(255, 255, 255, 0.7)",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        Prashant Sridharan has held senior marketing leadership roles at{" "}
        {BIO_COMPANIES}. His international best-seller{" "}
        <em>Picks and Shovels</em> explores marketing to developers during the
        AI gold rush. <em>The Midnight Coder&apos;s Children</em> is his debut
        novel, drawing on years spent inside the institutions and engineering
        cultures the book portrays. He lives in {BIO_LOCATION}.
      </p>
    );
  }

  return (
    <div
      className="space-y-5 mb-12"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <p
        className="text-base leading-[1.8]"
        style={{ color: "rgba(255, 255, 255, 0.8)" }}
      >
        Prashant Sridharan has over three decades of experience at the
        intersection of technology and storytelling. He has held senior
        marketing leadership roles at {BIO_COMPANIES}.
      </p>
      <p
        className="text-base leading-[1.8]"
        style={{ color: "rgba(255, 255, 255, 0.8)" }}
      >
        He is the author of the international best-seller{" "}
        <em>Picks and Shovels: Marketing to Developers During the AI Gold Rush</em>.{" "}
        <em>The Midnight Coder&apos;s Children</em> is his debut novel.
      </p>
      <p
        className="text-base leading-[1.8]"
        style={{ color: "rgba(255, 255, 255, 0.8)" }}
      >
        He lives in {BIO_LOCATION}.
      </p>
    </div>
  );
}
