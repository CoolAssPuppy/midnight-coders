# Meta Ads: The Midnight Coder's Children

Structure is **Campaign (objective) → Ad Set (audience, budget, placement) →
Ad (creative)**. Unlike OpenAI, targeting lives on the ad set, and Meta's own
algorithm does most of the work if you let it.

All copy below is verified against Meta's feed specs: headline 27 characters,
primary text 125.

---

## The constraint that shapes everything

An ad set needs roughly **50 optimization events per week** to exit the learning
phase and deliver efficiently. Below that it goes "learning limited" and Meta
throttles it.

A $14.99 pre-order will not produce 50 purchases a week before launch. So
**do not optimize for Purchase at the start.** You would be asking the algorithm
to learn from three or four events a week, and it never will.

Optimize for the event that actually has volume, and move up the funnel only
when the numbers support it:

| Phase | Optimize for | Why |
|---|---|---|
| Now to launch | `Lead` (newsletter) or `InitiateCheckout` (retailer clicks) | Enough weekly volume to train on |
| Launch week | `Purchase` | Volume spikes; give it a real test |
| After launch | Whichever clears 50/week | Let the data decide |

`InitiateCheckout` fires on Amazon and Barnes & Noble clicks, so it is your
highest-volume signal by a wide margin.

---

## Step by step

### 1. Business account

1. business.facebook.com → **Business Settings**
2. If Strategic Nerds already has a Business account, add a new **ad account**
   under it. Do not create a second business.
3. Add a payment method. Ads will not deliver without one.

### 2. Verify the domain

Business Settings → **Brand Safety** → **Domains** → add
`midnightcoderschildren.com`, then verify by DNS TXT record or meta tag.

Skipping this is the most common self-inflicted wound in Meta setup. Without a
verified domain you cannot configure Aggregated Event Measurement, and iOS
attribution degrades to the point where you will think the pixel is broken.

### 3. Create the dataset

Events Manager → **Connect data sources** → **Web** → **Meta Pixel** →
name it `Midnight Coders`.

Do **not** install their snippet. The pixel is already in `layout.tsx` and
renders as soon as the id exists.

Copy the **Dataset ID**.

### 4. Conversions API token

Dataset → **Settings** → **Conversions API** → **Generate access token**.
Shown once, so copy it immediately.

### 5. Configure Aggregated Event Measurement

Events Manager → **Aggregated Event Measurement** → **Configure Web Events** →
select the verified domain. Rank the eight slots, highest priority first:

```
1  Purchase
2  InitiateCheckout
3  AddToCart
4  Lead
```

For an iOS user who opts out of tracking, only the highest-priority event they
trigger is counted. The order decides what you can measure.

### 6. Fill Doppler and redeploy

The slots already exist and are empty:

```
cd ~/Developer/sites/midnight-coders
for CFG in stg prd; do
  doppler secrets set --project midnight-coders --config $CFG --silent \
    NEXT_PUBLIC_META_DATASET_ID="..." \
    META_CONVERSIONS_ACCESS_TOKEN="EAAG..."
done
```

Then **redeploy**. `NEXT_PUBLIC_META_DATASET_ID` is inlined at build time, so
setting it is not enough. Until you rebuild, the bundle contains an empty string
and the pixel never loads while every dashboard shows the key present.

### 7. Verify before spending

Events Manager → **Test events** → copy the test code. Confirm `PageView`,
`InitiateCheckout` (click a retailer link) and `Purchase` (test buy) arrive, and
that `Purchase` shows **value 14.99**, not 1499.

This code has never had a payload accepted by Meta's API. It is unit tested
only. Verify before any budget is live.

---

## Creative assets you do not have yet

Meta feed ads need **1:1 (1080x1080)** and **4:5 (1080x1350)** images. The book
cover is portrait at roughly 2:3, so it does not drop in directly.

You need, at minimum:

- A 1:1 and a 4:5 composition with the cover on the midnight background
- One variant carrying the BookLife quote as text
- Keep text under about 20% of the image area; heavy text still suppresses reach

Ads will not run without these. This is the real blocker, not the account setup.

---

## Campaign structure

**Campaign:** `Midnight Coders - Pre-order`
Objective: **Sales**. Use Advantage+ campaign budget across ad sets.

### Ad set 1: Broad

No interest targeting. Age 25-65, your five English markets. Let the algorithm
find readers.

Counterintuitive but usually correct on modern Meta: broad beats hand-stacked
interests once the pixel has signal, and it will not go learning limited from a
small audience.

### Ad set 2: Thriller and techno-thriller interests

Interests: Daniel Suarez, Blake Crouch, Michael Crichton, Andy Weir, techno-
thriller, financial thriller, Goodreads, Kindle.

### Ad set 3: Book clubs

Interests: book club, Goodreads, Book of the Month, reading groups.
Small audience, high value: one hit sells eight to twelve copies.

### Ad set 4: Retargeting

Custom audience: site visitors in the last 30 days, excluding purchasers.
Cheapest conversions you will get. Turn this on only once there is traffic to
retarget.

---

## Ads

Headlines are capped at 27 characters on feed, which is far tighter than most
platforms. Primary text is 125.

### Ad set 1 and 2: thriller readers

| Headline (27) | Primary text (125) |
|---|---|
| Out 22 September 2026 | Sydney has hours to stop a cyberattack on the US financial system. The answer died with the engineer who predicted it. |
| A thriller about legacy | A bank is breached. The only fix was written decades ago by a woman nobody listened to. |
| Your next thriller | "A brisk financial thriller buoyed by a powerful emotional throughline." BookLife |
| She saw it coming | She predicted the attack decades early. Nobody listened. Now her children hold the only key. |
| A debut techno-thriller | For readers of Daniel Suarez and Blake Crouch. Out 22 September. Pre-order for $14.99. |
| Legacy code, real stakes | A VP of engineering has hours to save a bank. The fix is buried in a former employee's work. |

### Ad set 3: book clubs

| Headline (27) | Primary text (125) |
|---|---|
| Book club ready | Trust, legacy, and the bonds that hold families and civilizations together. Free discussion guide. |
| A pick worth discussing | A propulsive thriller with a discussion guide already written. Out 22 September 2026. |

### Family and immigrant angle

Run these inside ad set 1. They reach readers who would never search for a
techno-thriller but respond to Gayathri, which is the thread BookLife singled
out.

| Headline (27) | Primary text (125) |
|---|---|
| A mother's last protocol | An immigrant engineer left something behind. Only her children can piece it together. |
| What she left behind | A thriller about an overlooked engineer, her sacrifices, and the system only her family can read. |

### Ad set 4: retargeting

| Headline (27) | Primary text (125) |
|---|---|
| Still thinking it over? | The Midnight Coder's Children. Pre-order the ebook for $14.99. DRM-free, yours to keep. |
| Read chapter one free | Start at 5:43 a.m., the morning everything breaks. Chapter one is free on the site. |

---

## Reading the results

`InitiateCheckout` is **intent, not revenue**. The sale completes on Amazon and
cannot be confirmed, so some share of those clicks never becomes a book. Judge
real performance on `Purchase`.

Expect the first two weeks to look bad. That is the learning phase, not the
creative. Resist editing ad sets mid-learning: a significant edit resets it.
