# BrickAndMotorLabs — Social Kit

Ready-to-use images and copy for Facebook + Instagram. You create the accounts (Meta requires owner verification); everything else here is plug-and-play.

## What's in `img/`
| File | Use it for |
|---|---|
| `avatar-1080.png` | Profile photo on **both** Facebook and Instagram |
| `fb-cover-820x312.png` | Facebook page cover photo |
| `post-welcome-1080x1350.png` | Post #1 — "we're live" |
| `post-bazaar-1080x1350.png` | Post #2 + Facebook Event photo (Oct 10) |
| `post-ferris-1080x1350.png` | Post #3 + Facebook Event photo (Oct 17) |
| `post-kits-1080x1350.png` | Post #4 — product overview |
| `post-workshop-1080x1350.png` | Post #5 — schools/workshops |
| `event-cover-post-bazaar-1600x800.png` | FB Event 1 cover (Family Bazaar) |
| `event-cover-post-ferris-1600x800.png` | FB Event 2 cover (Ferris Wheel) |

## Status (as of 2026-09-09)
| Step | Status |
|---|---|
| 1. Facebook Page "Brick and Motor Labs" (avatar, cover, bio, category Retail shop) | **Done** |
| 1b. Facebook handle @brickandmotorlabs | **Done** (Settings → Page setup → General Page settings → Username) |
| 2. Instagram account, business type, avatar, bio, linked to the FB Page | **Done by owner** |
| 4. Two Facebook Events (Bazaar Oct 10, Ferris Wheel Oct 17) | **Done** (published, posters as cover photos) |
| 5. First-week posts (5, one per day at 10:00 AM ET) | **Done** (scheduled in FB Content Library, event posts tagged to their events) |
| 5b. Social links on website | **Done** (footer icons on all 24 pages + "Follow Us" row on contact page, commit 8b15d54) |
| 3. Meta Business Suite | **Optional, not set up** (the FB Professional dashboard already covers inbox + scheduling) |

## Original steps (for reference / to replicate on other pages)
1. **Facebook Page:** facebook.com/pages/create → name **"Brick and Motor Labs"** (Facebook rejects camelCase), category "Retail shop", then claim handle @brickandmotorlabs. Upload `avatar-1080.png` (profile) and `fb-cover-820x312.png` (cover). Paste the bio from `copy.md`.
2. **Instagram:** create **@brickandmotorlabs** (or switch an existing account to Business: Settings → Account type → Business). Upload `avatar-1080.png` as profile photo. Paste the IG bio from `copy.md`, link = brickandmotorlabs.com. In IG settings, **link it to your Facebook Page**.
3. **Meta Business Suite:** business.facebook.com → add your Page, Instagram and website. This is your dashboard: one inbox + free post scheduler.
4. **Create the two Facebook Events** (copy in `copy.md`) — do this first, it's your best free reach for October.
5. **Post week 1** following the schedule table in `copy.md` (upload image + paste caption).

**FB scheduling quirk:** the FB time picker runs on UTC; 10:00 AM ET (EDT) = 2:00 PM in the picker. Rescheduling an existing post: Content Library → row Actions (⋯) → "Reschedule post" (no delete/recreate needed).

## Managing from now on
- Schedule 1–2 posts/week in the FB Professional dashboard (Content → Content Library); reuse `copy.md` captions for future events (swap dates/venue).
- Short video clips of kits in action are the best-performing content — film builds at the events.
- Keep the handle identical on both platforms so people can find you easily.
- Ask your friend to add the brand colors/fonts to her Canva brand kit (values in `copy.md`) so any new designs match.

## Regenerating graphics
If you ever need a new size or edited text, the design source is in this session's history; ask the agent to rebuild from the `social/img` templates.
