# Car Rentals UI

Package: `@car-rentals/ui` · used by `web-admin`, `web-customers` and `web-providers`.

This package is the single home of the theme (colors, type, spacing, shapes) and the shared
components. Every app imports it, so a change here shows up in all three apps.

**See everything live:** run `task dev-uikit` and open **http://localhost:3020**
(source: `applications/ui-kit/`, local only). It renders every class and component below,
has a light/dark toggle, and copies a class name when you click its label.

Pages should only use the classes and components listed below. If you need something that
isn't here, add it to this package first; don't hard-code it in a page.

---

## 1. How it is wired

```
packages/ui-package/src/styles.css   ← all tokens + reusable classes (edit theme here)
          ▲
applications/<app>/app/globals.css   ← @import "tailwindcss"; @import "@car-rentals/ui/styles.css";
          ▲
applications/<app>/app/layout.tsx    ← imports globals.css, sets <html data-theme="light|dark">
```

- **Theme switch:** `THEME=dark task dev` (or `NEXT_PUBLIC_THEME=dark`). It sets `data-theme` on `<html>`.
- **Components:** `import { Button, Badge, Card, DataTable, ZoneLink, cn } from "@car-rentals/ui";`

### Golden rules

1. Use **role** colors (`bg-primary`, `text-muted-foreground`), never palette colors (`bg-blue-600`, `#1d4ed8`).
2. Every background role has a matching `-foreground` text color. Use them together, or use the `tone-*` class that sets both.
3. Don't write `dark:` classes for colors. The role colors already switch in dark mode.
4. Use the type classes (`text-h1` … `text-caption`) instead of `text-3xl md:text-5xl`. They scale with the screen on their own.
5. Wrap pages in `container`. Use `auto-grid` for card lists. Don't set fixed pixel widths on layout boxes.

---

## 2. Colors

All color classes work with any Tailwind color prefix: `bg-`, `text-`, `border-`, `outline-`, `ring-`, `fill-`, `stroke-`, `divide-`.

### Roles

| Role | Background class | Text on it | Use for |
|---|---|---|---|
| background | `bg-background` | `text-foreground` | Page background and main text |
| surface | `bg-surface` | `text-surface-foreground` | Cards, panels, dialogs, menus |
| muted | `bg-muted` | `text-muted-foreground` | Quiet sections, disabled areas, secondary text |
| primary | `bg-primary` / `hover:bg-primary-hover` | `text-primary-foreground` | Main action, selected state, brand moments |
| primary-subtle | `bg-primary-subtle` | `text-primary-subtle-foreground` | Light brand tint: hover on light buttons, highlights |
| secondary | `bg-secondary` / `hover:bg-secondary-hover` | `text-secondary-foreground` | Less important actions |
| accent (gold) | `bg-accent` / `hover:bg-accent-hover` | `text-accent-foreground` | Offers, "Book now", premium cars. Use sparingly |
| success | `bg-success` | `text-success-foreground` | Confirmed, active, paid |
| success-subtle | `bg-success-subtle` | `text-success-subtle-foreground` | Success badges and banners |
| warning | `bg-warning` | `text-warning-foreground` | Needs attention, pending |
| warning-subtle | `bg-warning-subtle` | `text-warning-subtle-foreground` | Warning badges and banners |
| danger | `bg-danger` / `hover:bg-danger-hover` | `text-danger-foreground` | Delete, cancel booking, errors |
| danger-subtle | `bg-danger-subtle` | `text-danger-subtle-foreground` | Error badges and banners |
| highlight (pink) | `bg-highlight` / `hover:bg-highlight-hover` | `text-highlight-foreground` | Promotions, "Hot deal", app download |
| highlight-subtle | `bg-highlight-subtle` | `text-highlight-subtle-foreground` | Promo badges and banners |
| strong (navy) | `bg-strong` | `text-strong-foreground` | Header bar, hero band |
| deep (indigo) | `bg-deep` / `hover:bg-deep-hover` | `text-deep-foreground` | Footer, secondary dark bands |
| info (bright blue) | `bg-info` | `text-info-foreground` | Info banners, "Free cancellation" |
| info-subtle | `bg-info-subtle` | `text-info-subtle-foreground` | Info badges and notes |
| callout (orange) | `bg-callout` | `text-callout-foreground` | Urgency: "Only 2 left", "Ends tonight" |
| callout-subtle | `bg-callout-subtle` | `text-callout-subtle-foreground` | Urgency badges |
| sky | `bg-sky` | `text-sky-foreground` | Soft section background, maps, illustrations |
| rating (yellow) | `bg-rating` | `text-rating-foreground` | Stars and review scores |

