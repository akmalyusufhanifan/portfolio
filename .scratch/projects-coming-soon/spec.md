# Spec — Projects Coming Soon: Skeleton Carousel Blur + Overlay

- **Feature slug:** `projects-coming-soon`
- **Status:** `ready-for-agent`
- **ADR:** `docs/adr/0010-projects-coming-soon-skeleton.md` (amended — carousel)
- **Glossary:** `CONTEXT.md:23` (Projects Section, Skeleton Project Card, Coming Soon Overlay)
- **Grill:** 8 ronde awal (Q1 anatomi, Q2 copy, Q3 interaksi, Q4 wrapper, Q5 grid, Q6 blur, Q7 animasi, Q8 migrasi) + 6 ronde amend carousel (Q9 mekanika, Q10 ukuran, Q11 duplikasi, Q12 overlay statis, Q13 kecepatan, Q14 reduced-motion)

## Problem Statement

`Projects Section` masih dummy (`"PROJECTS SECTION"` `flex min-h-[60vh] border-b border-zinc-100 bg-zinc-50`) di `app/sections/projects.tsx:1` — pengunjung yang klik `Projects → #projects` di Navbar hanya melihat placeholder, tanpa indikasi bahwa portfolio belum memiliki project client dan tanpa ajakan untuk menjadi client pertama.

Kebutuhan awal (8 ronde) menuntut konsep **coming soon** dengan 3 skeleton card blur + overlay `"Want to be my first client?"` (mobile 3 vertikal, desktop 3 horizontal). Amend terbaru (6 ronde, 2026-09-21) mengubah skeleton statis menjadi **carousel yang bergerak ke samping untuk semua viewport**, dengan ukuran mobile sedikit lebih kecil — agar loading affordance terlihat dinamis, bukan stack diam.

Tanpa ini, section Projects terasa kosong dan kehilangan opportunity konversi visitor → client, plus tidak ada motion yang mengkomunikasikan "loading".

## Solution

Bangun Projects Section final coming soon — carousel marquee yang menggantikan dummy dengan komposisi blur + overlay:

- **Wrapper** `section id="projects" bg-white py-16 lg:py-20` dengan container `mx-auto max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8` dan heading `h2 "Projects"` `text-[56px] lg:text-[92px] font-semibold tracking-tight text-zinc-900 text-center lg:text-left` (sinkron `About Me`).

- **Skeleton carousel** `group marquee-container relative mt-8 overflow-hidden lg:mt-10` dengan fade mask `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` (inline `maskImage`, reuse `Skills Carousel`). Inner track `marquee-track animate-marquee flex w-max gap-6 py-2 blur-[2px] opacity-85 pointer-events-none select-none aria-hidden` berisi **6 `Skeleton Project Card`** (3 desain duplikasi `3×2` untuk loop `translateX(-50%)` seamless). Tiap card `flex h-[220px] w-[300px] shrink-0 flex-col gap-3 rounded-[24px] border border-zinc-300 bg-white p-4 shadow-md lg:h-[320px] lg:w-[360px]` (mobile `300×220` lebih kecil, desktop `360×320`) dengan isi: image placeholder `h-24 lg:h-36 rounded-[16px] bg-zinc-300` + 2 bar judul `h-3 w-3/4 + w-1/2` + 1 bar deskripsi `h-3 w-full` + 2 pill tag `h-6 w-16 rounded-full` — semua `bg-zinc-300 animate-pulse motion-reduce:animate-none`. Animasi `marquee 25s linear infinite` di `app/globals.css:25`, `group:hover/focus-within → animation-play-state: paused`, `prefers-reduced-motion: reduce → animation:none + mask none + flex-wrap wrap justify-center`.

- **Coming Soon Overlay** `absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px] px-4 text-center` statis center di atas carousel: heading `h3 "Want to be my first client?" text-[22px] lg:text-[32px] font-semibold tracking-tight text-zinc-900` + sub `p "Let's build something together" text-[14px] lg:text-[16px] text-zinc-600` + CTA `a "Contact Me" href="#contact" rounded-full bg-[#111827] px-7 py-3 text-[14px] lg:text-[15px] font-medium text-white hover:bg-black`. Overlay tidak ikut geser; `group` di wrapper jadi hover di overlay juga pause carousel.

