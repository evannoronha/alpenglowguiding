# CMS options after Strapi Cloud's free plan removal

Research date: **2026-08-11**. All prices verified against vendor pricing pages on this date unless
explicitly marked unverified. Currency is USD unless stated.

## 0. The deadline, confirmed

Strapi announced on 2026-07-21 that the Strapi Cloud Free plan is gone:

- 2026-07-01 — Free plan removed for new signups
- **2026-09-01 — all existing free projects are deleted**
- Between now and then: upgrade, or export your data and delete the project

Source: <https://strapi.io/blog/we-re-removing-the-free-plan-from-strapi-cloud>

Cheapest paid Strapi Cloud tier today is **Starter $35/month** (100k API requests, 50 GB asset
storage, 50 GB asset bandwidth, and note "Runtime behavior: **Sleeps when idle**"), then Pro $90/mo
and Business $450/mo. Source: <https://strapi.io/pricing-cloud>

**Read section 6 first — the export is time-critical.**

## 1. What we actually have to preserve

From `strapi/src/api/*/content-types/*/schema.json` and `strapi/src/components/`:

| Concept | Where | Detail |
| --- | --- | --- |
| `Post` | `api/post` | title, date, description, image (media), author (relation → users-permissions user), slug (uid), **body: dynamiczone** of `body.markdown`, `body.rich-text`, `body.video` |
| `Program` | `api/program` | name, description, images (media, multiple), slug (uid), **body: dynamiczone** of `programs.program-page-section` |
| `body.rich-text` | component | single field of type **`blocks`** (Strapi's JSON block format) |
| `body.markdown` | component | markdown text |
| `body.video` | component | **media upload** of type files/videos — an actual uploaded video file, not an embed URL |
| `programs.program-page-section` | component | `section_header` (string) + `section_content` (`blocks`) |
| draft/publish | both types | `draftAndPublish: true` |

Two things drive the whole evaluation:

1. **Two dynamic zones.** Ordered, heterogeneous block lists are the distinctive Strapi feature. Any
   replacement must model this natively or the content model gets rebuilt.
2. **Uploaded video files.** This kills several free tiers on storage alone (see DatoCMS below).

Volume: ~5 posts, ~5 programs, low edit frequency, one non-technical editor.

---

## 2. Candidate shortlist

### 2a. Managed / SaaS headless CMS

#### Sanity — **strongest SaaS candidate**

Source: <https://www.sanity.io/pricing>

- **Free: $0 "forever"** — 20 user seats, 2 permission roles (**Administrator + Viewer only**),
  2 datasets (**public only**), 10k documents, 2k unique attributes/dataset, 1M API CDN requests/mo,
  250k API requests/mo, **100 GB assets**, **100 GB bandwidth/mo**, unlimited content types,
  **free Studio hosting**, live preview + visual editing, 3-day draft history.
- **First paid: Growth $15 per seat / month** — adds Editor/Developer/Contributor roles, private
  datasets, scheduled drafts, 25k documents, comments/tasks, pay-as-you-go overages.
- Hosting model: SaaS (Content Lake) + Studio, which you can host free on Sanity's infrastructure or
  embed on an Astro route.
- Admin UI: Sanity Studio. Genuinely good for non-technical editors, though it is a developer-configured
  UI — the editor experience is only as friendly as the schema you write.
- Astro integration: **official** — `@sanity/astro` (`npx astro add @sanity/astro @astrojs/react`),
  exposes `sanityClient` via a `sanity:client` virtual module, can mount Studio at `/admin`.
  Source: <https://www.sanity.io/plugins/sanity-astro>

Two real caveats for our case:

- **Free datasets are public only.** Content on a marketing site is public anyway, but *drafts* would
  also be world-readable if someone guessed the API URL. Acceptable here; worth knowing.
- **The Free plan has no Editor role** — only Administrator and Viewer. A solo business owner as
  Administrator is fine. The moment you want a genuinely restricted editor account, it's $15/seat/mo.

#### Prismic — **best fit for the dynamic-zone shape**

Source: <https://prismic.io/pricing>

- **Free: $0/month per repository** — **1 user**, 4M API calls/mo (no overages), 100 GB CDN
  bandwidth/mo (no overages), 2 locales, **unlimited documents, types, and assets**, Visual Page
  Builder, image optimization, **Migration API included**, previews, scheduling, full revision history.
- **First paid: Starter $10/month per repository** — 3 users, 3 locales, paid bandwidth overages to
  500 GB at $0.30/GB. Then Small $25/mo (7 users), Medium $150/mo, Platinum $675/mo.
- Note: the pricing page quotes these as "per repository, **paid annually**". I could not confirm a
  separate month-to-month rate from the page's monthly/annual toggle — **treat the monthly-billing
  price as unverified**; budget $10/mo annually committed.
- Hosting: SaaS. Admin UI: the Page Builder is one of the friendliest non-technical editors in this list.
- Astro integration: `@prismicio/client` + an Astro CMS guide (<https://docs.astro.build/en/guides/cms/>).
  No first-party Astro adapter, but the JS client is trivial to use in SSR.
- **Slices are exactly dynamic zones** — an ordered list of typed, repeatable content blocks. This is
  the closest 1:1 conceptual match to what we have.
- Caveat: **Free is 1 user.** If the developer and the owner both need logins, that's Starter at $10/mo
  (still inside budget).

#### Storyblok

Source: <https://www.storyblok.com/pricing>

- **Starter: Free** — 1 space, **1 user seat included** (max 2, +$15/mo for the second),
  100k API requests/mo (no additional available), 100 GB traffic/mo, 2 locales, **2,000 assets max**,
  20,000 stories, 200 components, **content versioning retention: 1 day**, 500 MB max asset size,
  Visual Editor and Asset Manager included.
- **First paid: Growth $99/month** ($90.75/mo annual) — 5 seats, 400 GB traffic, 1M API requests.
- Astro integration: **official** `@storyblok/astro`; Astro's docs call out Storyblok as one of the
  CMSes that ships an Astro-specific integration.
- Nestable Blocks map cleanly to dynamic zones; the Visual Editor is excellent for non-technical users.
- Caveats: 1 seat on free; 1-day version history is thin; the cliff from $0 to $99 is steep.

#### Hygraph

Source: <https://hygraph.com/pricing>

- **Hobby: $0 "always"** — 3 seats, 2 roles, **1,000 entries**, 500k API calls/mo, 100 GB asset
  traffic, **unlimited asset storage**, 50 MB max per asset, 20 models, **10 components**, 2 locales,
  2 content stages (draft/published), live preview, commenting. **No version retention.
  No scheduled publishing.** Rate limit 5 uncached RPS.
- **First paid: Growth $199/month** — 10 seats, 10k entries, 1M API calls, 14-day version retention.
- Astro: REST/GraphQL + Astro CMS guide. No first-party Astro package.
- The 50 MB per-asset cap is a problem for uploaded video. The $0 → $199 cliff is the worst kind of
  loss-leader shape.

#### DatoCMS — **disqualified on storage**

Source: <https://www.datocms.com/pricing>

- **Free: 3 projects, 1 collaborator, 100 models, 300 records, 10 GB/mo bandwidth,
  100k CDA calls/mo, 25k CMA calls/mo, 120 min/mo video streaming, 3-day history — and
  200 MB total file storage.**
- **First paid: Professional €149/month billed annually, or €199/month monthly.**
- Free plan hard-stops: "In the Free plan, you can't go over the allowed monthly limits. If you reach
  these limits, the service will stop responding as expected."

**200 MB of file storage cannot hold a photo-heavy climbing site with uploaded video.** And the
first paid tier is 13× our ceiling. Rule it out.

#### Contentful

Source: <https://www.contentful.com/pricing/>

- **Free: $0 forever** — 10 users, 2 roles (Admin, Editor), 2 locales, 100k API calls/mo (no
  overages), 50 GB/mo CDN bandwidth (no overages), 50 MB max asset upload, 1 Starter Space with
  25 content types / 2 environments / **10,000 records**.
- **First paid: Lite $300/month.** Then Enterprise (custom).
- Free tier is technically generous enough for this site, and the admin UI is mature and
  non-technical-friendly. But **the next step up is $300/month** — there is no graceful growth path,
  and Contentful has repeatedly restructured its low-end tiers.

#### Directus Cloud — **cheap cloud tiers were just eliminated**

Source: <https://directus.io/pricing>

Directus restructured in 2026 and it is bad news for small users:

- **Core: $0** — self-host, **3 user seats (hard limit), 25 collections**, 5 Flows, community support.
  **Directus Cloud is an add-on at $99/month** for Core and Team.
- **Team: $499/month** ($599 billed monthly), 10 SSO seats, 50 collections.
- The page itself asks "Why is there nothing between Core and $499/mo?"
- **Open Innovation Grant**: organizations under $5M annual revenue and fewer than 50 employees get
  "fully permissive access to Directus at no software cost… Self-hosted is completely free. Cloud
  hosting is $99/mo." A climbing guide service qualifies. Requires requesting a key.
- License is now **MSCL-1.0-GPL** (Monospace Sustainable Core License), which explicitly forbids
  circumventing the license-key functionality and converts to GPL-3.0 four years after each release.
  Source: <https://directus.io/license>

So Directus is only viable **self-hosted**, and the seat/collection limits are license-key enforced
unless you hold a Grant key. See 2c.

#### Payload Cloud — **closed to new projects**

Source: <https://payloadcms.com/cloud-pricing>

> "Payload is now part of Figma!… Although deployment of **new projects is currently paused**,
> existing Cloud projects will continue running as normal."

And on migration: "Will I need to migrate my project? **Yes, eventually.**"

Payload Cloud is not an option. Payload self-hosted is — see 2d.

#### Contentstack

Source: <https://www.contentstack.com/pricing>

Contentstack publishes **no numeric pricing at all** — the page is capability tiers plus
"Request demo / Start free". **I could not verify any 2026 price.** Given it's positioned as an
enterprise "agentic experience platform," it is very unlikely to land under $15/mo. Not pursued further.

#### Builder.io

Source: <https://www.builder.io/m/pricing>

- **Free: $0 per user/mo**, up to 5 users, 1 space, **admin-only role**, 25 daily / 75 monthly Agent
  Credits, GitHub/GitLab/Bitbucket connect.
- **Pro and Team prices did not render on the pricing page when fetched — unverified.** The page is
  organized around "Fusion" (visual IDE) and "Publish" (visual CMS) with per-user monthly pricing.
- Builder.io is fundamentally a visual page builder / AI coding surface, not a structured content
  backend for a blog with typed body blocks. Poor conceptual fit. Not recommended.

#### Webiny

Source: <https://www.webiny.com/pricing>

- **Community: FREE forever**, open source (MIT), self-hosted, 1 tenant, no user limit.
- **First paid: Business Small $79/month** (8 users, 3 tenants), Medium $299, Large $599.
- Hosting model: Webiny self-hosts as a **full AWS serverless stack** (Lambda, DynamoDB, S3,
  CloudFront). The license is free; the AWS bill is not, and it's not a $5/mo shape. Operational
  complexity is far out of proportion to a 10-document site. Not recommended.

### 2b. Git-based CMS with a hosted non-technical editing UI

These all store content as files in the GitHub repo. Media generally lands in the repo too, unless
noted. For 10 documents and a handful of images that is fine; for uploaded video it is not
(GitHub soft-limits files at 100 MB and repos get unpleasant fast).

| Product | Price | Hosted UI | Media | Astro | Notes |
| --- | --- | --- | --- | --- | --- |
| **Keystatic** | Keystatic Cloud **free up to 3 users/team**; **Pro from $10/mo** (>3 users, Cloud Images, multiplayer); +$5/mo per user beyond 3 | Yes, Keystatic Cloud handles GitHub auth so editors don't need GitHub accounts | Repo by default; **Cloud Images (upload/transform/serve) requires Pro $10/mo** | Astro CMS guide exists; Keystatic ships an Astro integration | Best-in-class editor UX among git CMSes; `blocks`-style document field with custom component blocks |
| **Pages CMS** | Free, open source | Yes, hosted at the Pages CMS app; config via a `.pages.yml` file in the repo | In-repo media, managed through the UI | Astro CMS guide exists | Simple and genuinely non-technical, but no media CDN and no hosted asset transforms |
| **Decap CMS** | Free, open source | Self-hosted admin route in your own site; needs an OAuth backend (GitHub/GitLab/Bitbucket) | Drag-and-drop into repo | Astro CMS guide exists | Mature but low maintenance velocity; you own the auth proxy |
| **Sveltia CMS** | Free, open source | Same model as Decap (drop-in successor) | Same as Decap | Config-compatible with Decap | Modern UX rewrite of Decap, first-class i18n, actively developed |
| **TinaCMS** | **Free $0 forever**: 2 users, 2 roles, unlimited documents, 1 project, 100 MB asset cap. **Team $24/mo** (annual $290/yr; the comparison table lists $29/month for monthly billing — the two figures on the page disagree, treat the monthly rate as unverified) | Yes, Tina Cloud | Tina Cloud media store; 100 MB asset cap on all tiers | Astro CMS guide exists | Free tier's 2 users covers owner + dev. Editorial workflow is Team Plus ($41/mo) only |
| **CloudCannon** | **No free tier.** Standard **$55/month** ($49/mo annual), 3 users. "Lite $10/mo" is **Partners Only** | Yes | Yes, incl. DAM connectors on higher tiers | **Astro's featured CMS partner** | Out of budget. Note its free tier is gone (see section 5) |
| **Front Matter CMS** | Free, open source | **No — it's a VS Code extension.** | Local files | Astro CMS guide exists | **Disqualified: requires the editor to use VS Code.** Not a hosted UI for a non-technical user |

Sources: <https://keystatic.com/docs/cloud>, <https://pagescms.org/docs/>, <https://decapcms.org/docs/intro/>,
<https://github.com/sveltia/sveltia-cms>, <https://tina.io/pricing>, <https://cloudcannon.com/pricing/>,
<https://docs.astro.build/en/guides/cms/>

**Where git-based CMSes break down for us:** the `body.video` component is an uploaded video file.
None of the free git-CMS paths give you sane video hosting — you'd move video to YouTube/Vimeo embeds
and change the content model. That's a reasonable change to make anyway, but it *is* a change.

### 2c. Self-hosting the existing Strapi 5 app — **recommended**

This is the only option that preserves the content model, the components, the dynamic zones, the
admin UI, and the existing Astro fetch code **exactly**. Migration risk is near zero because it's the
same application.

**Strapi's documented hardware requirements** (<https://docs.strapi.io/cms/deployment>,
<https://docs.strapi.io/snippets/hardware-require>):

| Hardware | Recommended | Minimum |
| --- | --- | --- |
| CPU | 2+ cores | 1 core |
| Memory | **4 GB+** | **2 GB** |
| Disk | 32 GB+ | 8 GB |

**The admin build is the memory problem, not the runtime.** Long-running upstream issues
(<https://github.com/strapi/strapi/issues/12137>, <https://github.com/strapi/strapi/issues/21502>)
document the admin panel build consuming ~2 GB+ and OOM-ing or hanging on 2 GB boxes, with Strapi
maintainers pointing back at the documented 2 GB minimum / 4 GB recommendation. Practical workarounds
in those threads: `NODE_OPTIONS="--max-old-space-size=4096"`, adding swap, or **building elsewhere
(CI or locally) and shipping the `dist/` output to the server**. Runtime after the build is far
lighter. Strapi also exposes `upload.config.sharp` specifically to "reduce memory usage during image
processing… particularly useful for memory-constrained environments"
(<https://docs.strapi.io/cms/features/media-library>).

Databases supported: PostgreSQL (17 recommended / 14 min), MySQL, MariaDB, SQLite. **No MongoDB, and
explicitly no "cloud native" databases like Aurora or Cloud SQL.**
Source: <https://docs.strapi.io/cms/installation/cli>

#### Concrete monthly totals

**Option A — Hetzner CX22 + Postgres in Docker on the same box + R2 for media — ~€4.49/mo (~$5)**

| Line item | Cost |
| --- | --- |
| Hetzner Cloud CX22 (2 vCPU, 4 GB RAM, 40 GB SSD) | **€4.49/mo** price cap |
| PostgreSQL 17 in Docker on the same box | €0 |
| Cloudflare R2 for media (well under 10 GB) | **$0** |
| Coolify for deploys (self-hosted, open source) | €0 |
| **Total** | **≈ €4.49/mo** |

Hetzner CX22 at €4.49/mo and CPX11 at €5.49/mo reflect Hetzner's price adjustment effective
2026-04-01 (CX22 rose from €3.29, CPX11 from €3.85). Hetzner's own cloud pages render prices via
JavaScript and did not yield numbers on fetch; the figures come from Hetzner's price-adjustment doc
(<https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/>, read via
<https://web.archive.org/web/20260513201413/https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/>)
corroborated by third-party summaries. **Re-confirm on hetzner.com before committing.** Hetzner bills
hourly with a monthly cap and no minimum term.

4 GB RAM hits Strapi's *recommended* spec, so this comfortably runs Strapi + Postgres and can even do
the admin build locally with swap. This is the only option that lands in the "$0–5 ideal" band while
meeting documented requirements. Coolify self-hosted is free and open source (**Coolify Cloud's price
was not verified in this pass**); plain `docker compose` + Caddy works too.

**Option B — Fly.io — ~$6–11/mo**

Fly machine prices, `iad` region (<https://fly.io/docs/about/pricing/>):

| Config | Price/mo |
| --- | --- |
| shared-cpu-1x, 512 MB | $3.19 |
| shared-cpu-1x, 1 GB | $5.70 |
| shared-cpu-1x, 2 GB | $10.70 |

Plus volumes at **$0.15/GB-month**, volume snapshots $0.08/GB-month (first 10 GB free), IPv4 $2/mo
(first 10 single-hostname certs free).

- Realistic: shared-cpu-1x 2 GB ($10.70) + 3 GB volume ($0.45) ≈ **$11.15/mo**, using SQLite or an
  external Postgres. Squeezing to 1 GB ($5.70 + $0.45 ≈ **$6.15/mo**) works only with a pre-built
  admin and is below Strapi's documented minimum.
- **Fly Managed Postgres starts at $38/month** (Basic: 2 shared vCPU, 1 GB, two-node HA) plus
  $0.28/provisioned GB. Source: <https://fly.io/docs/mpg/>. That alone is over double our ceiling —
  do not use it. Unmanaged Fly Postgres is ~$2/mo for a single dev node but you own it entirely.
- **There is no free allowance for new Fly organizations** — the free allowances are explicitly
  "Legacy" and honored only for orgs that predate the plan sunset.
- **Scale-to-zero caveat:** Fly's auto-stop/auto-start would make this nearly free, *but the Astro
  site is SSR on Cloudflare Workers and queries Strapi per request*. Every cold request would eat a
  Node boot (roughly 10–30s for Strapi). Scale-to-zero is only viable if you put caching in front of
  Strapi or move to build-time fetching with webhook-triggered rebuilds. Ironically Strapi Cloud's
  own Starter tier "Sleeps when idle," so this is the same trade-off, just cheaper.

**Option C — Railway — ~$13/mo**

Rates (<https://railway.com/pricing>): Hobby **$5/mo including $5 of usage credits**; memory
$0.00000386/GB-s, CPU $0.00000772/vCPU-s, volumes $0.00000006/GB-s, egress $0.05/GB.

Estimating a 730-hour month (2,628,000 s):

| Item | Calculation | Cost |
| --- | --- | --- |
| 1 GB memory, always on | 1 × 2,628,000 × $0.00000386 | $10.14 |
| ~0.1 vCPU average | 0.1 × 2,628,000 × $0.00000772 | $2.03 |
| 3 GB volume | 3 × 2,628,000 × $0.00000006 | $0.47 |
| Subtotal usage | | $12.64 |
| Less $5 included credits, plus $5 plan fee | | **≈ $12.64/mo** |

That's with **SQLite on a volume**. Adding a Railway Postgres service as separate always-on compute
pushes this to roughly $18–22/mo — **over budget**. Railway's **Free plan caps services at
1 vCPU / 0.5 GB** with $1 of monthly credits, which is below Strapi's minimum and not viable.

**Option D — Render — $13/mo (fragile) or $31/mo (safe)**

Rates (<https://render.com/pricing>): Hobby workspace $0 + compute, 5 GB bandwidth included,
500 build pipeline minutes/mo.

| Config | Cost |
| --- | --- |
| Web Service Starter (512 MB, 0.5 CPU) + Postgres Basic-256mb ($6) | **$13/mo** |
| Web Service Standard (2 GB, 1 CPU) + Postgres Basic-256mb ($6) | **$31/mo** |

512 MB is a quarter of Strapi's documented minimum — expect runtime OOM. Render's free Postgres has a
**30-day limit**, so it isn't a real option. Builds run on Render's build pipeline rather than the
instance, which helps the build-memory problem, but doesn't fix runtime. The safe configuration is
over budget.

**Option E — DigitalOcean** — **prices not verified in this pass.** Hetzner is materially cheaper for
equivalent RAM regardless, so this wasn't pursued.

#### Managed Postgres add-ons, if you don't co-locate the DB

| Provider | Free tier | Gotcha for an always-on Strapi |
| --- | --- | --- |
| **Neon** (<https://neon.com/pricing>) | Free is permanent: 0.5 GB storage/project, **100 CU-hours/project/mo**, 5 GB egress, scale-to-zero after 5 min, autoscaling to 2 CU | **This is the trap.** Strapi holds a persistent connection pool, so the compute never idles into scale-to-zero. At the 0.25 CU floor, 730 h × 0.25 = **~183 CU-hours**, well past the 100 CU-hour free cap — and "hitting any Free monthly limit… suspends compute until the next billing month." Paid Launch is $0.106/CU-hour ≈ **$19/mo** at 0.25 CU always-on. Over budget. |
| **Supabase** (<https://supabase.com/pricing>) | Free: 500 MB database, 1 GB file storage, 5 GB egress, 2 active projects | **"Free projects are paused after 1 week of inactivity."** A connected Strapi probably counts as activity, but you're betting uptime on an undocumented heuristic. Pro is $25/mo + $10 compute − $10 credits = **$25/mo**. Over budget. |
| **Fly Managed Postgres** | none | **$38/mo minimum.** Out. |
| **Postgres in Docker next to Strapi** | n/a | **$0**, and for 10 documents the operational risk is a nightly `pg_dump` to R2. This is the right answer at this scale. |

The conclusion is consistent across providers: at this size, **a separate managed Postgres costs more
than the entire rest of the stack**. Co-locate it.

### 2d. Payload CMS 3 self-hosted

- License: open source (MIT), and Figma has publicly committed to keeping the core open source
  (<https://payloadcms.com/cloud-pricing>).
- Runs "anywhere Next.js can run" — Vercel, Netlify, SST, DigitalOcean, AWS, and there are official
  guides for **Cloudflare Workers** and Vercel. Source: <https://payloadcms.com/docs/production/deployment>
- Needs: Postgres **or** MongoDB-compatible database, plus permanent file storage. The docs
  specifically warn that ephemeral filesystems (Heroku, DigitalOcean Apps) will silently lose uploads,
  so you need an S3/R2 storage adapter.
- Hosting reality: a Cloudflare Workers + D1/Postgres + R2 deployment could plausibly land at
  **$5/mo** (Workers Paid) or even free-tier. On a VPS it's the same ~€4.49 Hetzner shape as Strapi.
- **But**: adopting Payload means rebuilding the content model, rewriting all Astro fetch code, and
  running a Next.js app alongside the Astro app. Payload's Blocks field is an excellent dynamic-zone
  equivalent and Lexical rich text exports to JSON/HTML/markdown — so it's a *good* CMS. It just buys
  us nothing that self-hosting Strapi doesn't already give us, at higher migration cost.
- **Vendor-risk flag:** Payload was acquired by Figma, Cloud signups are paused, and existing Cloud
  customers are told they will eventually need to migrate. The OSS core looks safe; the commercial
  direction is unsettled.

### 2e. Directus self-hosted

- **$0 self-hosted on the Core tier**, but license-key-limited to **3 user seats (hard limit) and
  25 collections**. Directus Cloud is a **$99/mo** add-on. Team is $499/mo.
  Source: <https://directus.io/pricing>
- The **MSCL-1.0-GPL** license forbids disabling or circumventing the license key
  (<https://directus.io/license>). Each release converts to GPL-3.0 after four years.
- **Open Innovation Grant**: <$5M revenue and <50 employees gets a fully permissive key, free
  self-hosted. We'd qualify — but it's a grant you have to apply for and hold, which is a dependency
  on Directus's continued goodwill.
- 3 seats and 25 collections are plenty for this site. Hosting cost is the same Hetzner shape.
- Directus is a database-first admin, not a content-first CMS. It has repeatable groups (JSON repeater
  / M2A relationships) that can express dynamic zones via **Many-to-Any**, but modelling it is more
  work and the editor UI is more "database table" than "content studio."
- **Vendor-risk flag: Directus just deleted its entire low-end cloud offering.** That's precisely the
  failure mode we're trying to escape.

---

## 3. Which candidates support the Strapi concepts we use

| Capability | Strapi (keep) | Sanity | Prismic | Storyblok | Hygraph | Contentful | Keystatic | TinaCMS | Payload 3 | Directus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Ordered heterogeneous blocks** (dynamic zone) | native `dynamiczone` | **Array of block types** — idiomatic, first-class | **Slices** — a direct 1:1 match | **Nestable Blocks** — direct match | **Modular/component fields** (10 components on free) | Rich text embedded entries, or a references array | **Document field with custom component blocks** | Rich text with embedded custom blocks | **Blocks field** — direct match | **M2A relationship** — works, more setup |
| **Repeatable components** (program sections) | native | array of objects | repeatable slice zone | repeatable blocks | components | array of references | `array` field | object list | `array` field | repeater / O2M |
| **Rich text storage format** | **`blocks` = Strapi's own JSON block format** (proprietary shape, but plain JSON you can transform) | **Portable Text** — published open spec, JSON. Best lock-in story | Prismic **structured rich text JSON**; `@prismicio/richtext` renders it | Storyblok **richtext JSON**; official renderers | Hygraph **RichTextAST** (JSON), plus HTML/markdown output | Contentful **Rich Text JSON** (documented schema) | **Markdoc/MDX or markdown files in your repo** — zero lock-in | **markdown/MDX in your repo** — zero lock-in | **Lexical JSON**, converters to HTML/markdown | plain text/markdown/WYSIWYG HTML — your column, your format |
| **Media library + responsive derivatives** | Media Library; "Responsive friendly upload" generates `large` 1000px / `medium` 750px / `small` 500px, configurable via `upload.config.breakpoints` | Asset pipeline with on-demand transforms, auto-WebP, global CDN, LQIP/blurhash/palette metadata; **100 GB free** | Unlimited assets + image optimization on **Free** | Asset Manager + Image Optimization Service; **2,000 asset cap on free** | Unlimited storage, **50 MB/asset cap** | 50 MB/asset, Images API | Repo images by default; **Cloud Images needs Pro $10/mo** | Tina Cloud media, **100 MB asset cap** | Storage adapters (S3/R2) + `sharp` resizing | Files collection + on-the-fly transforms |
| **Draft/publish + preview** | `draftAndPublish: true` on both types | drafts + Presentation/live preview; **scheduled drafts need Growth** | previews, shareable previews, scheduling, releases — all on **Free** | Visual Editor previews; **single-story scheduling needs Growth** | 2 content stages + live preview; **no scheduled publishing on Hobby** | scheduled publishing + live preview on Free | git branch/PR-based | draft mode; **editorial workflow needs Team Plus $41/mo** | drafts, versions, live preview | manual (status field) or Flows |

Sources for the Strapi rows: <https://docs.strapi.io/cms/features/media-library>, and the repo schemas.

**The honest read on rich text lock-in:** Strapi's `blocks` format is proprietary in shape but it's
just JSON in your own database — you can transform it with a script. Sanity's Portable Text is the
only format here that is a *published open specification* with a multi-framework renderer ecosystem.
Git-based CMSes (Keystatic, Tina, Pages CMS, Decap/Sveltia) have the strongest story of all: the
content is markdown in your repo, and there is nothing to migrate off of.

---

## 4. Migration ergonomics

| Target | Bulk import mechanism | Strapi → X tooling |
| --- | --- | --- |
| **Strapi self-hosted** | **`strapi transfer` / `strapi export` + `strapi import`** — first-party, schema-matched, transfers content, files, config, and schemas. See section 6. | **N/A — same app, same schema.** This is the entire argument for this option. |
| **Sanity** | **Excellent.** `sanity datasets import <file|tarball> <dataset>` takes NDJSON, one document per line. Images/files use a special `_sanityAsset` property accepting `image@file:///abs/path.jpg` **or `image@https://…`** — so you can point it straight at the old Strapi Cloud media URLs. `--replace` / `--missing` / `--allow-failing-assets` flags. References auto-imported as weak then strengthened, so document order doesn't matter. API limit: 25 mutations/sec. Source: <https://www.sanity.io/docs/apis-and-sdks/importing-data> | No off-the-shelf Strapi→Sanity migrator found. A ~150-line script mapping Strapi `blocks` JSON → Portable Text is the real work. `sanity-import` CLI was removed in v5.0.0 (2026-03-11) — use `sanity datasets import`. |
| **Prismic** | **Migration API is included on the Free plan** (per the pricing page's feature table) — programmatic document creation. | None found; would need a custom script mapping dynamic zones → slices. |
| **Storyblok** | **Management API** available on all tiers including Starter, plus a CLI. | Community migration scripts exist but nothing first-party; unverified. |
| **Contentful** | **Content Management API** + `contentful-cli` with `space import/export`, on Free. | Several community Strapi→Contentful scripts exist; none first-party. |
| **Hygraph** | Management API / mutations. | None first-party. |
| **Keystatic / Pages CMS / Decap / Sveltia / Tina** | **Trivially scriptable** — you generate markdown/MDX files with frontmatter and commit them. No API, no rate limits, no auth. Easiest bulk load of any option. | None needed; write a one-off script that reads the Strapi export `.jsonl` and emits markdown. |
| **Payload 3** | **Local API** (`payload.create()`) — run a Node seed script directly against the config. Very ergonomic. | None first-party. |
| **Directus** | REST/GraphQL items API + SDK; supports batch create by POSTing an array. | None first-party. |

**Key enabler for any target:** `strapi export --no-encrypt --no-compress` (or `--format dir`) produces
`entities/*.jsonl`, `links/*.jsonl`, `schemas/*.jsonl`, and `assets/` — one JSON record per line.
Strapi's own docs note the format is "convenient for line-by-line processing or conversion to formats
such as CSV." That's your migration source of truth for **any** destination.
Source: <https://docs.strapi.io/cms/data-management/export>

---

## 5. Vendor risk — durability of each free tier

Ranked by how likely you are to get burned again.

**Already burned, recently:**

- **Strapi Cloud** — Free plan killed 2026-07-01, projects deleted 2026-09-01. Worth noting the
  *second-order* signal: a Strapi blog post from 2025-12-22 (updated 2026-06-14) discusses **Free and
  "Essential" plans**, and says "upgrading to a paid plan starting at just **$18/month** (or $15/month
  with yearly billing)". Today's pricing page shows **no Free and no Essential tier at all** — the
  entry point is **$35/mo**. Strapi eliminated two tiers and roughly doubled the floor in about eight
  months. Sources: <https://strapi.io/blog/introducing-yearly-plans-and-new-limits-for-strapi-cloud>,
  <https://strapi.io/pricing-cloud>
- **Directus Cloud** — the entire affordable cloud range is gone. Self-host Core is $0 but
  license-key-capped at 3 seats / 25 collections; Cloud is a $99/mo add-on; next tier is $499/mo. The
  pricing page itself acknowledges the gap. Simultaneously relicensed to MSCL-1.0-GPL.
- **CloudCannon** — no free tier remains on the pricing page; entry is $55/mo ($49 annual). The $10/mo
  "Lite" plan is restricted to Partner Program members.
- **Payload Cloud** — acquired by Figma, **new project deployment paused**, existing customers told
  they will "eventually" need to migrate.

**Structurally fragile free tiers (loss-leaders with a cliff):**

- **Hygraph** — $0 → **$199/mo**. No version retention or scheduled publishing on Hobby. A free tier
  with a 199× step is a customer-acquisition funnel, not a product.
- **Contentful** — $0 → **$300/mo**. Contentful has restructured its low-end tiers repeatedly
  (the old Team tier is gone). The free tier is real today but there is no survivable next step.
- **DatoCMS** — $0 → **€199/mo** monthly, and the free tier's 200 MB storage / 1 collaborator /
  300 records is deliberately too small to run a real site. Explicit hard-stop on limits.
- **Storyblok** — $0 → **$99/mo**, 1 seat, 1-day version history. Free tier is functional but clearly
  positioned as an evaluation sandbox.
- **Fly.io** — already removed free allowances; they exist only as "Legacy" for grandfathered orgs.
- **Neon / Supabase free Postgres** — both have mechanisms (CU-hour caps, inactivity pausing) that
  suspend your database. Neither is designed to back a production always-on app for free.

**More durable:**

- **Sanity Free** — the most credible SaaS free tier here. It is described as "$0 forever," the limits
  (20 seats, 10k docs, 100 GB assets, 100 GB bandwidth, 1M CDN requests) are generous rather than
  token, the next step is a gentle **$15/seat** rather than a cliff, and Sanity has offered a
  substantive free tier for many years. Risk isn't zero, but the *shape* is a real product tier, not
  a funnel.
- **Prismic Free → $10 → $25** — a genuinely graduated ladder. The absence of a cliff is itself the
  strongest durability signal on this list.
- **TinaCMS Free → $24** — small vendor (higher company risk) but content lives in your git repo, so
  the blast radius of Tina disappearing is "you lose the editing UI," not "you lose your content."
- **Self-hosted anything (Strapi/Directus/Payload/Decap/Sveltia/Pages CMS)** — the only options with
  **no vendor pricing risk at all**. Your exposure moves to infrastructure pricing (Hetzner just
  raised prices 36% in April 2026 — €3.29 → €4.49 for CX22 — so even this isn't fixed, but a 36% rise
  on €3.29 is a rounding error compared to $0 → $35).

**The structural lesson:** the thing that burned us wasn't Strapi's price, it was depending on someone
else's *free* tier for production. Every free SaaS tier above is a marketing expense that can be cut.
Self-hosting converts that risk into a small, predictable, and portable bill.

---

## 6. URGENT: exporting everything from Strapi Cloud before 2026-09-01

### The critical constraint

**Strapi Cloud gives you no shell access and the Cloud CLI has no export command.** The Cloud CLI
(<https://docs.strapi.io/cloud/cli/cloud-cli>) supports only `login`, `link`, `deploy`, `projects`,
and `logout`. So you **cannot** run `strapi export` on the Cloud instance.

**The only supported path is `strapi transfer --from`**, run from a local Strapi instance, pulling the
remote Cloud instance's data down. Source: <https://docs.strapi.io/cms/data-management/transfer>

`strapi transfer` uses **strict schema matching** — "your two Strapi instances need to be exact copies
of each other except for the contained data." Our local `strapi/` directory is that copy, provided it
is on the same Strapi version and the same schema as what's deployed.

### Runbook

**Step 0 — verify local matches Cloud.** Confirm the local `strapi/` checkout is the exact commit
deployed to Strapi Cloud and that `@strapi/strapi` matches the Cloud version (currently 5.30.1).
A schema mismatch aborts the transfer.

**Step 1 — create a transfer token in the Strapi Cloud admin panel.**
Log into the Cloud project's admin panel and find **Transfer Tokens** under **Settings → Global
settings**, alongside API Tokens (the transfer docs say tokens "are managed from the admin panel" with
`view`/`create`/`read`/`regenerate`/`delete` RBAC permissions, and point at the User Guide for the
exact path — confirm the menu location in the panel). Create a token with Pull permissions at minimum.
Copy it immediately — like API tokens, transfer tokens are only viewable once unless
`admin.secrets.encryptionKey` is configured (<https://docs.strapi.io/cms/features/api-tokens>).

Prerequisite per the transfer docs: "A salt transfer token should be defined in the admin panel
configuration file" — i.e. `TRANSFER_TOKEN_SALT`. Strapi Cloud provisions this automatically for
Cloud projects. **Your local instance needs its own `TRANSFER_TOKEN_SALT` in `.env`** or local token
handling will fail.

**Step 2 — prepare and start the local destination.**

```bash
cd strapi
npm install
# ensure .env has APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT, JWT_SECRET
npm run build
npm run start
```

Leave it running. Default local DB is SQLite in `.tmp/`.

**Step 3 — pull everything from Cloud.** In a second terminal, from the local project root:

```bash
cd strapi
npm run strapi -- transfer \
  --from https://YOUR-PROJECT.strapiapp.com/admin \
  --from-token "$STRAPI_CLOUD_TRANSFER_TOKEN" \
  --force \
  --verbose
```

- `--from` must be the **full URL including `/admin`**.
- Default transfer includes **content (entities + relations), files (assets), project configuration,
  and schemas**. Don't pass `--only` or `--exclude` — you want all of it.
- `--force` skips the destructive-action prompt. It wipes the **local** database, which is what you
  want. Omit it the first time if you'd rather read the prompt.
- Progress, per-stage timing, and an ETA print live.

**Step 4 — verify before you trust it.** Open `http://localhost:1337/admin`, register an admin user,
and confirm:

- 5 Posts and 5 Programs, each **published** (draft/publish state survives the transfer)
- every `body` dynamic zone has its blocks **in the right order** with the right component types
- the Media Library has every image **and every video**, and files actually load
- `author` relations resolve — but see the gotcha below

**Step 5 — take a portable, off-Strapi backup too.** Once local has the data, snapshot it in a
format that isn't Strapi-specific, so you keep options open:

```bash
# encrypted, compressed archive — the belt-and-braces backup
npm run strapi -- export --file strapi-cloud-backup-20260811

# plain, inspectable, diffable directory — your migration source of truth
npm run strapi -- export --format dir --no-encrypt -f strapi-cloud-export
```

The directory form (Strapi ≥ 5.42.0) writes `metadata.json`, `schemas/`, `entities/`, `links/`,
`configuration/`, and `assets/`, with one JSON record per line in the `.jsonl` files. Store both
somewhere outside the repo (R2, external drive) — the archive is your disaster recovery, the directory
is what any future migration script reads.
Sources: <https://docs.strapi.io/cms/data-management/export>, <https://docs.strapi.io/cms/data-management/import>

**Step 6 — deploy the self-hosted instance, then push to it.** Once the new server is up with its
admin built and a transfer token created there, either `strapi import -f` the archive, or push
directly:

```bash
npm run strapi -- transfer --to https://cms.alpenglowguiding.com/admin \
  --to-token "$NEW_TRANSFER_TOKEN" --force
```

**Step 7 — do not delete the Cloud project until the new instance is serving production traffic.**
You have until 2026-09-01 to roll back. Upgrading to Starter ($35 for one month) is a legitimate
emergency escape hatch if the migration slips.

### Gotchas, specifically

1. **Admin users and API tokens are never transferred or exported.** You will re-register the admin
   account and re-issue the API token that Astro uses. **Update the Astro/Cloudflare Workers secret.**
2. **`createdBy` / `updatedBy` come back empty** after a restore, because the admin users table isn't
   included.
3. **The `author` relation targets `plugin::users-permissions.user`**, which is a *content* user, not
   an admin user — so it *should* transfer. Verify explicitly; if the author was modelled as an admin
   user it will be lost.
4. **`transfer` deletes the destination.** The prompt reads: "The transfer will delete all of the
   remote Strapi assets and its database." When pulling, the destination is your local instance — fine.
   Never point `--to` at something you care about without reading the prompt.
5. **SQLite destinations block other DB connections during the transfer.** Don't run two things at once.
6. **Websockets/Socket.io break `transfer`.** Not applicable to this project, but if the transfer fails
   inexplicably, this is on the known-issues list.
7. **Cloud storage deletion hazard on *import*:** if the destination uses a cloud upload provider
   (S3/R2/Cloudinary), `strapi import` may issue **delete API calls** for media records it removes
   first — "This affects all environments sharing the same cloud storage account." **Give the new
   self-hosted instance its own dedicated R2 bucket** and never point two environments at one bucket.
8. **Version drift.** `--exclude-content-types` / `--only-content-types` need Strapi ≥ 5.50.3, and
   `--format dir` needs ≥ 5.42.0. On 5.30.1 those flags don't exist — you don't need them for a full
   transfer, but if you want the directory export, upgrade locally first.
9. **Nginx/proxy header forwarding** breaks transfers if headers aren't passed through; the docs give
   an explicit `proxy_set_header` config. Relevant when you later push to your own server behind a
   reverse proxy.

---

## 7. Media hosting for a non-technical uploader

If the CMS hosts media itself (Strapi self-hosted with an S3 provider, Sanity, Prismic, Storyblok),
the owner just drags files into the CMS and nothing further is needed. This section is for the
git-based-CMS case, and for backing self-hosted Strapi's media.

### Cloudflare R2 — the right answer here

Source: <https://developers.cloudflare.com/r2/pricing/>

| | Standard storage |
| --- | --- |
| Storage | $0.015 / GB-month |
| Class A ops (writes/lists) | $4.50 / million |
| Class B ops (reads) | $0.36 / million |
| **Egress to Internet** | **Free** |

**Free tier: 10 GB-month storage, 1M Class A ops, 10M Class B ops, free egress.**

For ~10 documents with hero images and a few videos, **this site fits inside R2's free tier**, and
egress is free forever. Zero-cost, no bandwidth risk.

**Strapi wires up to R2 with the official S3 provider.** Strapi's maintained upload providers are
**Amazon S3**, **Cloudinary**, and **Local** (<https://docs.strapi.io/cms/features/media-library>);
the S3 provider works against R2's S3-compatible endpoint. Configure it in `config/plugins`. Keep
`Responsive friendly upload` on so Strapi keeps generating `small` (500px) / `medium` (750px) /
`large` (1000px) derivatives, and set `upload.config.sharp` conservatively on a small instance to hold
memory down.

### Cloudflare Images — probably not needed

Source: <https://developers.cloudflare.com/images/pricing/>

| Metric | Price |
| --- | --- |
| **Images Free plan** | **5,000 unique transformations / month, free** — works on images stored *outside* Images, e.g. in R2 |
| Images Transformed (Paid) | first 5,000 included, then **$0.50 / 1,000 unique transformations** |
| Images Stored (Paid only) | **$5 / 100,000 images stored / month** |
| Images Delivered (Paid only) | **$1 / 100,000 images delivered / month** |

Notes that matter: a "unique transformation" is one (image, parameter-set) pair per calendar month,
and repeat requests within the month are counted once. `format=auto` counts as **one** transformation
even when it serves AVIF to some visitors and WebP to others. Exceeding the free 5,000 doesn't bill
you — cached transformations keep serving and new ones return error `9422`.

**Does it make sense given we're already on Cloudflare Workers?**

- **Yes for transformations, on the free plan.** R2 + Images-Transformations is a natural pairing: the
  images live in R2 (free under 10 GB, free egress), and Cloudflare transforms them at the edge on the
  same network the Worker already runs on. With ~10 documents × a handful of sizes each, we're in the
  low hundreds of unique transformations per month — nowhere near 5,000. Cloudflare's own worked
  example puts 5,000 R2 images serving 2,000 of them at five sizes each at **$2.72/month total**;
  we're an order of magnitude smaller than that, so **$0**.
- **No for Images storage.** "Images Stored" and "Images Delivered" are Paid-plan-only and would add
  a minimum $5/mo for storage we're already getting free from R2. Store in R2, transform with Images.
- **And arguably not needed at all**, because self-hosted Strapi already generates responsive
  derivatives on upload via sharp. Cloudflare Images Transformations is the better long-term answer
  (on-demand sizes, AVIF/WebP negotiation, no CPU on our tiny box), but it's an optimization, not a
  requirement.

### Backblaze B2 — not evaluated in detail

**B2's 2026 prices were not verified in this pass.** It's not worth pursuing: B2 charges for egress
beyond a free allowance, whereas R2's egress is unconditionally free and we're already on Cloudflare.
R2 wins on both price and proximity.

---

## 8. Recommendation

### Primary: self-host the existing Strapi 5 app on Hetzner — ~€4.49/month

Hetzner CX22 (2 vCPU / **4 GB RAM** / 40 GB SSD, €4.49/mo cap), PostgreSQL 17 in Docker on the same
box, Cloudflare R2 for media via Strapi's official S3 provider (free tier), Coolify or plain
`docker compose` + Caddy for deploys, nightly `pg_dump` + media sync to R2.

Why this wins:

- **Zero migration.** Same app, same schema, same dynamic zones, same admin UI the owner already
  knows, same Astro fetch code. `strapi transfer` moves the data with a first-party, documented tool.
  Every other option on this list requires rebuilding the content model and rewriting the frontend
  data layer.
- **Hits the ideal budget band** (~$5/mo) while meeting Strapi's *recommended* 4 GB spec, not just the
  2 GB minimum — which matters because the admin build is the documented memory hazard.
- **No vendor free-tier risk.** This is the actual lesson of the Strapi Cloud experience.
- **Always-on**, so SSR-on-Workers per-request fetches don't hit cold starts — better than both
  scale-to-zero platforms *and* Strapi Cloud's own Starter tier, which sleeps when idle.

The cost is operational: OS patching, Strapi upgrades, and owning your backups. For a site with ~10
documents and low edit frequency, that's a couple of hours of setup and a monthly `apt upgrade`.
Build the admin panel in CI or locally and ship `dist/` if the 4 GB box struggles.

### If you'd rather not run a server: Sanity Free ($0), or Prismic ($0–10/mo)

- **Sanity** if you want the most durable free tier and the least rich-text lock-in (Portable Text is
  an open spec), plus the only *official* Astro integration among the SaaS options. Budget a migration
  script mapping Strapi `blocks` → Portable Text; `sanity datasets import` can pull assets straight
  from the old Strapi Cloud URLs via `image@https://…`. Accept that free datasets are public and that
  the free plan has no Editor role.
- **Prismic** if the editor experience is the top priority and you want the closest structural match —
  Slices *are* dynamic zones, the Migration API is on the free plan, and the pricing ladder
  ($0 → $10 → $25) has no cliff. Plan on **$10/mo Starter** since Free is a single user.

### Explicitly ruled out

DatoCMS (200 MB free storage; €199/mo next tier) · Contentful (fine free tier, $300/mo cliff) ·
Hygraph ($199/mo cliff, 50 MB asset cap) · Storyblok ($99/mo cliff, 1 seat, 2,000 assets) ·
Payload Cloud (closed to new projects) · Directus Cloud ($99/mo add-on, $499/mo tier) ·
CloudCannon ($55/mo, no free tier) · Webiny (AWS stack, $79/mo commercial) ·
Front Matter CMS (VS Code extension, not a hosted UI) · Contentstack and Builder.io Pro/Team
(**no verifiable 2026 price**) · Fly Managed Postgres ($38/mo) · Neon and Supabase paid Postgres
($19–25/mo, more than the rest of the stack combined).

### Unverified claims in this document

Flagged inline, collected here for honesty:

- **Hetzner CX22 €4.49 / CPX11 €5.49** — from Hetzner's price-adjustment doc via web.archive.org plus
  third-party corroboration; hetzner.com renders prices in JavaScript and returned none on fetch.
  **Confirm on hetzner.com before purchase.**
- **Prismic month-to-month rate** — the page quotes $10/mo "paid annually" and I could not resolve the
  monthly-billing figure.
- **TinaCMS Team monthly price** — the plan card says $24/mo, the comparison table says $29/month.
- **Coolify Cloud pricing** — not fetched. Coolify self-hosted is free and open source.
- **Contentstack** — publishes no numeric pricing.
- **Builder.io Pro/Team** — prices did not render.
- **DigitalOcean droplet prices** — not fetched.
- **Backblaze B2 2026 prices** — not fetched.
- **USD/EUR conversions** — Hetzner and DatoCMS price in EUR; I have not applied an FX rate.