The last ten roles were added from two reference sites: pink, indigo and sky from GO Rentals
(gorentals.co.nz), and navy, bright blue, orange and yellow from Booking.com cars. Their exact
hex values are in `styles.css` section 1, each marked with its source. A few dark-mode shades
are marked "derived" because the sites don't define them.

### Lines, focus and links

| Class | Use for |
|---|---|
| `border-border` | Card edges, dividers, table lines |
| `border-input` | Form field borders |
| `outline-ring` / `ring-ring` | Focus outline (already applied to all elements by default) |
| `text-link` | Inline links (or use the `link` class) |
| `bg-skeleton` | Loading placeholder color (or use the `skeleton` class) |
| `bg-table-header`, `bg-table-hover`, `bg-table-stripe`, `border-table-border` | Used by `DataTable`; reuse for table-like lists |

### Color pairs (one class = background + matching text)

| Class | Looks like |
|---|---|
| `tone-primary` | Blue background, white text |
| `tone-secondary` | Light grey background, dark text |
| `tone-accent` | Gold background, dark brown text |
| `tone-muted` | Light grey background, grey text |
| `tone-surface` | Card color with its text color |
| `tone-success` | Green background, white text |
| `tone-warning` | Amber background, dark brown text |
| `tone-danger` | Red background, white text |
| `tone-highlight` | Pink background, white text |
| `tone-strong` | Navy background, white text |
| `tone-deep` | Indigo background, white text |
| `tone-info` | Bright blue background, white text |
| `tone-callout` | Orange background, dark text |
| `tone-sky` | Sky background, navy text |
| `tone-rating` | Yellow background, dark text |

```tsx
<div className="tone-accent rounded-card p-gutter">Weekend offer: 20% off SUVs</div>
```

---

## 3. Typography

Sizes are **fluid**: they grow smoothly between phone and desktop with no breakpoints.
Plain `<h1>`–`<h4>` and `<body>` already use them, so you only need a class to make
one element look like another (for example a `<p>` styled as a heading).

| Class | Phone → desktop | Weight | Use for |
|---|---|---|---|
| `text-display` | 40 → 72px | 800 | Landing-page hero only |
| `text-h1` | 32 → 56px | 700 | Page title (one per page) |
| `text-h2` | 24 → 40px | 700 | Section titles |
| `text-h3` | 20 → 28px | 600 | Card titles, sub-sections |
| `text-h4` | 18 → 22px | 600 | Small headings, dialog titles |
| `text-body-lg` | 17 → 20px | 400 | Intro paragraphs |
| `text-body` | 15 → 16px | 400 | Default text (already on `<body>`) |
| `text-small` | 14px | 400 | Table cells, buttons, helper text |
| `text-caption` | 12px | 400 | Badges, timestamps, footnotes |

Fonts: `font-sans` (Geist, the default) and `font-mono` (Geist Mono, for booking IDs and codes).
Headings get `text-wrap: balance` and paragraphs get `text-wrap: pretty` automatically.

---

## 4. Layout and spacing

| Class | What it does |
|---|---|
| `container` | Full width up to 80rem (1280px), centered, side padding that grows with the screen. Put it on every page wrapper. |
| `section` | Vertical padding between big page sections (48 → 96px). |
| `stack` | Vertical flex column with `gap-gutter` between children. |
| `auto-grid` | Grid that fits as many 16rem (256px) columns as there is room for. One column on phones. Change the minimum with `[--auto-grid-min:20rem]`. |
| `p-gutter`, `px-gutter`, `gap-gutter`, `m-gutter` … | Fluid spacing step (16 → 32px). Use it for card padding and grid gaps. |
| `py-section`, `mt-section` … | Fluid spacing step (48 → 96px) between sections. |
| `xs:` `sm:` `md:` `lg:` `xl:` `2xl:` | Breakpoints at 480 / 640 / 768 / 1024 / 1280 / 1536px, mobile-first. |

Normal Tailwind spacing (`p-4`, `gap-2`, `mt-6` …) is fine for small, fixed gaps inside components.

```tsx
<main className="container section stack">
  <h1>Available cars</h1>
  <div className="auto-grid">
    <Card>…</Card>
    <Card>…</Card>
  </div>
</main>
```

**Rules that keep pages from breaking:**

- Give flex and grid children that hold text `min-w-0` (`Card` already has it).
- Wrap wide tables in `overflow-x-auto` (`DataTable` already does).
- Never use a fixed `w-[1200px]`. Use `w-full max-w-…` instead.
- Long emails and URLs wrap automatically (`overflow-wrap` is set on `<body>`).