- **Perilaku:** carousel bergerak untuk semua viewport (mobile & desktop horizontal, bukan vertikal stack); blur permanen `blur-[2px] opacity-85` + `bg-white/30` visibilitas ditingkatkan (amend dari `3px/60` + `45`); `animate-pulse` untuk skeleton. Section tetap Server Component (tanpa `"use client"`), tidak ada dependency baru, retains `id="projects"` anchor. Reuse `app/globals.css:25/39/44` tanpa keyframes baru.

Perubahan terbatas pada `Projects Section`; tidak mengubah Navbar, Hero, About, Contact, atau `Breakpoint lg`.

## User Stories

1. As a visitor di mobile, I want melihat heading `"Projects"` di atas section dengan ukuran besar terpusat, so that saya tahu ini section Projects meski isinya coming soon.
2. As a visitor di desktop, I want heading `"Projects"` rata kiri di atas carousel, so that sejajar dengan `About Me` dan ritme halaman konsisten.
3. As a visitor di mobile, I want melihat skeleton carousel yang bergerak ke samping (bukan stack vertikal) di bawah heading, so that loading affordance dinamis terlihat di layar sempit.
4. As a visitor di desktop, I want melihat skeleton carousel yang sama bergerak ke samping, so that konsistensi motion untuk semua viewport.
5. As a visitor di mobile, I want card carousel sedikit lebih kecil (`w-[300px] h-[220px]`) dibanding desktop (`360×320`), so that di `375px` viewport muat 1 card penuh + intip card kedua (affordance geser).
6. As a visitor di mobile, I want di `375px` melihat 1 card penuh dan sedikit card kedua di tepi (fade mask), so that saya paham ini carousel bukan single card.
7. As a visitor, I want tiap skeleton card terlihat seperti project card real (image placeholder + bar judul + deskripsi + pill tag) dengan `rounded-[24px] border bg-white shadow-md`, so that saya paham ini placeholder project.
8. As a visitor, I want carousel berisi 6 card (3 desain duplikasi) yang loop seamless `translateX(-50%)` tanpa gap kosong, so that animasi tidak lompat saat restart.
9. As a visitor, I want carousel bergerak `25s linear infinite` (sedang, tidak pusing/lamban) dengan `gap-6`, so that motion terasa loading tapi tetap elegan.
10. As a visitor, I want tepi kiri-kanan carousel memudar halus (fade mask `10%→90%`) bukan terpotong tajam, so that kesan marquee premium seperti `Skills Carousel`.
11. As a visitor, I want carousel terlihat blur (`blur-[2px] opacity-85`) di balik overlay, so that jelas ini bukan project yang bisa diklik.
12. As a visitor, I want blur tersebut permanen (tidak hilang saat hover), so that pesan coming soon tidak ambigu.
13. As a visitor, I want skeleton lebih jelas terlihat (`zinc-300` + `shadow-md` + `opacity-85` + `bg-white/30` vs `zinc-200/45` awal), so that bentuk card tetap terbaca di balik blur.
14. As a visitor, I want overlay di tengah carousel menampilkan tulisan `"Want to be my first client?"` Title Case `font-semibold 22→32px`, so that ajakan terbaca jelas dan konsisten dengan `About Me`.
15. As a visitor, I want di bawah ajakan ada sub-teks `"Let's build something together"` `14→16px text-zinc-600`, so that nada lebih hangat.
16. As a visitor, I want di bawah sub-teks ada button `"Contact Me"` `rounded-full bg-[#111827]` yang klik ke `#contact`, so that saya punya next-step jelas.
17. As a visitor, I want overlay `bg-white/30 backdrop-blur-[1px]` agar teks `zinc-900` kontras di atas carousel blur, so that readability terjaga tanpa menutup total card.
18. As a visitor, I want overlay statis center (tidak ikut geser bersama carousel), so that teks tetap terbaca sementara carousel bergerak di belakang.
19. As a visitor dengan mouse, I want hover di overlay atau carousel menghentikan gerakan (`group:hover pause`), so that saya bisa fokus tanpa motion.
20. As a keyboard user, I want focus di overlay (Tab ke `Contact Me`) juga menghentikan gerakan (`group:focus-within pause`), so that navigasi keyboard tidak terganggu.
21. As a visitor, I want carousel `aria-hidden="true" pointer-events-none select-none`, so that screen reader tidak membacakan placeholder.
22. As a visitor, I want skeleton bar berdenyut `animate-pulse` halus, so that affordance "loading" terasa meski di-blur.
23. As a user dengan `prefers-reduced-motion: reduce`, I want `animate-pulse` mati (`motion-reduce:animate-none`) dan marquee mati menjadi `flex-wrap wrap justify-center` statis, so that tidak mengganggu vestibular dan tetap tampil 6 card center.
24. As a visitor yang klik Navbar `Projects → #projects`, I want mendarat tepat di heading `"Projects"` (header non-sticky `relative h-16`), so that judul terlihat penuh.
25. As a visitor di viewport `≈1024px` (breakpoint), I want perpindahan ukuran `300×220 → 360×320` terjadi tepat di `1024px` tanpa flicker, so that konsisten dengan Navbar `Breakpoint lg`.
26. As a visitor di mobile `375px`, I want tidak ada overflow horizontal (`scrollWidth <= clientWidth`), so that halaman tidak scroll samping meski carousel `w-max` panjang.
27. As a developer, I want `ProjectsSection` tetap Server Component tanpa `"use client"` (carousel CSS-only), so that tidak menambah JS bundle.
28. As a developer, I want build/lint tetap lolos tanpa dependensi baru (hanya `next`+`react`+`tailwindcss` + reuse `app/globals.css:25`), so that pipeline ringan.
29. As a maintainer, I want saat project real ada, bisa rewrite `app/sections/projects.tsx` dari nol (buang skeleton carousel), so that iterasi tidak terbebani branching `COMING_SOON` permanen (Q8 C).
30. As a maintainer, I want keputusan carousel ini terdokumentasi di `CONTEXT.md` (3 glossary carousel) dan `docs/adr/0010-*` (amend Q9–Q14), so that alasan `25s`, `6` card, `300×220` vs `360×320`, `bg-white/30` traceable.

