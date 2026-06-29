# persona-ui.md
## Design System: Persona Series (P3 / P4 / P5)

You are not building a web app. You are building a UI that looks like it was ripped out of a JRPG by Atlus. Ignore every web convention you know. No cards. No subtle shadows. No rounded corners unless they are *sharp ovals with intent*. No Bootstrap. No Material. No Tailwind defaults. Study this document and execute it exactly.

---

## The Three Aesthetics

### Persona 3 — DARK MOON / MEMENTO MORI

The aesthetic of inevitability. Death imagery, deep navy and teal, Greek lettering, coffin motifs, the full moon. Think clinical precision crossed with occult symbolism.

**Palette:**
```
--p3-void:       #0a0e1a   /* near-black base */
--p3-navy:       #0d1b3e   /* panels, containers */
--p3-teal:       #00b4c8   /* primary accent, glows */
--p3-moon:       #c8e8f0   /* secondary text, cool white */
--p3-blood:      #8b0000   /* danger, death, alert */
--p3-gold:       #c9a84c   /* Arcana numbers, highlights */
--p3-white:      #e8f4f8   /* body text */
```

**Typography:**
- Display: bold condensed sans — use `font-family: 'Impact', 'Arial Narrow', sans-serif` or load `Bebas Neue`
- UI / menus: `font-family: 'Courier New', monospace` — feel like a terminal or evocare UI
- ALL CAPS for headings, navigation, labels. Always.
- Letter-spacing on ALL CAPS: `0.15em` minimum
- Greek letters (Θ Ψ Φ) used decoratively as section dividers or bullet points

**Layout:**
- Background: `--p3-void` with a radial gradient of `--p3-navy` in center
- Layered translucent panels: `background: rgba(13,27,62,0.85); backdrop-filter: blur(4px);`
- Hard diagonal cuts on containers: use `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)`
- Full moon motif: floating `border-radius: 50%` circle in teal with glow as a decorative BG element
- Scanlines overlay: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,180,200,0.03) 2px, rgba(0,180,200,0.03) 4px)`

**Signature elements:**
- HP/SP bars styled as evoker displays: thin, glowing, with tick marks
- "MEMENTO MORI" watermark text in pale teal at 5% opacity, rotated 90°, running up the side of the viewport
- Coffin / moon shapes used as decorative SVG elements in corners
- Arcana card labels: `THE FOOL`, `THE MOON`, etc. as category/section labels in gold

---

### Persona 4 — MIDNIGHT CHANNEL / GOLDEN

Energy. Youth. A TV world of surreal brightness. Yellow and grey, bold patterns, flat color. Think Junes advertising meets surrealist fog.

**Palette:**
```
--p4-yellow:     #f7d000   /* THE yellow. dominant accent */
--p4-yellow-hot: #ffb300   /* hover states, secondary */
--p4-grey:       #1a1a1a   /* backgrounds */
--p4-mid:        #2c2c2c   /* panels */
--p4-fog:        #a0a0a0   /* secondary text, fog motif */
--p4-white:      #f5f5f0   /* primary text */
--p4-red:        #e03030   /* alerts, danger */
--p4-tv-static:  #333333   /* border color, TV static feel */
```

**Typography:**
- Display: `font-family: 'Arial Black', 'Franklin Gothic Heavy', sans-serif`
- Body: `font-family: 'Arial', 'Helvetica Neue', sans-serif`
- JUNES SLOGAN rule: important text gets yellow highlight background `background: var(--p4-yellow); color: #000; padding: 0 6px`
- Numbers and stats in a bold monospace: `font-family: 'Courier New', monospace; color: var(--p4-yellow)`
- Section headers: ALL CAPS, massive font-size (clamp 3rem–8vw), color `--p4-yellow`

**Layout:**
- Main BG: `#1a1a1a` with a subtle noise texture (CSS or SVG filter)
- TV scanlines: `repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)`
- Panels: flat `--p4-mid` with a `4px solid var(--p4-yellow)` top border — NO other border, just top
- Junes-style grid: bold, CSS grid with thick `--p4-yellow` gutters using `gap` + `background: var(--p4-yellow)` on the grid container
- "TV frame": key content wrapped in a thick `8px` solid yellow border with `box-shadow: inset 0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(247,208,0,0.3)`
- Crosshatch / halftone pattern on dividers: SVG background pattern of dots in `--p4-yellow` at 10% opacity

