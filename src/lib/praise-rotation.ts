/** Returns the next quote index, wrapping back to the first quote. */
export function getNextPraiseIndex(
  currentIndex: number,
  quoteCount: number,
): number {
  if (quoteCount <= 1) {
    return 0;
  }

  return (currentIndex + 1) % quoteCount;
}
