# Firestore backups & restore

## Daily export (production)
1. Create a GCS bucket, e.g. `gs://shendetperdite-firestore-backups`.
2. Grant the default App Engine / Firestore service agent `roles/storage.admin` on that bucket (or use a dedicated SA).
3. Enable the Firestore Admin API.
4. Create a Cloud Scheduler job (daily, e.g. `0 3 * * *` Europe/Belgrade) that calls:

```bash
gcloud firestore export gs://shendetperdite-firestore-backups/$(date +%Y%m%d) \
  --project=shendetperdite-8d758
```

Or use the Console: Firestore → Import/Export → Schedule export.

## Restore (document once, practice on emulator)
1. **Emulator dry-run:** export a small dataset, clear emulator data, import with the Firebase emulator tools / Admin SDK import path used by your team.
2. **Production restore (break-glass):**
   - Put the shop in maintenance (Vercel env flag or Cloudflare WAF block).
   - `gcloud firestore import gs://shendetperdite-firestore-backups/YYYYMMDD --project=shendetperdite-8d758`
   - Verify catalog + a sample order, then reopen traffic.

## Notes
- Exports are point-in-time; Auth users are **not** included (backup Auth separately if needed).
- Keep at least 14 daily exports; lifecycle rule older objects to Nearline/Coldline.