**Signature elements:**
- "JUNES" banner element: full-width stripe in `--p4-yellow` with black text in compressed font: `EVERY DAY'S GREAT AT YOUR JUNES`
- Fog overlay on page load: white-to-transparent gradient that fades out via CSS animation
- TV static effect on hover for image elements: CSS animation flickering opacity
- Character faces as abstract circles (avatars) with thick yellow rings

---

### Persona 5 — PHANTOM THIEVES / METAVERSE

The masterpiece. Red, black, and white. Brutal graphic design. Everything is slanted, exploding, dripping, masked. Think Bauhaus meets heist movie meets Tokyo street graffiti.

**Palette:**
```
--p5-black:      #0a0a0a   /* absolute base */
--p5-panel:      #111111   /* containers */
--p5-red:        #e8001a   /* THE red. use aggressively */
--p5-red-dark:   #8b0011   /* hover, shadow red */
--p5-white:      #f0f0f0   /* primary text, contrast */
--p5-grey:       #444444   /* secondary text, muted */
--p5-yellow:     #ffd700   /* rare accent, CRITICAL highlights only */
--p5-mask:       rgba(232,0,26,0.15) /* transparent red wash */
```

**Typography:**
- Display: `font-family: 'Impact', 'Haettenschweiler', sans-serif` — or load `Bebas Neue` / `Black Han Sans`
- Body: `font-family: 'Arial Black', sans-serif` for UI; fallback `Arial` for paragraphs
- SKEWED TEXT: `transform: skewX(-8deg)` on ALL headings. This is mandatory.
- Text stroke: `-webkit-text-stroke: 1px var(--p5-red)` on large display text over white
- Glitch effect on key text: duplicate element with offset + red color-shift via CSS animation
- Letter-spacing on nav/labels: `0.2em`, ALL CAPS
- Numbers in `--p5-red`, always

**Layout — THE MOST IMPORTANT SECTION:**
- Everything is on a slant. Use `transform: skewX(-8deg)` on containers and `skewX(8deg)` on inner content to counter-correct text
- Containers: `background: var(--p5-panel); border-left: 6px solid var(--p5-red); clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)`
- Navigation: vertical or diagonal stripe arrangement, NOT horizontal tabs
- Hover states: flip `background` to `var(--p5-red)` and `color` to `var(--p5-white)` — instant, no transition, or `transition: 0.05s` max
- Splash screens / headers: full bleed black with a diagonal red slash across the center: `background: linear-gradient(102deg, #0a0a0a 49.9%, var(--p5-red) 50%)`
- Grid: asymmetric. Sidebar at ~28%, main at ~72%. Both skewed slightly.
- Borders: `1px solid var(--p5-red)` everywhere panels touch. No soft shadows — `box-shadow: 4px 4px 0 var(--p5-red)` (hard, offset, no blur)
- Text boxes: white BG with black text, skewed, red border — used for contrast punching
- Full-page overlays: `background: var(--p5-red); opacity 0→1→0` on route transitions

**Signature elements:**
- "TAKE YOUR HEART" as the meta tagline in huge skewed type
- Mask icon: Joker-style mask as SVG favicon, avatar default, section divider
- Calling card: a `<div>` styled as a black card with red wax seal and Impact text — use for modal headers, announcements
- Splat/drip dividers: SVG drip shapes in red between sections (not horizontal rules — never `<hr>`)
- Menu cursor: a red arrow `►` or `▶` that replaces default bullets and selected states
- "!" ALERT boxes: sharp rectangle, red BG, white bold text, slight skew, drop shadow `4px 4px 0 #000`

---

## Global Rules (Apply to ALL Three)

### Never Do These:
- `border-radius` on rectangles. If you must round something, make it a full circle (`50%`) or a pill (`999px`). No `8px` corners.
- Subtle anything. Colors are loud or they don't exist.
- Gradients that go from color to white. Dark to darker, or color to black only.
- Sans-serif system fonts at normal weight. Everything is bold or black weight.
- Standard `<hr>` dividers. Use SVG shapes, angled divs, or color blocks.
- Placeholder lorem ipsum in a default typeface. Every text element should feel like UI text from the game.
- Hover transitions longer than `0.1s`. These UIs are fast and snappy.
- Centered body text. Left-align everything unless it's a logo or massive display text.

