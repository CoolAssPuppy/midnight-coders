# Social posts

Four concepts, each rendered at three sizes, into `public/social`. The
`/socials` page previews them and serves the downloads. Rebuild with
`pnpm social:build`, or pass a filter to redo one concept:
`pnpm social:build 03-timelines`.

Every render writes three files: a PNG master, a JPG, and a six-second .mov
loop. Upload the JPG for stills. Instagram, LinkedIn, and X all recompress on
the way in, and starting from a JPG saves a round of that.

## The loops

The .mov files run the homepage glitch under the same composition: bursts of
two to six screened bands with a horizontal shift and a matching glow, the scan
lines lifting for the length of each burst, and a torn slice of the picture on
the strongest ones. The cover breathes on a single sine cycle per loop, a few
pixels of drift and a fraction of a percent of scale. Type never moves.

Everything runs on whole cycles across exactly 180 frames, so the last frame
lands where the first one started and the loop point is invisible. H.264 in a
.mov container, 1080 wide, 30fps, under about 1.5 MB each.

Frames are synthesised rather than screenshotted. Driving Chrome once per frame
would mean hundreds of browser launches per video; compositing over rendered
plates takes a couple of seconds instead. Each rendition renders three plates:
the still, the composition with the cover hidden, and the cover alone on a
transparent frame. The last two are what the loop animates, which is why the
cover can drift without dragging the type with it.

Motion needs `ffmpeg` on the path. The stills build fine without it.

The build also rewrites `src/lib/social-posts.generated.ts`, which is what the
`/socials` page renders from, and deletes any render left behind by a concept
that no longer exists. A concept cannot appear on the page without an image
behind it.

## Sizes

| Suffix | Pixels | Where it goes |
| --- | --- | --- |
| `4x5` | 1080 x 1350 | The default feed post. Instagram, Facebook, LinkedIn, Threads. Takes the most vertical space the feed will give you. |
| `9x16` | 1080 x 1920 | Instagram and Facebook Stories, TikTok, YouTube Shorts covers. The top 190px and bottom 250px are left empty because the app paints its own buttons there. |
| `1x1` | 1080 x 1080 | X, Bluesky, and anywhere a square crops better than a tall image. |

## The four concepts

**01-architect.** Opens on the money and lands on the person. The attack buys
the second of attention, and the engineer who saw it coming is what makes the
book worth the evening.

**02-praise.** The BookLife quote. A verdict from a name a reader can go and
check outranks anything the author says about his own book, so the quote takes
the top of the frame and the cover moves down.

**03-timelines.** The heist and the structure. Twenty hours against fifty years
is what separates this book from every other Wall Street thriller.

**04-cipher.** The detail people repeat to each other. A failsafe hidden in a
family recipe book. The closing line carries the site's own text-selection
colours, teal on midnight, so it reads as a sentence somebody stopped and
marked. Set `markSub: true` on a concept to get the same treatment.

Run them as a carousel in that order and it reads as a full pitch: the woman,
the verdict, the heist, the trick. Carousels and Reels remain the two highest
engagement formats on Instagram, and a carousel is the only one of the two you
can build out of stills.

## What every post carries

One call to action, one URL, one date. A second ask splits the click, so there
is never a second one.

## Design

The background is a still rebuild of the homepage `GlitchEffect`: the same
midnight base, the same tiled pattern screened back, the same scan lines, a
handful of frozen glitch bands, and the same vignette. Bands are seeded from
the post id and size, so a rebuild is byte-identical and no two posts carry the
same pattern.

Type follows the site. Monospace is the machine speaking, so it holds the
button, the URL, and the date. Serif is the book speaking, so it holds the
headline above the cover and the hook below it.

## Editing

Copy lives in `concepts.mjs` and nothing there is invented. Everything traces
back to the site, the press kit, or the BookLife review. Layouts and type
scales live in `layouts.mjs`. Colors, sizes, and the background live in
`tokens.mjs`.

Rendering runs through headless Chrome, found at the usual macOS path or at
`CHROME_PATH` if you set one.
