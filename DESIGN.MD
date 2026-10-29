# Design System Inspired by Spotify — Calio Adaptation

> Source: [getdesign.md/spotify/design-md](https://getdesign.md/spotify/design-md) (`spotify/DESIGN.md`).  
> **Primary override:** Spotify Green `#1ed760` → Calio **`#00D95F`**. All other reference colors keep their values and roles.  
> **Fonts:** SpotifyMixUI / CircularSp are proprietary — Calio uses **IBM Plex Sans** for UI/titles and body (weights 700 / 600 / 500 / 400). Body temporarily uses IBM Plex instead of DM Sans for reliable Vietnamese diacritics.  
> **Platform:** Rules below are adapted for React Native / Expo mobile (fitness & nutrition), not desktop music chrome.

---

## 1. Visual Theme & Atmosphere

Dark-first, content-first immersion. Near-black surfaces (`#121212`, `#181818`, `#1f1f1f`) so nutritional content and CTAs read clearly. The only saturated brand color is Calio Green (`#00D95F`) — functional only (primary actions, focus, selected states).

Pill geometry for primary/secondary buttons; cards use small radii (6–8px). Depth comes from shade steps and purposeful shadows, not decorative borders.

**Key Characteristics:**
- Near-black immersive dark theme (`#121212`–`#1f1f1f`)
- Calio Green (`#00D95F`) as singular brand accent — never decorative backgrounds
- Compact type (≈10–24px), bold/regular contrast
- Pill buttons (`radii.pill`) for primary actions
- Semantic: error `#f3727f`, warning `#ffa42b`, info `#539df5`
- Dense spacing — app density over marketing whitespace

---

## 2. Color Palette & Roles

### Primary Brand
| Role | Hex | Notes |
|------|-----|-------|
| **Calio Green** (primary) | `#00D95F` | CTAs, focus, selected (replaces `#1ed760`) |
| **Green pressed** | `#00B84F` | Pressed primary |
| **Green deep** | `#13873C` | Strong pressed / deep accent |
| **Green border (legacy ref)** | `#1db954` | Optional outline accent — prefer `#00D95F` for brand borders |
| **Near Black** | `#121212` | Deepest background |
| **Dark Surface** | `#181818` | Cards, containers |
| **Mid Dark** | `#1f1f1f` | Inputs, interactive wells |

### Text
| Role | Hex |
|------|-----|
| Primary | `#ffffff` |
| Secondary (silver) | `#b3b3b3` |
| Near white emphasis | `#cbcbcb` |
| Light max emphasis | `#fdfdfd` |
| On primary (green fill) | `#000000` |

### Semantic
| Role | Hex |
|------|-----|
| Error / negative | `#f3727f` |
| Warning | `#ffa42b` |
| Info / announcement | `#539df5` |

### Surface & Border
| Role | Hex |
|------|-----|
| Dark card elevated | `#252525` |
| Mid card | `#272727` |
| Border gray | `#4d4d4d` |
| Light border (outline) | `#7c7c7c` |
| Separator | `#b3b3b3` |
| Light surface (rare / light theme) | `#eeeeee` |

### Overlays & shadows
- Overlay strong: `rgba(0,0,0,0.7)`
- Heavy elevation: `rgba(0,0,0,0.5) 0px 8px 24px`
- Medium elevation: `rgba(0,0,0,0.3) 0px 8px 8px`
- Input inset feel (RN approximation): 1px border `#7c7c7c` on `#1f1f1f` fill; focus border `#00D95F`

### Light theme (Calio preserves switching)
Map semantic roles coherently — not a raw invert:
- Background `#f5f5f5`, surface `#ffffff`, muted `#eeeeee`
- Text primary `#121212`, secondary `#6a6a6a`
- Borders `#d0d0d0`
- Primary remains `#00D95F`; on-primary `#000000`

**Do not** keep legacy Calio `#69b32b` or PostHog cream yellow as brand primary.

---

## 3. Typography

| Role | Size | Weight | Use |
|------|------|--------|-----|
| Screen / section title | 24 / 18 | 700 / 600 | `headingLarge` / `headingSmall` |
| Body / body strong | 16 | 400 / 700 | `body` / `bodyStrong` |
| Button | 14 | 700 | Uppercase + letterSpacing ≈ 1.4 where primary/secondary pills |
| Caption / label | 14–12 | 400–600 | Metadata, field labels |
| Micro | 10–12 | 400 | Fine print |

Principles: bold/regular binary; compact sizes; avoid loose line-heights.

---

## 4. Spacing, Radius, Control Sizes (RN)

**Spacing base:** 8px (also allow 4px half-steps). Prefer `spacing` / `layout` in `src/theme/spacing.ts`.

| Alias | Value | Use |
|-------|-------|-----|
| Screen padding X | 16 | Screen inset |
| Section gap | 16 | Major blocks |
| Field gap | 12 | Form fields |
| Card padding | 16 | Sections |
| Label → control | 6 | Forms |
| Control min height | 48 | Buttons, switches |
| Input min height | 48 | Text fields |
| Macro cell min | 56 | Nutrition grid |

**Radius** (`radii`): `sm` 4 · `md` 8 · `lg` 12 · `xl` 16 · `pill` 999  
- Cards/sections: `md` (8)  
- Inputs: `pill` or large pill (≥ 24 / `xl`) for search-like fields; form fields may use `md`–`xl` for density  
- Primary/secondary buttons: `pill`

**Icons:** 16 / 20 / 24 (`iconSizes`)

---

## 5. Components

### Buttons
- **Primary:** fill `#00D95F`, label `#000000`, pill, min height 48, optional uppercase + tracking  
- **Secondary (dark pill):** fill `#1f1f1f`, text `#ffffff`, border `#4d4d4d`, pill  
- **Outline:** transparent, border `#7c7c7c`, text white  
- **Destructive:** outline/text `#f3727f`  
- Disabled: muted gray fill/text — never washed primary green as fill for disabled

### Inputs
- Fill: `#1f1f1f` (dark) / white (light)  
- Text: primary text token  
- Border: `#4d4d4d` or inset gray; focus `#00D95F`  
- Error: border `#f3727f`  
- Height 48, horizontal padding 12–16

### Cards / sections
- Fill `#181818` or `#1f1f1f`, radius 8, **no** thick decorative border by default  
- Prefer one section surface — avoid card-in-card  
- Elevation only for menus/modals (medium/heavy shadow)

### Manual Add Food (layout spec)
1. Header + mode switch (compact pills)  
2. Intro: one title + one helper line  
3. Details section: name, brand, unit + amount — shared input height  
4. Nutrition: 2×2 macro cells, equal size  
5. Compact serving summary  
6. Meal/date context (existing)  
7. Full-width primary pill **Save**

---

## 6. Depth

| Level | Treatment |
|-------|-----------|
| 0 Base | `#121212` |
| 1 Surface | `#181818` / `#1f1f1f` |
| 2 Elevated | medium shadow |
| 3 Dialog | heavy shadow + overlay |

---

## 7. Do / Don't

**Do:** dark immersion; green only for functional accents; pill CTAs; compact type; heavy shadows when elevating.  
**Don't:** green backgrounds; square primary buttons; thin invisible shadows on dark; invent extra brand accents; keep `#69b32b`.

---

## 8. Implementation map

| DESIGN role | Theme token |
|-------------|-------------|
| Near black | `background` (dark) |
| Dark surface | `surface` |
| Mid dark | `surfaceMuted` |
| Calio green | `primary` |
| White / silver | `textPrimary` / `textMuted` |
| Error / warning / info | `error` / `warning` / `info` |
| Border gray | `border` |

Code: `src/theme/*`, `src/components/ui/*`. Prefer `useThemeColors()`.
