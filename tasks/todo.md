# Direct sales + ad measurement: setup checklist

Audited 2026-07-22 against the live Stripe, Doppler, R2 and Meta APIs, and
against production. Everything verified done was removed rather than ticked.

Release date is **15 September 2026**.

---

## Blocks a buyer receiving the book

- [ ] **Upload the EPUB to R2.** Bucket `bodhi-press-books`, key from
      `R2_EPUB_KEY`. Blocked on the finished file existing. Until then the
      download route presigns a URL to an object that is not there.
- [ ] **Confirm the Kit delivery automation is live.** The tag and the
      `download_url` custom field are verified via API, but the automation
      itself cannot be checked that way. Add the `Digital Purchase` tag to your
      own address in Kit and confirm the email arrives, the merge tag renders as
      a URL rather than literal `{{ subscriber.download_url }}`, and the copy
      says the link unlocks **15 September 2026**. Remove the tag afterwards.

## Blocks going live

- [ ] **Local end-to-end test in Stripe test mode.** Detail in Part I below.
- [ ] **Live smoke test.** Buy with a real card, confirm the Kit email arrives,
      then refund yourself.

## Decide

- [ ] **VAT.** `ALLOWED_COUNTRIES` in `src/lib/stripe.ts` is still `null`, so the
      site sells worldwide. Selling digital goods into the EU/UK has no
      registration threshold for a US seller, so VAT is owed from the first sale.
      Stripe Tax calculates it; calculating is not remitting. Either register for
      EU non-Union OSS and UK VAT, or set `ALLOWED_COUNTRIES` to `["US"]`, or
      accept the exposure knowingly.
- [ ] **Stripe Tax.** Not yet enabled. Settings → Tax: set the origin address,
      set the default tax category to Digital goods, turn it on (0.5% per
      transaction), and add any jurisdictions you registered in.

## Measurement

- [ ] **Confirm pixel and CAPI deduplication.** One visit should produce two rows
      in Test Events for the same event, one Browser and one Server, sharing an
      `event_id`. If dedup is broken every conversion double-counts and the
      numbers look great right until you make a budget decision on them.
- [ ] **Verify the browser pixel end to end.** `fbevents.js` is blocked by a
      local ad blocker on your machine, so `fbq.getState` is undefined and the
      init and PageView calls sit in the queue forever. Retest in Incognito.
- [ ] **Rotate both Conversions API tokens.** Both appeared in a working
      transcript. They cannot move money, but they can inject fabricated
      conversions, and poisoned optimization data cannot be cleaned up after.
- [ ] **Set Aggregated Event Measurement rankings** on both domains, ordered by
      value per event: Purchase, InitiateCheckout, Lead, AddToCart, ViewContent.
      No API for this, Events Manager UI only.
- [ ] **PostHog reverse proxy.** After the next deploy, confirm in devtools that
      requests go to `midnightcoderschildren.com/ingest/...` and not to
      `us.i.posthog.com`. If they go direct, ad blockers will eat your analytics.

## Housekeeping

- [ ] `STRIPE_WEBHOOK_SECRET` missing from Doppler `stg`. Only matters if
      staging ever takes payments.
- [ ] Re-login the clobbered Stripe CLI profile:
      `stripe login --project-name agent-panel`
- [ ] `layout.tsx` sets `baseUrl` to the apex domain, but production 307s apex to
      `www`. Canonicals and JSON-LD point at a redirecting host. Confirmed still
      true: `https://midnightcoderschildren.com/buy` returns 307 to `www`.

---

## Part I: Local end-to-end test

Stripe test mode throughout. Switch the dashboard toggle and use test keys in
your `dev` Doppler config.

- [ ] Terminal 1: `pnpm dev`
- [ ] Terminal 2: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Copy the `whsec_...` that `stripe listen` prints into the **dev** Doppler
      config as `STRIPE_WEBHOOK_SECRET`, then restart `pnpm dev`
- [ ] Open http://localhost:3000/buy and pay with `4242 4242 4242 4242`

**Verify:**

- [ ] You land on `/buy/success`
- [ ] Terminal 2 shows `checkout.session.completed`
- [ ] Terminal 1 logs `Delivered digital edition to <email>`
- [ ] In Kit, that subscriber has the `Digital Purchase` tag and a long URL in
      `download_url`
- [ ] Opening that URL returns **"Not yet available"** and names
      **15 September 2026**. If it downloads the book, the not-before gate is
      broken. Stop and say so.
- [ ] Changing one character in the middle of the token returns
      **"Invalid download link"**

## Part J: Verify measurement

- [ ] Events Manager → Test events, open the site through the browser-events box
- [ ] Click a retailer link, confirm `InitiateCheckout` appears
- [ ] Test purchase, confirm `Purchase` appears with **value 14.99** and
      currency USD. If it shows `1499` the units are wrong. Stop and say so.
- [ ] Confirm the event shows both Browser and Server rows sharing an `event_id`
- [ ] PostHog → Activity: confirm `$pageview` from the domain and a `purchase`
      event with `ecommerce.value = 14.99`

## Part K: Go live

- [ ] Confirm Stripe is out of test mode and live keys are in Doppler `prd`
- [ ] Deploy
- [ ] Buy your own book with a real card, confirm the Kit email, then refund

---

## Verified done, 2026-07-22

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
| Meta dataset | `1561129122079440`, appears twice in served HTML, `fbq('init')` fires with it |
| Meta CAPI validated | Server event accepted, `events_received: 1`, Processed in Test Events |

## Removed as no longer applicable

- **Part D, OpenAI Ads.** The paid plan is now Meta and LinkedIn. No OpenAI
  pixel or conversions key exists in any Doppler config. Reinstate if that
  changes.
- **Part H as written.** It said to place the EPUB at `private/ebook/` and commit
  it. The download route now presigns from R2, so the file goes to the bucket
  and never enters the repo.

## Known limitations, accepted

- **No download count limit.** Tokens gate on not-before and expiry only. A buyer
  who forwards their link shares access until it expires. Enforcing a count needs
  a datastore this site does not have.
- **Retailer clicks are intent, not revenue.** `checkout_started` and
  `InitiateCheckout` overcount relative to books actually sold on Amazon. Read
  `order_created` and `Purchase` for real money.
