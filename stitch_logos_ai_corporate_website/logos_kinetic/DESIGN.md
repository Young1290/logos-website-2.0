# Design System Strategy: The Kinetic Precision Engine

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is built to reflect the core promise of Logos AI: **Absolute Truth through High-Velocity Intelligence.** While many AI brands lean into soft, ethereal "clouds" or "bubbles," this system adopts the **Digital Curator** persona. It is sophisticated, editorial, and unapologetically bold. 

We break the "standard tech template" by moving away from symmetrical grids and thin borders. Instead, we use **Kinetic Asymmetry** and **Tonal Depth** to create a sense of forward motion. The layout should feel like a high-end architectural magazine—intentional white space, overlapping layers, and high-contrast typography that commands authority. This isn't just a dashboard; it’s a precision tool for "0 hallucination" data.

---

## 2. Colors: The High-Octane Palette
Our palette transitions from the raw energy of the pitch deck into a professional, "tech-forward" ecosystem. We prioritize high contrast to signify clarity and truth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. Structural boundaries must be defined solely through background color shifts. Use `surface-container-low` sections against a `surface` background to create "invisible" edges. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use Material-style surface tiers to define importance without adding visual clutter:
- **Base Layer:** `surface` (#fff4f0) - The canvas.
- **Sectioning:** `surface-container-low` (#ffede5) - For large logic blocks.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) - To pop against the warm background.
- **Information Overlays:** `surface-container-highest` (#ffd4bd) - For heavy-duty data panels.

### The "Glass & Gradient" Rule
To escape the "flat" look, floating elements (modals, dropdowns) should utilize **Glassmorphism**. Use semi-transparent variants of `surface` with a 20px-40px backdrop-blur. 
- **Signature Texture:** Primary CTAs must use a subtle linear gradient from `primary` (#a33800) to `primary-container` (#ff7941) at a 135-degree angle. This adds "soul" and depth to the action.

---

## 3. Typography: Editorial Authority
We pair **Space Grotesk** (Display/Headlines) with **Manrope** (Body/Labels). Space Grotesk provides a "tech-brutalist" edge that feels precise, while Manrope ensures long-form data remains readable.

*   **Display (Space Grotesk):** Large, tight tracking (-2%). Used for hero statements where we emphasize the "0 hallucination" promise.
*   **Headlines (Space Grotesk):** Bold and high-contrast (`on-surface` #4b240a). Use these to anchor the user's eye.
*   **Body (Manrope):** Generous line height (1.6x) for `body-lg`. This ensures that even dense AI data logs feel airy and digestible.
*   **Labels (Manrope):** Use `label-md` in uppercase with +5% letter spacing for a technical, "meta-data" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "standard." We achieve hierarchy through **Ambient Light** and **Material Stacking**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a natural, soft lift.
*   **Ambient Shadows:** If an element must float (e.g., a critical alert or command bar), use a multi-layered shadow:
    *   *Shadow 1:* 0px 4px 20px rgba(75, 36, 10, 0.04)
    *   *Shadow 2:* 0px 12px 40px rgba(75, 36, 10, 0.08)
    *   The color is a tint of `on-surface` (#4b240a), never pure black.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline-variant` (#dd9f7c) at 15% opacity. Never use 100% opaque borders.

---

## 5. Components: The Precision Set

### Buttons: The "Action Block"
- **Primary:** Gradient (`primary` to `primary-container`), white text (`on-primary`), `md` (0.375rem) roundedness. Use bold weight for text.
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Text-only in `primary` with a high-contrast underline on hover.

### Inputs: The "Data Field"
- **Static State:** `surface-container-low` background, no border.
- **Focus State:** Background shifts to `surface-container-lowest`, with a 2px "Ghost Border" in `primary`.
- **Error State:** Background shifts to `error_container` (#fb5151) at 10% opacity.

### Cards & Lists: The "Zero-Line" Format
- **Forbid Dividers:** Do not use horizontal rules (`<hr>`). 
- **Separation:** Use vertical white space (32px or 48px) or a subtle shift from `surface-container-low` to `surface-container-high` to separate list items.
- **Chips:** Small, pill-shaped (`full` roundedness) using `tertiary_container` (#00e3fd) to highlight "Verified" or "0 Hallucination" data points.

### Contextual Tooltips
- Use `inverse_surface` (#1e0800) with `inverse_on_surface` (#cb906d) text. This provides a "dark mode" pop against the warm UI, signaling a technical insight.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** Treat space as a functional element that separates ideas.
- **Use Intentional Asymmetry:** Align a headline to the left but place the supporting body text in a narrower, offset column to the right.
- **Contrast for Truth:** Use the `tertiary` (teal/cyan) tones strictly for "verification" and "success" states to contrast against the energetic orange.

### Don’t:
- **No Gray:** Avoid neutral grays (#808080). Use our `secondary` (#5c5b5b) or `on-surface-variant` (#805032) which have warm/tech undertones.
- **No Rounded Overload:** Stick to `md` (0.375rem) for most containers. Do not use "bubbly" high-radius corners for professional data tools.
- **No Center Alignment:** For hero sections and data dashboards, default to left-aligned editorial layouts. Center alignment is for marketing "fluff," not technical "precision."