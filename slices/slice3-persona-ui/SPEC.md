# Spec: Slice 3 — Persona-Style UI

## Overview

Komplettes UI-Redesign inspiriert von Persona 3/4/5. Dunkle Themes mit leuchtenden Akzenten, aufwendige Animationen, Social-Link-inspirierte Stat-Darstellung. Spider/Radar-Chart für Stats.

---

## Navigation — Persona-Style

**Kein Tab-Bar oben.** Stattdessen:

### Option: Side Navigation (wie P5 Main Menu)

Ein vertikales Menü auf der linken Seite — wie das P5 Main Menu mit leuchtenden Icons.

```
┌──────┐
│  VP  │  ← Logo
├──────┤
│  ☀️  │  ← Day Planner (aktiv = glowing)
│  📊  │  ← Stats
│  ⚙️  │  ← Settings (später)
└──────┘
```

- Vertical icon menu, links side
- Active item: leuchtet mit Glow + link border
- Hover: Glow intensiviert sich
- Klein, nur Icons + Tooltip beim Hover
- Auf Mobile: Bottom Bar statt Side Menu

---

## Stats — Spider/Radar Chart

### Visualisierung

Ein **5-Achsen Spider/Radar Chart** — wie in Shin Megami Tensei / Persona Games für Stats.

```
         Guts (top)
           /\
          /  \
         /    \
        /      \
       /        \
      /__________\
   Courage    Academics
   (left)       (right)

       Kindness-Proficiency
         (bottom)
```

### Details

- **5 Achsen**: Guts (top), Courage (left), Academics (right), Kindness (bottom-left), Proficiency (bottom-right)
- **Gefüllter Bereich**: Stat-Wert als Punkt auf jeder Achse, Polygon gefüllt mit halbtransparenter Farbe
- **Farbe des Polygons**: Gradient von `--color-primary` zu transparent
- **Glow**: Der Polygon-Bereich leuchtet leicht
- **Achsen-Beschriftungen**: Stat-Name an jeder Spitze
- **Tooltip beim Hover**: Zeigt "Stat: Value / 100" oder "Value / (tier*100)"
- **Tier-Anzeige**: Wenn Value > 100, wird "★ ×2" angezeigt (oder ähnlich)
- **Animation**: Chart "zeichnet sich auf" beim Laden (wie P5 UI Animation)

### Stat-Tiers (P5 Style)

Jede Stat hat einen **Tier** (wie P5 Social Links):
- **Tier 0**: 0–99 (normal)
- **Tier 1**: 100–199 (Level-up Animation wenn 100 erreicht)
- **Tier 2**: 200–299
- etc.

Bei erreichen von 100, 200, etc.:
- Kurz-Animation: Glow-Burst + "TIER UP" Text
- Fortschrittsbalken resettet auf 0 (innerhalb des Tiers)
- Außenspinne wächst äußerlich (größerer Radius)

---

## Design-Richtung

### Referenz: Persona 5 UI

- **Schwarzer Hintergrund** mit roten/goldenen Akzenten
- **Futuristische Typografie** — Montserrat, Stronger Display-Fonts
- **Leuchtende Buttons** — Glow-Effekte, Schatten mit Farbe
- **Glitch-Animationen** bei Interaktionen
- **Card-UI** mit harten Ecken, animierten Borders

### Referenz: Persona 4 UI

- **Helleres Yellow/Gold** auf dunklem Hintergrund
- **Weniger "aggressiv"** als P5
- **Organischere Formen** als P5

### Referenz: Persona 3 UI

- **Dunkles Blau**, melancholischer
- **Elegante Einfachheit**

---

## Konkrete UI-Änderungen

### Day Planner

