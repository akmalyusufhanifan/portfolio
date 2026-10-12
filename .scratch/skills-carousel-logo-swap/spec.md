# Spec — Skills Carousel Logo Swap (SVG → Image) + Perbesar

- **Feature slug:** `skills-carousel-logo-swap`
- **Status:** `ready-for-agent`
- **ADR:** `docs/adr/0009-skills-carousel-logo-swap.md` (supersedes partial `docs/adr/0008-about-section-responsive-carousel.md`)
- **Glossary:** `CONTEXT.md:22` (Skills Carousel)

## Problem Statement

Carousel di About Section masih menampilkan 10 icon SVG monochrome dengan singkatan (`JS`/`TS`/`RE`/`NX`/`ND`/`TW`/`HT`/`CS`/`GT`/`GH`) berukuran kecil (`h-10 w-10`). User telah menyiapkan 8 logo brand asli di `public/` (`js.png`, `ts.webp`, `react.webp`, `next.png`, `node.png`, `tailwind.png`, `supabase.jpg`, `github.png`) yang berwarna dan lebih recognisable, namun belum terpakai. Ukuran existing juga terasa kecil dan perlu sedikit diperbesar agar standout di container `max-w-6xl`. Tanpa swap, carousel tidak merepresentasikan stack aktual (Supabase belum ada, HTML/CSS/Git redundan) dan visual kurang premium.

## Solution

Ganti isi `SkillsCarousel` dari SVG `abbr` ke `next/image` dengan 8 logo dari `public/` sesuai urutan `JS → TS → React → Next → Node → Tailwind → Supabase → GitHub`, duplikasi menjadi 16 untuk loop seamless. Perbesar card dari `h-10 w-10 p-2` ke `h-12 w-12 p-2.5` (48px, +20%) dengan inner image `28×28 h-7 w-7 object-contain`. Pertahankan semua mekanika marquee existing (`25s linear infinite`, `gap-4`, fade mask, hover/focus pause, `prefers-reduced-motion` wrap). Card tetap `bg-white rounded-xl border-zinc-100 shadow-sm`. Update glossary dan ADR.

## User Stories

1. As a visitor, I want to see JavaScript logo asli di carousel, so that I instantly recognise the JS skill without reading abbreviation.
2. As a visitor, I want to see TypeScript logo asli, so that TS distinction from JS is visually clear.
3. As a visitor, I want to see React logo asli, so that frontend stack terasa modern dan familiar.
4. As a visitor, I want to see Next.js logo asli, so that framework expertise terlihat eksplisit.
5. As a visitor, I want to see Node.js logo asli, so that backend capability is communicated.
6. As a visitor, I want to see Tailwind CSS logo asli, so that styling skill is recognisable.
7. As a visitor, I want to see Supabase logo asli (menggantikan Git/HTML/CSS), so that I know the stack includes BaaS/database yang actual dipakai.
8. As a visitor, I want to see GitHub logo asli, so that VCS/platform skill tetap represented dengan brand akurat.
9. As a visitor on mobile, I want to see 8 logo auto-scroll seamless tanpa gap, so that carousel terasa infinite dan polished.
10. As a visitor on desktop, I want to see logo yang sedikit lebih besar (48px vs 40px), so that icon lebih legible dan premium di layout 1100px.
11. As a visitor hovering the carousel, I want animation pause on hover/focus, so that I can inspect a logo without motion distraction.
12. As a keyboard user, I want to tab ke tiap logo card dan pause animation on focus-within, so that carousel accessible via keyboard.
13. As a user with `prefers-reduced-motion: reduce`, I want carousel menjadi static wrap centered tanpa animasi, so that motion tidak mengganggu.
14. As a visitor, I want fade mask di tepi kiri/kanan carousel, so that loop edge terasa smooth bukan cut hard.
15. As a developer, I want implementation pakai `next/image` dengan `alt` per label, so that SEO/accessibility terjaga dan image ter-optimize otomatis.
16. As a developer, I want urutan logo `JS → TS → React → Next → Node → Tailwind → Supabase → GitHub`, so that story frontend→backend→infra→VCS konsisten.
17. As a developer, I want card tetap `bg-white rounded-xl border shadow-sm p-2.5`, so that baik logo transparent (`png`/`webp`) maupun solid (`supabase.jpg`) tampil rapi di frame putih yang sama.
18. As a developer, I want logo di-render `object-contain` 28×28 di dalam 48×48 card, so that tidak stretch dan ada breathing room 10px.
19. As a content owner, I want HTML5/CSS3/Git lama dihapus dari carousel, so that daftar skill presisi 8 yang benar-benar dipakai.
20. As a maintainer, I want glossary di `CONTEXT.md` sinkron dengan 8 image + `h-12`, so that domain docs tidak drift dari code.
21. As a maintainer, I want ADR baru merekam decision swap + grill Q1-Q5, so that future reversal low-cost dan traceable.

## Implementation Decisions

