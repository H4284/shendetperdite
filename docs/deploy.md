# Deploy (Cloudflare + Vercel + Firebase)

## Vercel
1. Connect the GitHub repo and deploy `feature/epic-*` or `main`.
2. Set production env vars from `.env.example` (Firebase client + Admin, Resend optional, GA/Meta, Sentry, `NEXT_PUBLIC_SITE_URL`).
3. Never set `FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST` on Vercel.

## Firebase
1. Project: `shendetperdite-8d758`.
2. Deploy rules/indexes: `npm run firebase:deploy-firestore`.
3. Auth: Email/Password + Google; Authorized domains include `localhost`, `*.vercel.app`, and the custom domain.
4. Grant admins: `npm run admin:set -- you@example.com` then sign out/in.

## Cloudflare (DNS proxy)
1. Add the domain to Cloudflare; point nameservers at Cloudflare.
2. Create an A/CNAME record for `@` / `www` to Vercel (**Proxied** / orange cloud).
3. SSL/TLS → **Full (strict)**.
4. Caching → Cache Rules: cache everything under `/_next/static/*` and image paths for a long TTL.
5. Scrape Shield / Email Address Obfuscation: enable for HTML emails in the footer if desired.
6. Optional: Cloudflare Insights beacon (separate from GA).

## Custom domain on Vercel
1. Project → Domains → add `shendetperdite.com` / `www`.
2. Keep Cloudflare proxy on after Vercel verifies the domain.

## Storage uploads
Ensure the Firebase Storage bucket allows the Admin service account to write, and that product images resolve under the hostnames listed in `next.config.ts` `images.remotePatterns`.
