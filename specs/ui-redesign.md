# UI Redesign — Avant-Garde Persona Authenticity

## Overview

Full theme system where P3/P4/P5 are **completely different UI experiences**, not just color swaps. Each game has its own typography, animation style, border treatment, and ambient effects.

---

## P5 — Rebellion Red / Punk-Rock / Acid Jazz

### Vibe
Total chaotic rebellion. Aggressive, stylish, kinetic. Like street art meets heist thriller.

### Color Palette
```css
--p5-primary: #e91e63;       /* Deep crimson red */
--p5-accent: #ff1744;          /* Bright accent red */
--p5-glow: rgba(233,30,99,0.6);
--p5-bg: #050508;              /* Near-black with blue tint */
--p5-surface: #0a0a12;
--p5-card: #12121a;
--p5-border: #2a2a3a;
--p5-text: #ffffff;
--p5-text-dim: rgba(255,255,255,0.5);
```

### Typography
- **Display**: `Bebas Neue` (condensed, bold, all-caps) — Google Fonts
- **Body**: `Noto Sans`
- Headlines: -3deg rotation, letter-spacing 0.2em, uppercase
- Numbers: Extra bold, compressed

### Visual Elements
- **Hard corners** — `border-radius: 0` everywhere
- **3px solid borders** on cards
- **Star-pattern overlay** — `repeating-conic-gradient` at 3% opacity
- **Glitch effect** on hover: 2-frame opacity flicker (0→0.8→1) + 2px translateX
- **Diagonal accent lines** on backgrounds
- **Comic-style starburst** on success states

### Animations
```css
/* Glitch hover */
@keyframes p5-glitch {
  0% { opacity: 1; transform: translateX(0); }
  25% { opacity: 0.8; transform: translateX(-2px); }
  50% { opacity: 1; transform: translateX(1px); }
  75% { opacity: 0.9; transform: translateX(-1px); }
  100% { opacity: 1; transform: translateX(0); }
}
/* Card entrance */
@keyframes p5-slam {
  from { transform: translateX(-20px) skewX(-5deg); opacity: 0; }
  to { transform: translateX(0) skewX(0); opacity: 1; }
}
```

### Slots / Cards
- Background: `--p5-card`
- Left border: 3px solid `--p5-primary`
- No border-radius
- Hover: glitch animation + box-shadow glow

---

## P4 — Retro-Pop Yellow / TV-World

### Vibe
Nostalgic, warm, high-energy. Like a 1960s pop-art poster. Deceptively sunny — hiding dark secrets.

### Color Palette
```css
--p4-primary: #ffca28;       /* Vibrant yellow */
--p4-accent: #ffb300;          /* Deep amber */
--p4-glow: rgba(255,202,40,0.5);
--p4-bg: #0f0f0f;             /* Deep black */
--p4-surface: #1a1a1a;
--p4-card: #222222;
--p4-border: #333333;
--p4-text: #fffde7;            /* Warm white */
--p4-text-dim: rgba(255,253,231,0.5);
```

### Typography
- **Display**: `Fredoka One` (playful, rounded) — Google Fonts
- **Body**: `Noto Sans`
- Headlines: Normal rotation, slightly bouncy weight
- Playful but readable

### Visual Elements
- **Rounded corners** — `border-radius: 6px`
- **Inset borders** — like old TV bezels
- **CRT Scanlines** — `repeating-linear-gradient` horizontal lines overlay on entire page
- **TV Static noise** — subtle noise texture on backgrounds
- **Warm glow** — yellow diffuse glow instead of sharp shadow
- **Polaroid-style frames** — slight rotation on cards (-1deg to 2deg)

### Animations
```css
/* Bounce in */
@keyframes p4-bounce {
  0% { transform: scale(0.8) translateY(10px); opacity: 0; }
  60% { transform: scale(1.05) translateY(-3px); opacity: 1; }
  80% { transform: scale(0.98) translateY(1px); }
  100% { transform: scale(1) translateY(0); }
}
/* Scanline drift */
@keyframes p4-scanlines {
  from { background-position: 0 0; }
  to { background-position: 0 4px; }
}
```

### Slots / Cards
- Background: `--p4-card`
- 1px inset border
- border-radius: 6px
- Subtle -1deg rotation
- Hover: bounce + yellow glow

---

## P3 — Moonlight Blue / Y2K-Gothic / Clinical

### Vibe
Melancholic, isolated, clinical. Late-night urban loneliness. Beautiful sorrow. Like floating on water in moonlight.

### Color Palette
```css
--p3-primary: #3949ab;       /* Deep indigo blue */
--p3-accent: #1a237e;          /* Midnight blue */
--p3-glow: rgba(57,73,171,0.4);
--p3-bg: #0d1520;              /* Deep navy */
--p3-surface: rgba(21,37,60,0.7);
--p3-card: rgba(30,50,80,0.6);
--p3-border: rgba(100,150,200,0.2);
--p3-text: #e0e8f0;
--p3-text-dim: rgba(224,232,240,0.5);
```

### Typography
- **Display**: `Cinzel` (elegant serif) — Google Fonts
- **Body**: `Noto Sans`
- Headlines: Normal rotation, generous letter-spacing, uppercase
- Clinical precision

