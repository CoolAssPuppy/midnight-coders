# Direct sales + ad measurement: setup checklist

Code is written, tested, and committed (`7516328`, `fcf6711`). Everything below
is external configuration that only you can do.

Work top to bottom. Each part ends with a **Verify** step. Do not move on until
it passes, because later parts assume earlier ones worked.

Values in `backticks` are exact. Type them exactly.

---

## REMAINING WORK (audited 2026-07-22, verified against live APIs)

### Verified done

- [x] Stripe live: `charges_enabled`, `payouts_enabled`, descriptor `BODHI PRESS`
- [x] Live product `prod_UvqvqRD05lsFM0` (tax code `txcd_10302000`)
- [x] Live price `price_1TvzE6PDk9uLJgQGqiJfLOIH` — 1499 usd, inclusive, one match on lookup key
- [x] Live webhook `we_1TvzFHPDk9uLJgQGKduIKXyw`, `checkout.session.completed` only
- [x] Test-mode product + price
- [x] Kit tag `Bodhi Press Bundle` (21364276) in all three Doppler configs
- [x] Kit custom field `download_url` (id 1319749), key verified exact
- [x] R2 bucket + credentials — signed HEAD returns 404, so auth works and only the file is absent
- [x] Stripe, download-token, site-URL and Kit secrets in prd
- [x] Code: checkout, webhook, token gate, analytics for 4 destinations. 60 tests, lint and build clean

### 1. Blocks a buyer receiving the book

- [ ] **R2 download migration (mine).** Swap `readFile` for a presigned R2
      redirect in `src/app/api/download/[token]/route.ts`. HMAC and not-before
      checks stay untouched. Removes `private/` and the tracing entry.
- [ ] **Upload the EPUB** to `bodhi-press-books` with key
      `the-midnight-coders-children.epub`. Blocked on the book existing.
- [ ] **Confirm the Kit automation is live.** Field and tag are verified via API;
      the automation itself cannot be checked that way. Send yourself a test.

### 2. Blocks going live

- [ ] **Push and deploy.** 7 commits unpushed. Production `/buy` is **404** and
      the live webhook points at a route that does not exist yet.
- [x] **Vercel env vars.** A Doppler to Vercel integration is active and
      syncing; verified against the Vercel project.
- [ ] **Redeploy after adding any `NEXT_PUBLIC_*`.** These are inlined into the
      bundle at build time, so syncing the value is not enough. Until you
      rebuild, the shipped bundle still contains `""` and PostHog and both
      pixels do nothing, while every dashboard shows the variable as set.
- [ ] **Local end-to-end test on test mode.** Detail in Part I.
- [ ] **Live smoke test.** Buy with a real card, confirm the Kit email, refund.

### 3. Measurement (does not block selling)

Missing from all three configs. Pixels no-op until set; nothing breaks.

- [x] PostHog project created; `NEXT_PUBLIC_POSTHOG_KEY` and
      `NEXT_PUBLIC_POSTHOG_HOST` set in dev, stg, prd and synced to Vercel.
      Verify after first deploy: Network tab requests must go to
      `/ingest/...`, not `us.i.posthog.com`.
- [ ] OpenAI pixel → `NEXT_PUBLIC_OPENAI_PIXEL_ID`, `OPENAI_CONVERSIONS_API_KEY`
- [ ] OpenAI conversion events (Part D2)
- [ ] Meta dataset → `NEXT_PUBLIC_META_DATASET_ID`, `META_CONVERSIONS_ACCESS_TOKEN`
- [ ] Meta payloads have **never** been validated against the live API. Unit
      tested only. Verify with `test_event_code` once the token exists.

### 4. Housekeeping

- [ ] **Delete `STRIPE_PROVISIONING_KEY`, now in two places.** It synced through
      to **Vercel Production** as well as Doppler prd. Remove from Doppler,
      confirm the sync removes it from Vercel, then revoke the key in Stripe.
      Live write scope, and it appeared in a chat transcript.