### Always Do These:
- Stack elements with `z-index` intentionally — layering is part of the visual language
- Use `overflow: hidden` on containers to let skewed/clipped elements bleed dramatically
- Build menus as vertical stacks with a selector bar, not horizontal nav bars
- Style scrollbars: `scrollbar-color: var(--accent) var(--base); scrollbar-width: thin`
- Make selection highlight match the accent color: `::selection { background: var(--accent); color: #000; }`
- Sound-effect-style labels: "PRESS START", "NEW GAME", "CONFIDANT", "ARCANA" — use game vocabulary for UI chrome
- Use `position: absolute` decorative elements (circles, slashes, dots) to break up empty space — not stock icons
- Every "card" is a cutout, not a floated box. Use `clip-path` or skew transforms.

---

## Component Recipes

### Menu / Navigation (P5 style)
```css
nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #0a0a0a;
  padding: 0;
  width: 280px;
}

nav a {
  display: block;
  padding: 14px 24px;
  font-family: 'Impact', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #f0f0f0;
  text-decoration: none;
  background: #111;
  border-left: 4px solid transparent;
  transform: skewX(-4deg);
  transition: background 0.05s, border-color 0.05s;
}

nav a:hover, nav a.active {
  background: #e8001a;
  border-left-color: #ffd700;
  color: #fff;
}
```

### Stat Bar (P3 / P5 style)
```css
.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.stat-bar__track {
  flex: 1;
  height: 6px;
  background: #1a1a1a;
  border: 1px solid currentColor;
  position: relative;
}

.stat-bar__fill {
  height: 100%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  transition: width 0.3s ease;
}
```

### Calling Card / Alert (P5 style)
```css
.calling-card {
  background: #0a0a0a;
  border: 2px solid #e8001a;
  box-shadow: 6px 6px 0 #e8001a;
  padding: 24px 32px;
  transform: skewX(-3deg);
  font-family: 'Impact', sans-serif;
  text-transform: uppercase;
  color: #f0f0f0;
  letter-spacing: 0.1em;
  position: relative;
}

.calling-card::before {
  content: '▶ NOTICE ◀';
  display: block;
  font-size: 0.7rem;
  color: #e8001a;
  letter-spacing: 0.3em;
  margin-bottom: 8px;
}
```

### Panel / Container (General)
```css
.persona-panel {
  background: var(--panel-color);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  padding: 24px;
  position: relative;
}

.persona-panel::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 12px; height: 12px;
  background: var(--accent);
}
```

### Page Transition Overlay (P5 style)
```css
.page-flash {
  position: fixed;
  inset: 0;
  background: #e8001a;
  z-index: 9999;
  pointer-events: none;
  animation: flash 0.4s ease forwards;
}

@keyframes flash {
  0%   { opacity: 0; transform: scaleX(0); transform-origin: left; }
  40%  { opacity: 1; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(1); }
}
```

---

## Fonts to Load (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Black+Han+Sans&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```
- `Bebas Neue` → Display / headings (P3, P5)
- `Black Han Sans` → Heavy Korean-style bold (P5 alternative)
- `Share Tech Mono` → Terminal/evoker UI (P3)

---

## Tone & Copy Rules
Write UI copy as if it's from the game:
- Buttons: `CONFIRM` / `EXECUTE` / `ESCAPE` / `ALL-OUT ATTACK` — not "Submit" or "Cancel"
- Empty states: `NO DATA FOUND — RETURN TO VELVET ROOM`
- Loading: `ACCESSING THE METAVERSE...` or `ANALYZING SHADOWS...`
- Errors: `CONNECTION TO THE DARK HOUR LOST` or `TARGET EVADED`
- Success: `SHOWTIME!` / `NICE!` / `GREAT!` (with flash animation)
- Sections labeled by Arcana: THE FOOL, THE MAGICIAN, etc. instead of "Overview", "Settings", "Profile"

---

## Quick Reference — Which Game For Which Mood

| Mood / Intent | Use |
|---|---|
| Dark, psychological, death/time theme | Persona 3 |
| Warm, mystery, friendship, rural/cozy | Persona 4 |
| Rebellion, heist, hype, high energy | Persona 5 |
| Can't pick one | Default to P5 — it's the most visually extreme and distinctive |

When in doubt, go harder. If it looks like a normal website, you haven't gone far enough.