# Sam's Aquarium website

A twelve-page static site for Sam's Aquarium, 15 Lawrence Street, Main Road, Bergvliet, Cape Town. Plain HTML, CSS and JavaScript. No build step, no framework, no database. Upload the folder to any web host and it works.

## Pages

| File | Page | Job |
|---|---|---|
| `index.html` | Home | The hero, the wall of tanks, Sam's since 1985, the online shop in three steps, kit, reviews, calls to action |
| `fish.html` | In the tanks | Freshwater livestock range by category, with WhatsApp asks per category |
| `aquariums.html` | Tanks & kit | Aquariums, filtration, lighting, heating, marine equipment, sourcing |
| `start.html` | Your first tank | Beginner's guide, shopping list, FAQ (with FAQ structured data for Google) |
| `about.html` | About | Since 1985, the staff, the macaw, how the shop sells fish |
| `visit.html` | Visit | Live open/closed status, hours, map, directions, contact |
| `guides.html` | Guides | Hub for the six guides below |
| `cycling.html` | Cycling a new tank | The nitrogen cycle, fishless cycling, speeding it up, when it is ready |
| `water.html` | Water | Weekly routine, tests, target numbers, Cape Town tap water, temperature |
| `stocking.html` | Choosing fish | How many, schooling, temperaments, fish that outgrow tanks, example communities |
| `plants.html` | Live plants | Easy plants, light, feeding, CO2, planting, algae |
| `problems.html` | Common problems | Cloudy water, algae, gasping, white spot, fin rot, losses, power cuts |

Shared files: `assets/css/site.css`, `assets/js/site.js`, `assets/img/*.webp`.

## Set the WhatsApp number (do this first)

Open `assets/js/site.js` and change one line near the top:

```js
var WHATSAPP_NUMBER = '27682265378';
```

Country code first, digits only, no plus sign or spaces. It is set to the shop's WhatsApp Business line, +27 68 226 5378, which the shop gave on 23 September 2026. Every WhatsApp button and link on the site is built from this number, so it only needs to change here.

## Set the online shop address

The home page "Shop online" section uses a photo of the shop's back wall as the menu: each shelf label opens that category in the online shop. Every shop link is built from two lines near the top of `assets/js/site.js`:

```js
var SHOP_URL = 'https://shop.samsaquarium.co.za/';
var SHOP_CATEGORY_PATH = 'collections/';
```

Set `SHOP_URL` to the shop's real address, and `SHOP_CATEGORY_PATH` to match the platform (`collections/` on Shopify, `product-category/` on WooCommerce). The shelf labels use these category names, which should match the categories set up in the shop: `filters`, `pumps`, `water-care`, `food`, `test-kits`, `marine`, `lighting`. To rename one, change its `data-shop` value and label in `index.html`.

Each shelf's position on the photo is set in percentages in its `style` attribute (`--l`, `--t`, `--w`, `--h` for the shelf, `--tx`, `--ty` for the label), so it stays in place at any screen size. If the photo is replaced, those numbers need redoing.

## Link previews

When a page is shared on WhatsApp, Facebook, X or iMessage, the preview shows a 1200 by 630 card: the SAMS AQUARIUM wordmark in the sign's colours over one of the shop's photos, with the page title. Each page has its own card in `assets/img/share/`, named after the page (`index.jpg`, `fish.jpg` and so on), all JPEGs under 300 KB so WhatsApp shows them. To change a card, replace the file with any 1200 by 630 JPEG of the same name.

The preview tags (`og:url` and `og:image`) use the address the site is live on now, `https://skyeh01.github.io/sams-aquarium/`, because the apps fetch the preview from that address. **When the site moves to samsaquarium.co.za,** find and replace `https://skyeh01.github.io/sams-aquarium/` with `https://samsaquarium.co.za/` in every `.html` file.

Apps remember a preview once a link has been shared. After changing a card, refresh Facebook's copy with the Sharing Debugger (developers.facebook.com/tools/debug, then "Scrape Again"). WhatsApp keeps its own copy for a while; adding `?v=2` to the end of the link makes it fetch a fresh one.

## Campaign links for WhatsApp promotions