- [ ] `R2_*` missing from `dev` — needed to exercise the download path locally
- [ ] `STRIPE_WEBHOOK_SECRET` missing from `stg` — only matters if staging takes payments
- [ ] Re-login the clobbered CLI profile: `stripe login --project-name agent-panel`
- [ ] Pre-existing: `layout.tsx:12` sets `baseUrl` to the apex domain, but
      production 307s apex to `www`. Canonicals and JSON-LD point at a
      redirecting host. Unrelated to this work.

---

## Part 0: Decide before you start

- [ ] **VAT decision.** Selling *digital* goods into the EU/UK has **no
      registration threshold** for a US seller. VAT is owed from the **first
      sale**. Stripe Tax calculates it; calculating is not remitting.
  - [ ] Either: register for **EU non-Union OSS** and **UK VAT**, then continue.
  - [ ] Or: launch US-only. Open `src/lib/stripe.ts`, find `ALLOWED_COUNTRIES`
        (line ~21), change `null` to `["US"]`. Then continue.
  - [ ] Or: accept the exposure knowingly and continue. Your call, but decide it
        rather than drift into it.

---

## Part A: Stripe account

> **Status: partly done.** The account exists as *Bodhi Press Publications*
> (`acct_1TvyuFPDk9uLJgQG`) and the CLI is paired. Test-mode product and price
> are created and verified. Outstanding: A1 verification, A2 descriptor, A3 tax.

- [x] Account created: **Bodhi Press Publications** (`acct_1TvyuFPDk9uLJgQG`)
- [ ] Complete business verification (legal name, address, bank account, SSN/EIN)
  - [ ] Currently `charges_enabled: false`, `details_submitted: false`.
        Until this is done the account cannot take live money at all.

### A2: Statement descriptor

This is the entire reason for a separate account. Buyers who see an unfamiliar
name on their card statement file chargebacks.

- [ ] **Settings** → **Business** → **Public details**
- [ ] Statement descriptor: `BODHI PRESS`
- [ ] Shortened descriptor: `BODHIPRESS`
- [ ] The account descriptor is the **imprint**, shared by every future title.
      The book name is appended per checkout by
      `STATEMENT_DESCRIPTOR_SUFFIX` in `src/lib/stripe.ts`, so buyers see
      `BODHI PRESS MIDNIGHT`. Give each new book its own suffix.
- [ ] This cannot be set via the API. Stripe blocks own-account settings
      entirely, connected accounts only. Dashboard is the only route.
- [ ] Support email: your real address
- [ ] Save

### A3: Enable Stripe Tax