---

## 5. Shape and elevation

| Class | Value | Use for |
|---|---|---|
| `rounded-control` | 8px | Buttons, inputs, small tiles |
| `rounded-card` | 12px | Cards, panels, tables, dialogs |
| `rounded-full` | pill | Badges, avatars |
| `shadow-card` | soft | Cards that sit on the page |
| `shadow-overlay` | strong | Dropdowns, popovers, dialogs |
| `ease-standard` | curve | Transitions: `transition-colors duration-200 ease-standard` |

---

## 6. Forms

| Class | Put it on |
|---|---|
| `field` | `<input>`, `<select>`, `<textarea>`. Covers the border, focus ring, disabled state, and a red border when `aria-invalid="true"`. Text is 16px so iPhones don't zoom in. |
| `label` | `<label>` above a field |
| `hint` | Helper text under a field |
| `error-text` | Error message under a field |

```tsx
<div>
  <label className="label" htmlFor="pickup">Pickup city</label>
  <input id="pickup" className="field" aria-invalid={!!error} aria-describedby="pickup-msg" />
  {error
    ? <p id="pickup-msg" className="error-text">{error}</p>
    : <p id="pickup-msg" className="hint">We'll show cars near this city.</p>}
</div>
```

---

## 7. Other utilities

| Class | What it does |
|---|---|
| `link` | Brand-colored inline link that underlines on hover |
| `skeleton` | Pulsing loading block: `<div className="skeleton h-4 w-40" />` |

### Effects (`fx-`)

Ready-made animations and text effects. You can see each one live in the **Effects** section of
the UI Kit app. They all stop automatically for users who turn on "reduce motion" in their OS.

**Buttons and surfaces**

| Class | What it does | Good for |
|---|---|---|
| `fx-glow` | Soft glow that pulses forever | The one main CTA on a page |
| `fx-glow-hover` | Glow only on hover or keyboard focus | Secondary CTAs |
| `fx-shine` | A light sweep crosses the element every 3s | Offer and premium buttons |
| `fx-shine-hover` | One light sweep when hovered | Buttons, cards |
| `fx-pulse-ring` | Ring expands outward, like a radar ping | Live dot, "new" indicator |
| `fx-press` | Shrinks slightly while pressed | Any button |
| `fx-lift` | Rises with a bigger shadow on hover | Clickable cards |
| `fx-gradient-border` | Moving brand-gradient border (add your own `rounded-*`) | Featured or premium card |
| `fx-float` | Gentle up-and-down movement | Car images, illustrations |

**Entrance and one-shot** (play once when the element appears)

| Class | What it does |
|---|---|
| `fx-fade-in` | Fades in |
| `fx-fade-up` | Fades in while moving up |
| `fx-scale-in` | Fades in while growing (dialogs, popovers) |
| `fx-shake` | Shakes once (wrong input). To play it again, re-render the element with a new `key`. |

**Text**

| Class | What it does |
|---|---|
| `fx-text-gradient` | Brand gradient text (primary → pink). Change the ends with `[--fx-from:var(--deep)] [--fx-to:var(--info)]` |
| `fx-text-shimmer` | A light band slides across the text (loading labels) |
| `fx-text-glow` | Colored glow around the text |
| `fx-underline` | Underline grows from the left on hover (nav links) |
| `fx-marker` | Highlighter stroke draws in behind the text (default gold) |

**Gradients** (a preset only picks colors; combine it with a class below)

| Class | What it does |
|---|---|
| `fx-grad-brand` `fx-grad-royal` `fx-grad-ocean` `fx-grad-sunset` `fx-grad-gold` `fx-grad-forest` | Color presets |
| `fx-grad-angle-<deg>` | Direction, e.g. `fx-grad-angle-180` (top → bottom) |
| `fx-text-gradient` | Gradient text |
| `fx-bg-gradient` | Gradient background. Set the text color yourself; white is readable on brand, royal and ocean. |
| `fx-gradient-animate` | Makes a gradient text or background flow back and forth |
| `fx-underline-gradient` | Gradient underline |

```tsx
<h1 className="fx-text-gradient fx-grad-sunset fx-gradient-animate">Weekend sale</h1>
<div className="fx-bg-gradient fx-grad-royal text-white rounded-card p-gutter">Members save 15%</div>
```

**Backgrounds and borders**

