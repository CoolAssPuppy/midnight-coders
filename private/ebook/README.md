# Ebook source files

Place the digital edition here as:

    the-midnight-coders-children.epub

This directory sits outside `public/` on purpose, so the file is never directly
fetchable. It reaches the Vercel deployment through `outputFileTracingIncludes`
in `next.config.ts`, and is served only by `/api/download/[token]` after an
HMAC-signed token verifies.

Replacing the file requires a redeploy. If that becomes annoying, move it to
Vercel Blob (private) and swap the `readFile` call in the download route for a
Blob fetch.
