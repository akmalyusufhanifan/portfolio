# ADR 0009 — Skills Carousel Logo Swap (SVG → Image) + Perbesar

- **Status:** Accepted
- **Date:** 2026-09-21
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/skills-carousel.tsx:1`, `public/js.png`, `public/ts.webp`, `public/react.webp`, `public/next.png`, `public/node.png`, `public/tailwind.png`, `public/supabase.jpg`, `public/github.png`, `app/globals.css:25`, `CONTEXT.md:22`, `docs/adr/0008-about-section-responsive-carousel.md:50`
- **Grill:** Q1 (daftar akhir), Q2 (urutan), Q3 (ukuran), Q4 (gaya card), Q5 (mekanika)
- **Supersedes (partial):** ADR 0008 Q5/Q6 — 10 SVG `h-10` → 8 image `h-12`

## Context

`SkillsCarousel` di `app/components/skills-carousel.tsx:1` masih 10 SVG inline monochrome (`JS`/`TS`/`RE`/`NX`/`ND`/`TW`/`HT`/`CS`/`GT`/`GH`) `h-10 w-10 p-2` digandakan 20 untuk marquee `25s` di `app/globals.css:25`. User menyiapkan 8 logo asli di `public/` (`js.png`, `ts.webp`, `react.webp`, `next.png`, `node.png`, `tailwind.png`, `supabase.jpg`, `github.png`) dan minta swap + sedikit perbesar. Grill 5 ronde menetapkan scope & detail visual.

Investigasi existing:
- 8 file ada di `public/` dengan size 2.4–11.6KB, mix `png`/`webp`/`jpg` — semua support `next/image` tanpa config `next.config.ts:1` (static local).
- `supabase.jpg` JPG background putih solid, bukan transparan — butuh `object-contain` di card putih agar tidak block.
- `github.png`/`next.png` dark logo kontras di `bg-white` card existing — tidak butuh invert.
- `app/components/skills-carousel.tsx:21` sudah `"use client"` untuk marquee — tetap client, tidak perlu jadi Server.
- `CONTEXT.md:22` & ADR 0008 Q5 masih deskripsi `h-10` SVG — perlu sinkron.

Alternatif yang dipertimbangkan (5 grill rounds):

- **Q1 Daftar akhir:** A) **Pas 8 baru saja** (hapus HTML5/CSS3/Git, 8→16) (chosen), B) 8 baru + Git tetap (9→18), C) 8 baru + HTML/CSS/Git (11→22). Dipilih A: brief minta 8 logo siap, HTML/CSS/Git tidak ada asset, Supabase menggantikan Git sebagai tech stack baru; 16 item cukup untuk loop seamless tanpa overhead.
- **Q2 Urutan:** A) **`JS → TS → React → Next → Node → Tailwind → Supabase → GitHub`** (chosen), B) alfabet, C) custom. Dipilih A: frontend (JS/TS/React/Next) → backend (Node) → styling (Tailwind) → infra (Supabase) → VCS (GitHub), storytelling stack konsisten dengan About paragraph Full Stack.
- **Q3 Ukuran:** A) `h-12 w-12 (48px) p-2.5` +20% (chosen), B) `h-14 w-14` +40%, C) `h-16 w-16` +60%. Dipilih A: "sedikit perbesar" literal, tetap compact di `max-w-6xl` container, tidak nabrak fade mask, `gap-4` tetap proporsional; B/C terlalu dominan di mobile 340px.
- **Q4 Gaya card:** A) **Tetap `bg-white rounded-xl border-zinc-100 shadow-sm`** hanya ganti isi ke `next/image object-contain` (chosen), B) hapus border/shadow, C) full-bleed. Dipilih A: preserve visual language ADR 0008, card putih memberi frame konsisten untuk mix transparent (`png`/`webp`) + solid (`jpg`), `p-2.5` beri napas 10px di 48px.
- **Q5 Mekanika:** A) **Tetap `25s gap-4`** (chosen), B) `20s`, C) `30s`. Dipilih A: minimal change, 16 vs 20 item perbedaan 20% tidak butuh kompensasi durasi; `gap-4` (16px) tetap pas untuk `h-12`, hover/focus pause + `prefers-reduced-motion` wrap statis preserve aksesibilitas ADR 0008.

## Decision

1. **Rewrite `SkillsCarousel` `app/components/skills-carousel.tsx:1`**:
   ```tsx
   "use client";
   import Image from "next/image";
   type Skill = { label: string; src: string };
   const SKILLS: Skill[] = [
     { label: "JavaScript", src: "/js.png" },
     { label: "TypeScript", src: "/ts.webp" },
     { label: "React", src: "/react.webp" },
     { label: "Next.js", src: "/next.png" },
     { label: "Node.js", src: "/node.png" },
     { label: "Tailwind CSS", src: "/tailwind.png" },
     { label: "Supabase", src: "/supabase.jpg" },
     { label: "GitHub", src: "/github.png" },
   ];
   // items = [...SKILLS, ...SKILLS] // 16
   // card: h-12 w-12 p-2.5 rounded-xl bg-white border shadow-sm
   // inner: <Image src alt width=28 height=28 className="h-7 w-7 object-contain" />
   ```
   Hapus `SkillIcon` SVG, hapus `abbr`, hapus `text-zinc-700` (warna logo asli).

2. **Pertahankan mekanika `app/globals.css:25`**: `@keyframes marquee 25s`, `gap-4`, `group:hover` pause, fade mask, `prefers-reduced-motion` — tidak ubah.

3. **Update `CONTEXT.md:22`**: ganti 10 SVG `h-10` → 8 image `h-12 w-12 p-2.5` + daftar `src` + urutan + ref ADR 0009.

## Consequences

- **Positif:** Logo asli berwarna sesuai brand, lebih recognisable daripada `abbr` monochrome; `h-12` sedikit lebih standout tanpa break layout; zero-dep baru (hanya `next/image` built-in); 8→16 tetap seamless, pause & reduced-motion preserve; JPG `supabase.jpg` tertangani `object-contain` di card putih.
- **Negatif:** Tambah ~50KB total image (8 file) vs SVG inline 0KB — negligible, tapi `next/image` akan optimize via `/_next/image`; mix format (`jpg` solid vs `png` transparent) butuh `object-contain` agar tidak stretch.
- **Trade-off:** `h-12 p-2.5` vs `h-14` — `h-12` kompromi "sedikit" vs standout; `next/image` vs `img` — pilih `next/image` untuk automatic optimization meski client component tetap.
- **Reversal cost:** Low — revert `app/components/skills-carousel.tsx:1` ke `abbr` SVG `h-10`, revert `CONTEXT.md:22`, hapus file ini; `public/` assets tetap.

## References

- `app/components/skills-carousel.tsx:1` — SkillsCarousel 8→16 image, h-12, next/image
- `public/js.png`, `public/ts.webp`, `public/react.webp`, `public/next.png`, `public/node.png`, `public/tailwind.png`, `public/supabase.jpg`, `public/github.png` — source assets
- `app/globals.css:25` — marquee keyframes (unchanged)
- `CONTEXT.md:22` — glossary Skills Carousel updated
- `docs/adr/0008-about-section-responsive-carousel.md:50` — superseded Q5/Q6
- `.scratch/skills-carousel-logo-swap/spec.md` — spec lengkap