- **Module modified:** Skills Carousel component — swap type `Skill` dari `{label, abbr}` ke `{label, src}`, hapus `SkillIcon` SVG inline, ganti ke `next/image` import; `SKILLS` jadi 8 item dengan `src` `/js.png`, `/ts.webp`, `/react.webp`, `/next.png`, `/node.png`, `/tailwind.png`, `/supabase.jpg`, `/github.png` sesuai urutan grill.
- **Duplication:** `const items = [...SKILLS, ...SKILLS]` menghasilkan 16 untuk `translateX(-50%)` seamless — tidak ubah keyframes.
- **Sizing:** Card `h-10 w-10 p-2` → `h-12 w-12 p-2.5` (Tailwind `48px` + `10px` padding), inner image `width=28 height=28` + `className h-7 w-7 object-contain`; card tetap `flex shrink-0 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm focus-visible:ring`.
- **Image handling:** Pakai `next/image` dari `next/image` (built-in Next 16.3.5), `alt={label}`, tanpa `priority` (carousel below-the-fold), tanpa `unoptimized` — biarkan optimizer handle `png`/`webp`/`jpg`; mix format ditangani `object-contain` di background putih card.
- **Mechanics unchanged:** Wrapper `group marquee-container overflow-hidden` dengan `maskImage linear-gradient(to right, transparent, black 10%, black 90%, transparent)`, track `marquee-track animate-marquee flex w-max gap-4 py-2` dengan `@keyframes marquee 25s linear infinite` di `app/globals.css`, hover/focus `animation-play-state: paused` via `.group:hover .animate-marquee`, `prefers-reduced-motion` tetap `animation:none` + `flex-wrap`.
- **Directive:** Tetap `"use client"` — marquee butuh client untuk hover pause consistency dengan ADR 0008.
- **Docs:** Update `CONTEXT.md` glossary Skills Carousel (8 image, `h-12`, `src` list, urutan, `object-contain`, ref ADR 0009); create `docs/adr/0009-skills-carousel-logo-swap.md` superseding partial ADR 0008 Q5/Q6.
- **Non-change:** `app/sections/about.tsx`, `app/globals.css`, `next.config.ts`, `public/` assets tidak diubah.
- **A11y:** Tiap card `aria-label={label}` + `title={label}` + `tabIndex=0` + `Image alt`; tidak perlu `abbr` lagi.

## Testing Decisions

- **Philosophy:** Only test external behavior, not implementation details. Assert what visitor sees/interacts, not internal `SKILLS` array or `Image` props.
- **Seam tertinggi — E2E browser (preferred):** Single suite Playwright/Cypress render halaman penuh `/`:
  - (a) Carousel berisi tepat 16 card (8 unique ×2) dengan `alt` `JavaScript`…`GitHub` urut `JS→TS→React→Next→Node→Tailwind→Supabase→GitHub` (duplikasi identik).
  - (b) Tiap card `h-12 w-12` (computed `48px`) dan inner `img` `object-contain` tidak stretch, `supabase.jpg` load sukses meski JPG.
  - (c) Track `transform` berubah dalam 1s (animasi jalan) dan loop tanpa gap visual (duplikasi check).
  - (d) `hover` atau `focus-within` mengubah `animation-play-state` ke `paused`.
  - (e) `prefers-reduced-motion: reduce` → `animation: none` + layout wrap centered, mask `none`.
  - (f) Fade mask `linear-gradient` computed `mask-image` tidak `none` di mode normal.
- **Prior art:** Pola marquee existing di ADR 0008 `.scratch/about-section/spec.md` E2E; no unit test harness (`package.json` hanya `dev`/`build`/`lint`) — E2E adalah seam tertinggi.
- **Fallback manual:** Jika E2E belum ada, verify via `npm run build` sukses (image optimizer), `npm run dev` visual check 8 logo load, hover pause, reduced-motion emulate di DevTools Rendering tab.

## Out of Scope

- Mengganti asset di `public/` (mis. convert `supabase.jpg` ke `png` transparan, optimize ulang `js.png`/`tailwind.png`) — out of scope, future ADR jika butuh.
- Mengubah durasi marquee (`25s`), `gap-4`, fade mask, atau menambah draggable/swipe JS lib (`swiper`/`embla`) — tetap 25s per grill Q5.
- Mengubah grid `AboutSection` (`app/sections/about.tsx`), heading, paragraf, atau gambar profile — hanya carousel.
- Menambah skill baru di luar 8 (mis. `HTML5`/`CSS3`/`Git` kembali) — eksplisit dihapus per Q1.
- Menambah dark mode atau mengubah `next.config.ts` image remote domains.
- Menambah unit test framework baru — repo tetap tanpa harness, E2E manual/build check cukup.

## Further Notes

- Grill 5 ronde: Q1 Pas 8, Q2 urutan `JS→TS→React→Next→Node→Tailwind→Supabase→GitHub`, Q3 `h-12 w-12 p-2.5`, Q4 tetap card putih, Q5 tetap `25s gap-4`. Rekomendasi `gap-4` (bukan `gap-5`) dipilih untuk execution ini.
- `public/` files mix `png`/`webp`/`jpg` — `next/image` handle semua; `supabase.jpg` solid white tidak butuh `fill` transparan.
- Reversal low: revert `app/components/skills-carousel.tsx` ke SVG `h-10`, revert `CONTEXT.md:22`, hapus ADR 0009.