## Implementation Decisions

- **Wrapper & container** Pilih `bg-white py-16 lg:py-20` (tolak `bg-zinc-50` dummy) agar `bg-white` card kontras via `border-zinc-300 shadow-md`; container `max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8` sinkron Navbar `max-w-6xl` + Hero `1100px`; heading `"Projects"` `text-[56px] lg:text-[92px] font-semibold tracking-tight text-zinc-900 text-center lg:text-left` sinkron `About Me`; `id="projects"` retained untuk anchor. Wrapper carousel `group marquee-container relative mt-8 overflow-hidden lg:mt-10` dengan inline `maskImage: linear-gradient(to right, transparent, black 10%, black 90%, transparent)` (reuse `Skills Carousel`).

- **Mekanika carousel (Q9 A)** Pilih CSS marquee reuse `app/globals.css:25` `@keyframes marquee 25s linear infinite translateX(-50%)` + `flex w-max gap-6 py-2` + `animate-marquee` + `will-change: transform`. Pilih CSS vs JS lib `embla/swiper` — CSS zero-dep, GPU `transform`, sudah terbukti `app/components/skills-carousel.tsx:35`; tolak JS yang tambah bundle untuk kasus yang bisa CSS. Duplikasi `Array(6)` (`3×2`) untuk `translateX(-50%)` seamless; tolak `9`/`12` yang overkill DOM.

- **Ukuran card (Q10 A)** Pilih mobile `w-[300px] h-[220px] shrink-0` vs desktop `lg:w-[360px] lg:h-[320px]`. Alasan: carousel butuh `w` fixed untuk `w-max` (bukan `w-full max-w-[400px]` grid awal); `300px` di `375px` viewport muat 1 penuh + intip card kedua (affordance), tidak cramped seperti `260px` dan tidak penuh seperti `400px`; image `h-24 lg:h-36` proporsional dengan `h` baru. `gap-6` (24px) konsisten dengan About `gap-8→12` tapi lebih rapat untuk track.

- **Jumlah duplikasi (Q11 A)** 6 card (`3×2`) — minimal seamless; track `≈1896px` mobile / `2256px` desktop cukup di container `1100px`; `gap-6` ×5 = 120px termasuk. Tolak `9`/`12` yang bikin track `3384→4512px` paint lebih besar tanpa benefit loop.

