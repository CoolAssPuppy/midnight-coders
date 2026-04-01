"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

const ASSETS = [
  {
    src: "/images/book-cover/Midnight Coders Children Cover 3D.png",
    alt: "The Midnight Coder's Children - 3D book cover",
    label: "3D book cover",
  },
  {
    src: "/images/book-cover/Midnight Coders Children Cover.jpg",
    alt: "The Midnight Coder's Children - book cover",
    label: "Book cover",
  },
  {
    src: "/images/midnight-coders-logotype.svg",
    alt: "The Midnight Coder's Children - logo",
    label: "Logo",
  },
  {
    src: "/images/author/prashant-sridharan.jpg",
    alt: "Prashant Sridharan - author photo",
    label: "Author photo",
  },
];

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
      <h2
        className="text-xs tracking-[0.15em] uppercase mb-5"
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Media assets
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ASSETS.map((asset, index) => (
          <button
            key={asset.label}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group flex flex-col items-center gap-2 cursor-pointer"
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
            <span
              className="text-[10px] tracking-wider uppercase"
              style={{
                color: "rgba(255, 255, 255, 0.35)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {asset.label}
            </span>
          </button>
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
            <p
              className="text-xs tracking-wider uppercase"
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {ASSETS[activeIndex].label}
            </p>
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
