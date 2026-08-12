# Agentic readiness remediation

Closing the gaps found in the AEO agentic readiness audit (August 12, 2026).

## Plan

- [x] 1. Homepage synopsis reaches the HTML (was 67 crawlable words, now 302)
- [x] 2. robots.txt gains per-crawler rules with retrieval and training separated
- [x] 3. `/pricing.md` with both editions priced
- [x] 4. `/openapi.json` describing the public read endpoints
- [x] 5. `/contact` with ContactPage JSON-LD
- [x] 6. `/privacy` and `/terms`, which did not exist on a site that takes payments
- [x] 7. `/developers` documenting the agent files, rate limits, and reuse terms
- [x] 8. `speakable` markup on the WebSite node and the new pages
- [x] 9. `hreflang` self-reference plus a `Content-Language: en` header site-wide
- [x] 10. Markdown negotiation extended from the homepage to every page except `/excerpt`
- [x] 11. llms.txt generated instead of hand-maintained, so it stops going stale
- [x] 12. Sitemap gains `/buy`, `/contact`, `/privacy`, `/terms`, `/developers`
- [x] 13. JSON-LD gains the digital edition offer, the editorial reviews, and a contact point

## Review

118 tests pass, lint and type-check are clean, and the production build renders
every new route as static.

**The homepage was the real finding.** `HeroSection`, `BookBlurb`, and
`EmailSignup` all `return null` when scroll progress is zero, which is exactly
the state the server renders. The synopsis, the character names, and the book
details were absent from the HTML entirely: 67 words, most of it navigation.
The blurb text now lives in `src/lib/book-blurb.ts`, the page is a server
component, and `CrawlableSynopsis` renders the same prose the animation paints.
302 words now, including both protagonists' names.

**One source of truth per fact.** `book-facts.ts` holds the prices, ISBN, page
count, and dates that previously appeared separately in the JSON-LD, the buy
page, and llms.txt. `praise.ts` holds the editorial reviews, shared by the
press kit and the Book schema. Tests assert pricing.md, llms.txt, and the buy
page all quote the same numbers.

**llms.txt was stale and is now generated.** The hand-written file in `public/`
advertised a `/beta` page that no longer exists, omitted `/buy` and `/socials`,
and predated the digital edition. A test cross-checks every path it lists
against the sitemap.

**`/excerpt` is deliberately excluded from markdown negotiation.** Every other
page answers `Accept: text/markdown`. Chapter 1 does not, because handing the
prose over as clean markdown contradicts what `ai-train=no` and the terms page
say. The HTML is still readable by anyone.

**Crawler policy differs from strategicnerds.com on purpose.** This site blocks
Google-Extended and Applebot-Extended along with GPTBot, ClaudeBot, and CCBot,
because the novel is the product. Amazonbot stays allowed: it is retrieval, it
feeds Alexa and Rufus, and the book sells on Amazon. Retrieval crawlers are all
allowed, so an LLM can still recommend the book. Both robots files carry
comments explaining the split, and both test suites assert their own side of
it.

## Second pass

**Per-page markdown, built.** `Accept: text/markdown` now returns each page's
own content, built in `src/lib/page-markdown.ts` from the same modules the page
renders. That required extracting the press kit and book club content out of
their page files into `press-kit-content.ts` and `book-club-content.ts`, which
both surfaces now share. `/excerpt` is still refused, and a test asserts no
builder can return chapter prose even if a request reached the route.

**Security headers, added.** CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy, and COOP, all in the proxy. Verified in a
real browser rather than by reading the header back: the first CSP draft blocked
Google Analytics, because GA4 posts to regional endpoints
(`region1.google-analytics.com`) rather than to `www.google-analytics.com`.
Fixed with wildcards before it shipped.

## Still open

**Privacy and terms need a human read.** Both are written from what the code
actually does: beehiiv, Stripe, Cloudflare R2, hCaptcha, PostHog, Google
Analytics, Meta and OpenAI conversion pixels, Vercel logs. The retention
periods and the refund position are reasonable defaults rather than anything
anybody has decided. Neither is legal advice.