Every WhatsApp button already carries a pre-written message that matches its page ("What fish do you have in stock this week?", "Can you source this for me?", and so on). To attribute messages to a specific ad, post or promotion, add `?c=` and a short campaign name to any page link:

```
https://samsaquarium.co.za/fish.html?c=betta-weekend
https://samsaquarium.co.za/aquariums.html?c=juwel-rio-promo
https://samsaquarium.co.za/?utm_campaign=spring-plants
```

Every WhatsApp message the visitor sends from that visit will start with `[betta-weekend]`, so the shop can see where each enquiry came from and reply accordingly. The tag survives navigation between pages for that browser session. `utm_campaign` works the same way, so existing ad-tracking links need no changes.

To change the pre-written message on any button, edit its `data-wa` attribute in the HTML.

## Hours

Opening hours live in two places and must match:

1. `assets/js/site.js`, the `HOURS` object (drives the live "Open now / Closed" indicator in South African time)
2. The hours lists in each page footer and the table on `visit.html`

Also in the structured data block at the top of `index.html`.

## Content to confirm with the shop before going live

The site was written from public sources (the old website, Google Business Profile, Google reviews, photos of the signage). These points should be checked:

- **WhatsApp number.** Confirmed: +27 68 226 5378 (WhatsApp Business), wired into `assets/js/site.js`.
- **Online shop.** The shop has chosen an integrated online shop. Its address is a placeholder, `https://shop.samsaquarium.co.za/`, set once as `SHOP_URL` in `assets/js/site.js` (see "Set the online shop address" below). The same section says orders can be collected or delivered in the Southern Suburbs. Confirm this before launch. Live fish are not delivered (the shop does not deliver fish); the same step says so and offers to set fish aside for collection instead.
- **Photos from the old shop.** The Red Sea reef display photo was from the shop's previous premises and has been replaced on the home page and `aquariums.html`. Two more photos show the same interior (the red pillar, the pegboard of accessories and the white reef cabinet): `shop-interior.webp`, the banner on `aquariums.html`, and `macaw-reef.webp` on `about.html`. Google dates the macaw photo October 2021, after the move to the Caversham Centre, so these may be the current shop after all. The coral close-ups on `aquariums.html` may be from the same tank. Confirm with the shop.
- **The tank wall photo.** `tank-wall.webp` was an old photo. It has been replaced on the About band and the `fish.html` and `guides.html` banners by `tank-racks-2024.webp`, the cover frame of a customer's video on the Google Business Profile (May 2024) showing the racks against the current shop's blue wall.
- **Customer photos.** Some Google Business Profile photos are customers' own tanks at home, not the shop: `nano-planted.webp` (May 2025), `nano-tank-2.webp` (Sep 2025) and `desk-tank.webp` (Oct 2025). Their captions describe the tanks without saying where they are, but the footer line about the shop's own photographs does not strictly cover them. Swap them for shop photos, or ask the customers, before launch.
- **"Established 1985"** is taken from the current shop sign. Confirm the year.
- **The 2021 move.** A sign in one shop photo reads "Sams will be swimming to Caversham Centre February 2021", so the About page says the shop moved to the Caversham Centre in 2021. Confirm the date and where the shop was before.
- **Species lists** on `fish.html` are the typical range for a shop this size, not a live stock list. Remove anything the shop never carries and add regulars that are missing.
- **Photo captions** name species as they appear (angelfish, platies, gold gouramis, yellow labs, oranda). Correct any that are wrong.
- **Brands** named: Juwel, Red Sea, Fluval, Sera, Tetra, Sobo (all visible in shop photos or signage). Add or remove as needed.
- **"Best price guaranteed on Juwel"** comes from the old website. Confirm it still stands.
- **"The largest freshwater fish and aquarium supplier in Cape Town"** (home page, About page and its meta description). The shop's own 2015 About page says it is "arguably the largest supplier of aquariums … in Cape Town". The Advertising Regulatory Board expects proof on file for any claim that can be checked, so confirm the shop is happy to state it without "arguably".
- **Promises made on the shop's behalf:** no deposit needed to reserve fish (`fish.html`), most WhatsApp questions answered the same day (`visit.html`), and new stock announced on WhatsApp before anywhere else (`index.html`). Confirm the shop will keep all three.
- **A repeated review.** Emily N.'s review (the shout-out to Wade) appears on both the home and About pages. Ask the shop for another review to use on About.
- **Juwel and Red Sea range names** (Rio, Lido, Vision, Trigon; Reefer, Max) are the manufacturers' current ranges. Check they match what's on the floor.
- **The macaw.** The site says "ask the staff for the name". Add the name if the shop would like it on the site.
- **Staff.** No names are used except "Wade", quoted from a public Google review. Add a team section with photos if they'd like one.
- **Location description** on `visit.html` ("Caversham Centre, a few minutes from the M3 and Ladies Mile"). Confirm the wording.
- **Reviews** are quoted verbatim from public Google reviews with first name and initial. Swap for any the shop prefers.
- **Review topic counts** ("helpful staff 160" and so on) were read from Google's own review summary on 19 September 2026. Update occasionally.
- **The old website's About page** lists different hours (Mon–Fri 8 to 6, Sat 8 to 5, Sun 8 to 4) from its home page and Google. The site uses the Google Business Profile hours.

