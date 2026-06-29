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
