# Lessons

- When rotating content has different heights inside a grid, do not vertically center adjacent columns. Anchor the columns so the static content does not shift when the rotating content changes.
- Put variable-length rotating copy after the primary layout when it does not need to share a column with the main action.
- When a GrokBot report is wrong because a skill is stale, update the skill in the same turn. GrokBot Daily Advertising Report reads `~/Developer/brain/agents/agents/daily-ad-spend-watch.md` and `~/Developer/brain/skills/daily-meta-checkin/SKILL.md` (hardlinked to `~/.claude/skills/daily-meta-checkin/SKILL.md`). Those two files must stay in sync.
- After 16 August 2026, retailer clicks fire Meta `RetailerClick` and `PreorderIntent`. `InitiateCheckout` is Stripe only. Changing the conversion event on a live ad set is allowed and resets learning; the earlier note here claiming otherwise was wrong.
- Meta deduplicates a browser event against a *server* event that shares its `event_id`. It never deduplicates two browser requests against each other. Sending one event through both `fbq` and `sendBeacon` counts it twice. That shipped on 16 August 2026 and doubled every `RetailerClick` and `PreorderIntent` for four days.
- Assert on requests that leave the browser, not on the event mapping. The 16 August tests asserted the mapping returned two names and separately asserted `sendBeacon` fired twice, so they encoded the double-send as correct and passed the whole time.
