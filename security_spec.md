# Security Specification — Te cuento tu primer paso

## 1. Data Invariants

1. **PII Isolation (`leads`)**: Visitors may only `create` a strictly validated lead document with explicit `consent == true` and server timestamp `request.time`. Public `get`, `list`, `update`, and `delete` on `leads` are strictly denied to prevent PII leaks.
2. **Admin Verification (`admins`, `leads`, `siteContent`, `analyticsEvents`)**: Administrative reads and mutations require `request.auth != null`, `request.auth.token.email_verified == true`, and either matching the bootstrapped verified admin email (`cerebrosupport@gmail.com`) or existing in `/admins/{uid}`.
3. **Public Content Integrity (`siteContent/landing`)**: Only the single document `landing` may be read publicly (`get`). Listing `siteContent` is denied. Updates require verified admin identity, strict field allowlisting, bounded `audioSamples` array (`<= 10`), and `updatedBy == request.auth.uid`.
4. **Anonymous Analytics (`analyticsEvents`)**: Publicly creatable with strict enum `eventType`, bounded `target` string (`<= 64`), no PII keys allowed, and `createdAt == request.time`. Reads and deletes are admin-only.
5. **No Clinical Data**: No free-text clinical notes or shadow fields are permitted in `leads` or `analyticsEvents`.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Public PII Read**: Unauthenticated `get(/leads/lead_1)` -> `PERMISSION_DENIED`.
2. **Public PII List Scrape**: Authenticated non-admin `list(/leads)` -> `PERMISSION_DENIED`.
3. **Shadow Field Injection on Lead**: `create(/leads/lead_2)` adding `{ isAdmin: true, clinicalNotes: "..." }` -> `PERMISSION_DENIED`.
4. **Consent Bypass**: `create(/leads/lead_3)` with `{ consent: false }` -> `PERMISSION_DENIED`.
5. **Invalid Interest Area Enum**: `create(/leads/lead_4)` with `{ interestArea: "custom_script" }` -> `PERMISSION_DENIED`.
6. **Timestamp Forgery**: `create(/leads/lead_5)` with client-supplied past timestamp instead of `request.time` -> `PERMISSION_DENIED`.
7. **ID Poisoning**: `create(/leads/<200-char-junk-id>)` -> `PERMISSION_DENIED`.
8. **Payload Exhaustion (Denial of Wallet)**: `create(/leads/lead_6)` with 50KB `name` string -> `PERMISSION_DENIED`.
9. **Email Spoofing Without Verification**: Auth token with `email: "cerebrosupport@gmail.com"` and `email_verified: false` attempting `list(/leads)` -> `PERMISSION_DENIED`.
10. **Non-Admin Content Hijack**: Signed-in normal user updating `/siteContent/landing` -> `PERMISSION_DENIED`.
11. **Unbounded Audio Array Overflow**: Admin updating `/siteContent/landing` with `audioSamples.size() == 25` -> `PERMISSION_DENIED`.
12. **Self-Assigned Admin Escalation**: Non-admin user creating `/admins/{theirUid}` with `{ role: "admin" }` -> `PERMISSION_DENIED`.
