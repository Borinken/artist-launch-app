# Artist Launch OS

Back-office for independent music artists: rights registration, split sheets,
contracts, distribution delivery and royalty tracking in one place.

Independent artists lose money to paperwork they don't know exists — an
unregistered work with a PRO, a split sheet nobody signed before the session
ended, a distribution upload rejected for a sample rate. This tracks each of
those as a state machine with an owner and a deadline, instead of a folder of
Word documents.

---

## What it does

**Split sheets.** Collaborator percentages are validated server-side to total
exactly 100 before a sheet can be stored. This is the single most common cause
of frozen royalties, and a UI-only check is not enough — the API rejects the
write.

**Rights registration tracking.** Each work carries per-society registration
records (PRO, publisher, ISRC, ISWC) with real cost data, so an artist can see
what is registered, what is pending, and what it costs before committing.

**Distribution delivery.** Audio masters are validated in the browser before
upload: `lib/wavHeader.ts` parses the RIFF/WAVE header from the first 64 bytes
and checks sample rate, bit depth and channel count against distribution spec.
A file that would be rejected downstream never gets uploaded. Files then move
through a signed-URL flow (`/api/track-assets/sign` → `confirm`) so large
uploads go straight to storage rather than through the application server.

**Contracts.** Templated producer, feature and management agreements generated
from structured data.

**Royalties.** Per-source income tracking with CSV export.

**Billing.** Stripe subscriptions across three tiers, reconciled by webhook —
subscription state is written by `/api/webhooks/stripe`, never inferred from a
successful redirect.

---

## Architecture

```
Browser ──► Next.js App Router (Vercel)
              │
              ├─ middleware.ts ──── session gate for /dashboard and /admin
              │
              ├─ /api/split-sheets     100% validation before write
              ├─ /api/registrations    PRO / publisher / ISRC state
              ├─ /api/track-assets/*   signed upload → confirm
              ├─ /api/royalties        income + CSV export
              ├─ /api/contracts        templated generation
              ├─ /api/checkout         Stripe session creation
              └─ /api/webhooks/stripe  subscription reconciliation
              │
              ▼
          Supabase (Postgres + RLS + Storage)
```

### Decisions worth explaining

**Identity comes from the session, never the URL.** An earlier iteration
resolved the dashboard from `?artist_id=<uuid>`, which let any visitor read any
artist's data by editing the query string. `lib/getSessionArtist.ts` now derives
the artist from the authenticated Supabase session and returns `null` when the
signed-in user has no linked artist row.

**Two layers of authorisation, not one.** Route handlers check the session, and
13 RLS policies enforce ownership at the database level. Either layer alone
fails open under a mistake; a route handler that forgets its check still cannot
read another artist's rows.

**Audio validation happens client-side, on purpose.** Reading 64 bytes of header
in the browser is instant and costs nothing. Uploading a 60 MB WAV to discover
it is 8-bit mono wastes the artist's bandwidth and the storage bill.

**The dev auth bypass is inert in production.** `DISABLE_AUTH` skips the login
redirect for local work, but is ANDed with `NODE_ENV !== 'production'`. A
misconfigured environment variable on the host must not be sufficient to expose
`/admin`.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Database | Supabase (Postgres, RLS, Storage) |
| Auth | Supabase Auth (artists) + signed cookie (admin) |
| Payments | Stripe subscriptions + webhooks |
| Charts | Recharts |
| Animation | Framer Motion |
| Hosting | Vercel |

---

## Running locally

```bash
npm install
cp .env.example .env.local
```

Create a Supabase project and apply the schema from `supabase/schema.sql` via
the SQL editor. Populate `.env.local` with your project URL, anon key and
service-role key, then:

```bash
npm run dev
```

To work on the dashboard without seeding an auth user, set `DISABLE_AUTH=true`
in `.env.local`. This only takes effect outside production builds.

For billing, create three recurring Stripe products and set their price IDs in
`.env.local`. Point a webhook endpoint at `/api/webhooks/stripe` subscribing to
`customer.subscription.*` and `payment_intent.succeeded`.

---

## Project structure

```
app/
  api/            16 route handlers
  dashboard/      artist-facing: tracks, split sheets, registrations,
                  distribution, contracts, royalties, calendar, team
  admin/          operator view across all artists
  auth/, login/   session handling
lib/
  wavHeader.ts            RIFF/WAVE header parsing
  getSessionArtist.ts     session-derived identity
  registrationCatalog.ts  society and registration cost data
  contractTemplates.ts    contract generation
  adminAuth.ts            signed admin session cookie
supabase/
  schema.sql      tables, constraints and RLS policies
```

---

## Status

Feature-complete for the flows above and running against a live Supabase
project. Not yet accepting public signups — billing is wired end to end but the
tiers are still being validated with a small number of artists before the
self-service checkout opens.

## License

MIT — see [LICENSE](LICENSE).
