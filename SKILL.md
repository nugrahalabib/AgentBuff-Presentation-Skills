---
name: agentbuff-presentation
description: Create stunning presentations and deliver them in any format — an interactive HTML deck, PDF, PNG/JPG images, or PPTX (PowerPoint) — with every export pixel-identical to the HTML. Build from scratch or convert an existing PowerPoint. Works with ANY coding agent that has filesystem and shell access (Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, and others), not just Claude. Use when the user wants a presentation, slides, a deck, a pitch, or to export/convert slides to PDF, images, or PowerPoint. Helps non-designers discover their aesthetic by seeing visual previews rather than describing taste.
---

# AgentBuff Presentation

Create distinctive presentations and deliver them in whatever format the user needs. The presentation is authored once as a zero-dependency, animation-rich HTML deck that runs entirely in the browser; that HTML deck is the **single source of truth**. From it you can export a PDF, PNG/JPG images, or a PPTX (PowerPoint) file — all generated from the same 1920×1080 render, so every export looks **exactly** like the deck.

This skill is **agent-agnostic**: the workflow and its scripts use only standard tooling (a browser, Node.js, and optional Python), with no Claude-specific APIs. Any agent or runtime with filesystem and shell access — Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, a CI job, or a person — can follow `SKILL.md` and run the scripts. (See [Portability](#portability--running-in-any-agent).)

## Core Principles

1. **Zero Dependencies in the output** — The deck is a single HTML file with inline CSS/JS. No npm, no build tools, no frameworks at runtime. (Export to PDF/image/PPTX uses a headless browser, but the deck itself stays dependency-free.)
2. **Show, Don't Tell** — Generate visual previews, not abstract choices. People discover what they want by seeing it.
3. **Distinctive Design** — No generic "AI slop." Every presentation must feel custom-crafted.
4. **Progressive Disclosure** — Read lightweight style indexes first. For bold templates, use small preview cards for style previews and load the full `design.md` only after the user picks that template.
5. **Fixed 16:9 Stage (NON-NEGOTIABLE)** — Every deck uses a 1920×1080 slide canvas scaled as a whole to the viewport. Slides must stay 16:9 on every screen, including phones. Do not reflow slide content to fit the device. (This is also what makes lossless export possible — each slide is a fixed 1920×1080 frame.)
6. **Author Once, Export Anywhere** — The HTML deck is canonical. PDF, PNG, JPG, and PPTX are all produced from the same per-slide 1920×1080 screenshots, so they are pixel-identical to the deck. Never re-typeset content into another format by hand — always export from the rendered deck so nothing drifts.

## Output Formats

The HTML deck is always built first (it carries the design). Everything else is exported from it:

| Format | What it is | Best for | How |
| ------ | ---------- | -------- | --- |
| **HTML deck** | Interactive, animated, single file | Presenting live, sharing a link, inline editing | The core generation flow (Phases 1–3) |
| **PDF** | One slide per page, 16:9 | Email, print, Notion, universal sharing | `scripts/export-deck.mjs --format=pdf` |
| **PNG / JPG** | One image per slide, 1920×1080 | Thumbnails, social, docs, embedding | `scripts/export-deck.mjs --format=png` / `jpg` |
| **PPTX** | PowerPoint, one full-bleed image per slide | Handing off to PowerPoint/Keynote users | `scripts/export-deck.mjs --format=pptx` |

Many users ultimately want the PDF, image, or PPTX more than the raw HTML — ask which deliverables they need (Phase 1, Question 5) and produce them at delivery (Phase 6).

**PPTX has two modes (the user chooses fidelity vs. editability):**

- **`image` (default)** — each slide is a full-bleed image: pixel-perfect, identical to the deck, but the text is **not editable** in PowerPoint.
- **`editable` (`--pptx-mode=editable`)** — each slide is rebuilt as native shapes + text boxes: the text **is editable** in PowerPoint, but the look is **approximate** (PowerPoint substitutes the web fonts and re-wraps text, so spacing/positioning drift from the deck).

You cannot have both at once. If the user wants something that "looks exactly like the deck," use `image`. If they want to keep editing the text in PowerPoint, use `editable`. When unsure, ask; default to `image`.

## Design Aesthetics

You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight.

Focus on:

- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)
- Cliched color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!

## Fixed Stage Rules

These invariants apply to EVERY slide in EVERY presentation:

- Every deck has a viewport wrapper that fills the browser window.
- Every slide is authored inside a fixed 1920×1080 stage.
- The stage scales uniformly to fit the viewport. It may letterbox/pillarbox; it must not re-layout content.
- Do not use responsive breakpoints to rearrange slide content for phones.
- Use fixed internal slide measurements at the 1920×1080 design size.
- Slide visibility must be controlled by `.active` / `.visible` using `visibility`, `opacity`, and `pointer-events` from `viewport-base.css`. Do not use `display: none` / `display: block` for slide switching; later layout classes such as `.slide-content { display: flex; }` can override them and make every slide visible at once.
- Use `clamp()` only for non-slide UI outside the stage, or for small fallback previews where a full stage is impractical.
- Include `prefers-reduced-motion` support
- Never negate CSS functions directly (`-clamp()`, `-min()`, `-max()` are silently ignored) — use `calc(-1 * clamp(...))` instead

**When generating, read `viewport-base.css` and include its full contents in every presentation.**

### Content Density Modes

Ask the user whether this is primarily a reading deck or a speaking deck, then design around that answer:

| Density mode | Best for | Design behavior |
| ------------- | -------- | --------------- |
| **Low density / speaker-led** | Public talks, keynote-style sharing, live explanation | One idea per slide, large type, strong visual hierarchy, generous negative space, 1-3 bullets max, more slides if needed |
| **High density / reading-first** | Reports, handouts, async review, detailed internal docs | More self-contained slides, structured grids/tables/annotations, 4-8 bullets or 4-6 cards when readable, tighter but still intentional spacing |

Baseline limits still apply: no scrolling, no overflow, no overlapping panels, and no text below comfortable reading size. If content exceeds the selected density mode, split it into more slides instead of shrinking until it becomes cramped.

---

## Phase 0: Detect Mode

Determine what the user wants:

- **Mode A: New Presentation** — Create from scratch. Go to Phase 1.
- **Mode B: PPT Conversion** — Convert a .pptx file. Go to Phase 4.
- **Mode C: Enhancement** — Improve an existing HTML presentation. Read it, understand it, enhance. **Follow Mode C modification rules below.**

### Mode C: Modification Rules

When enhancing existing presentations, fixed-stage fitting is the biggest risk:

1. **Before adding content:** Count existing elements, check against density limits
2. **Adding images:** Fit them inside the 1920×1080 slide canvas. If slide already has max content, split into two slides
3. **Adding text:** Max 4-6 bullets per slide. Exceeds limits? Split into continuation slides
4. **After ANY modification, verify:** the slide stage remains 16:9, no text overflows its card, no panels overlap, and screenshots look correct at 1280×720 plus one phone viewport
5. **Proactively reorganize:** If modifications will cause overflow, automatically split content and inform the user. Don't wait to be asked

**When adding images to existing slides:** Move image to a new slide or reduce other content first. Never add images without checking if existing content already fills the 1920×1080 slide stage.

---

## Phase 1: Content Discovery (New Presentations)

**Ask ALL questions together** so the user fills everything out at once. If the current environment provides a native structured-question UI, use it; otherwise ask in one concise message with clearly numbered choices:

**Question 1 — Purpose** (header: "Purpose"):
What is this presentation for? Options: Pitch deck / Teaching-Tutorial / Conference talk / Internal presentation

**Question 2 — Length** (header: "Length"):
Approximately how many slides? Options: Short 5-10 / Medium 10-20 / Long 20+

**Question 3 — Content** (header: "Content"):
Do you have content ready? Options: All content ready / Rough notes / Topic only

**Question 4 — Density** (header: "Density"):
How dense should the deck feel? Options:

- "Low density / speaker-led" — Big ideas, fewer words, more visual breathing room
- "High density / reading-first" — More self-contained detail for async reading

**Question 5 — Deliverable format(s)** (header: "Format", allow multiple):
Which formats do you want to receive? The interactive HTML deck is always created as the source; pick any extras to export from it. Options:

- "Interactive HTML deck" — the live, animated presentation (always produced)
- "PDF" — universal file for email, print, Notion
- "Images (PNG/JPG)" — one image per slide
- "PowerPoint (PPTX)" — slides as a .pptx (full-bleed images; pixel-perfect but not text-editable)

Remember the answer. It does not change how the deck is designed (the design always lives in the HTML), but it tells you what to produce at delivery (Phase 6). If the user is unsure, default to building the HTML deck and offering exports afterward. Do not let format choice block the creative flow — always design the deck first, then export.

**Do not ask about inline editing during Phase 1.** Users should not have to choose editing behavior before seeing a draft. Inline editing is a post-draft affordance: include it by default unless the user explicitly asks for a locked/export-only file.

Remember the user's density choice. It affects slide count, typography scale, amount of text per slide, layout density, and whether to favor cinematic presenter slides or self-contained reading slides.

If user has content, ask them to share it.

### Step 1.2: Image Evaluation (if images provided)

If user selected "No images" → skip to Phase 2.

If user provides an image folder:

1. **Scan** — List all image files (.png, .jpg, .svg, .webp, etc.)
2. **Inspect each image** — Use the agent's available image-understanding capability. If image reading is unavailable, use filenames/metadata and ask the user to clarify only when needed
3. **Evaluate** — For each: what it shows, USABLE or NOT USABLE (with reason), what concept it represents, dominant colors
4. **Co-design the outline** — Curated images inform slide structure alongside text. This is NOT "plan slides then add images" — design around both from the start (e.g., 3 screenshots → 3 feature slides, 1 logo → title/closing slide)
5. **Confirm the outline** using the same structured-question mechanism when available: "Does this slide outline and image selection look right?" Options: Looks good / Adjust images / Adjust outline

**Logo in previews:** If a usable logo was identified, embed it (base64) into each style preview in Phase 2 — the user sees their brand styled three different ways.

---

## Phase 2: Style Discovery

**This is the "show, don't tell" phase.** Most people can't articulate design preferences in words.

### Step 2.0: Generate 3 Style Previews Directly

Based on purpose, audience, mood, and content density, generate 3 distinct single-slide HTML previews showing typography, colors, animation, and overall aesthetic.

Do not ask the user whether they want options or a preset picker. The default discovery experience is always visual comparison.

If the user already gave a vibe, use it. If they did not, infer the likely mood from the occasion, audience, content, and stakes. Keep the options diverse enough that the user can react visually instead of needing to articulate taste up front.

If the user explicitly names a preset or bold template, honor that as one option and generate the remaining preview slots around it.

Read [STYLE_PRESETS.md](STYLE_PRESETS.md) for safe preset candidates. If [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json) exists, read that compact index too, but do not read any `design.md` files yet.

| Mood                | Suggested Presets                                  |
| ------------------- | -------------------------------------------------- |
| Impressed/Confident | Bold Signal, Electric Studio, Dark Botanical       |
| Excited/Energized   | Creative Voltage, Neon Cyber, Split Pastel         |
| Calm/Focused        | Notebook Tabs, Paper & Ink, Swiss Modern           |
| Inspired/Moved      | Dark Botanical, Vintage Editorial, Pastel Geometry |

**Preview mix rules:**

- Generate 3 previews by default: 1 safe preset from `STYLE_PRESETS.md`, at least 1 bold template from `bold-template-pack/selection-index.json`, and 1 wildcard.
- The wildcard may be either a second bold template or a self-generated custom design. Choose whichever creates the strongest, most useful contrast for the user's occasion, audience, mood, and content.
- Do not force every expressive option to come from the template library. If the brief has a sharper, more specific design opportunity than the available templates, use the wildcard slot to design freely.
- For conservative or high-stakes decks, make the safe preset especially restrained; choose a calm, higher-formality bold template; make the wildcard either another restrained template or a custom design that feels authoritative rather than decorative.
- For expressive decks, keep the safe preset as a readable fallback; choose one strong bold template; make the wildcard adventurous, context-specific, and clearly different from both other previews.
- If bold template matches feel weak, use the wildcard as a custom design or fall back to another safe preset instead of forcing a template.

**Custom wildcard design rules:**

- Follow the Design Aesthetics section above: no generic "AI slop", no default font/color/layout choices, no purple-gradient-on-white clichés, no cookie-cutter dashboard/card look.
- Match the user's stated occasion, audience, mood/vibe, and content density. The custom design should feel authored for this deck, not merely "stylish."
- Make a deliberate visual thesis: distinctive typography, a committed palette, a recognizable layout system, and one strong atmospheric or graphic device.
- Keep it feasible for a full deck. The preview must imply a design system that can expand into section, content, quote, comparison, and closing slides.
- Use fixed 1920×1080 stage rules and pass the same preview authenticity checks as every other option.
- Never render "custom", "wildcard", "AI-generated", or design-process labels on the slide itself.

**Bold template selection rules:**

- Match user purpose and mood against `mood`, `tone`, `best_for`, `avoid_for`, `formality`, `density`, and `scheme`.
- Treat `best_for` examples as soft signals, not strict industry filters.
- Keep the three previews genuinely different from each other.
- After choosing bold template candidate(s), read only those candidate(s)' `preview.md` files from the `preview_md` paths in the selection index.
- Use `preview.md` only for title-slide previews. Do not read full `design.md` files until the user picks the final template.
- Do not read or copy `template.html` unless the selected final `design.md` is missing a critical implementation detail.

**Preview authenticity rules (NON-NEGOTIABLE):**

- Every style preview must look like a real first slide from the user's deck, not a diagnostic card.
- Never render internal workflow text on a slide: no `preview`, `generated from`, `preview.md`, `template`, `preset`, `style option`, `Option A/B/C`, file names, paths, or source-doc labels.
- Never render template names or slug names on the slide itself. Template/style names belong only in the message to the user.
- Never render user requirement notes as slide content, such as "sharp and provocative", "safe option", "bold option", "for internal sharing", or "audience: ...", unless the user explicitly wants that exact phrase to appear in the deck.
- If the slide needs chrome, use real deck chrome only: the deck title, section title, date, author, company, page number, or a genuine content phrase from the user's material.
- Before opening previews, inspect the visible text and revise if any internal metadata appears.

Save previews to `.agentbuff-presentation/slide-previews/` (style-a.html, style-b.html, style-c.html). Each should be self-contained and compact, showing one animated title slide.

Open each preview automatically for the user.

### Step 2.1: User Picks

Ask (header: "Style"):
Which style preview do you prefer? Options: Style A: [Name] / Style B: [Name] / Style C: [Name] / Mix elements

If "Mix elements", ask for specifics.

---

## Phase 3: Generate Presentation

Generate the full presentation using content from Phase 1 (text, or text + curated images) and style from Phase 2.

If images were provided, the slide outline already incorporates them from Step 1.2. If not, CSS-generated visuals (gradients, shapes, patterns) provide visual interest — this is a fully supported first-class path.

Apply the user's density choice throughout the deck:

- **Low density / speaker-led:** Use more slides with fewer ideas per slide. Favor large headings, short phrases, visual metaphors, section beats, quote/statement slides, and presenter-friendly pacing.
- **High density / reading-first:** Make slides more self-contained. Use structured grids, comparison tables, annotated diagrams, captions, and concise explanatory copy. Keep hierarchy strong so it feels designed, not like a document pasted onto slides.

If the user's stated needs are mixed, choose the closer of the two modes instead of inventing a middle option: live audience persuasion defaults low-density; async circulation or detailed review defaults high-density.

Never let high density become visual clutter. If a high-density slide starts to overflow, split it or redesign it into a clearer structure.

If the user selected a bold template from `bold-template-pack`, read that one template's full `design.md` before generating. Do not read the other bold templates. Treat `design.md` as the design recipe:

- Preserve its fonts, palette, decorative vocabulary, spacing rhythm, and component grammar.
- Generate the final deck as a fixed 1920×1080 stage scaled uniformly to the viewport, regardless of whether the source template originally used `deck-stage.js` or viewport-fluid CSS.
- Treat viewport-fluid values in `design.md` as design proportions to translate into 1920×1080 stage coordinates. Do not keep them as live viewport reflow rules in the final deck.
- Keep the output as a single self-contained AgentBuff Presentation HTML file.
- Do not copy demo slide content or mimic the source template too literally.
- Use `template.html` only as a last-resort implementation reference for the selected template.
- After generating, verify both content overflow and panel overlap in rendered browser screenshots. `scrollHeight` checks alone are not enough because grid panels can visually cover each other.

If the user selected a self-generated custom wildcard, treat that preview's CSS and layout as the design recipe:

- Preserve its fonts, palette, decorative vocabulary, spacing rhythm, grid logic, and component grammar.
- Expand the same visual system across the full deck. Do not switch to a preset or bold template after the user has chosen the custom direction.
- Design any missing slide layouts from that system rather than importing patterns from another style.
- Keep the output fixed-stage, single-file, and visually verified like every other deck.

**Before generating, read these supporting files:**

- [html-template.md](html-template.md) — HTML architecture and JS features
- [viewport-base.css](viewport-base.css) — Mandatory CSS (include in full)
- [animation-patterns.md](animation-patterns.md) — Animation reference for the chosen feeling

**Key requirements:**

- Single self-contained HTML file, all CSS/JS inline
- Include the FULL contents of viewport-base.css in the `<style>` block
- Use fonts from Fontshare or Google Fonts — never system fonts
- Add detailed comments explaining each section
- Every section needs a clear `/* === SECTION NAME === */` comment block

---

## Phase 4: PPT Conversion

When converting PowerPoint files:

1. **Extract content** — Run `python scripts/extract-pptx.py <input.pptx> <output_dir>` (install python-pptx if needed: `pip install python-pptx`)
2. **Confirm with user** — Present extracted slide titles, content summaries, and image counts
3. **Style selection** — Proceed to Phase 2 for style discovery
4. **Generate HTML** — Convert to chosen style, preserving all text, images (from assets/), slide order, and speaker notes (as HTML comments)

---

## Phase 5: Delivery

1. **Clean up** — Delete `.agentbuff-presentation/slide-previews/` if it exists
2. **Open** — Use `open [filename].html` to launch in browser
3. **Summarize** — Tell the user:
   - File location, style name, slide count
   - Navigation: Arrow keys, Space, swipe/tap if enabled
   - How to customize: `:root` CSS variables for colors, font link for typography, `.reveal` class for animations
   - Inline text editing is available: Hover top-left corner or press E to enter edit mode, click any text to edit, Ctrl+S to save
   - Offer the natural post-draft actions: ask for revisions, edit text directly in the browser, or export/share
4. **Produce requested exports** — If the user asked for PDF, images, or PPTX in Phase 1 (Question 5), go to Phase 6 now and generate them from the finished deck. Otherwise, offer exports as part of the Phase 6 prompt.

---

## Phase 6: Share & Export (Optional)

After delivery, **ask the user:** _"How would you like to take this away? I can export it to **PDF**, **images (PNG/JPG)**, or **PowerPoint (PPTX)** — all pixel-identical to the deck — and/or deploy it to a **live URL** that works on any device."_

Options:

- **Export to PDF** — Universal file for email, Slack, print
- **Export to images (PNG/JPG)** — One image per slide
- **Export to PowerPoint (PPTX)** — A .pptx for PowerPoint/Keynote users
- **Deploy to URL** — Shareable link that works on any device
- **Several of these / All**
- **No thanks**

If you already collected the answer in Phase 1 (Question 5), don't re-ask — just produce those formats. If the user declines everything, stop here. Otherwise proceed below.

### 6A: Export to File — PDF / PNG / JPG / PPTX (recommended)

One command exports the finished deck to any combination of formats. Every output is built from the same per-slide 1920×1080 browser render, so it is **pixel-identical to the HTML deck**.

```bash
# pick any of: pdf, png, jpg, pptx — or "all"
node scripts/export-deck.mjs <path-to-deck.html-or-folder> --format=all
node scripts/export-deck.mjs ./presentation.html --format=pdf,pptx
node scripts/export-deck.mjs ./my-deck/ --format=png --out=./dist
```

This single Node script replaces the need for a separate PDF tool and works in any agent/runtime (see [Portability](#portability--running-in-any-agent)). On first run it auto-installs its own tools (Playwright + a Chromium browser, plus `pptxgenjs` only when PPTX is requested) into a shared cache — no global or repo pollution. Reuses any existing Playwright browser cache, so Chromium is usually not re-downloaded.

**Options:**

- `--format=LIST` — comma list of `pdf,png,jpg,pptx`, or `all`. Default `pdf`.
- `--out=DIR` — output directory (default: next to the deck). PNG/JPG go into `<name>-png/` and `<name>-jpg/` folders; PDF and PPTX are single files named `<name>.pdf` / `<name>.pptx` (editable PPTX is saved as `<name>-editable.pptx`).
- `--compact` — render at 1280×720 instead of 1920×1080 for smaller files.
- `--jpeg-quality=N` — JPEG quality 1–100 (default 95).
- `--pptx-mode=image|editable` — `image` (default) = pixel-identical full-bleed images, not editable; `editable` = native shapes + text boxes, editable in PowerPoint but visually approximate.

**Always tell the user:**

- The fidelity guarantee (PDF / PNG / JPG / image-PPTX): exports look exactly like the deck because they ARE the deck's rendered pixels.
- The PPTX choice: default `image` mode is pixel-perfect but not text-editable; `--pptx-mode=editable` makes the text editable in PowerPoint but only **approximates** the look (web fonts get substituted, text re-wraps). Confirm which the user wants — you cannot have both at once.
- Animations are not preserved in any file export (each slide is captured in its final, settled state).

**Verify before declaring success (NON-NEGOTIABLE):** after exporting, confirm the files exist and are sane — PDF page count equals the slide count and pages are 16:9; PNG/JPG count equals the slide count at 1920×1080; the PPTX opens as a valid archive with one slide per deck slide. If anything is off, fix and re-export rather than reporting success.

**⚠ Export gotchas:**

- **Slides must use `class="slide"`.** The exporter finds slides by `.slide` elements and shows them one at a time. All decks generated by this skill use `.slide`; this only matters for externally-authored HTML.
- **Local images must load over HTTP, with relative paths.** The exporter serves the deck's folder over a local server, so `src="photo.png"` resolves (including filenames with spaces). Absolute filesystem paths like `src="/Users/name/photo.png"` will not load — fix to relative before exporting. Generated decks always use relative paths.
- **First run is slower.** Installing Playwright + Chromium (~150MB) happens once; later exports are fast.
- **Large decks make large files.** Each slide is a full 1920×1080 image. If a PDF/PPTX gets big, re-run with `--compact` (1280×720), which typically cuts size 50–70% with minimal visible difference.

### 6B: Deploy to a Live URL (Vercel)

This deploys the presentation to Vercel — a free hosting platform. The link works on any device (phones, tablets, laptops) and stays live until the user takes it down.

**If the user has never deployed before, guide them step by step:**

1. **Check if Vercel CLI is installed** — Run `npx vercel --version`. If not found, install Node.js first (`brew install node` on macOS, or download from https://nodejs.org).

2. **Check if user is logged in** — Run `npx vercel whoami`.
   - If NOT logged in, explain: _"Vercel is a free hosting service. You need an account to deploy. Let me walk you through it:"_
     - Step 1: Ask user to go to https://vercel.com/signup in their browser
     - Step 2: They can sign up with GitHub, Google, email — whatever is easiest
     - Step 3: Once signed up, run `vercel login` and follow the prompts (it opens a browser window to authorize)
     - Step 4: Confirm login with `vercel whoami`
   - Wait for the user to confirm they're logged in before proceeding.

3. **Deploy** — Run the deploy script:

   ```bash
   bash scripts/deploy.sh <path-to-presentation>
   ```

   The script accepts either a folder (with index.html) or a single HTML file.

4. **Share the URL** — Tell the user:
   - The live URL (from the script output)
   - That it works on any device — they can text it, Slack it, email it
   - To take it down later: visit https://vercel.com/dashboard and delete the project
   - The Vercel free tier is generous — they won't be charged

**⚠ Deployment gotchas:**

- **Local images/videos must travel with the HTML.** The deploy script auto-detects files referenced via `src="..."` in the HTML and bundles them. But if the presentation references files via CSS `background-image` or unusual paths, those may be missed. **Before deploying, verify:** open the deployed URL and check that all images load. If any are broken, the safest fix is to put the HTML and all its assets into a single folder and deploy the folder instead of a standalone HTML file.
- **Prefer folder deployments when the presentation has many assets.** If the presentation lives in a folder with images alongside it (e.g., `my-deck/index.html` + `my-deck/logo.png`), deploy the folder directly: `bash scripts/deploy.sh ./my-deck/`. This is more reliable than deploying a single HTML file because the entire folder contents are uploaded as-is.
- **Filenames with spaces work but can cause issues.** The script handles spaces in filenames, but Vercel URLs encode spaces as `%20`. If possible, avoid spaces in image filenames. If the user's images have spaces, the script handles it — but if images still break, renaming files to use hyphens instead of spaces is the fix.
- **Redeploying updates the same URL.** Running the deploy script again on the same presentation overwrites the previous deployment. The URL stays the same — no need to share a new link.

### 6C: Export to PDF (PDF-only alternative)

> Prefer **6A `export-deck.mjs`** for new work — it does PDF plus images and PPTX in one command. This `export-pdf.sh` script remains as a focused, bash-based PDF-only path and is kept for backward compatibility.

This captures each slide as a screenshot and combines them into a PDF. Perfect for email attachments, embedding in documents, or printing.

**Note:** Animations and interactivity are not preserved — the PDF is a static snapshot. This is normal and expected; mention it to the user so they're not surprised.

1. **Run the export script:**

   ```bash
   bash scripts/export-pdf.sh <path-to-html> [output.pdf]
   ```

   If no output path is given, the PDF is saved next to the HTML file.

2. **What happens behind the scenes** (explain briefly to the user):
   - A headless browser opens the presentation at 1920×1080 (standard widescreen)
   - It screenshots each slide one by one
   - All screenshots are combined into a single PDF
   - The script needs Playwright (a browser automation tool) — it will install automatically if missing

3. **If Playwright installation fails:**
   - The most common issue is Chromium not downloading. Run: `npx playwright install chromium`
   - If that fails too, it may be a network/firewall issue. Ask the user to try on a different network.

4. **Deliver the PDF** — The script auto-opens it. Tell the user:
   - The file location and size
   - That it works everywhere — email, Slack, Notion, Google Docs, print
   - Animations are replaced by their final visual state (still looks great, just static)

**⚠ PDF export gotchas:**

- **First run is slow.** The script installs Playwright and downloads a Chromium browser (~150MB) into a temp directory. This happens once per run. Warn the user it may take 30-60 seconds the first time — subsequent exports within the same session are faster.
- **Slides must use `class="slide"`.** The export script finds slides by querying `.slide` elements. If the presentation uses a different class name, the script will report "0 slides found" and fail. All presentations generated by this skill use `.slide`, so this only matters for externally-created HTML.
- **Local images must be loadable via HTTP.** The script starts a local server and loads the HTML through it (so Google Fonts and relative image paths work). If images use absolute filesystem paths (e.g., `src="/Users/name/photo.png"`) instead of relative paths (e.g., `src="photo.png"`), they won't load. Generated presentations always use relative paths, but converted or user-provided decks might not — check and fix if needed.
- **Local images appear in the PDF** as long as they are in the same directory as (or relative to) the HTML file. The export script serves the HTML's parent directory over HTTP, so relative paths like `src="photo.png"` resolve correctly — including filenames with spaces. If images still don't appear, check: (1) the image files actually exist at the referenced path, (2) the paths are relative, not absolute filesystem paths like `/Users/name/photo.png`.
- **Large presentations produce large PDFs.** Each slide is captured as a full 1920×1080 PNG screenshot. An 18-slide deck can produce a ~20MB PDF. If the PDF exceeds 10MB, ask the user: _"The PDF is [size]. Would you like me to compress it? It'll look slightly less sharp but the file will be much smaller."_ If yes, re-run the export with the `--compact` flag:
  ```bash
  bash scripts/export-pdf.sh <path-to-html> [output.pdf] --compact
  ```
  This renders at 1280×720 instead of 1920×1080, typically cutting file size by 50-70% with minimal visual difference.

---

## Supporting Files

| File                                               | Purpose                                                              | When to Read              |
| -------------------------------------------------- | -------------------------------------------------------------------- | ------------------------- |
| [STYLE_PRESETS.md](STYLE_PRESETS.md)               | 12 curated visual presets with colors, fonts, and signature elements | Phase 2 (style selection) |
| [bold-template-pack/selection-index.json](bold-template-pack/selection-index.json) | Compact bold template metadata for candidate selection | Phase 2 (style selection) |
| [bold-template-pack/templates/*/preview.md](bold-template-pack/templates/) | Lightweight style cards for shortlisted bold title previews | Phase 2 after shortlisting |
| [bold-template-pack/templates/*/design.md](bold-template-pack/templates/) | Detailed design-system docs for the selected bold template only | Phase 3 after user selection |
| [viewport-base.css](viewport-base.css)             | Mandatory fixed-stage CSS — copy into every presentation             | Phase 3 (generation)      |
| [html-template.md](html-template.md)               | HTML structure, JS features, code quality standards                  | Phase 3 (generation)      |
| [animation-patterns.md](animation-patterns.md)     | CSS/JS animation snippets and effect-to-feeling guide                | Phase 3 (generation)      |
| [scripts/extract-pptx.py](scripts/extract-pptx.py) | Python script for PPT content extraction                             | Phase 4 (conversion)      |
| [scripts/export-deck.mjs](scripts/export-deck.mjs) | Export the deck to PDF / PNG / JPG / PPTX (pixel-identical)           | Phase 6 (export)          |
| [scripts/deploy.sh](scripts/deploy.sh)             | Deploy slides to Vercel for instant sharing                          | Phase 6 (sharing)         |
| [scripts/export-pdf.sh](scripts/export-pdf.sh)     | Export slides to PDF (PDF-only alternative to export-deck.mjs)        | Phase 6 (sharing)         |

---

## Portability — running in any agent

This skill is not Claude-specific. The workflow is just instructions, and the scripts use only standard, widely-available tooling. Any agent or person with filesystem and shell access can use it.

**Requirements by capability:**

- **Generate / edit the HTML deck** — no dependencies; just write the file and open it in a browser.
- **Export to PDF / PNG / JPG / PPTX** — Node.js. Run `node scripts/export-deck.mjs <deck> --format=...`; it auto-installs Playwright (Chromium) and, for PPTX, `pptxgenjs`.
- **Convert a PowerPoint** — Python with `python-pptx` (`pip install python-pptx`).
- **Deploy to a live URL** — Node.js + a free Vercel account.

**Agent-agnostic guidance:**

- Use whatever this environment provides for the same intent. Examples: to open a file in the browser use `open` (macOS), `xdg-open` (Linux), or `start ""` / `Invoke-Item` (Windows). To ask the Phase 1 / Phase 2 questions, use the native structured-question UI if the agent has one, otherwise ask in one concise numbered message.
- Paths and shells differ across agents and OSes — quote paths, and prefer the dedicated file tools the agent exposes over assuming a specific shell.
- Nothing here depends on Claude Code or any plugin system. To install, copy the skill files into your agent's skills directory (or just point the agent at `SKILL.md`); every agent reads the same `SKILL.md` and runs the same scripts.