- [ ] **Settings** → **Tax** (or https://dashboard.stripe.com/settings/tax)
- [ ] Set **origin address** to your business address
- [ ] Set **default tax category** to **Digital goods**
- [ ] Turn Stripe Tax **on** (0.5% per transaction)
- [ ] Under **Registrations**, add every jurisdiction you registered in at Part 0.
      Leave empty if US-only and below your state's nexus threshold.

### A4: Create the product

> **Done in test mode** by the CLI: `prod_UvqhU7V6PsD0vL`.
> Repeat in live mode after verification completes.

- [ ] **Products** → **Add product**
- [ ] Name: `The Midnight Coder's Children (Digital Edition)`
- [ ] Description: `Ebook, EPUB format, DRM-free.`
- [ ] **Tax code**: search for and select `txcd_10302000`
      — *Digital Books - downloaded - non subscription - with permanent rights*
  - [ ] **Do not** accept the default `txcd_10000000` (General Electronically
        Supplied Services). Ebooks get **reduced VAT** across most of the EU;
        the generic code taxes at the standard rate and overcharges your
        European readers.
- [ ] Price: `14.99`
- [ ] Currency: `USD`
- [ ] Billing: **One time**
- [ ] Click **More pricing options** → **Tax behavior** → **Inclusive**
  - [ ] This is what makes every buyer worldwide pay exactly $14.99. Getting it
        wrong means EU buyers see $14.99 + VAT at checkout.
- [ ] Save the product

### A5: Set the price lookup key

> **Done in test mode**: `price_1Tvz0LPDk9uLJgQGKFog6Ngz`, verified
> 1499 / usd / inclusive / one_time / active, resolving by lookup key.

The code resolves the price by lookup key, never by a hardcoded `price_...` id,
so you can change the price later without a deploy. Without this key, **checkout
returns a 500**.

- [ ] Open the product you just created
- [ ] Find the $14.99 price in the **Pricing** table, click the `...` menu → **Edit price**
- [ ] **Lookup key**: `midnight-coders-digital`
- [ ] Save

**Verify A:**
- [ ] Run: `stripe prices list --lookup-keys midnight-coders-digital`
      (after Part A6 gives you a CLI login)
- [ ] Expect exactly one price, `unit_amount: 1499`, `tax_behavior: inclusive`

### A6: API keys

- [ ] **Developers** → **API keys**
- [ ] Confirm the **top-left account picker says Bodhi Press Publications**, not
      Strategic Nerds. Copying the wrong account's key is the easiest mistake
      here and it would silently charge the wrong business.
- [ ] Reveal and copy the live key. Note the CLI issued a **restricted**
      `rk_live_` key, which could not write account settings. If product or
      webhook creation fails on scope, use a full `sk_live_` from this page.
- [ ] Hold it for Part F. Do not paste it into a file.

---

## Part B: PostHog project

You are org owner of *Strategic Nerds* with 6 projects and no plan cap. Nothing
is blocking you.

- [ ] Go to https://us.posthog.com
- [ ] Click the **project dropdown** (top left)
- [ ] **New project**
- [ ] Name: `Midnight Coders`
- [ ] Copy the **Project API key** (`phc_...`) from the onboarding screen
- [ ] Hold it for Part F

**Verify B:**
- [ ] **Settings** → **Project** shows the name `Midnight Coders`
- [ ] The key starts with `phc_`

---

## Part C: Kit tag and delivery automation

This is how the book actually reaches the buyer. If this part is wrong, people
pay and receive nothing.

### C1: Create the custom field

- [ ] Kit → **Grow** → **Subscribers** → **Custom fields**
- [ ] Add a field named exactly `download_url`
  - [ ] The webhook writes to this name. A typo means the merge tag renders empty.

### C2: Create the purchase tag

- [ ] Kit → **Grow** → **Subscribers** → **Tags** → **Create a tag**
- [ ] Name: `Digital Purchase`

### C3: Find the tag's numeric id

The Kit UI does not show tag ids. Get it from the API:

- [ ] Run (substitute your key):
      ```
      curl -s "https://api.convertkit.com/v3/tags?api_key=$KIT_API_KEY" | grep -B2 -A2 "Digital Purchase"
      ```
- [ ] Copy the numeric `id` (looks like `13946969`)
- [ ] Hold it for Part F as `KIT_DIGITAL_PURCHASE_TAG_ID`

### C4: Build the delivery automation

- [ ] Kit → **Automate** → **Visual automations** → **New automation**
- [ ] Trigger: **Tag added** → `Digital Purchase`
- [ ] Action: **Email** → create a new email
- [ ] Subject: `Your copy of The Midnight Coder's Children`
- [ ] In the body, insert the download link using the merge tag:
      ```
      {{ subscriber.download_url }}
      ```
- [ ] The email **must** say the link unlocks **22 September 2026**. Buyers who
      click early get a "not yet available" response, and without that sentence
      they will read it as a broken link and email you.
- [ ] Set the automation **live**

**Verify C:**
- [ ] Manually add the `Digital Purchase` tag to your own email address in Kit
- [ ] Confirm the automation email arrives
- [ ] Confirm the merge tag renders as a URL and not as literal
      `{{ subscriber.download_url }}` (it will be empty for you since you have no
      `download_url` value yet — empty is fine here, literal braces is a bug)
- [ ] Remove the tag from yourself afterwards

---

## Part D: OpenAI Ads

- [ ] Go to https://ads.openai.com → **Measurement** → **Pixels**
- [ ] Create a pixel for `midnightcoderschildren.com`
- [ ] Copy the **Pixel ID** → Part F as `NEXT_PUBLIC_OPENAI_PIXEL_ID`
- [ ] **Measurement** → **Conversions API keys** → create one
- [ ] Copy it → Part F as `OPENAI_CONVERSIONS_API_KEY`

### D2: Create the conversion events

Base event names must match exactly; the code emits these four.

- [ ] `checkout_started` → name it `Book Retailer Click` → data source **Pixel** → window **7 days**
- [ ] `order_created` → name it `Digital Edition Purchase` → data source **Pixel + API** → window **30 days**
- [ ] `lead_created` → name it `Newsletter Signup` → data source **Pixel** → window **30 days**
- [ ] `items_added` → name it `Checkout Started` → data source **Pixel** → window **30 days**

Set `order_created` as your reporting conversion, but optimize campaigns against
`checkout_started`. Digital sales volume will be too thin to train on; retailer
clicks will not be.

---

## Part E: Meta Ads

- [ ] Go to https://business.facebook.com/events_manager
- [ ] **Connect data sources** → **Web** → **Meta Pixel**
- [ ] Name: `Midnight Coders`
- [ ] Copy the **Dataset ID** (aka Pixel ID) → Part F as `NEXT_PUBLIC_META_DATASET_ID`

### E2: Conversions API token

- [ ] In Events Manager, open the dataset → **Settings**
- [ ] Scroll to **Conversions API** → **Generate access token**
- [ ] Copy it → Part F as `META_CONVERSIONS_ACCESS_TOKEN`

### E3: Grab a test event code (needed for verification later)

- [ ] Dataset → **Test events** tab
- [ ] Copy the **Test event code** (looks like `TEST12345`)
- [ ] Keep it in your clipboard for Part H. It is temporary, not a secret to store.

---

## Part F: Doppler secrets

Set every secret in **both** `stg` and `prd`.

- [ ] Generate the download signing secret:
      ```
      openssl rand -hex 32
      ```
- [ ] Set them all (run from the repo root, substitute real values):
      ```
      cd ~/Developer/sites/midnight-coders

      for CFG in stg prd; do
        doppler secrets set --project midnight-coders --config $CFG \
          STRIPE_SECRET_KEY="sk_live_..." \
          STRIPE_WEBHOOK_SECRET="whsec_..." \
          DOWNLOAD_TOKEN_SECRET="<openssl output>" \
          KIT_DIGITAL_PURCHASE_TAG_ID="..." \
          NEXT_PUBLIC_SITE_URL="https://midnightcoderschildren.com" \
          NEXT_PUBLIC_POSTHOG_KEY="phc_..." \
          NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com" \
          NEXT_PUBLIC_OPENAI_PIXEL_ID="..." \
          OPENAI_CONVERSIONS_API_KEY="..." \
          NEXT_PUBLIC_META_DATASET_ID="..." \
          META_CONVERSIONS_ACCESS_TOKEN="..."
      done
      ```
- [ ] `STRIPE_WEBHOOK_SECRET` is not available until Part G. Set everything else
      now, come back for that one.
- [x] **`dev` config is already loaded** with the Stripe test key, the
      `stripe listen` webhook secret, a generated `DOWNLOAD_TOKEN_SECRET`, and
      `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Part I can run now.

### F2: Read this before deploying

**`NEXT_PUBLIC_*` variables are inlined at build time, not read at runtime.**

`package.json` runs `next build` **without** `doppler run`. So on Vercel these
must be present as real Vercel environment variables, or the build bakes in
empty strings and the pixels silently never fire.

- [ ] Confirm how Doppler reaches Vercel for this project: either the
      **Doppler → Vercel integration** is enabled, or you set the vars manually
      in the Vercel dashboard.
- [ ] Specifically confirm these three exist in Vercel for **Production**:
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - [ ] `NEXT_PUBLIC_OPENAI_PIXEL_ID`
  - [ ] `NEXT_PUBLIC_META_DATASET_ID`

---

## Part G: Stripe webhook

Do this **after** the site is deployed once, so the URL exists.

- [ ] Stripe → **Developers** → **Webhooks** → **Add endpoint**
- [ ] URL: `https://midnightcoderschildren.com/api/stripe/webhook`
- [ ] Events to send: **`checkout.session.completed`** only
  - [ ] The handler ignores every other event type. Subscribing to more just
        generates noise and pointless invocations.
- [ ] Save, then reveal and copy the **Signing secret** (`whsec_...`)
- [ ] Add it to Doppler as `STRIPE_WEBHOOK_SECRET` for `stg` and `prd`
- [ ] Redeploy so the new secret is picked up

---

## Part H: The ebook file

- [ ] Export the EPUB
- [ ] Name it exactly: `the-midnight-coders-children.epub`
- [ ] Place it at: `private/ebook/the-midnight-coders-children.epub`
- [ ] Commit it. It ships to Vercel via `outputFileTracingIncludes` in
      `next.config.ts`. It is outside `public/`, so it is never directly
      fetchable.

**Verify H:**
- [ ] `ls -la private/ebook/` shows the file with a non-trivial size
- [ ] `curl -I https://midnightcoderschildren.com/private/ebook/the-midnight-coders-children.epub`
      returns **404**. If it returns 200, the file is publicly downloadable and
      you are giving the book away. Stop and tell me.

---

## Part I: Local end-to-end test

Use **Stripe test mode** for all of this. Switch the dashboard toggle to Test
mode and use test keys in your `dev` Doppler config.

- [ ] Terminal 1: `pnpm dev`
- [ ] Terminal 2: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Copy the `whsec_...` that `stripe listen` prints into your **dev** Doppler
      config as `STRIPE_WEBHOOK_SECRET`, then restart `pnpm dev`
- [ ] Open http://localhost:3000/buy
- [ ] Click the buy button
- [ ] Pay with card `4242 4242 4242 4242`, any future expiry, any CVC

**Verify I:**
- [ ] You land on `/buy/success` and see "Thank you"
- [ ] Terminal 2 shows `checkout.session.completed`
- [ ] Terminal 1 logs `Delivered digital edition to <email>`
- [ ] In Kit, that subscriber now has the `Digital Purchase` tag
- [ ] In Kit, that subscriber's `download_url` field contains a long URL
- [ ] Open that URL. It must return **"Not yet available"** and name
      **September 22, 2026**. If it downloads the book, the not-before gate is
      broken. Stop and tell me.
- [ ] Change one character in the middle of the token in that URL and reload.
      Must return **"Invalid download link"**.

---

## Part J: Verify measurement

### J1: Meta (this is the one never validated against the live API)

- [ ] In Events Manager → **Test events**, paste your site URL and open it
- [ ] Browse the site, click **Buy on Amazon**
- [ ] Confirm an `InitiateCheckout` event appears in the Test events stream
- [ ] Do a test purchase and confirm a `Purchase` event appears
- [ ] Confirm `Purchase` shows **value 14.99** and **currency USD**
  - [ ] If it shows `1499`, the units are wrong. Stop and tell me.
- [ ] Confirm the event shows as **deduplicated** or lists both Browser and
      Server. Two separate `Purchase` events for one sale means the `event_id`
      is not matching. Tell me.

### J2: OpenAI

- [ ] In Ads Manager → your pixel → confirm events are arriving
- [ ] Confirm `order_created` appears once per test purchase, not twice

### J3: PostHog

- [ ] Open PostHog → **Activity**
- [ ] Confirm `$pageview` events arrive from your domain
- [ ] Confirm a `purchase` event with `ecommerce.value = 14.99`
- [ ] In your browser devtools **Network** tab, confirm requests go to
      `midnightcoderschildren.com/ingest/...` and **not** to `us.i.posthog.com`.
      If they go direct, the reverse proxy rewrite is not active and ad blockers
      will eat your analytics.

---

## Part K: Go live

- [ ] Flip Stripe out of Test mode; confirm live keys are in Doppler `prd`
- [ ] Confirm the webhook endpoint in Part G is registered against the **live**
      mode, not test. These are separate lists in Stripe and this catches people
      constantly.
- [ ] Deploy
- [ ] Buy your own book with a real card
- [ ] Confirm the Kit email arrives, then refund yourself in Stripe

---

## Known limitations, accepted

- **No download count limit.** Tokens gate on not-before and expiry only.
  A buyer who forwards their link shares access until it expires. Enforcing
  a count needs a datastore, which this site does not have.
- **Replacing the EPUB requires a redeploy.** If that becomes annoying, the file
  moves to Vercel Blob and the `readFile` call in
  `src/app/api/download/[token]/route.ts` becomes a fetch.
- **Retailer clicks are intent, not revenue.** `checkout_started` /
  `InitiateCheckout` will overcount relative to books actually sold on Amazon.
  Read `order_created` / `Purchase` for real money.