## How the copy is written

The site has one voice: **plain and direct.** Say what the shop sells, where it is, and what to do next, in short sentences. If a new page or a promotion is written later, these are the rules it should follow so everything still sounds like the same shop.

**1. No personality copy.** Don't give fish, tanks, shelves or the macaw a personality ("firm opinions", "a tank that forgives a missed water change"). No jokes, wordplay or rhetorical set-ups ("What's changed... What hasn't"), and no mood lines about how a tank will make someone feel. Tape captions describe the photo in two or three words ("Netting fish", "Nano tanks").

**2. Lead with what the customer gets.** Describe the product or service and the next step. Don't open with what can go wrong.

**3. Never define the shop against somebody else.** No "not like the chain stores", no "unlike online". Say what Sam's does. Watch for the "X, not Y" sentence shape in particular.

**4. Offer advice, don't issue it.** "Ask us what size suits the fish you want" rather than "Ask us before you fall for one."

**5. Don't end paragraphs on a zinger.** Let sentences finish plainly.

**6. Say what to do rather than what to avoid.** "Feeding lightly keeps the water cleaner" rather than "overfeeding is the most common mistake we see."

**7. One idea per sentence.** Keep sentences short and cut filler. If a sentence could be deleted without losing a fact or an instruction, delete it.

**8. Use contractions everywhere, the guides included.** "It's", "we'll" and "you're" sound like someone at the counter; "it is", "we will" and "you are" sound like a textbook.

**9. Only say what the shop has confirmed about itself.** No invented habits ("the question we answer most days"), staff details or superlatives. If a line can't be checked, describe the service instead.

**House style.** Display headings (the large section headings) end with a full stop; short labels ("Where", "When") and the headings inside a guide don't. Write "Open 7 days a week" in figures. Say "load shedding" rather than only "power cut", since it's the phrase South Africans use and search for. British spelling throughout: colour, centre, litres, fertiliser.

**Words and phrases to keep off the site:** straight answers (implies others lie), honest (same), actually, obviously, of course, simply, just (as in "just do X"), mistake, wrong, fail, die, kill, suffer, waste, don't, never, avoid, "fewer than you think", "more than you'd expect" as a scold, and anything that begins "most people don't realise".

The list applies to marketing and sales copy. The guides may name a real risk once, calmly, and follow it straight away with what to do: "ammonia is poisonous to fish even at low levels", or "this needs attention today" for a fish gasping at the surface. Literal uses are fine too, such as fish waste or "just as forgiving".

## Typography

- **Archivo** sets the headings. It echoes the bold lettering on the shop sign. It is deliberately held at a moderate width and weight (800, width 104-106); pushed wider and heavier it starts to shout, which works against the voice above.
- **Source Sans 3** sets all body text. It is a humanist face, which means slightly open, handwritten-derived letterforms that read as friendlier than a geometric or grotesque face over a paragraph.
- **Caveat** is used only for the masking-tape labels, which copy the real hand-written labels on the shop's tanks.

All three load from Google Fonts in one request per page.

## Photos

