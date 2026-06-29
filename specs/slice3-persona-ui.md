# Spec: Slice 3 — Persona-Style UI

## Overview

Komplettes UI-Redesign inspiriert von Persona 3/4/5. Dunkle Themes mit leuchtenden Akzenten, aufwendige Animationen, Social-Link-inspirierte Stat-Darstellung.

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
| Navigation | Einfache Buttons | Pill-Shaped mit Glow-Effekt, Hover: Scale + Glow |
| Hintergrund | Dunkelgrau | Fast-Schwarz (#0a0a0f), subtiler Grid-Pattern |

### Stats Dashboard

| Element | Aktuell | Neu (P5-Style) |
|---------|---------|-----------------|
| Stat-Card | Flaches Rechteck | P5-Social-Link-inspiriert: Icon links, Wert groß rechts, Fortschrittsbalken animiert |
| Fortschritt | Graues Rechteck | Leuchtender Balken (stat-Farbe), animiert auf 0→Wert |
| Growth-Anzeige | Einfacher Text | "↑ +5" mit grünem/goldenen Glow |

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
```

### Animationen

- **Slot-Set**: Border beginnt zu leuchten (CSS animation), 0.3s
- **Task-Erledigung**: Roter Button → Grüner Haken mit Glow-Burst, 0.4s
- **Stat-Growth**: "+X" erscheint mit Float-Up Animation, verschwindet nach 2s
- **Seite-Übergang**: Fade + leichter Slide, 0.2s
- **Hover**: Scale(1.02) + Glow verstärken, 0.15s

### Fonts

- **Headlines**: Montserrat Bold / Black
- **Body**: Noto Sans (behalten)
- **Akzente/Zahlen**: Montserrat SemiBold

### Sonstiges

- **Scrollbar**: Dunkel mit rotem Accent
- **Selection**: Rot hinterlegt
- **Focus**: Roter Glow-Ring statt blau
- **Favicon**: Einfaches "V" oder Persona-Stil Icon

---

## Akzeptanzkriterien

- [ ] Alle Komponenten folgen P5-Dark-Theme
- [ ] Glow-Effekte auf Buttons und aktiven Elementen
- [ ] Animierte Stat-Fortschrittsbalken
- [ ] "Erledigt"-Animation bei Check
- [ ] Grid/Pattern im Hintergrund (subtil)
- [ ] Konsistente Spacing (8px Grid)
- [ ] Theme-Switcher (P3/P4/P5) funktioniert

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