| Element | Aktuell | Neu (P5-Style) |
|---------|---------|-----------------|
| Slot-Card | Einfaches Rechteck | Schwarze Karte mit leuchtender Border (animiert), harte Ecken |
| Stat-Badge | Flaches Rechteck | Leuchtendes Icon + Name, Glow bei Hover |
| Check-Button | Grüner Kreis | Roter Kreis mit "✓" Glyphe, Puls-Animation bei Erfolg |
| Navigation | Link oben in Header | Side-Menu Icons (P5 Style) |
| Hintergrund | Dunkelgrau | Fast-Schwarz (#0a0a0f), subtiler Grid-Pattern |

### Stats Dashboard

| Element | Aktuell | Neu (P5-Style) |
|---------|---------|-----------------|
| Stat-Liste | Cards mit Balken | **Spider/Radar Chart** |
| Tier-Indikator | Keiner | ★×2, ★×3 etc. Badge |
| Growth-Anzeige | Einfacher Text | "↑ +5" mit grünem/goldenen Glow |
| Detail-Ansicht | Keine | Klick auf Stat → Detail mit Tier-Info |

### Navigation Detail

| Element | Beschreibung |
|---------|-------------|
| Side Menu | Vertikales Icon-Menü links, 60px breit |
| Logo | "VP" Monogram oben |
| Nav Items | ☀️ Day Planner, 📊 Stats, ⚙️ Settings |
| Active State | Glow + leuchtende linke Border |
| Hover | Glow intensiviert sich |
| Mobile | Bottom Bar mit 3 Icons |

### Farbschema (P5 Default)

```
--color-primary: #e91e63     /* Rot/Pink — P5 Signature */
--color-accent: #ff1744      /* Akzent-Rot */
--color-glow: rgba(233,30,99,0.5)  /* Glow-Effekt */
--color-bg: #0a0a0f          /* Fast-Schwarz */
--color-surface: #1a1a24     /* Leicht heller als BG */
--color-card: #252532        /* Card-Hintergrund */
--color-border: #3a3a4a      /* Border */
--color-text: #ffffff
--color-text-dim: #8888aa
--color-success: #00e676     /* Erledigt-Glow */
--color-stat-guts: #e65100
--color-stat-courage: #f9a825
--color-stat-academics: #1565c0
--color-stat-kindness: #c2185b
--color-stat-proficiency: #2e7d32
```

### Animationen

- **Slot-Set**: Border beginnt zu leuchten (CSS animation), 0.3s
- **Task-Erledigung**: Roter Button → Grüner Haken mit Glow-Burst, 0.4s
- **Stat-Growth**: "+X" erscheint mit Float-Up Animation, verschwindet nach 2s
- **Seite-Übergang**: Fade + leichter Slide, 0.2s
- **Hover**: Scale(1.02) + Glow verstärken, 0.15s
- **Spider Chart Aufbau**: Linien zeichnen sich nach und nach (wie P5 UI), 0.8s
- **Tier Up**: Glow-Burst + Skalierung, 0.6s

### Fonts

- **Headlines**: Montserrat Bold / Black
- **Body**: Noto Sans (behalten)
- **Akzente/Zahlen**: Montserrat SemiBold

---

## Akzeptanzkriterien

- [ ] P5 Dark Theme mit Glow-Effekten
- [ ] Side-Navigation (oder Bottom Bar auf Mobile)
- [ ] Spider/Radar Chart für Stats
- [ ] Tier-System (100 = neues Level)
- [ ] Spider Chart Tier-Up Animation
- [ ] Slot-Card Glow-Animation bei Set
- [ ] Konsistente Spacing (8px Grid)
- [ ] Theme-Switcher (P3/P4/P5)

---

## Theme-Implementierung

CSS Custom Properties für jeden Theme:

```css
/* P5 (Default) */
[data-theme="p5"] {
  --color-primary: #e91e63;
  --color-bg: #0a0a0f;
  --color-glow: rgba(233,30,99,0.5);
}

/* P4 */
[data-theme="p4"] {
  --color-primary: #ffca28;
  --color-bg: #121212;
  --color-glow: rgba(255,202,40,0.4);
}

/* P3 */
[data-theme="p3"] {
  --color-primary: #1a237e;
  --color-bg: #0d1b2a;
  --color-glow: rgba(26,35,126,0.4);
}
```

Theme wird in `settings` Tabelle gespeichert, Frontend liest beim Start.

---

## Appendix: Detailed Theme Specifications (from ui-redesign.md)

### P5 — Rebellion Red / Punk-Rock / Acid Jazz

**Vibe:** Total chaotic rebellion. Aggressive, stylish, kinetic. Like street art meets heist thriller.

**Color Palette:**
```css
--p5-primary: #e91e63;       /* Deep crimson red */
--p5-accent: #ff1744;        /* Bright accent red */
--p5-glow: rgba(233,30,99,0.6);
--p5-bg: #050508;            /* Near-black with blue tint */
--p5-surface: #0a0a12;
--p5-card: #12121a;
--p5-border: #2a2a3a;
--p5-text: #ffffff;
--p5-text-dim: rgba(255,255,255,0.5);
```

**Typography:** Bebas Neue (condensed, bold, all-caps) for display; Noto Sans for body; headlines at -3deg rotation, letter-spacing 0.2em, uppercase.

**Visual Elements:** Hard corners (border-radius: 0); 3px solid borders on cards; star-pattern overlay via `repeating-conic-gradient` at 3% opacity; glitch effect on hover (2-frame opacity flicker + 2px translateX); diagonal accent lines on backgrounds; comic-style starburst on success states.

**Animations:**
```css
@keyframes p5-glitch {
  0%   { opacity: 1;    transform: translateX(0); }
  25%  { opacity: 0.8;  transform: translateX(-2px); }
  50%  { opacity: 1;    transform: translateX(1px); }
  75%  { opacity: 0.9;  transform: translateX(-1px); }
  100% { opacity: 1;    transform: translateX(0); }
}
@keyframes p5-slam {
  from { transform: translateX(-20px) skewX(-5deg); opacity: 0; }
  to   { transform: translateX(0) skewX(0);          opacity: 1; }
}
```

**Slots/Cards:** Background `--p5-card`; left border 3px solid `--p5-primary`; no border-radius; hover triggers glitch animation + box-shadow glow.

---

### P4 — Retro-Pop Yellow / TV-World

**Vibe:** Nostalgic, warm, high-energy. Like a 1960s pop-art poster.

**Color Palette:**
```css
--p4-primary: #ffca28;       /* Vibrant yellow */
--p4-accent: #ffb300;        /* Deep amber */
--p4-glow: rgba(255,202,40,0.5);
--p4-bg: #0f0f0f;            /* Deep black */
--p4-surface: #1a1a1a;
--p4-card: #222222;
--p4-border: #333333;
--p4-text: #fffde7;          /* Warm white */
--p4-text-dim: rgba(255,253,231,0.5);
```

**Typography:** Fredoka One (playful, rounded) for display; Noto Sans for body.

**Visual Elements:** Rounded corners (border-radius: 6px); inset borders (like old TV bezels); CRT scanlines via `repeating-linear-gradient` overlay; TV static noise texture; warm diffuse glow; polaroid-style slight card rotation (-1deg to 2deg).

**Animations:**
```css
@keyframes p4-bounce {
  0%   { transform: scale(0.8) translateY(10px); opacity: 0; }
  60%  { transform: scale(1.05) translateY(-3px); opacity: 1; }
  80%  { transform: scale(0.98) translateY(1px); }
  100% { transform: scale(1) translateY(0); }
}
/* Scanline drift */
@keyframes p4-scanlines {
  from { background-position: 0 0; }
  to   { background-position: 0 4px; }
}
```

**Scanline Overlay (P4 only):**
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
```

---

### P3 — Moonlight Blue / Y2K-Gothic / Clinical

**Vibe:** Melancholic, isolated, clinical. Late-night urban loneliness. Beautiful sorrow.

**Color Palette:**
```css
--p3-primary: #3949ab;       /* Deep indigo blue */
--p3-accent: #1a237e;        /* Midnight blue */
--p3-glow: rgba(57,73,171,0.4);
--p3-bg: #0d1520;            /* Deep navy */
--p3-surface: rgba(21,37,60,0.7);
--p3-card: rgba(30,50,80,0.6);
--p3-border: rgba(100,150,200,0.2);
--p3-text: #e0e8f0;
--p3-text-dim: rgba(224,232,240,0.5);
```

**Typography:** Cinzel (elegant serif) for display; Noto Sans for body; headlines uppercase with generous letter-spacing.

**Visual Elements:** Glass-morphism panels (`backdrop-filter: blur(12px)` + semi-transparent bg); very subtle corners (border-radius: 2px); wave pattern SVG on background; floating card effect (translateY(-2px)); clock motifs; translucent borders.

**Animations:**
```css
@keyframes p3-wave {
  0%   { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0);  opacity: 1; }
}
@keyframes p3-hover {
  0%   { transform: translateY(-2px); }
  100% { transform: translateY(-6px); }
}
```

**Slots/Cards:** Background `--p3-card` with `backdrop-filter: blur()`; translucent 1px border; floating hover effect (translateY -6px); slow smooth animations (0.4s ease).

---

### Global CSS Variable System

All three themes use a unified CSS variable set via `[data-theme="p5/p4/p3"]` on `:root`:

```css
:root[data-theme="p5"] {
  --corner-radius: 0px;      --card-border-style: solid;
  --card-border-width: 3px;  --glow-spread: 20px;
  --glow-color: rgba(233,30,99,0.6);
  --bg-pattern: repeating-conic-gradient(rgba(233,30,99,0.03) 0% 25%, transparent 0% 50%);
  --font-display: 'Bebas Neue', Impact, sans-serif;
  --animation-base: 0.15s;   --animation-style: glitch;
  --scanline-overlay: false; --glass-blur: 0px;
  --card-transform: none;    --hover-transform: translateX(-2px);
}
:root[data-theme="p4"] {
  --corner-radius: 6px;      --card-border-style: inset;
  --card-border-width: 1px;   --glow-spread: 12px;
  --glow-color: rgba(255,202,40,0.4);
  --bg-pattern: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
  --font-display: 'Fredoka One', cursive;
  --animation-base: 0.3s;    --animation-style: elastic;
  --scanline-overlay: true;  --glass-blur: 0px;
  --card-transform: rotate(-1deg); --hover-transform: scale(1.02);
}
:root[data-theme="p3"] {
  --corner-radius: 2px;      --card-border-style: solid;
  --card-border-width: 1px;  --glow-spread: 25px;
  --glow-color: rgba(57,73,171,0.35);
  --bg-pattern: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><path d='M0 100 Q100 70 200 100 T400 100' fill='none' stroke='rgba(57,73,171,0.06)' stroke-width='30'/></svg>");
  --font-display: 'Cinzel', serif;
  --animation-base: 0.4s;    --animation-style: wave;
  --scanline-overlay: false; --glass-blur: 12px;
  --card-transform: none;   --hover-transform: translateY(-4px);
}
```

**Implementation Priority:**
1. Rewrite `styles.css` with full 3-theme CSS variable system
2. Extend `ThemeService` with full theme config objects
3. Add Settings nav item to `SideNavComponent`
4. Create `SettingsPageComponent` with theme cards + mini previews
5. Update `SlotCardComponent` with `--text-angle` transform, animation classes
6. Update `DayViewComponent` headline with `--text-angle`
7. Add scanline `::after` overlay for P4 in `styles.css`
8. Add `backdrop-filter: blur()` for P3 cards
9. Add glitch/elastic/wave CSS animations to `styles.css`