- **Overlay statis (Q12 A)** Pilih `absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px] px-4 text-center` center, tidak ikut geser. Carousel `blur-[2px] opacity-85 pointer-events-none select-none aria-hidden` di belakang; `group` di wrapper jadi hover di overlay juga `animation-play-state: paused` via `app/globals.css:39`. Tolak overlay ikut geser (tidak terbaca) dan tolak tanpa `bg` (skeleton terlalu jelas).

- **Kecepatan & fade (Q13 A)** Pertahankan `25s gap-6` + mask `10%→90%` + `group:hover/focus-within pause` — 1:1 `Skills Carousel`. `25s` untuk track `1896/2256px` kecepatan sedang; tolak `18s` (terlalu cepat untuk card `300→360px`) dan `35s` (hampir statis di mobile).

- **Anatomi skeleton (Q1 A)** Tiap card: `h-24 lg:h-36 rounded-[16px] bg-zinc-300` (image) + `h-3 w-3/4` + `h-3 w-1/2` + `h-3 w-full` + `mt-auto flex gap-2` 2× `h-6 w-16 rounded-full` — semua `bg-zinc-300 animate-pulse motion-reduce:animate-none`. Pilih mirip project real vs minimal — A lebih meyakinkan.

- **Blur & visibilitas (Q6 amend)** `blur-[2px] opacity-85` + `bg-zinc-300 shadow-md` + overlay `bg-white/30` (amend dari `3px/60` + `200/sm` + `45`) — visibilitas ditingkatkan per feedback; `zinc-300` kontras di `bg-white` card, `shadow-md` edge tegas di balik blur.

- **Overlay copy (Q2 B)** `h3 "Want to be my first client?"` Title Case `text-[22px] lg:text-[32px] font-semibold tracking-tight` + `p "Let's build something together" 14→16px text-zinc-600` + `a "Contact Me" href="#contact" rounded-full bg-[#111827]`. Title Case konsisten `About Me`; button fokusable.

- **Animasi (Q7 A + Q14 A)** `animate-pulse` per bar + `motion-reduce:animate-none`; marquee reuse `app/globals.css:25` + pause `app/globals.css:39` + `prefers-reduced-motion` `app/globals.css:44` (`animation:none`, `mask none`, `flex-wrap wrap justify-center width:auto`). Tidak tambah keyframes baru.

- **Migrasi (Q8 C)** Rewrite total — saat project real ada, buang skeleton carousel dan tulis ulang `app/sections/projects.tsx:1` dari nol; tidak extract `SkeletonProjectCard`, tidak flag `COMING_SOON`.

- **Non-change** `app/globals.css` (reuse keyframes), `app/components/navbar.tsx:5` (anchor), `app/sections/contact.tsx:1` (target `#contact`), `next.config.ts` tidak diubah.

## Testing Decisions

- **Prinsip uji** Hanya uji perilaku eksternal (apa yang dilihat/diklik), bukan string class mentah. Deterministik di `375px` vs `1024px` vs `1280px`.

- **Seam tertinggi — E2E browser (diutamakan)** Satu suite Playwright/Cypress render halaman penuh `/`:
  - (a) Heading `"Projects"` ada `text-[56→92px]` `text-center lg:text-left`.
  - (b) Carousel track `flex w-max` berisi 6 card `w 300px` mobile / `360px` desktop, `gap-6`, bergerak (`transform` berubah dalam 1s, `animation-name: marquee`).
  - (c) Track `blur 2px` + `opacity ~0.85`, `pointer-events none`, `aria-hidden`; tiap card `rounded-[24px]` `h 220px` mobile / `320px` desktop, inner bar `animate-pulse` + `motion-reduce` mati saat emulasi reduce.
  - (d) Overlay `absolute inset-0` center berisi `"Want to be my first client?"` + `"Let's build something together"` + `a[href="#contact"]` terlihat, `background rgba(255,255,255,0.3)` + `backdrop-blur 1px`, tidak ikut geser (posisi `center` tetap sementara `transform` track berubah).
  - (e) `hover` di overlay atau carousel → `animation-play-state: paused`; `focus-within` (Tab ke `Contact Me`) juga `paused`.
  - (f) `prefers-reduced-motion: reduce` → `animation: none`, `mask-image: none`, track `flex-wrap wrap` 6 card center, skeleton tetap blur di balik overlay.
  - (g) Fade mask `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` di wrapper (computed `mask-image` tidak `none` di mode normal).
  - (h) Tab ke `Contact Me` fokusable `focus-visible:ring`, klik scroll ke `#contact`.
  - (i) Anchor Navbar `Projects → #projects` mendarat heading terlihat (top < 100px).
  - (j) Tidak ada overflow horizontal di `375px` (`scrollWidth <= clientWidth`), carousel `w-max 1896→2256px` ter-clip `overflow-hidden`.