### Visual Elements
- **Glass-morphism panels** — `backdrop-filter: blur(12px)` + semi-transparent background
- **Very subtle corners** — `border-radius: 2px`
- **Wave pattern** — SVG curved lines on background (subtle)
- **Floating effect** — cards have `translateY(-2px)` and soft shadow
- **Clock motifs** — subtle circular patterns
- **Translucent borders** — `rgba(100,150,200,0.2)`

### Animations
```css
/* Wave slide */
@keyframes p3-wave {
  0% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
/* Card float hover */
@keyframes p3-hover {
  0% { transform: translateY(-2px); }
  100% { transform: translateY(-6px); }
}
```

### Slots / Cards
- Background: `--p3-card` with `backdrop-filter: blur()`
- Translucent 1px border
- Slight floating effect on hover (translateY -6px)
- Slow, smooth animations (0.4s ease)

---

## Global CSS Variable System

All components use CSS variables. Each theme block sets ALL variables:

```css
:root[data-theme="p5"] {
  --corner-radius: 0px;
  --text-angle: -3deg;
  --card-border-width: 3px;
  --card-border-style: solid;
  --glow-spread: 20px;
  --glow-color: rgba(233,30,99,0.6);
  --bg-pattern: repeating-conic-gradient(rgba(233,30,99,0.03) 0% 25%, transparent 0% 50%);
  --font-display: 'Bebas Neue', Impact, sans-serif;
  --panel-bg: #0a0a12;
  --text-primary: #ffffff;
  --accent-color: #e91e63;
  --animation-base: 0.15s;
  --animation-style: glitch;
  --scanline-overlay: false;
  --glass-blur: 0px;
  --card-transform: none;
  --hover-transform: translateX(-2px);
}

:root[data-theme="p4"] {
  --corner-radius: 6px;
  --text-angle: 0deg;
  --card-border-width: 1px;
  --card-border-style: inset;
  --glow-spread: 12px;
  --glow-color: rgba(255,202,40,0.4);
  --bg-pattern: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
  --font-display: 'Fredoka One', cursive;
  --panel-bg: #1a1a1a;
  --text-primary: #fffde7;
  --accent-color: #ffca28;
  --animation-base: 0.3s;
  --animation-style: elastic;
  --scanline-overlay: true;
  --glass-blur: 0px;
  --card-transform: rotate(-1deg);
  --hover-transform: scale(1.02);
}

:root[data-theme="p3"] {
  --corner-radius: 2px;
  --text-angle: 0deg;
  --card-border-width: 1px;
  --card-border-style: solid;
  --glow-spread: 25px;
  --glow-color: rgba(57,73,171,0.35);
  --bg-pattern: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><path d='M0 100 Q100 70 200 100 T400 100' fill='none' stroke='rgba(57,73,171,0.06)' stroke-width='30'/></svg>");
  --font-display: 'Cinzel', serif;
  --panel-bg: rgba(30,50,80,0.6);
  --text-primary: #e0e8f0;
  --accent-color: #3949ab;
  --animation-base: 0.4s;
  --animation-style: wave;
  --scanline-overlay: false;
  --glass-blur: 12px;
  --card-transform: none;
  --hover-transform: translateY(-4px);
}
```

---

## Scanline Overlay (P4 only)

Applied via `::after` on `body`:

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.08) 0px,
    rgba(0,0,0,0.08) 1px,
    transparent 1px,
    transparent 3px
  );
  animation: scanline-drift 8s linear infinite;
}
@keyframes scanline-drift {
  from { background-position: 0 0; }
  to { background-position: 0 12px; }
}
```

Only active when `data-theme="p4"`.

---

## Settings Page

### Layout
Three theme cards in horizontal row. Each card:
- Theme name + star icon
- 140×90px mini-preview area
- Inside preview: real SlotCardComponent rendered with theme's CSS vars active
- Active theme: 2px glowing border in theme accent color
- Click: activates theme

### Route
`/settings` — managed by `SettingsPageComponent`

---

## Settings Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  SETTINGS                                                │
│                                                          │
│  APPEARANCE                                              │
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │    ★ P5 ★   │ │    ★ P4 ★   │ │    ★ P3 ★   │     │
│  │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │     │
│  │ │ MORNING  │ │ │ │ MORNING  │ │ │ │ MORNING  │ │     │
│  │ │  Study   │ │ │ │  Study   │ │ │ │  Study   │ │     │
│  │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │     │
│  │             │ │             │ │             │     │
│  │  ● ACTIVE  │ │             │ │             │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Side Navigation

```
┌──────┐
│  VP  │
├──────┤
│  ☀️  │ → Day Planner
│  📊  │ → Stats
│  ⚙️  │ → Settings (NEW)
└──────┘
```

Settings icon: gear SVG. Located in `SideNavComponent`.

---

## Implementation Priority

1. Rewrite `styles.css` with full 3-theme CSS variable system
2. Extend `ThemeService` with full theme config objects
3. Add Settings nav item to `SideNavComponent`
4. Create `SettingsPageComponent` with theme cards + mini previews
5. Update `SlotCardComponent` with `--text-angle` transform, animation classes
6. Update `DayViewComponent` headline with `--text-angle`
7. Add scanline `::after` overlay for P4 in `styles.css`
8. Add `backdrop-filter: blur()` for P3 cards
9. Add glitch/elastic/wave CSS animations to `styles.css`
