# OpenAI Ads campaign: The Midnight Coder's Children

Structure is **Campaign → Ad Group → Ads**. Campaign-level targeting is
geography only, so all audience segmentation happens through ad groups and their
`context_hints`.

`context_hints` are free-form keywords or phrases describing the conversations
where the ad belongs. They guide matching; they are not exact-match rules. Write
them the way a reader would actually talk to ChatGPT, not as ad keywords.

Every title below is within 50 characters and every text within 100, verified.

---

## Campaign

| Setting | Value |
|---|---|
| Name | `Midnight Coders - Pre-order` |
| Geo | US, CA, UK, AU, IE |
| Billing event | `click` (required for conversion-optimized) |
| Primary conversion | Book Retailer Click (`checkout_started`) |
| Reporting conversion | Digital Edition Purchase (`order_created`) |

**On geo:** the ebook sells worldwide, but the print editions run through
Amazon and Barnes & Noble, which are strongest in these five English-language
markets. Widen once you see which converts.

**On the optimization target:** direct digital sales will be far too thin to
train an algorithm on before launch. Retailer clicks are the volume signal.
Optimize on those and read `order_created` for actual revenue.

---

## Ad group 1: Thriller recommendations

The largest and least qualified group. People asking what to read next.

**Context hints**

```
what thriller should I read next
book recommendations for a long flight
best financial thrillers
page turner recommendations
what to read after finishing a thriller series
new thriller releases 2026
debut novels worth reading
gripping fiction recommendations
novels about corporate crime
thrillers with a strong emotional core
```

**Ads**

| Title (50) | Text (100) |
|---|---|
| A thriller about the code we inherit | Sydney has hours to stop a cyberattack. The answer died with the woman who predicted it. |
| The bank is breached. The fix is missing. | A debut financial thriller. Out 22 September. Pre-order the ebook for $14.99. |
| Your next financial thriller | "A brisk financial thriller buoyed by a powerful emotional throughline." BookLife |

---

## Ad group 2: Techno-thrillers and tech fiction

Higher intent. Readers who already know they want this subgenre.

**Context hints**

```
techno-thriller recommendations
books like Daemon by Daniel Suarez
novels like Blake Crouch
Michael Crichton style novels
fiction about hackers and cyberattacks
realistic technology in fiction
novels about artificial intelligence and finance
thrillers set inside big tech companies
fiction that gets engineering right
near-future thrillers grounded in real systems
```

**Ads**

| Title (50) | Text (100) |
|---|---|
| For readers of Daniel Suarez and Crouch | A cyberattack on the US financial system, and a safety protocol only a family can decode. |
| The engineer who saw it coming | She predicted the attack decades early. Nobody listened. Her children hold the key. |
| A techno-thriller written by an engineer | Thirty years in tech, one debut novel. Out 22 September 2026. |

---

## Ad group 3: Cybersecurity and fintech

Occupational relevance rather than reading intent. Expect a lower conversion
rate and a much cheaper click. Watch this one; if it does not convert in three
weeks, cut it.

**Context hints**

```
how banks defend against cyberattacks
legacy code risk in financial systems
incident response for a security breach
fintech engineering culture
novels for software engineers
what to read as an engineering leader
books about famous technology failures
fiction about the finance industry
security engineering career reading
what happens when critical systems fail
```

**Ads**

| Title (50) | Text (100) |
|---|---|
| 5:43 a.m. The worst has happened. | A VP of engineering has hours to save a bank. The fix is buried in a former employee's work. |
| A novel about legacy code and trust | What happens when the only person who understood the system is gone. |
| Written for people who ship systems | A financial thriller about the fragile systems we build and the people we overlook. |

---

## Ad group 4: Book clubs and reading groups

Small but high value: one hit sells eight to twelve copies. You already have the
discussion guide, which most competing titles do not.

**Context hints**

```
book club picks for this month
book club discussion questions
what should our book club read next
novels that spark good discussion
book club recommendations 2026
books about family and legacy for groups
literary thrillers for book clubs
novels with discussion guides available
```

**Ads**

| Title (50) | Text (100) |
|---|---|
| A book club pick about family and code | Trust, legacy, and the bonds holding families and civilizations together. Free guide. |
| Your next book club read | A propulsive thriller with a discussion guide ready. Out 22 September 2026. |
| Discussion guide included | The Midnight Coder's Children. A thriller about inheritance, in every sense. |

---

## Ad group 5: Immigrant and family narratives

Reaches readers who would never search for a techno-thriller but will respond to
Gayathri's story. The book's emotional throughline, and the thing BookLife
singled out.

**Context hints**

```
novels about immigrant families
fiction about mothers and daughters
books about legacy and inheritance
literary fiction about sacrifice
novels about women in technology
stories about overlooked pioneers
books about first generation families
fiction about what parents leave behind
```

**Ads**

| Title (50) | Text (100) |
|---|---|
| A mother builds. Her children decode. | An immigrant engineer left a protocol behind. Only her family can piece it together. |
| The legacies we leave in the systems | A thriller about an overlooked engineer, her sacrifices, and what her children inherit. |
| She was never listened to | Decades later, the system she built is the only thing that can save it. |

---

## Before launching

- [ ] Create the OpenAI pixel and conversion events for **this** site. The
      Strategic Nerds pixel is a different account; nothing carries over.
- [ ] Set `NEXT_PUBLIC_OPENAI_PIXEL_ID` and `OPENAI_CONVERSIONS_API_KEY`, then
      **redeploy**. The pixel id is inlined at build time, so setting it is not
      enough.
- [ ] Create all four conversion events (Part D2 of `todo.md`).
- [ ] Keep campaigns paused until a test purchase confirms conversions arrive.

## Reading the results

Retailer clicks are **intent, not revenue**. The sale completes on Amazon and
cannot be confirmed, so some share of those clicks never becomes a book. Treat
that number as directional and judge real performance on `order_created`.

Ad group 3 is the experiment. The other four target people who are already
looking for something to read; group 3 targets people talking about the
book's subject matter, which is a different and less proven bet.
