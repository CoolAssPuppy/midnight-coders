"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_REOPEN_EVENT,
  getMarketingConsent,
  setMarketingConsent,
  subscribeMarketingConsent,
} from "@/lib/consent";
import { promoteCampaignParamsAfterConsent } from "@/lib/analytics/campaign-params";

/**
 * Portugal / GDPR measurement prompt.
 *
 * Hidden after a choice. Default is denied, so marketing pixels stay off
 * until Agree. Not now leaves them off.
 */
export function ConsentBanner(): React.ReactElement | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = (): void => {
      setVisible(getMarketingConsent() === null);
    };

    sync();
    const unsubscribe = subscribeMarketingConsent(sync);
    const reopen = (): void => setVisible(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => {
      unsubscribe();
      window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-copy"
      className="fixed bottom-0 inset-x-0 z-[80] px-4 pb-4 md:px-6"
    >
      <div
        className="mx-auto max-w-3xl rounded border px-4 py-3 md:px-5 md:py-4"
        style={{
          backgroundColor: "rgba(10, 22, 40, 0.96)",
          borderColor: "rgba(255, 255, 255, 0.14)",
        }}
      >
        <p
          id="consent-title"
          className="text-[10px] tracking-[0.18em] uppercase mb-1"
          style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-mono)" }}
        >
          Measurement
        </p>
        <p
          id="consent-copy"
          className="text-xs md:text-sm leading-relaxed mb-3"
          style={{ color: "rgba(255, 255, 255, 0.72)" }}
        >
          If you agree, the site records which type of link you used to buy.
          That&rsquo;s it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="px-4 py-2 text-[11px] tracking-wider uppercase rounded border"
            style={{
              color: "#7fe3cd",
              borderColor: "rgba(78, 201, 176, 0.6)",
              backgroundColor: "rgba(78, 201, 176, 0.1)",
              fontFamily: "var(--font-mono)",
            }}
            onClick={() => {
              promoteCampaignParamsAfterConsent();
              setMarketingConsent("granted");
              setVisible(false);
            }}
          >
            Agree
          </button>
          <button
            type="button"
            className="px-4 py-2 text-[11px] tracking-wider uppercase"
            style={{
              color: "rgba(255, 255, 255, 0.45)",
              fontFamily: "var(--font-mono)",
            }}
            onClick={() => {
              setMarketingConsent("denied");
              setVisible(false);
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
