# Launch checklist

Sign-off owner: ________________ (Ken) · Date: ________

## Environment
- [ ] Vercel Production env: `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_PROJECT_ID`, `FIREBASE_ADMIN_*`
- [ ] `NEXT_PUBLIC_SITE_URL=https://shendetperdite.com` (or current production host)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` set
- [ ] Optional: `RESEND_*`, `ORDERS_ADMIN_EMAIL`, `CHECKOUT_TOKEN_SECRET`, `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Emulator host env vars **not** set on Vercel

## Auth & admin
- [ ] Email/Password + Google enabled
- [ ] Authorized domains include production host
- [ ] Admin claim set (`npm run admin:set -- …`) and verified on `/admin`

## Catalog & content
- [ ] Real products/brands/categories seeded
- [ ] Hero / promos reviewed in `/admin/content`
- [ ] Legal pages (`/about`, `/shipping`, `/returns`, `/privacy`, `/terms`) reviewed

## Commerce smoke test
- [ ] Browse → variant → add to cart → discount → COD checkout
- [ ] Test order with a real phone number
- [ ] Order appears in `/admin/orders`; status email works if Resend is configured

## Analytics & SEO
- [ ] Decline cookies → no GA/Meta network calls
- [ ] Accept cookies → `page_view` fires
- [ ] GA4 DebugView: `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (EUR)
- [ ] Meta Events Manager Test Events shows the same
- [ ] `/sitemap.xml` lists active products/categories
- [ ] `/robots.txt` disallows `/admin`, `/account`, `/checkout`, `/api`
- [ ] Sitemap submitted to Google Search Console

## Performance & security
- [ ] Lighthouse mobile ≥ 90 Performance on home, category, product
- [ ] securityheaders.com grade A (or close) on production
- [ ] Domain on Cloudflare Full (strict) SSL

## Backups
- [ ] Daily Firestore export scheduled (see `docs/backups.md`)
- [ ] Restore procedure dry-run once on emulator
