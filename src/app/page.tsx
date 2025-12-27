"use client";

import { StarField } from "@/components/StarField";
import { HeroSection } from "@/components/HeroSection";
import { BookBlurb } from "@/components/BookBlurb";
import { EmailSignup } from "@/components/EmailSignup";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function Home(): React.ReactElement {
  const { progress } = useScrollProgress();

  return (
    <main className="relative min-h-[400vh]">
      <StarField scrollProgress={progress} />

      <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <HeroSection scrollProgress={progress} />
          <BookBlurb scrollProgress={progress} />
          <EmailSignup scrollProgress={progress} />
        </div>
      </div>

      <ScrollIndicator isVisible={progress < 0.03} />
    </main>
  );
}

interface ScrollIndicatorProps {
  isVisible: boolean;
}

function ScrollIndicator({
  isVisible,
}: ScrollIndicatorProps): React.ReactElement | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse z-20"
      aria-hidden="true"
    >
      <span
        className="text-xs tracking-widest uppercase"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        Scroll
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </div>
  );
}
