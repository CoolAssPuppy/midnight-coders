"use client";

import { useState, useEffect, memo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  shimmerDuration: number;
  shimmerDelay: number;
  binary: "0" | "1";
  baseOpacity: number;
}

interface StarFieldProps {
  scrollProgress: number;
  particleCount?: number;
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      shimmerDuration: Math.random() * 3 + 2,
      shimmerDelay: Math.random() * 5,
      binary: Math.random() > 0.5 ? "1" : "0",
      baseOpacity: 0.4 + Math.random() * 0.3,
    });
  }

  return particles;
}

function StarFieldComponent({
  scrollProgress,
  particleCount = 150,
}: StarFieldProps): React.ReactElement | null {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(particleCount));
  }, [particleCount]);

  const transformThreshold = 0.05;
  const isTransformed = scrollProgress > transformThreshold;
  const transformProgress = isTransformed
    ? Math.min((scrollProgress - transformThreshold) / 0.15, 1)
    : 0;

  if (particles.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          transformProgress={transformProgress}
        />
      ))}
    </div>
  );
}

interface ParticleComponentProps {
  particle: Particle;
  transformProgress: number;
}

const ParticleElement = memo(function ParticleElement({
  particle,
  transformProgress,
}: ParticleComponentProps): React.ReactElement {
  const showBinary = transformProgress > 0;
  const opacity = 0.3 + transformProgress * 0.4;

  const baseStyles: React.CSSProperties = {
    position: "absolute",
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    ["--shimmer-duration" as string]: `${particle.shimmerDuration}s`,
    ["--shimmer-delay" as string]: `${particle.shimmerDelay}s`,
    transition: "opacity 0.5s ease-out",
  };

  if (showBinary) {
    return (
      <span
        className="animate-shimmer select-none"
        style={{
          ...baseStyles,
          fontSize: `${particle.size * 6 + 4}px`,
          color: `rgba(255, 255, 255, ${opacity})`,
          fontFamily: "monospace",
          transform: "translate(-50%, -50%)",
        }}
      >
        {particle.binary}
      </span>
    );
  }

  return (
    <span
      className="animate-shimmer rounded-full"
      style={{
        ...baseStyles,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: `rgba(255, 255, 255, ${particle.baseOpacity})`,
        boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.3)`,
      }}
    />
  );
});

export const StarField = memo(StarFieldComponent);
