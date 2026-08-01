"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { SocialPost, SocialRendition } from "@/lib/social-posts.generated";
import { trackFileDownload } from "@/lib/analytics";

type Preview = {
  rendition: SocialRendition;
  postTitle: string;
};

const MONO = { fontFamily: "var(--font-mono)" } as const;
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

const DOWNLOAD_CLASS =
  "px-3 py-2 text-[10px] tracking-[0.18em] uppercase rounded border transition-colors";

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "";
  const mb = bytes / 1_048_576;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

type DownloadLinkProps = {
  href: string;
  format: "PNG" | "JPG" | "MOV";
  bytes: number;
  isPrimary: boolean;
};

function DownloadLink({
  href,
  format,
  bytes,
  isPrimary,
}: DownloadLinkProps): React.ReactElement {
  return (
    <a
      href={href}
      download
      onClick={() =>
        trackFileDownload({ asset: href, category: "social_asset" })
      }
      className={DOWNLOAD_CLASS}
      style={{
        ...MONO,
        color: isPrimary ? "#4EC9B0" : "rgba(255,255,255,0.6)",
        borderColor: isPrimary
          ? "rgba(78,201,176,0.5)"
          : "rgba(255,255,255,0.16)",
        backgroundColor: isPrimary
          ? "rgba(78,201,176,0.08)"
          : "rgba(255,255,255,0.03)",
      }}
    >
      {format}
      {bytes > 0 && (
        <span style={{ color: "rgba(255,255,255,0.3)" }}>
          {" "}
          {formatBytes(bytes)}
        </span>
      )}
    </a>
  );
}

type RenditionCardProps = {
  rendition: SocialRendition;
  postTitle: string;
  onPreview: (preview: Preview) => void;
};

function RenditionCard({
  rendition,
  postTitle,
  onPreview,
}: RenditionCardProps): React.ReactElement {
  const ratio = rendition.sizeId.replace("x", ":");
  const videoRef = useRef<HTMLVideoElement>(null);

  /* The loop is fetched on first hover rather than with the page: twelve
     autoplaying videos would cost more than the whole rest of the site. */
  const playLoop = useCallback(() => {
    void videoRef.current?.play().catch(() => undefined);
  }, []);

  const stopLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  return (
    <figure className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => onPreview({ rendition, postTitle })}
        onMouseEnter={playLoop}
        onMouseLeave={stopLoop}
        onFocus={playLoop}
        onBlur={stopLoop}
        className="group relative flex h-[340px] md:h-[440px] lg:h-[520px] items-center justify-center rounded-lg p-6 cursor-zoom-in transition-colors hover:bg-white/[0.07]"
        style={{
          backgroundColor: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        aria-label={`Preview ${postTitle} at ${ratio}`}
      >
        <span className="relative flex h-full w-full items-center justify-center">
          <Image
            src={rendition.png}
            alt={`${postTitle}, ${ratio}`}
            width={rendition.width}
            height={rendition.height}
            sizes="(max-width: 768px) 90vw, 30vw"
            className="max-h-full w-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.03]"
            style={{
              boxShadow:
                "0 18px 44px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          />
          <video
            ref={videoRef}
            src={rendition.mov}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 m-auto max-h-full w-auto rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
          />
        </span>
        <span
          className="absolute top-3 right-3 px-2 py-1 text-[9px] tracking-[0.2em] rounded"
          style={{
            ...MONO,
            color: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(10,22,40,0.75)",
          }}
        >
          {ratio}
        </span>
      </button>

      <figcaption className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-[11px] tracking-[0.18em] uppercase"
            style={{ ...MONO, color: "rgba(255,255,255,0.7)" }}
          >
            {rendition.label}
          </span>
          <span
            className="text-[11px] whitespace-nowrap"
            style={{ ...MONO, color: "rgba(255,255,255,0.3)" }}
          >
            {rendition.width} &times; {rendition.height}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DownloadLink
            href={rendition.jpg}
            format="JPG"
            bytes={rendition.jpgBytes}
            isPrimary
          />
          <DownloadLink
            href={rendition.png}
            format="PNG"
            bytes={rendition.pngBytes}
            isPrimary={false}
          />
          <DownloadLink
            href={rendition.mov}
            format="MOV"
            bytes={rendition.movBytes}
            isPrimary={false}
          />
        </div>
      </figcaption>
    </figure>
  );
}

type SocialPostGalleryProps = {
  posts: SocialPost[];
};

export function SocialPostGallery({
  posts,
}: SocialPostGalleryProps): React.ReactElement {
  const [preview, setPreview] = useState<Preview | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);

  useEffect(() => {
    if (!preview) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [preview, closePreview]);

  return (
    <>
      <div className="flex flex-col gap-24 md:gap-32">
        {posts.map((post, index) => (
          <section key={post.id} id={post.id} className="scroll-mt-28">
            <header
              className="grid md:grid-cols-12 gap-6 md:gap-10 pb-8 mb-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="md:col-span-5 flex flex-col gap-3">
                <span
                  className="text-[11px] tracking-[0.3em]"
                  style={{ ...MONO, color: "#4EC9B0" }}
                >
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(posts.length).padStart(2, "0")}
                </span>
                <h2
                  className="text-3xl md:text-4xl leading-tight"
                  style={{ ...SERIF, color: "#ffffff" }}
                >
                  {post.title}
                </h2>
              </div>
              <div className="md:col-span-7 flex flex-col gap-4 md:pt-9">
                <p
                  className="text-lg md:text-xl leading-snug"
                  style={{ ...SERIF, color: "rgba(255,255,255,0.9)" }}
                >
                  &ldquo;{post.headline}&rdquo;
                </p>
                <p
                  className="text-sm leading-[1.7]"
                  style={{ ...SERIF, color: "rgba(255,255,255,0.55)" }}
                >
                  {post.note}
                </p>
              </div>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {post.renditions.map((rendition) => (
                <RenditionCard
                  key={rendition.sizeId}
                  rendition={rendition}
                  postTitle={post.title}
                  onPreview={setPreview}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.postTitle} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10"
          onClick={closePreview}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(3, 8, 16, 0.92)" }}
          />
          <div className="relative flex flex-col items-center gap-5 max-h-full">
            {/* The loop plays here rather than the still, because motion is the
                thing a preview cannot show any other way. */}
            <video
              src={preview.rendition.mov}
              poster={preview.rendition.png}
              autoPlay
              muted
              loop
              playsInline
              aria-label={`${preview.postTitle}, ${preview.rendition.sizeId.replace("x", ":")}`}
              className="max-h-[74vh] w-auto object-contain rounded"
              style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
            />
            <div
              className="flex flex-wrap justify-center items-center gap-3"
              onClick={(event) => event.stopPropagation()}
            >
              <span
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{ ...MONO, color: "rgba(255,255,255,0.5)" }}
              >
                {preview.rendition.width} &times; {preview.rendition.height}
              </span>
              <DownloadLink
                href={preview.rendition.jpg}
                format="JPG"
                bytes={preview.rendition.jpgBytes}
                isPrimary
              />
              <DownloadLink
                href={preview.rendition.png}
                format="PNG"
                bytes={preview.rendition.pngBytes}
                isPrimary={false}
              />
              <DownloadLink
                href={preview.rendition.mov}
                format="MOV"
                bytes={preview.rendition.movBytes}
                isPrimary={false}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={closePreview}
            className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full text-lg"
            style={{
              ...MONO,
              color: "rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            aria-label="Close preview"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
