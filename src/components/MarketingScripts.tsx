"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  hasMarketingConsent,
  subscribeMarketingConsent,
} from "@/lib/consent";
import {
  stashLandingCampaignParams,
  promoteCampaignParamsAfterConsent,
} from "@/lib/analytics/campaign-params";
import { META_DATASET_ID, GA_MEASUREMENT_ID, OPENAI_PIXEL_ID } from "@/lib/analytics";
import { createEventId } from "@/lib/analytics/meta-events";

const GTM_ID = "GTM-W663MCWC";

type FbqFunction = (...args: unknown[]) => void;

interface FbqWindow {
  fbq?: FbqFunction;
}

/**
 * The existing marketing tags, loaded only after consent.
 *
 * Same GTM container, same Meta dataset, same GA4 id, same OpenAI pixel as
 * before. Nothing new is installed. PageView uses the existing fbq, including
 * on App Router navigations.
 */
export function MarketingScripts(): React.ReactElement | null {
  const pathname = usePathname();
  const [granted, setGranted] = useState(false);
  const [pixelReady, setPixelReady] = useState(false);
  const lastPageView = useRef<string | null>(null);

  useEffect(() => {
    stashLandingCampaignParams(window.location.search);
    const grantedNow = hasMarketingConsent();
    setGranted(grantedNow);
    if (grantedNow) setPixelReady(true);
    return subscribeMarketingConsent((value) => {
      if (value === "granted") {
        promoteCampaignParamsAfterConsent();
        stashLandingCampaignParams(window.location.search);
        setGranted(true);
        setPixelReady(true);
      } else {
        setGranted(false);
        setPixelReady(false);
        lastPageView.current = null;
      }
    });
  }, []);

  useEffect(() => {
    if (!granted || !pixelReady) return;
    if (lastPageView.current === pathname) return;
    lastPageView.current = pathname;

    const fbq = (window as unknown as FbqWindow).fbq;
    if (typeof fbq !== "function") return;

    try {
      fbq("track", "PageView", {}, { eventID: createEventId() });
    } catch {
      // A blocked pixel must not break navigation.
    }
  }, [granted, pixelReady, pathname]);

  if (!granted) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
        }}
      />
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            id="ga4-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config','${GA_MEASUREMENT_ID}');`,
            }}
          />
        </>
      )}
      {OPENAI_PIXEL_ID && (
        <>
          <link rel="preconnect" href="https://bzrcdn.openai.com" />
          <Script
            id="oaiq-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.oaiq=window.oaiq||function(){(window.oaiq.q=window.oaiq.q||[]).push(arguments)};
oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}"});`,
            }}
          />
          <Script
            id="oaiq-sdk"
            strategy="afterInteractive"
            src="https://bzrcdn.openai.com/sdk/oaiq.min.js"
          />
        </>
      )}
      {META_DATASET_ID && (
        <>
          <link rel="preconnect" href="https://connect.facebook.net" />
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_DATASET_ID}');`,
            }}
          />
        </>
      )}
    </>
  );
}
