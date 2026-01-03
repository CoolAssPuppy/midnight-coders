"use client";

import { useState, useEffect, memo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  shimmerDuration: number;
  shimmerDelay: number;
  baseOpacity: number;
}

interface StaticStarFieldProps {
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
      baseOpacity: 0.4 + Math.random() * 0.3,
    });
  }

  return particles;
}

function StaticStarFieldComponent({
  particleCount = 100,
}: StaticStarFieldProps): React.ReactElement | null {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(particleCount));
  }, [particleCount]);

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
        <span
          key={particle.id}
          className="animate-shimmer rounded-full"
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: `rgba(255, 255, 255, ${particle.baseOpacity})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.3)`,
            ["--shimmer-duration" as string]: `${particle.shimmerDuration}s`,
            ["--shimmer-delay" as string]: `${particle.shimmerDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

export const StaticStarField = memo(StaticStarFieldComponent);
