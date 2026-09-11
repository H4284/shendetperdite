# QA checklist (EPIC 1–7)

## EPIC 1 — Shell
- [ ] Header, mega-menu, footer, dark mode, cookie bar, Albanian copy

## EPIC 2 — Catalog data
- [ ] Categories / brands / products / variants readable; draft/archived hidden on storefront

## EPIC 3 — Storefront
- [ ] Home, category, brand, product, search work; product gallery & stock badge correct

## EPIC 4 — Cart
- [ ] Add / qty / remove / discount / free-shipping progress / drawer badge

## EPIC 5 — Checkout
- [ ] COD order creates `SP-YYYY-#####`, thank-you page, stock decrements

## EPIC 6 — Accounts
- [ ] Register / login / Google / forgot password / account orders & addresses

## EPIC 7 — Admin
- [ ] Non-admin redirected from `/admin`
- [ ] Create product with 2×2 variants; appears on storefront after revalidation
- [ ] Upload images (WebP); reorder gallery
- [ ] Archive product → gone from storefront, still on old orders
- [ ] Order status change emails customer; cancel restores stock
- [ ] Discount usage limit enforced; hero edit updates home
- [ ] Free-shipping threshold change reflected in cart
- [ ] Orders CSV opens in Excel with UTF-8 (ë, ç)
- [ ] Audit log entries created for admin writes

## EPIC 8 — Launch
- [ ] Consent-gated analytics, sitemap/robots, security headers, Playwright golden path
