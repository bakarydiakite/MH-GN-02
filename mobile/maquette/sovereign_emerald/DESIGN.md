# Design System Document: High-End Government Interface

## 1. Overview & Creative North Star: "The Verdant Monolith"

This design system is built for the specific demands of Guinean government technology—where trust, sovereignty, and modernity must intersect. Our Creative North Star is **"The Verdant Monolith."** 

Unlike traditional "GovTech" which relies on rigid grids and heavy borders, this system treats the interface as an organic, living ledger. We break the "template" look by utilizing **intentional asymmetry** and **tonal depth**. The aesthetic is authoritative yet breathing, using expansive whitespace and high-contrast typography scales to ensure information is not just accessible, but prestigious. We move away from the "standard" dashboard by layering components like fine vellum, creating a digital environment that feels premium, secure, and uniquely Guinean.

---

## 2. Colors: The Emerald Spectrum

The palette is strictly monochromatic-adjacent, utilizing the vibrant emerald of the Guinean spirit without a single drop of blue. 

### Core Palette (Material Design Convention)
*   **Primary (`#006d43`):** The "Sovereign Green." Use for high-emphasis actions and brand presence.
*   **Primary Container (`#00a86b`):** Use for active states or subtle hero backgrounds.
*   **Surface (`#f4fbf6`):** A tinted, warm white that reduces eye strain compared to pure `#ffffff`.
*   **Surface Container Tiers:**
    *   **Lowest (`#ffffff`):** For the highest level of "pop" (e.g., a card on a grey background).
    *   **Low (`#eff5f0`):** Standard sectional background.
    *   **Highest (`#dde4df`):** For nested elements requiring distinct separation.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition a modern user needs. Lines create visual noise; tonal shifts create elegance.

### Signature Textures & Glassmorphism
To elevate the experience, use **Glassmorphism** for floating navigation or modal overlays. 
*   **Formula:** `surface` color at 70% opacity + `backdrop-filter: blur(20px)`.
*   **Gradients:** Use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` to `primary-container` for main CTAs to provide a "jeweled" depth that flat colors cannot mimic.

---

## 3. Typography: Editorial Authority

We use **Manrope** for its geometric clarity and modern humanist touch.

*   **Display (lg/md/sm):** Use for high-impact landing moments. Tracking should be set to `-0.02em` to feel tighter and more bespoke.
*   **Headline (lg/md/sm):** The workhorse for page titles. Use `headline-lg` (2rem) to establish clear hierarchy.
*   **Title (lg/md/sm):** Reserved for card headers and section titles.
*   **Body (lg/md/sm):** Set `body-lg` at 1rem for long-form reading. Ensure line-height is at least `1.6` to maintain "The Verdant Monolith" breathing room.
*   **Label (md/sm):** All-caps with `+0.05em` letter spacing for small metadata or form labels.

The hierarchy is designed to feel like a high-end financial journal—bold headers followed by generous, readable body copy.

---

## 4. Elevation & Depth: Tonal Layering

We reject the "drop shadow" defaults. Depth in this system is achieved through physics-based layering.

*   **The Layering Principle:** Stack surfaces like physical sheets of paper. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#eff5f0) background to create a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (e.g., a FAB or a Modal), use a tinted shadow:
    *   `box-shadow: 0 12px 32px -4px rgba(22, 29, 26, 0.08);`
    *   The shadow is not grey; it is a dark, desaturated green (`on-surface` color) to mimic natural light passing through emerald glass.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Sleek & Minimalist

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`, `xl` (0.75rem) rounded corners. White text.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. No border.
*   **Tertiary:** Ghost style. `primary` text color, no background, high-contrast hover state.

### Input Fields
*   **Style:** No bottom line or full box. Use a `surface-container-highest` background with an `xl` corner radius.
*   **Focus:** Transition the background to `surface-container-lowest` and add a 2px `primary` "Ghost Border" (20% opacity).

### Cards & Lists
*   **Strict Rule:** No divider lines between list items. Use vertical spacing (16px or 24px) to separate data.
*   **Hover States:** Transition the background color of a list item from `transparent` to `surface-container-low`.

### Specialized Components
*   **Sovereign Header:** A top navigation bar using the Glassmorphism rule (70% opacity + blur) to allow content to flow beneath it, maintaining a sense of immense digital space.
*   **Data Chips:** Use `secondary-fixed` backgrounds with `on-secondary-fixed-variant` text for status indicators (e.g., "Verified," "Pending").

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme whitespace. If you think there’s enough room, add 16px more.
*   **Do** use asymmetrical layouts for landing pages (e.g., a left-aligned headline with a right-shifted hero image).
*   **Do** use the `primary-fixed` token for subtle highlights in dark-mode or high-contrast scenarios.

### Don't
*   **Don't** use blue. Not for links, not for success states, not for shadows.
*   **Don't** use 1px solid dividers. If you need a break, use a `surface-variant` color block 4px high or simply more space.
*   **Don't** use "Standard" sharp corners. Always stick to the `xl` (0.75rem) or `lg` (0.5rem) roundedness scale to maintain the "Sleek" aesthetic.
*   **Don't** clutter the screen. If a piece of data isn't essential, hide it in a progressive disclosure (accordion or "View More").

---
*This design system is a living document intended to ensure every digital touchpoint for the Republic of Guinea feels authoritative, modern, and impeccably crafted.*