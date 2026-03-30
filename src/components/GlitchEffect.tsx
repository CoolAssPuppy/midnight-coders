"use client";

import { memo, useState, useEffect, useRef, useCallback } from "react";

interface GlitchEffectProps {
  scrollProgress: number;
}

interface GlitchBand {
  id: number;
  top: number;
  height: number;
  left: number;
  width: number;
  rgbShift: number;
  opacity: number;
  skew: number;
  color: "cyan" | "red" | "green";
}

const GLITCH_COLORS = {
  cyan: "rgba(0, 255, 200, 0.15)",
  red: "rgba(255, 0, 50, 0.12)",
  green: "rgba(0, 255, 100, 0.1)",
} as const;

const COLOR_KEYS: Array<"cyan" | "red" | "green"> = ["cyan", "red", "green"];

const generateGlitchBands = (count: number, startId: number): GlitchBand[] => {
  return Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 60;
    const maxWidth = 100 - left;
    const width = Math.random() * (maxWidth * 0.6) + maxWidth * 0.15;

    return {
      id: startId + i,
      top: Math.random() * 100,
      height: Math.random() * 3 + 0.5,
      left,
      width,
      rgbShift: (Math.random() - 0.5) * 12,
      opacity: Math.random() * 0.6 + 0.4,
      skew: (Math.random() - 0.5) * 2,
      color: COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
    };
  });
};

function GlitchEffectComponent({
  scrollProgress,
}: GlitchEffectProps): React.ReactElement {
  const [glitchBands, setGlitchBands] = useState<GlitchBand[]>([]);
  const [scanLineFlicker, setScanLineFlicker] = useState(false);
  const lastScrollRef = useRef(scrollProgress);
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounterRef = useRef(0);

  const triggerGlitch = useCallback(() => {
    const bandCount = Math.floor(Math.random() * 5) + 2;
    const bands = generateGlitchBands(bandCount, idCounterRef.current);
    idCounterRef.current += bandCount;

    setGlitchBands(bands);
    setScanLineFlicker(true);

    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
    }

    const duration = Math.random() * 150 + 50;
    glitchTimeoutRef.current = setTimeout(() => {
      setGlitchBands([]);
      setScanLineFlicker(false);
    }, duration);
  }, []);

  useEffect(() => {
    const scrollDelta = Math.abs(scrollProgress - lastScrollRef.current);
    lastScrollRef.current = scrollProgress;

    if (scrollDelta > 0.001 && Math.random() < 0.3) {
      triggerGlitch();
    }
  }, [scrollProgress, triggerGlitch]);

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, []);

  const offsetY = scrollProgress * -40;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep blue base */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#0a1628" }}
      />

      {/* Tiled pattern layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/bg-pattern.jpg)",
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
          opacity: 0.07,
          mixBlendMode: "screen",
          transform: `translateY(${offsetY}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Scan lines (always visible, very subtle) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)",
          opacity: scanLineFlicker ? 0.6 : 0.2,
          transition: "opacity 0.05s",
        }}
      />

      {/* Glitch bands */}
      {glitchBands.map((band) => (
        <div
          key={band.id}
          className="absolute"
          style={{
            top: `${band.top}%`,
            left: `${band.left}%`,
            width: `${band.width}%`,
            height: `${band.height}%`,
            backgroundColor: GLITCH_COLORS[band.color],
            opacity: band.opacity,
            transform: `skewX(${band.skew}deg) translateX(${band.rgbShift}px)`,
            mixBlendMode: "screen",
            boxShadow: `${band.rgbShift}px 0 ${Math.abs(band.rgbShift) * 2}px ${GLITCH_COLORS[band.color]}`,
          }}
        />
      ))}

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />
    </div>
  );
}

export const GlitchEffect = memo(GlitchEffectComponent);