All photos in `assets/img/` were downloaded from the shop's public Google Business Profile photo gallery (uploaded by the shop and by customers), resized to web sizes, and saved as WebP. `assets/img/credits.json` maps each file back to its source. Customer-uploaded photos on a Business Profile are licensed to Google and the business under Google's terms; if the shop wants to be strict, replace any customer-uploaded shots with their own. No photo with a recognisable face or child was used.

Photos of the old website (2015) were deliberately not reused.

**The home page hero** (`assets/img/hero.webp`) is the one exception: a stock photograph of a school of orange fish from Pexels (photo 8838011), used under the Pexels licence (free for commercial use, no attribution required). None of the shop's own photographs had the resolution or lighting to carry a full-width headline. Two alternates are in the same folder, `hero-alt-betta.webp` and `hero-alt-discus.webp`; to swap, change the `src` on the hero `<img>` in `index.html`. Because of this one image, the footer says the photographs of the shop and its tanks are the shop's own, rather than claiming every photo was taken there.

## Design notes

- **The wordmark** is the shop's sign set in type: SAMS in the sign's orange, AQUARIUM in its blue, in Archivo at a wide width. There is no logo image on the site; the wordmark is text, so it stays sharp at any size and is one line of CSS to recolour.
- **Palette** comes from the shop: deep tank-water teal for dark sections, pale aqua-white for light ones, and the orange and blue of the sign on Main Road. WhatsApp green appears only on WhatsApp actions.
- **Type** is covered under Typography above.
- **The wall** on the home page is two rows of the shop's tanks at one height, widths following the photographs, with the fish names on tape like the labels in the shop. As the page scrolls the top row slides left and the bottom row slides right; the moment someone swipes or scrolls a row by hand, that row is theirs. Hovering a tank shows its category; the whole tank links to that category on the fish page. To change a tank, edit its photo, label and category in the wall block in `index.html`.
- **The home hero** puts the words beside the photograph rather than over it: text on the pale ground on the left, the photo uncovered on the right, the photo above the words on a phone. No overlays, no canvas, no animation on it beyond a gentle parallax.
- **Buttons** are solid and square-cornered with no glow and no hover lift. WhatsApp green is used only for WhatsApp actions.
- **Parallax** is applied to hero images and the full-width photo bands, and switched off for reduced motion.
- **Tanks** (the framed photos) are drawn like the shop's aquariums, with a black lid and base trim. Their tape labels are stuck on as they scroll into view, one after another along a wall. Once.
- **Other motion:** the review chart's bars grow and its counts count up; the mobile menu items arrive one after another; pages fade between each other. There is deliberately no fade-in or slide-in on sections. All of it is off under reduced motion and needs no JavaScript to read the page.
- Fonts load from Google Fonts. If the site must work offline, download Archivo, Source Sans 3 and Caveat and replace the `<link>` in each page's `<head>`.

## Hosting

Any static host works: the current cPanel/WordPress host (upload to `public_html`, replacing or alongside WordPress), Netlify, Cloudflare Pages, GitHub Pages, Vercel. There is nothing to install. `sitemap.xml` and `robots.txt` are included; submit the sitemap in Google Search Console after launch.

If it replaces the WordPress site, the old URLs (`/about-sams-aquarium/`, `/our-products/`, `/gallery/`) should redirect to `about.html`, `aquariums.html` and `fish.html` respectively.

## The guides

Six guides live under `guides.html`, each with a sticky side panel (reading time, contents, key numbers, a WhatsApp button) and a "More guides" strip at the end. They carry Article structured data for search engines. Two claims in them should be confirmed by the shop before launch: that Cape Town's tap water is generally soft with low carbonate hardness (in `water.html`), and that the shop can sometimes supply mature filter media to seed a new tank (in `cycling.html`). Both are true in general and worth stating, but the shop should be comfortable with them.

To add a guide, copy any guide page, change the title, description, canonical, hero, contents list, key numbers and body, add a card for it on `guides.html`, and add it to `sitemap.xml`.

## Adding a page

Copy any inner page (for example `visit.html`), keep the `<header>`, `.menu`, `<footer>` and `.wa-float` blocks, change the `<title>`, description, canonical URL and content, and add the page to the navigation lists on every page and to `sitemap.xml`.
