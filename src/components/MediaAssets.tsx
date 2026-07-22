"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import ASSETS from "@/lib/press-assets.json";
import { trackFileDownload } from "@/lib/analytics";

const PRESS_KIT_ZIP = "/press-kit/midnight-coders-press-kit.zip";

const downloadLinkClass =
  "text-[10px] tracking-wider uppercase underline underline-offset-2 text-white/35 hover:text-white/70 transition-colors";

export function MediaAssets(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    },
    [closeLightbox]
  );

  return (
    <section
      className="pt-8"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2
          className="text-xs tracking-[0.15em] uppercase"
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Media assets
        </h2>
        <a
          href={PRESS_KIT_ZIP}
          onClick={() => trackFileDownload({ asset: "press-kit.zip", category: "press_kit" })}
          download
          className={downloadLinkClass}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Download all (.zip)
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ASSETS.map((asset, index) => (
          <div key={asset.label} className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group w-full cursor-pointer"
              aria-label={`View ${asset.label}`}
            >
              <div
                className="w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center p-4 transition-colors"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  width={200}
                  height={200}
                  className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
            </button>
            <span
              className="text-[10px] tracking-wider uppercase text-center"
              style={{
                color: "rgba(255, 255, 255, 0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {asset.label}
            </span>
            <a
              href={asset.src}
              onClick={() => trackFileDownload({ asset: asset.src, category: "media_asset" })}
              download={asset.downloadName}
              className={downloadLinkClass}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Download
            </a>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ASSETS[activeIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
          />
          <div className="relative max-w-2xl max-h-[80vh] flex flex-col items-center gap-4">
            <Image
              src={ASSETS[activeIndex].src}
              alt={ASSETS[activeIndex].alt}
              width={600}
              height={600}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="flex items-center gap-4">
              <p
                className="text-xs tracking-wider uppercase"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {ASSETS[activeIndex].label}
              </p>
              <a
                href={ASSETS[activeIndex].src}
                download={ASSETS[activeIndex].downloadName}
                onClick={(e) => {
                  // Keep the existing stopPropagation: without it the click
                  // bubbles to the backdrop and closes the lightbox.
                  e.stopPropagation();
                  trackFileDownload({
                    asset: ASSETS[activeIndex].src,
                    category: "media_asset",
                  });
                }}
                className={downloadLinkClass}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Download
              </a>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
