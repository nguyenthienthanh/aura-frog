---
name: frontend-aesthetics
description: "Anti-AI-slop taste layer for UI output — distinctive typography, dominant+accent color hierarchy, and implementation-matched polish. Use when building or restyling a UI/landing/component that should look designed rather than defaulted, or when the user asks for something 'beautiful', 'distinctive', 'less generic', or 'not another Tailwind template'."
when_to_use: "make UI distinctive / beautiful / less generic, typography choice, color hierarchy, restyle a bland component, avoid AI-default look"
user-invocable: false
---

> **AI-consumed reference.** Produce taste; do not re-implement enforcement. This skill *complements* `rules/agent/design-system-usage.md` + `rules/agent/theme-consistency.md` (which enforce token usage) and `rules/agent/accessibility-rules.md` (which enforces a11y) — cross-link, don't duplicate.

# Frontend Aesthetics

Raise output from *consistent & correct* to *distinctive*. **House-style hard constraint (global CLAUDE.md "12-year-old friendly"): flat, clean, accessible, ONE restrained accent — NO neon, NO glow, NO gradient-mesh, NO sparkle.** "Distinctive" = tasteful type + cohesive tokens + dominant color + sharp accent, NOT flashy maximalism. Any output that adds glow/neon fails.

## Typography (the fastest tell of AI-default)
- **Avoid** the default tells: Inter, Roboto, Open Sans, Arial, raw system-ui.
- **Reach for** a curated pairing instead: IBM Plex Sans/Serif, Newsreader, Space Grotesk, Bricolage Grotesque, Playfair Display (display only), JetBrains Mono (code/labels).
- **Pair with contrast:** one expressive display/serif + one clean sans. Make weight & size jumps *deliberate and large* (e.g. 14 → 20 → 40, not 16 → 18 → 22) — timid scales read as generic.

## Color
- **Dominant + sharp accent**, not an evenly-distributed rainbow: one color owns ~70% of the surface, the accent is used *sparingly* for the single primary action (ties to the house "1 primary action per screen" rule).
- Derive the palette from ONE hue (see the `design-tokens` skill for OKLCH generation) so it reads as a system.
- Accessible-first: verify text/background contrast meets WCAG AA *before* aesthetics.

## Match ambition to implementation
Only promise polish you'll actually build. A "distinctive" spec with a half-built component reads worse than a restrained one done fully. Ship the smaller, coherent version.

**See also:** `rules/agent/theme-consistency.md`, `rules/agent/accessibility-rules.md`, and the `design-tokens` skill.