| Class | What it does |
|---|---|
| `fx-bg-aurora` | Soft moving color blobs (hero sections). Colors from a preset, if one is set. |
| `fx-bg-spotlight` | Glow from the top center |
| `fx-bg-dots` / `fx-bg-grid` | Dot or line pattern. Change spacing with `[--fx-size:24px]` |
| `fx-glass` | Frosted see-through panel (over images or gradients) |
| `fx-border-spin` | Gradient border that rotates (add `rounded-*`; works with presets) |
| `fx-border-beam` | A beam of light travels around the border |
| `fx-glow-border` | Static glowing border (uses `fx-color-*`) |

**More motion**

| Class | What it does |
|---|---|
| `fx-zoom-hover` | Zooms the image, video or SVG inside on hover. Put it on the wrapper. |
| `fx-tilt-hover` | Slight tilt and grow on hover |
| `fx-pop-hover` | Bold offset shadow on hover (uses `fx-color-*`) |
| `fx-wiggle` `fx-bounce` `fx-heartbeat` `fx-breathe` `fx-spin-slow` | Attention loops (bell, scroll hint, favourite, status dot, loader) |
| `fx-slide-in-left` `fx-slide-in-right` `fx-slide-down` `fx-zoom-in` `fx-blur-in` `fx-flip-in` `fx-pop-in` `fx-reveal` | More entrances (play once, work with `fx-delay-*`) |

**On scroll** (Chrome, Edge, Safari 26+; other browsers show the element normally)

| Class | What it does |
|---|---|
| `fx-scroll-reveal` | Fades up as it scrolls into view |
| `fx-scroll-scale` | Grows in as it scrolls into view |
| `fx-scroll-progress` | Reading-progress bar pinned to the top: `<div className="fx-scroll-progress fx-grad-brand" />` |

**More text**

| Class | What it does |
|---|---|
| `fx-typewriter fx-chars-<n>` | Types itself out with a blinking caret. `n` = number of characters. Use with `font-mono`. |
| `fx-text-neon` | Glowing neon sign with a flicker (best on dark backgrounds; uses `fx-color-*`) |
| `fx-text-stroke` | Outline-only text |
| `fx-text-3d` | Stacked 3D shadow (uses `fx-color-*`, default indigo) |
| `fx-text-on-image` | Shadow that keeps text readable over photos |
| `fx-text-fill-hover` | Text fills with color from left to right on hover |
| `fx-squiggle` | Wavy underline |

**SplitText component** (letter-by-letter or word-by-word animation)

```tsx
import { SplitText } from "@car-rentals/ui";

<SplitText as="h1" text="Drive away today" />                       // letters rise in
<SplitText effect="blur" text="Your car is ready" />                // rise | fade | blur | wave
<SplitText by="word" stagger={120} text="Free cancellation" />      // word by word
```

Screen readers hear the normal sentence, and words never break in the middle.
Don't combine it with `fx-text-gradient`, because the gradient may not show on the animated letters.

**Modifiers**

| Class | What it does |
|---|---|
| `fx-color-<role>` | Sets the effect's color: `fx-color-highlight`, `fx-color-success`, `fx-color-accent`, … (any theme color). Default is `primary` (`accent` for `fx-marker`). |
| `fx-delay-<ms>` | Delays an entrance effect: `fx-delay-100`, `fx-delay-250`. Use it to stagger list items. |

```tsx
<Button variant="highlight" size="lg" className="fx-glow fx-color-highlight fx-shine fx-press">
  Reserve now
</Button>

<h1 className="fx-text-gradient">Drive away today</h1>

{cars.map((car, i) => (
  <Card key={car.id} className="fx-fade-up fx-lift" style={{ "--fx-delay": `${i * 80}ms` } as React.CSSProperties}>
    …
  </Card>
))}
```

**Rules:**

- **One animation per element.** Every looping, entrance, scroll and border animation (`fx-glow`,
  `fx-pulse-ring`, `fx-float`, `fx-wiggle`, `fx-bounce`, `fx-heartbeat`, `fx-breathe`, `fx-spin-slow`,
  every `fx-fade-*` / `fx-slide-*` / `fx-*-in` / `fx-reveal`, `fx-shake`, `fx-marker`,
  `fx-typewriter`, `fx-text-neon`, `fx-text-shimmer`, `fx-scroll-*`, `fx-border-spin`,
  `fx-border-beam`, `fx-gradient-animate`, `fx-bg-aurora`) replaces the others on the same element.
  Wrap the element in a `<div>` to stack two.
