<!-- Language switch -->
**[🇬🇧 English](#english) · [🇮🇩 Bahasa Indonesia](#bahasa-indonesia)**

---

# AgentBuff Presentation

> A portable **agent skill** for creating stunning presentations and delivering them in **any format** — interactive HTML deck, **PDF**, **PNG/JPG**, or **PPTX (PowerPoint)** — every export pixel-identical to the deck. Works with **any** coding agent that has filesystem + shell access.

---

## English

### What is this?

**AgentBuff Presentation** is a skill you can hand to *any* agentic AI — Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, a CI job, or a human — to build beautiful, distinctive presentations without writing CSS or JavaScript.

It uses a **"show, don't tell"** approach: instead of asking you to describe your taste in words, the agent generates visual style previews and lets you pick. The presentation is authored once as a **zero-dependency HTML deck** (a single file, all CSS/JS inline). That HTML deck is the **single source of truth** — and from it you can export to PDF, images, or PowerPoint, all generated from the same 1920×1080 render so they look **exactly** like the deck.

There is **no plugin, no marketplace, and nothing Claude-specific**. It is just `SKILL.md` (the instructions) plus a few supporting files and scripts, all standard tooling.

### Output formats

The HTML deck is always built first (it carries the design). Everything else is exported from it:

| Format | What it is | Best for |
| ------ | ---------- | -------- |
| **HTML deck** | Interactive, animated, single file | Presenting live, sharing a link, inline editing |
| **PDF** | One slide per page, 16:9 | Email, print, Notion |
| **PNG / JPG** | One image per slide, 1920×1080 | Thumbnails, social, docs |
| **PPTX** | PowerPoint — image (pixel-perfect) or editable mode | Handing off to PowerPoint/Keynote users |

### Key features

- **Author once, export anywhere** — PDF / PNG / JPG / PPTX are all the deck's own rendered pixels, so exports never drift from the HTML.
- **Agent-agnostic** — Only standard tooling (browser, Node.js, optional Python). No Claude-only APIs.
- **Zero dependencies in the output** — The deck is one self-contained HTML file that will still work in 10 years.
- **Anti-AI-slop design** — Curated, distinctive styles that avoid generic AI aesthetics (no purple-gradient-on-white).
- **Bold Template Pack** — 34 optional design-forward systems, loaded progressively.
- **PPT conversion** — Turn an existing `.pptx` into a web deck, preserving text, images, and notes.

### How any agent uses it

**Option A — point the agent at the skill.** Give the agent this repo (or the local folder) and ask it to *"use the AgentBuff Presentation skill in `SKILL.md`."* The agent reads `SKILL.md` and loads only the support files it needs.

**Option B — install into the agent's skills directory.**

```bash
# Example for Claude Code (folder name must match the skill name)
mkdir -p ~/.claude/skills/agentbuff-presentation
git clone https://github.com/nugrahalabib/AgentBuff-Presentation-Skills.git ~/.claude/skills/agentbuff-presentation
# then invoke it (Claude Code): /agentbuff-presentation
```

For other agents, copy the same files into whatever local skills directory that agent uses.

### What it does (workflow)

1. Asks about your content, length, density, and which **formats** you want.
2. Generates **3 visual style previews** for you to compare and pick.
3. Builds the full deck in your chosen style (fixed 16:9, animated, inline-editable).
4. Opens it in your browser.
5. Exports / shares on request.

### Exporting

One command exports the finished deck to any combination of formats:

```bash
# pick any of: pdf, png, jpg, pptx — or "all"
node scripts/export-deck.mjs deck.html --format=all
node scripts/export-deck.mjs deck.html --format=pdf,pptx
node scripts/export-deck.mjs ./my-deck/ --format=png --out=./dist
```

**PPTX has two modes:**

- `--pptx-mode=image` (default) — full-bleed images: **pixel-identical** to the deck, but text is not editable.
- `--pptx-mode=editable` — native shapes + text boxes: **editable** in PowerPoint, but the look is **approximate** (fonts get substituted, text re-wraps).

On first run the exporter auto-installs its tools (Playwright + a Chromium browser, plus `pptxgenjs` for PPTX) into a shared cache — no global or repo pollution. Flags: `--out=DIR`, `--compact` (1280×720), `--jpeg-quality=N`.

### Sharing to a live URL (optional)

```bash
bash scripts/deploy.sh ./my-deck/        # or a single .html file
```

Deploys to [Vercel](https://vercel.com) (free tier); the skill walks you through signup/login on first use.

### Project structure

```
SKILL.md              ← the skill (instructions every agent reads)
STYLE_PRESETS.md      ← 12 curated safe presets
viewport-base.css     ← mandatory fixed 16:9 stage CSS
html-template.md      ← HTML architecture + JS features
animation-patterns.md ← animation reference
bold-template-pack/   ← 34 bold design systems + selection index
scripts/
  ├─ export-deck.mjs  ← export to PDF / PNG / JPG / PPTX (pixel-identical)
  ├─ export-pdf.sh    ← PDF-only alternative
  ├─ deploy.sh        ← deploy to Vercel
  └─ extract-pptx.py  ← extract content from a .pptx
LICENSE
```

### Requirements

- Any agent (or person) with filesystem access and the ability to run shell commands. **No plugin or marketplace needed.**
- **Export (PDF/PNG/JPG/PPTX)** and **deploy**: Node.js (Playwright + `pptxgenjs` install automatically on first run).
- **PPT conversion**: Python with `python-pptx` (`pip install python-pptx`).
- **Live URL**: a free Vercel account.

### Credits

- Original **Frontend Slides** skill and the **Bold Template Pack** (`beautiful-html-templates`): **[Zara Zhang](https://github.com/zarazhangrui)** — MIT licensed.
- **AgentBuff Presentation** rework — agent-agnostic packaging, the unified multi-format exporter (PDF/PNG/JPG/PPTX, image + editable), and bilingual docs: **Nugraha Labib Mujaddid**.

### License

MIT — see [`LICENSE`](LICENSE). Use it, modify it, share it. The original copyright notice (Zara Zhang) is retained as the license requires.

---

## Bahasa Indonesia

### Apa ini?

**AgentBuff Presentation** adalah sebuah **skill** yang bisa kamu berikan ke *agentic AI mana pun* — Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, pipeline CI, atau bahkan manusia — untuk membuat presentasi yang indah dan khas **tanpa perlu menulis CSS atau JavaScript**.

Pendekatannya **"show, don't tell"**: alih-alih memintamu mendeskripsikan selera dengan kata-kata, agent membuat beberapa **preview gaya visual** lalu kamu tinggal memilih. Presentasi dibuat sekali sebagai **HTML deck tanpa dependency** (satu file, semua CSS/JS inline). HTML deck itulah **sumber kebenaran tunggal** — dan darinya kamu bisa mengekspor ke PDF, gambar, atau PowerPoint, semuanya dibuat dari render 1920×1080 yang sama sehingga tampak **persis** seperti deck-nya.

**Tidak ada plugin, tidak ada marketplace, dan tidak ada yang khusus Claude.** Isinya hanya `SKILL.md` (instruksi) plus beberapa file pendukung & script, semua memakai tooling standar.

### Format keluaran

HTML deck selalu dibuat lebih dulu (di situlah desainnya). Sisanya diekspor dari situ:

| Format | Apa itu | Cocok untuk |
| ------ | ------- | ----------- |
| **HTML deck** | Interaktif, beranimasi, satu file | Presentasi langsung, berbagi link, edit teks inline |
| **PDF** | Satu slide per halaman, 16:9 | Email, cetak, Notion |
| **PNG / JPG** | Satu gambar per slide, 1920×1080 | Thumbnail, sosial media, dokumen |
| **PPTX** | PowerPoint — mode gambar (pixel-perfect) atau editable | Diserahkan ke pengguna PowerPoint/Keynote |

### Fitur utama

- **Buat sekali, ekspor ke mana saja** — PDF / PNG / JPG / PPTX semuanya adalah piksel render deck itu sendiri, jadi hasil ekspor tidak pernah melenceng dari HTML.
- **Agent-agnostic** — Hanya tooling standar (browser, Node.js, opsional Python). Tanpa API khusus Claude.
- **Tanpa dependency di output** — Deck adalah satu file HTML mandiri yang tetap jalan 10 tahun lagi.
- **Anti "AI slop"** — Gaya-gaya kurасi yang khas, menghindari estetika AI generik (tanpa gradien ungu di atas putih).
- **Bold Template Pack** — 34 sistem desain opsional, dimuat secara progresif.
- **Konversi PPT** — Ubah `.pptx` yang sudah ada menjadi web deck, mempertahankan teks, gambar, dan catatan.

### Cara agent mana pun memakainya

**Opsi A — arahkan agent ke skill-nya.** Berikan agent repo ini (atau folder lokalnya) dan minta ia *"pakai skill AgentBuff Presentation di `SKILL.md`."* Agent membaca `SKILL.md` dan hanya memuat file pendukung yang diperlukan.

**Opsi B — pasang ke folder skill milik agent.**

```bash
# Contoh untuk Claude Code (nama folder harus sama dengan nama skill)
mkdir -p ~/.claude/skills/agentbuff-presentation
git clone https://github.com/nugrahalabib/AgentBuff-Presentation-Skills.git ~/.claude/skills/agentbuff-presentation
# lalu panggil (Claude Code): /agentbuff-presentation
```

Untuk agent lain, salin file yang sama ke folder skill lokal yang dipakai agent tersebut.

### Alur kerjanya

1. Bertanya soal konten, panjang, kepadatan, dan **format** yang kamu inginkan.
2. Membuat **3 preview gaya visual** untuk kamu bandingkan dan pilih.
3. Membangun deck lengkap dengan gaya pilihanmu (16:9 tetap, beranimasi, teks bisa diedit inline).
4. Membukanya di browser.
5. Mengekspor / membagikan sesuai permintaan.

### Mengekspor

Satu perintah mengekspor deck jadi kombinasi format apa pun:

```bash
# pilih salah satu/lebih: pdf, png, jpg, pptx — atau "all"
node scripts/export-deck.mjs deck.html --format=all
node scripts/export-deck.mjs deck.html --format=pdf,pptx
node scripts/export-deck.mjs ./my-deck/ --format=png --out=./dist
```

**PPTX punya dua mode:**

- `--pptx-mode=image` (default) — gambar full-bleed: **pixel-identik** dengan deck, tapi teks tidak bisa diedit.
- `--pptx-mode=editable` — shape + text box native: teks **bisa diedit** di PowerPoint, tapi tampilannya **approximate** (font disubstitusi, teks ter-wrap ulang).

Pada run pertama, exporter otomatis memasang tool-nya (Playwright + browser Chromium, plus `pptxgenjs` untuk PPTX) ke cache bersama — tanpa mengotori global maupun repo. Flag: `--out=DIR`, `--compact` (1280×720), `--jpeg-quality=N`.

### Berbagi via URL live (opsional)

```bash
bash scripts/deploy.sh ./my-deck/        # atau satu file .html
```

Men-deploy ke [Vercel](https://vercel.com) (tier gratis); skill memandu pendaftaran/login saat pertama kali.

### Struktur proyek

```
SKILL.md              ← skill-nya (instruksi yang dibaca tiap agent)
STYLE_PRESETS.md      ← 12 preset aman terkurасi
viewport-base.css     ← CSS panggung 16:9 tetap (wajib)
html-template.md      ← arsitektur HTML + fitur JS
animation-patterns.md ← referensi animasi
bold-template-pack/   ← 34 sistem desain bold + indeks seleksi
scripts/
  ├─ export-deck.mjs  ← ekspor ke PDF / PNG / JPG / PPTX (pixel-identik)
  ├─ export-pdf.sh    ← alternatif khusus PDF
  ├─ deploy.sh        ← deploy ke Vercel
  └─ extract-pptx.py  ← ekstrak konten dari .pptx
LICENSE
```

### Kebutuhan

- Agent (atau orang) mana pun dengan akses filesystem dan bisa menjalankan shell. **Tanpa plugin atau marketplace.**
- **Ekspor (PDF/PNG/JPG/PPTX)** dan **deploy**: Node.js (Playwright + `pptxgenjs` terpasang otomatis saat run pertama).
- **Konversi PPT**: Python dengan `python-pptx` (`pip install python-pptx`).
- **URL live**: akun Vercel gratis.

### Kredit

- Skill **Frontend Slides** asli dan **Bold Template Pack** (`beautiful-html-templates`): **[Zara Zhang](https://github.com/zarazhangrui)** — berlisensi MIT.
- Pengembangan **AgentBuff Presentation** — pengemasan agent-agnostic, exporter multi-format terpadu (PDF/PNG/JPG/PPTX, mode gambar + editable), dan dokumentasi bilingual: **Nugraha Labib Mujaddid**.

### Lisensi

MIT — lihat [`LICENSE`](LICENSE). Pakai, modifikasi, bagikan. Notice hak cipta asli (Zara Zhang) tetap dipertahankan sesuai syarat lisensi.