- **Seam komponen — Testing Library (pelengkap)** Render `ProjectsSection` terisolasi: assert `heading` ada, track berisi 6 card dengan `aria-hidden`, tiap card berisi image + 2 judul + deskripsi + 2 pill, overlay berisi `h3` + `p` + `a[href="#contact"]`. Mock `matchMedia` untuk `prefers-reduced-motion`.

- **Prior art** Repo tanpa harness test (hanya `dev`/`build`/`lint`); pola ini melanjutkan E2E di `.scratch/about-section/spec.md` dan `skills-carousel-logo-swap`; reuse `Skills Carousel` E2E marquee assertions.

- **Verifikasi manual wajib** (a) `375px` — carousel bergerak, 1 card + intip, overlay center; (b) `1024px` — card `360×320`, gap 24, fade tepi; (c) hover overlay → pause; (d) Tab ke `Contact Me` → pause + ring; (e) DevTools Rendering → Emulate `prefers-reduced-motion: reduce` → static wrap 6 center; (f) klik Navbar `Projects` → scroll heading; (g) cek `blur` computed `2px` di Elements.

- **Quality gates** `npm run lint` + `npm run build` lolos; `tsc --noEmit` tanpa error.

## Out of Scope

- Menampilkan project real, fetching CMS/API, filter kategori — tetap skeleton coming soon.
- Mengubah `Breakpoint lg` `1024px` atau menambah breakpoint custom untuk carousel — tetap `lg:`.
- Menambah library JS (`framer-motion`, `swiper`, `embla`) atau keyframes shimmer baru di `app/globals.css` selain reuse `marquee 25s`.
- Dark mode — tetap `light-only` ADR 0002; overlay tidak ada varian dark.
- Multi-page routing `/projects` — tetap anchor scroll `#projects`.
- Extract `SkeletonProjectCard` ke `app/components/` — tidak, inline `Array(6).map` sesuai Q8 C (rewrite total nanti).
- Mengubah `app/sections/contact.tsx` atau form contact — hanya link `href="#contact"`.
- Test harness berat (coverage threshold, visual regression cloud) — cukup satu suite E2E minimal.

## Further Notes

- **ADRs terkait** Melanjutkan `ADR 0007 Hero Gradient Card` (wrapper `flex justify-center`, card `327×530→1100×632`, Poppins) dan `ADR 0008/0009 About` (container `max-w-6xl`, heading `56→92px`, marquee `25s` reuse). Reversal low: revert `projects.tsx` ke dummy atau ke grid statis 3 card, revert `CONTEXT.md`, amend/hapus ADR 0010.
- **Glossary** `Projects Section` → `group marquee-container overflow-hidden` fade mask; `Skeleton Project Card` → `w-[300px] h-[220px] lg:w-[360px] lg:h-[320px]` 6 card marquee; `Coming Soon Overlay` → `bg-white/30` statis center, `group` pause.
- **Catatan implementasi** Track `w-max` `1896px` mobile (`6×300 + 5×24 + py-2`) / `2256px` desktop (`6×360 + 5×24`) `will-change: transform` GPU OK; `h-24 lg:h-36` image disesuaikan agar proporsional dengan `h 220→320`; `300px` di `375px` viewport sengaja intip card kedua sebagai affordance geser.
- **Aksesibilitas** Overlay `bg-white/30` di atas `blur` jaga kontras `zinc-900` `AAA` untuk `22→32px`; `group:hover pause` + `prefers-reduced-motion` wrap memenuhi WCAG motion.

