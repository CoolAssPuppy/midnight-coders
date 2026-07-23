# Direct sales + ad measurement: setup checklist

Audited 2026-07-22 against the live Stripe, Doppler, R2 and Meta APIs, and
against production. Verified items were removed rather than ticked.

Release date is **15 September 2026**.

---

## Blocks a buyer receiving the book

- [ ] **Upload the EPUB to R2.** Bucket `bodhi-press-books`, key from
      `R2_EPUB_KEY`. Blocked on the finished file existing. Until then the
      download route presigns a URL to an object that is not there.

## Measurement

- [ ] **PostHog reverse proxy.** After the next deploy, confirm in devtools that
      requests go to `midnightcoderschildren.com/ingest/...` and not to
      `us.i.posthog.com`. If they go direct, ad blockers will eat your analytics.

## Housekeeping

- [ ] Re-login the clobbered Stripe CLI profile:
      `stripe login --project-name agent-panel`

---

## Verified done

Kept as a record so nobody redoes them.

| Item | How it was verified |
| --- | --- |
| Stripe account live | `charges_enabled`, `payouts_enabled`, `details_submitted` all true |
| Statement descriptor `BODHI PRESS` | Live account settings |
| Live product and price | `price_1TvzE6PDk9uLJgQGqiJfLOIH`, 1499 usd, inclusive, lookup key `midnight-coders-digital`, one match |
| Live webhook | `we_1TvzFHPDk9uLJgQGKduIKXyw`, enabled, `checkout.session.completed` only, pointing at the www host |
| R2 download migration | `src/app/api/download/[token]/route.ts` uses `presignEbookUrl`, not `readFile` |
| R2 credentials in dev, stg, prd | All five `R2_*` keys present in every config |
| Deployed to production | `https://www.midnightcoderschildren.com/buy` returns 200 |
| `STRIPE_PROVISIONING_KEY` removed | Absent from all three Doppler configs |
| Doppler prd fully populated | Stripe, download-token, Kit, R2, PostHog, Meta, site URL |
| PostHog project | `Midnight Coders`, keys set in all three configs |
| Kit tag and custom field | Tag `Digital Purchase` (21364276), field `download_url` (1319749) |
| Kit delivery automation | Confirmed live by Prashant |
| Local end-to-end test | Run against Stripe test mode by Prashant |
| Live smoke test | Real card purchase confirmed by Prashant |
| Meta dataset | `1561129122079440`, appears twice in served HTML, `fbq('init')` fires with it |
| Meta CAPI validated | Server event accepted, `events_received: 1`, Processed in Test Events |
| `STRIPE_WEBHOOK_SECRET` in `stg` | Copied from `prd`, both now `whsec_pqa2…` |
| Browser pixel fires | Clean headless Chrome: `fbevents.js` 200, signals config 200, `facebook.com/tr/?id=1561129122079440&ev=PageView` 200, `fbq.loaded === true`. The ad blocker was the only thing suppressing it |
| Canonicals on the www host | `src/lib/site.ts` is the only origin; no apex URL left outside test fixtures (commit `50f98b7`) |

## Decided against

Recorded so the decision does not get relitigated.

- **VAT registration and Stripe Tax.** `ALLOWED_COUNTRIES` stays `null`, so the
  site sells worldwide with no EU or UK registration and Stripe Tax off. Selling
  digital goods into the EU and UK carries no registration threshold, so VAT is
  technically owed from the first sale. Accepted knowingly on volume grounds.
  Revisit if unit sales get into the thousands or if a tax authority makes
  contact.
- **Rotating the Conversions API tokens.** Both appeared in a working transcript.
  They cannot move money. Accepted.
- **Pixel and CAPI deduplication testing.** Untested. If dedup is broken, one
  sale writes two `Purchase` events and reported conversions run roughly double
  the truth. Accepted. Worth remembering if Meta's numbers ever look better than
  your Stripe dashboard.

## Known limitations, accepted

- **No download count limit.** Tokens gate on not-before and expiry only. A buyer
  who forwards their link shares access until it expires. Enforcing a count needs
  a datastore this site does not have.
- **Retailer clicks are intent, not revenue.** `checkout_started` and
  `InitiateCheckout` overcount relative to books actually sold on Amazon. Read
  `order_created` and `Purchase` for real money.

## Removed as no longer applicable

- **Aggregated Event Measurement rankings.** Meta dropped the eight-event limit
  and manual prioritization for web conversions in mid-2025 and removed the AEM
  tab from Events Manager. All eligible events are aggregated automatically.
  Confirmed against the live UI: the left rail is Connect data, Overview,
  Datasets, Custom conversions, Integrations. The old model still applies to iOS
  app campaigns, which this account does not run.
- **Part D, OpenAI Ads.** The paid plan is Meta and LinkedIn. No OpenAI pixel or
  conversions key exists in any Doppler config. Reinstate if that changes.
- **Part H as written.** It said to place the EPUB at `private/ebook/` and commit
  it. The download route presigns from R2 now, so the file goes to the bucket and
  never enters the repo.
