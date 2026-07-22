"use client";

import { useSyncExternalStore } from "react";

const RELEASE_MS = Date.parse("2026-09-15T00:00:00.000Z");

/**
 * Seconds remaining until release, snapped to whole seconds.
 *
 * useSyncExternalStore rather than useState plus useEffect: this repo treats
 * `react-hooks/set-state-in-effect` as an error, and the same pattern is
 * already used by StaticStarField. Snapping to seconds keeps the snapshot
 * stable between renders inside the same tick.
 */
function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

function getSnapshot(): number {
  return Math.max(0, Math.floor((RELEASE_MS - Date.now()) / 1000));
}

/** Stable on the server so hydration cannot mismatch. */
function getServerSnapshot(): number {
  return 0;
}

interface Part {
  value: number;
  label: string;
}

function splitDuration(totalSeconds: number): Part[] {
  return [
    { value: Math.floor(totalSeconds / 86400), label: "days" },
    { value: Math.floor(totalSeconds / 3600) % 24, label: "hours" },
    { value: Math.floor(totalSeconds / 60) % 60, label: "minutes" },
    { value: totalSeconds % 60, label: "seconds" },
  ];
}

export function ReleaseCountdown(): React.ReactElement {
  const remaining = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // The server renders zero, so the countdown would flash "released" for one
  // frame. Render the frame as reserved space instead.
  if (remaining <= 0) {
    return (
      <p className="thanks__released">
        The Midnight Coder&rsquo;s Children is out now.
      </p>
    );
  }

  const parts = splitDuration(remaining);

  return (
    <div
      className="thanks__countdown"
      aria-label={`${parts[0].value} days until release`}
    >
      {parts.map((part) => (
        <div className="thanks__unit" key={part.label}>
          <span className="thanks__value">
            {part.label === "days"
              ? part.value
              : String(part.value).padStart(2, "0")}
          </span>
          <span className="thanks__label">{part.label}</span>
        </div>
      ))}
    </div>
  );
}