- **These combine freely** with any of the above: `fx-shine`, `fx-shine-hover`, `fx-glow-hover`,
  `fx-lift`, `fx-press`, `fx-tilt-hover`, `fx-zoom-hover`, `fx-pop-hover`, `fx-underline`,
  `fx-text-gradient`, `fx-text-glow`, `fx-text-3d`, `fx-text-stroke`, the `fx-grad-*` presets and
  `fx-color-*`.
- **Use them sparingly:** at most one looping effect (`fx-glow`, `fx-shine`, `fx-pulse-ring`,
  `fx-float`) per screen. Several moving things at once look busy and pull attention from each other.
- **Inline delays:** for a computed delay in a loop, set `--fx-delay` inline as shown above.
  Tailwind only generates classes it can find written out in your code, so a built class like
  `` `fx-delay-${i * 80}` `` won't work.

---

## 8. Components

### Button

```tsx
<Button>Book now</Button>                                  // primary, md
<Button variant="secondary">Cancel</Button>
<Button variant="accent" size="lg">Get 20% off</Button>
<Button variant="outline">View details</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger">Cancel booking</Button>
<Button variant="highlight">Get the app</Button>
<Button variant="deep">Contact us</Button>
<Button variant="link">Terms</Button>
<Button size="icon" aria-label="Close">×</Button>
<Button fullWidth type="submit">Pay ₹4,900</Button>
```

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` `secondary` `accent` `outline` `ghost` `danger` `highlight` `deep` `link` | `primary` |
| `size` | `sm` (32px) `md` (40px) `lg` (48px) `icon` (40×40) | `md` |
| `fullWidth` | `true` | — |
| `type` | `button` `submit` `reset` | `button` (so it never submits a form by accident) |
| `className` | extra classes. These override the button's own classes safely through `cn()`. | — |

Need a link that looks like a button? Use `buttonVariants`:
`<Link href="/cars" className={buttonVariants({ variant: "outline" })}>Browse cars</Link>`

### Badge

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Rejected</Badge>
<Badge tone="primary">New</Badge>
<Badge tone="highlight">Hot deal</Badge>
<Badge tone="info">Free cancellation</Badge>
<Badge tone="callout">Only 2 left</Badge>
<Badge tone="rating">★ 8.6</Badge>
<Badge>Draft</Badge>                      // neutral
```

### Card

```tsx
<Card>…</Card>                             // surface color, border, shadow-card, fluid padding
<Card className="p-0">…</Card>             // override anything with className
```

### DataTable

See the props documented in `src/components/data-table.tsx`. Main ones: `data`, `columns`,
`getRowId`, `onRowClick`, `variant` (`default` | `striped` | `bordered`), `rowHeight`,
`stickyHeader`.

### ZoneLink

Links to a page in **another app**. This does a full page load.

```tsx
<ZoneLink zone="admin" href="/partners/accounts">Admin</ZoneLink>
```

Inside the same app, use `next/link`.

### cn()

Merges class names and resolves Tailwind conflicts (the last one wins):
`cn("px-4", isWide && "px-8")`.

---

## 9. Changing the theme

| Want to… | Edit |
|---|---|
| Rebrand (new blue, new gold) | `styles.css` → section **1. Palette** (hex values only) |
| Change what a role uses (for example primary uses a darker blue) | `styles.css` → section **2** (`:root` for light, `[data-theme="dark"]` for dark) |
| Change text sizes, spacing, radius, shadows | `styles.css` → section **3b** |
| Add a reusable class | `styles.css` → section **5** (`@utility my-class { … }`) |
| Add a component | `src/components/<name>.tsx`, then export it from `src/index.ts` |
| Change fonts | `next/font` imports in each app's `app/layout.tsx` |
| Style one app differently | That app's `globals.css`, **below** the two imports (override `--primary` etc. in `:root` **and** `[data-theme="dark"]`) |

When you add a new background role, also add its `-foreground` pair. Check the pair's contrast
(at least 4.5:1 for normal text) in **both** themes before merging.

---

## 10. Don't / Do

| Don't | Do |
|---|---|
| `bg-blue-600 text-white` | `bg-primary text-primary-foreground` or `tone-primary` |
| `text-gray-500` | `text-muted-foreground` |
| `dark:bg-zinc-900` | `bg-surface` (it switches on its own) |
| `text-2xl md:text-4xl lg:text-5xl` | `text-h1` |
| `w-[1200px] mx-auto px-6` | `container` |
| `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for cards | `auto-grid` |
| Copy-pasting 10 Tailwind classes for every input | `field` |
| `<button className="…long list…">` | `<Button variant="…">` |
