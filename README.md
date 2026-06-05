# AgentBuff Presentation

> **AgentBuff Presentation** is a presentation-building **agent skill** — a modified and upgraded version of the open-source [Frontend Slides](https://github.com/zarazhangrui/frontend-slides) skill, reworked into its own project — that lets *any* AI coding agent design beautiful decks and export them to **HTML, PDF, PNG/JPG, or PPTX**, with every export pixel-identical to the deck.

**Modified & developed by [Nugraha Labib Mujaddid](https://github.com/nugrahalabib)**

A skill for any coding agent — Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, and others — to create stunning presentations from scratch or by converting PowerPoint files, then export them to HTML, PDF, images, or PowerPoint. There is **no plugin and nothing Claude-specific**: the core `SKILL.md` is plain instructions any agent with filesystem and shell access can read.

## What This Does

**AgentBuff Presentation** helps non-designers create beautiful web presentations without knowing CSS or JavaScript. It uses a "show, don't tell" approach: instead of asking you to describe your aesthetic preferences in words, it generates visual previews and lets you pick what you like.

Here is a deck about the skill, made through the skill:

https://github.com/user-attachments/assets/ef57333e-f879-432a-afb9-180388982478

### Key Features

- **Zero Dependencies** — Single HTML files with inline CSS/JS. No npm, no build tools, no frameworks.
- **Multi-Format Export** — One command turns the deck into **PDF, PNG/JPG, or PPTX** — all pixel-identical to the HTML (PPTX in image or editable mode).
- **Agent-Agnostic** — No plugin, nothing Claude-specific. Any agent with filesystem + shell access can use it.
- **Visual Style Discovery** — Can't articulate design preferences? No problem. Pick from generated visual previews.
- **PPT Conversion** — Convert existing PowerPoint files to web, preserving all images and content.
- **Anti-AI-Slop** — Curated distinctive styles that avoid generic AI aesthetics (bye-bye, purple gradients on white).
- **Bold Template Pack** — Optional design-forward templates from `beautiful-html-templates`, loaded progressively so safe presets still work as the default fallback.
- **Production Quality** — Accessible, fixed 16:9, well-commented code you can customize.

## Installation

No plugin, no marketplace — it's just a skill folder. Install it by copying the files into your agent's skills directory, or simply point your agent at `SKILL.md`.

**Any agent (recommended):** give the agent this repo (or the local folder) and ask it to *"use the AgentBuff Presentation skill in `SKILL.md`."* It reads `SKILL.md` and loads only the support files it needs.

**Install into a skills directory** (example for Claude Code — the folder name must match the skill name `agentbuff-presentation`):

```bash
mkdir -p ~/.claude/skills/agentbuff-presentation
git clone https://github.com/nugrahalabib/AgentBuff-Presentation-Skills.git ~/.claude/skills/agentbuff-presentation
# then invoke it in Claude Code: /agentbuff-presentation
```

For any other agent, copy the same files into whatever local skills directory that agent uses. The agent should start from `SKILL.md` and load the support files it references (`STYLE_PRESETS.md`, `viewport-base.css`, `html-template.md`, `animation-patterns.md`, `bold-template-pack/`, `scripts/`).

## Usage

### Create a New Presentation

In Claude Code, type `/agentbuff-presentation`. In any other agent, ask it to use the AgentBuff Presentation skill and point it at `SKILL.md`:

```text
/agentbuff-presentation

> "I want to create a pitch deck for my AI startup"
```

The skill will:

1. Ask about your content (slides, messages, images)
2. Generate 3 visual style previews for you to compare, inferring the vibe from your brief unless you already named one
3. Let you pick the visual direction
4. Create the full presentation in your chosen style
5. Open it in your browser

### Convert a PowerPoint

```text
/agentbuff-presentation

> "Convert my presentation.pptx to a web slideshow"
```

The skill will:

1. Extract all text, images, and notes from your PPT
2. Show you the extracted content for confirmation
3. Let you pick a visual style
4. Generate an HTML presentation with all your original assets

## Included Styles

### Dark Themes

- **Bold Signal** — Confident, high-impact, vibrant card on dark
- **Electric Studio** — Clean, professional, split-panel
- **Creative Voltage** — Energetic, retro-modern, electric blue + neon
- **Dark Botanical** — Elegant, sophisticated, warm accents

### Light Themes

- **Notebook Tabs** — Editorial, organized, paper with colorful tabs
- **Pastel Geometry** — Friendly, approachable, vertical pills
- **Split Pastel** — Playful, modern, two-color vertical split
- **Vintage Editorial** — Witty, personality-driven, geometric shapes

### Specialty

- **Neon Cyber** — Futuristic, particle backgrounds, neon glow
- **Terminal Green** — Developer-focused, hacker aesthetic
- **Swiss Modern** — Minimal, Bauhaus-inspired, geometric
- **Paper & Ink** — Literary, drop caps, pull quotes

### Bold Template Pack

The skill also includes 34 optional bold design systems from
`beautiful-html-templates`, such as **Neo-Grid Bold**, **Editorial Tri-Tone**,
**Creative Mode**, **Broadside**, **Signal**, and **Vellum**.

During style discovery, the preview set is:

- 1 safe preset from `STYLE_PRESETS.md`
- at least 1 bold template option from `bold-template-pack/selection-index.json`
- 1 wildcard option, either another bold template or a self-generated custom design

The agent reads the compact bold template index first, then loads only the
shortlisted candidates' small `preview.md` cards for title-slide previews. It
loads the full `design.md` for exactly one bold template only after the user
picks that template for the final deck. If the user picks a custom wildcard,
the agent expands that preview's own CSS and layout system into the full deck.

## Bold Template Gallery

AgentBuff Presentation can now draw from the 34 bold design systems in [`beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates). Three screenshots per template show how each visual system handles different slide layouts. Click any template name to inspect the source template library.

### [Soft Editorial](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/soft-editorial/)

<p>
  <img src="assets/screenshots/soft-editorial-4.png" width="32.5%" alt="Soft Editorial — slide 4" />
  <img src="assets/screenshots/soft-editorial-6.png" width="32.5%" alt="Soft Editorial — slide 6" />
  <img src="assets/screenshots/soft-editorial-10.png" width="32.5%" alt="Soft Editorial — slide 10" />
</p>

> Cormorant Garamond serif on warm paper with sage, blush, and lemon accents.

### [Editorial Forest](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/editorial-forest/)

<p>
  <img src="assets/screenshots/editorial-forest-1.png" width="32.5%" alt="Editorial Forest — slide 1" />
  <img src="assets/screenshots/editorial-forest-2.png" width="32.5%" alt="Editorial Forest — slide 2" />
  <img src="assets/screenshots/editorial-forest-5.png" width="32.5%" alt="Editorial Forest — slide 5" />
</p>

> Forest green, dusty pink, and warm cream in Source Serif 4 — quiet, intentional quarterly-review aesthetic.

### [Pin & Paper](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/pin-and-paper/)

<p>
  <img src="assets/screenshots/pin-and-paper-1.png" width="32.5%" alt="Pin & Paper — slide 1" />
  <img src="assets/screenshots/pin-and-paper-11.png" width="32.5%" alt="Pin & Paper — slide 11" />
  <img src="assets/screenshots/pin-and-paper-3.png" width="32.5%" alt="Pin & Paper — slide 3" />
</p>

> Yellow paper with safety-pin illustrations, ink-blue handwritten Caveat, paper-grain texture.

### [Sakura Chroma](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/sakura-chroma/)

<p>
  <img src="assets/screenshots/sakura-chroma-1.png" width="32.5%" alt="Sakura Chroma — slide 1" />
  <img src="assets/screenshots/sakura-chroma-3.png" width="32.5%" alt="Sakura Chroma — slide 3" />
  <img src="assets/screenshots/sakura-chroma-4.png" width="32.5%" alt="Sakura Chroma — slide 4" />
</p>

> Vintage Japanese cassette-package aesthetic: cream paper, diagonal rainbow ribbons, condensed bold type, JIS-style spec checkboxes.

### [Stencil & Tablet](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/stencil-tablet/)

<p>
  <img src="assets/screenshots/stencil-tablet-1.png" width="32.5%" alt="Stencil & Tablet — slide 1" />
  <img src="assets/screenshots/stencil-tablet-3.png" width="32.5%" alt="Stencil & Tablet — slide 3" />
  <img src="assets/screenshots/stencil-tablet-8.png" width="32.5%" alt="Stencil & Tablet — slide 8" />
</p>

> Bone paper with stencil-cut headlines and a six-color earth palette: archaeology meets brand.

### [Cobalt Grid](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/cobalt-grid/)

<p>
  <img src="assets/screenshots/cobalt-grid-1.png" width="32.5%" alt="Cobalt Grid — slide 1" />
  <img src="assets/screenshots/cobalt-grid-3.png" width="32.5%" alt="Cobalt Grid — slide 3" />
  <img src="assets/screenshots/cobalt-grid-5.png" width="32.5%" alt="Cobalt Grid — slide 5" />
</p>

> Electric cobalt italic serifs on a graph-paper canvas, anchored by stair-stepped pixel-glitch decorations and slim hairline rules.

### [Vellum](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/vellum/)

<p>
  <img src="assets/screenshots/vellum-1.png" width="32.5%" alt="Vellum — slide 1" />
  <img src="assets/screenshots/vellum-4.png" width="32.5%" alt="Vellum — slide 4" />
  <img src="assets/screenshots/vellum-8.png" width="32.5%" alt="Vellum — slide 8" />
</p>

> Deep navy canvas with warm-yellow italic Cormorant serifs and a single dusty teal accent. A quiet, scholarly aesthetic.

### [Emerald Editorial](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/emerald-editorial/)

<p>
  <img src="assets/screenshots/emerald-editorial-1.png" width="32.5%" alt="Emerald Editorial — slide 1" />
  <img src="assets/screenshots/emerald-editorial-3.png" width="32.5%" alt="Emerald Editorial — slide 3" />
  <img src="assets/screenshots/emerald-editorial-6.png" width="32.5%" alt="Emerald Editorial — slide 6" />
</p>

> Magazine-cover business deck: emerald + navy + paper with double-rule masthead ornaments and a heavy Bodoni-style display serif.

### [Neo-Grid Bold](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/neo-grid-bold/)

<p>
  <img src="assets/screenshots/neo-grid-bold-1.png" width="32.5%" alt="Neo-Grid Bold — slide 1" />
  <img src="assets/screenshots/neo-grid-bold-3.png" width="32.5%" alt="Neo-Grid Bold — slide 3" />
  <img src="assets/screenshots/neo-grid-bold-8.png" width="32.5%" alt="Neo-Grid Bold — slide 8" />
</p>

> Editorial neo-brutalism with a single neon yellow accent on off-white paper.

### [Editorial Tri-Tone](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/editorial-tri-tone/)

<p>
  <img src="assets/screenshots/editorial-tri-tone-1.png" width="32.5%" alt="Editorial Tri-Tone — slide 1" />
  <img src="assets/screenshots/editorial-tri-tone-4.png" width="32.5%" alt="Editorial Tri-Tone — slide 4" />
  <img src="assets/screenshots/editorial-tri-tone-3.png" width="32.5%" alt="Editorial Tri-Tone — slide 3" />
</p>

> Three-color editorial system: dusty pink, mustard cream, and deep burgundy, set in Bricolage + Instrument Serif.

### [Creative Mode](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/creative-mode/)

<p>
  <img src="assets/screenshots/creative-mode-1.png" width="32.5%" alt="Creative Mode — slide 1" />
  <img src="assets/screenshots/creative-mode-4.png" width="32.5%" alt="Creative Mode — slide 4" />
  <img src="assets/screenshots/creative-mode-6.png" width="32.5%" alt="Creative Mode — slide 6" />
</p>

> Cream paper canvas with confident multi-color (green, pink, orange, yellow) accents and Archivo Black display.

### [Monochrome](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/monochrome/)

<p>
  <img src="assets/screenshots/monochrome-1.png" width="32.5%" alt="Monochrome — slide 1" />
  <img src="assets/screenshots/monochrome-4.png" width="32.5%" alt="Monochrome — slide 4" />
  <img src="assets/screenshots/monochrome-12.png" width="32.5%" alt="Monochrome — slide 12" />
</p>

> Ivory ledger paper with all-black type; Lora serif headlines, Jost body, no color at all.

### [People's Platform (Block & Bold)](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/peoples-platform/)

<p>
  <img src="assets/screenshots/peoples-platform-1.png" width="32.5%" alt="People's Platform (Block & Bold) — slide 1" />
  <img src="assets/screenshots/peoples-platform-4.png" width="32.5%" alt="People's Platform (Block & Bold) — slide 4" />
  <img src="assets/screenshots/peoples-platform-8.png" width="32.5%" alt="People's Platform (Block & Bold) — slide 8" />
</p>

> Activist poster energy: blue, orange, red on cream, with Alfa Slab + Caveat Brush.

### [Pink Script — After Hours](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/pink-script/)

<p>
  <img src="assets/screenshots/pink-script-1.png" width="32.5%" alt="Pink Script — After Hours — slide 1" />
  <img src="assets/screenshots/pink-script-4.png" width="32.5%" alt="Pink Script — After Hours — slide 4" />
  <img src="assets/screenshots/pink-script-8.png" width="32.5%" alt="Pink Script — After Hours — slide 8" />
</p>

> Black canvas, hot pink accent, pearl-cream paper, Instrument Serif headlines: late-night editorial luxury.

### [8-Bit Orbit](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/8-bit-orbit/)

<p>
  <img src="assets/screenshots/8-bit-orbit-1.png" width="32.5%" alt="8-Bit Orbit — slide 1" />
  <img src="assets/screenshots/8-bit-orbit-6.png" width="32.5%" alt="8-Bit Orbit — slide 6" />
  <img src="assets/screenshots/8-bit-orbit-5.png" width="32.5%" alt="8-Bit Orbit — slide 5" />
</p>

> Pixel-art neon arcade aesthetic on a deep navy void.

### [BlockFrame](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/block-frame/)

<p>
  <img src="assets/screenshots/block-frame-1.png" width="32.5%" alt="BlockFrame — slide 1" />
  <img src="assets/screenshots/block-frame-4.png" width="32.5%" alt="BlockFrame — slide 4" />
  <img src="assets/screenshots/block-frame-8.png" width="32.5%" alt="BlockFrame — slide 8" />
</p>

> Neobrutalist deck with pastel-neon color blocks and chunky black borders.

### [Blue Professional](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/blue-professional/)

<p>
  <img src="assets/screenshots/blue-professional-1.png" width="32.5%" alt="Blue Professional — slide 1" />
  <img src="assets/screenshots/blue-professional-6.png" width="32.5%" alt="Blue Professional — slide 6" />
  <img src="assets/screenshots/blue-professional-8.png" width="32.5%" alt="Blue Professional — slide 8" />
</p>

> Cream paper background with electric cobalt blue accents; clean modern professional.

### [Bold Poster](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/bold-poster/)

<p>
  <img src="assets/screenshots/bold-poster-1.png" width="32.5%" alt="Bold Poster — slide 1" />
  <img src="assets/screenshots/bold-poster-4.png" width="32.5%" alt="Bold Poster — slide 4" />
  <img src="assets/screenshots/bold-poster-8.png" width="32.5%" alt="Bold Poster — slide 8" />
</p>

> Editorial poster aesthetic with massive Shrikhand display and a single fire-engine red accent.

### [Broadside](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/broadside/)

<p>
  <img src="assets/screenshots/broadside-1.png" width="32.5%" alt="Broadside — slide 1" />
  <img src="assets/screenshots/broadside-4.png" width="32.5%" alt="Broadside — slide 4" />
  <img src="assets/screenshots/broadside-13.png" width="32.5%" alt="Broadside — slide 13" />
</p>

> Dark editorial canvas with a single fire orange accent and bilingual Latin/Chinese type stack.

### [Capsule](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/capsule/)

<p>
  <img src="assets/screenshots/capsule-1.png" width="32.5%" alt="Capsule — slide 1" />
  <img src="assets/screenshots/capsule-4.png" width="32.5%" alt="Capsule — slide 4" />
  <img src="assets/screenshots/capsule-8.png" width="32.5%" alt="Capsule — slide 8" />
</p>

> Modular pill-shaped cards on warm bone with a full pastel-pop palette.

### [Cartesian](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/cartesian/)

<p>
  <img src="assets/screenshots/cartesian-1.png" width="32.5%" alt="Cartesian — slide 1" />
  <img src="assets/screenshots/cartesian-4.png" width="32.5%" alt="Cartesian — slide 4" />
  <img src="assets/screenshots/cartesian-8.png" width="32.5%" alt="Cartesian — slide 8" />
</p>

> Quiet warm-neutral palette with classical Playfair serifs; tasteful and unhurried.

### [Coral](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/coral/)

<p>
  <img src="assets/screenshots/coral-1.png" width="32.5%" alt="Coral — slide 1" />
  <img src="assets/screenshots/coral-4.png" width="32.5%" alt="Coral — slide 4" />
  <img src="assets/screenshots/coral-8.png" width="32.5%" alt="Coral — slide 8" />
</p>

> Cream and coral on near-black, set in oversized Bebas Neue.

### [Daisy Days](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/daisy-days/)

<p>
  <img src="assets/screenshots/daisy-days-1.png" width="32.5%" alt="Daisy Days — slide 1" />
  <img src="assets/screenshots/daisy-days-4.png" width="32.5%" alt="Daisy Days — slide 4" />
  <img src="assets/screenshots/daisy-days-8.png" width="32.5%" alt="Daisy Days — slide 8" />
</p>

> Cheerful pastel deck with hand-drawn daisies, stars, and rainbows. Friendly, soft, and warm.

### [Grove](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/grove/)

<p>
  <img src="assets/screenshots/grove-1.png" width="32.5%" alt="Grove — slide 1" />
  <img src="assets/screenshots/grove-4.png" width="32.5%" alt="Grove — slide 4" />
  <img src="assets/screenshots/grove-8.png" width="32.5%" alt="Grove — slide 8" />
</p>

> Forest-green canvas with cream type, classical Playfair serifs, and a single rust accent.

### [Mat](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/mat/)

<p>
  <img src="assets/screenshots/mat-1.png" width="32.5%" alt="Mat — slide 1" />
  <img src="assets/screenshots/mat-4.png" width="32.5%" alt="Mat — slide 4" />
  <img src="assets/screenshots/mat-8.png" width="32.5%" alt="Mat — slide 8" />
</p>

> Dark sage canvas with bone paper and burnt-orange accent; mid-century modern with wood undertones.

### [Playful](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/playful/)

<p>
  <img src="assets/screenshots/playful-1.png" width="32.5%" alt="Playful — slide 1" />
  <img src="assets/screenshots/playful-6.png" width="32.5%" alt="Playful — slide 6" />
  <img src="assets/screenshots/playful-8.png" width="32.5%" alt="Playful — slide 8" />
</p>

> Sun-warm peach background with Syne display: a friendly indie launch deck.

### [Raw Grid](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/raw-grid/)

<p>
  <img src="assets/screenshots/raw-grid-1.png" width="32.5%" alt="Raw Grid — slide 1" />
  <img src="assets/screenshots/raw-grid-4.png" width="32.5%" alt="Raw Grid — slide 4" />
  <img src="assets/screenshots/raw-grid-8.png" width="32.5%" alt="Raw Grid — slide 8" />
</p>

> Neo-brutalist deck with thick borders, offset shadows, and a pink/sage/ink palette.

### [Retro Windows](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/retro-windows/)

<p>
  <img src="assets/screenshots/retro-windows-1.png" width="32.5%" alt="Retro Windows — slide 1" />
  <img src="assets/screenshots/retro-windows-4.png" width="32.5%" alt="Retro Windows — slide 4" />
  <img src="assets/screenshots/retro-windows-8.png" width="32.5%" alt="Retro Windows — slide 8" />
</p>

> Windows 95 chrome: gray title bars, MS Sans Serif, pixel typography, full nostalgia.

### [Retro Zine](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/retro-zine/)

<p>
  <img src="assets/screenshots/retro-zine-1.png" width="32.5%" alt="Retro Zine — slide 1" />
  <img src="assets/screenshots/retro-zine-4.png" width="32.5%" alt="Retro Zine — slide 4" />
  <img src="assets/screenshots/retro-zine-8.png" width="32.5%" alt="Retro Zine — slide 8" />
</p>

> Beige paper with green accent and Bebas Neue + Caveat: a riso-printed zine in HTML form.

### [Scatterbrain](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/scatterbrain/)

<p>
  <img src="assets/screenshots/scatterbrain-1.png" width="32.5%" alt="Scatterbrain — slide 1" />
  <img src="assets/screenshots/scatterbrain-4.png" width="32.5%" alt="Scatterbrain — slide 4" />
  <img src="assets/screenshots/scatterbrain-8.png" width="32.5%" alt="Scatterbrain — slide 8" />
</p>

> Post-it inspired: pastel sticky notes, Caveat handwriting, Shrikhand and Zilla Slab type stack.

### [Signal](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/signal/)

<p>
  <img src="assets/screenshots/signal-1.png" width="32.5%" alt="Signal — slide 1" />
  <img src="assets/screenshots/signal-18.png" width="32.5%" alt="Signal — slide 18" />
  <img src="assets/screenshots/signal-8.png" width="32.5%" alt="Signal — slide 8" />
</p>

> Deep navy canvas with bone paper and a single muted-gold accent; institutional with quiet weight.

### [Studio](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/studio/)

<p>
  <img src="assets/screenshots/studio-1.png" width="32.5%" alt="Studio — slide 1" />
  <img src="assets/screenshots/studio-4.png" width="32.5%" alt="Studio — slide 4" />
  <img src="assets/screenshots/studio-8.png" width="32.5%" alt="Studio — slide 8" />
</p>

> Black canvas with electric-yellow type; high-voltage design studio aesthetic.

### [Biennale Yellow](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/biennale-yellow/)

<p>
  <img src="assets/screenshots/biennale-yellow-1.png" width="32.5%" alt="Biennale Yellow — slide 1" />
  <img src="assets/screenshots/biennale-yellow-5.png" width="32.5%" alt="Biennale Yellow — slide 5" />
  <img src="assets/screenshots/biennale-yellow-8.png" width="32.5%" alt="Biennale Yellow — slide 8" />
</p>

> Solar yellow on warm parchment with deep indigo serif and atmospheric sun-glow gradients. Dutch-editorial poster energy.

### [Long Table](https://github.com/zarazhangrui/beautiful-html-templates/tree/main/templates/long-table/)

<p>
  <img src="assets/screenshots/long-table-1.png" width="32.5%" alt="Long Table — slide 1" />
  <img src="assets/screenshots/long-table-3.png" width="32.5%" alt="Long Table — slide 3" />
  <img src="assets/screenshots/long-table-7.png" width="32.5%" alt="Long Table — slide 7" />
</p>

> Warm cream and rust-red supper-club aesthetic with bold uppercase grotesk headlines, italic Fraunces, and pill-shaped outlined buttons.

## Architecture

This skill uses **progressive disclosure** — the main `SKILL.md` is a workflow map, with supporting files loaded on-demand only when needed:

| File                      | Purpose                        | Loaded When               |
| ------------------------- | ------------------------------ | ------------------------- |
| `SKILL.md`                | Core workflow and rules        | Always (skill invocation) |
| `STYLE_PRESETS.md`        | 12 curated visual presets      | Phase 2 (style selection) |
| `bold-template-pack/selection-index.json` | Compact bold template metadata | Phase 2 (candidate selection) |
| `bold-template-pack/templates/*/preview.md` | Tiny style cards for shortlisted bold previews | Phase 2 after shortlisting |
| `bold-template-pack/templates/*/design.md` | Full design system for the selected bold template | Phase 3 after user selection |
| `viewport-base.css`       | Mandatory fixed-stage CSS      | Phase 3 (generation)      |
| `html-template.md`        | HTML structure and JS features | Phase 3 (generation)      |
| `animation-patterns.md`   | CSS/JS animation reference     | Phase 3 (generation)      |
| `scripts/extract-pptx.py` | PPT content extraction         | Phase 4 (conversion)      |
| `scripts/export-deck.mjs` | Export to PDF / PNG / JPG / PPTX (pixel-identical) | Phase 6 (export) |
| `scripts/deploy.sh`       | Deploy to Vercel               | Phase 6 (sharing)         |
| `scripts/export-pdf.sh`   | Export slides to PDF (PDF-only alternative) | Phase 6 (sharing)        |

Maintenance-only source metadata and regeneration helpers live outside the
user-facing skill package. Normal users do not need them.

This design follows agent-skill best practices: give the agent a map first,
then reveal only the specific files needed for the current choice.

## Philosophy

This skill was born from the belief that:

1. **You don't need to be a designer to make beautiful things.** You just need to react to what you see.

2. **Dependencies are debt.** A single HTML file will work in 10 years. A React project from 2019? Good luck.

3. **Generic is forgettable.** Every presentation should feel custom-crafted, not template-generated.

4. **Comments are kindness.** Code should explain itself to future-you (or anyone else who opens it).

## Sharing & Exporting

After creating a presentation, export it to any format or share it as a live URL.

### Export to PDF / Images / PPTX

One command — every output is the deck's own 1920×1080 render, so it is pixel-identical to the HTML:

```bash
# pick any of: pdf, png, jpg, pptx — or "all"
node scripts/export-deck.mjs ./presentation.html --format=all
node scripts/export-deck.mjs ./presentation.html --format=pdf,pptx
node scripts/export-deck.mjs ./presentation.html --format=pptx --pptx-mode=editable
```

On first run it auto-installs its tools (Playwright + Chromium, plus `pptxgenjs` for PPTX) into a shared cache. PPTX has two modes: `image` (default — pixel-identical) and `editable` (native text boxes, editable in PowerPoint but visually approximate). Flags: `--out=DIR`, `--compact`, `--jpeg-quality=N`.

### Deploy to a Live URL

One command deploys your slides to a permanent, shareable URL that works on any device — phones, tablets, laptops:

```bash
bash scripts/deploy.sh ./my-deck/
# or
bash scripts/deploy.sh ./presentation.html
```

Uses [Vercel](https://vercel.com) (free tier). The skill walks you through signup and login if it's your first time.

### Export to PDF

Convert your slides to a PDF for email, Slack, Notion, or printing:

```bash
bash scripts/export-pdf.sh ./my-deck/index.html
bash scripts/export-pdf.sh ./presentation.html ./output.pdf
```

Uses [Playwright](https://playwright.dev) to screenshot each slide at 1920×1080 and combine into a PDF. Installs automatically if needed. Animations are not preserved (it's a static snapshot).

## Requirements

- Any agent (or person) with filesystem access and the ability to run shell commands — no plugin or marketplace needed
- For export (PDF / PNG / JPG / PPTX): Node.js (Playwright + `pptxgenjs` install automatically on first run)
- For PPT conversion: Python with `python-pptx` library
- For URL deployment: Node.js + a free Vercel account

## Credits

- **Modified, upgraded & developed by [Nugraha Labib Mujaddid](https://github.com/nugrahalabib)** — this project: the agent-agnostic rework, the unified multi-format exporter (PDF/PNG/JPG/PPTX, image + editable), and these docs.
- Built on top of the original **Frontend Slides** skill and the **Bold Template Pack** by [@zarazhangrui](https://github.com/zarazhangrui).

## License

MIT — see [`LICENSE`](LICENSE). Use it, modify it, share it.
