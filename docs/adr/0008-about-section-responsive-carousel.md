# ADR 0008 — About Section Responsive + Skills Marquee

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/sections/about.tsx:1`, `app/components/skills-carousel.tsx:1`, `app/globals.css:25`, `CONTEXT.md:17`, `app/page.tsx:1`, `app/components/navbar.tsx:42`
- **Grill:** Q1 (layout & container), Q2 (heading), Q3 (gambar dummy), Q4 (paragraf), Q5 (skills list & icon), Q6 (carousel mechanics)

## Context

`About Section` masih dummy di `app/sections/about.tsx:1` (`flex min-h-[60vh] border-b bg-white`, teks `"ABOUT SECTION"`). Brief baru (grill-with-docs 6 ronde) meminta section final dengan:

- Mobile 1 kolom 4 baris: judul `about me` → gambar kartun dummy → paragraf Full Stack → `skills` + carousel icon auto-scroll
- Desktop 2 kolom: kiri 3 baris (judul, paragraf, skills), kanan 1 gambar kartun
- Skills carousel berisi `js, ts, react, next, dll` yang bergerak ke samping otomatis
- Konsistensi dengan sistem existing: Poppins via `app/layout.tsx:6`, breakpoint `lg:1024px` via `app/components/navbar.tsx:42`, container sinkron Navbar `max-w-6xl`, Hero Section `app/sections/hero.tsx:1` (`bg-white py-6`, card `327×530 → 1100×632`)

Investigasi existing:
- Navbar `relative h-16` non-sticky sudah settled di ADR 0004; About Section `id="about"` adalah target anchor `About → #about` di `app/components/navbar.tsx:12`.
- Hero wrapper telah diamend dari `min-h-[calc(100vh-64px)]` ke `flex justify-center py-6` untuk gap minimal — About mengikuti ritme `py-16 lg:py-20` agar tidak ada ruang kosong besar.
- Tailwind v4 `@import "tailwindcss"` di `app/globals.css:1` mendukung arbitrary values dan `@keyframes` tanpa config.
- Repo tanpa test harness (hanya `dev`/`build`/`lint` di `package.json:11`); `AboutSection` dan `SkillsCarousel` adalah pola section baru yang butuh seam tertinggi E2E.

Alternatif yang dipertimbangkan (6 grill rounds):

- **Q1 Layout & container:** A) `mx-auto max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-white` + `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12` dengan `order` pindah gambar (chosen), B) `max-w-3xl` lama + `flex` stack tanpa grid, C) `1100px` fixed tanpa `max-w-6xl`. Dipilih A: sinkron Navbar `max-w-6xl` (`app/components/navbar.tsx:105`) + presisi Hero `1100px`, `grid` menyeimbangkan tinggi kolom tanpa JS, satu DOM via `order` hindari duplikasi gambar.
- **Q2 Heading:** A) `"About Me"` Title Case `text-2xl lg:text-4xl font-semibold tracking-tight text-zinc-900 text-center lg:text-left` (chosen), B) `"about me"` all-lowercase literal, C) `text-3xl font-bold` dummy lama. Dipilih A: konsisten dengan Navbar `About` Title Case dan Hero Heading `22→36px semibold`; `center → left` simetris dengan gambar terpusat di mobile.
- **Q3 Gambar dummy:** A) `div w-full max-w-[340px] lg:max-w-[440px] aspect-[4/3] lg:aspect-square rounded-[24px] bg-zinc-100 border border-zinc-200` berisi `🧑‍💻` + label (chosen), B) `next/image` dengan `public/file.svg`, C) external `placehold.co`. Dipilih A: tanpa `next/image` hindari config `next.config.ts:1` untuk external domain; `rounded-[24px]` proporsional dengan Hero `32→40px`; `aspect` menjaga rasio tanpa fix height.
- **Q4 Paragraf:** A) 1 paragraf utuh `text-[15px] lg:text-[17px] leading-relaxed text-zinc-600 lg:text-zinc-700 max-w-[480px] lg:max-w-[560px] text-center lg:text-left` (chosen), B) pecah 2 paragraf, C) `text-[14px] text-zinc-600` kecil. Dipilih A: sesuai brief 1 paragraf, `15→17px` di antara Hero Tagline `15→18px` dan dummy `zinc-600`; `max-w` batasi baris di `1100px` seperti Hero `260→620`.
- **Q5 Skills:** A) judul `Skills` `16→18px semibold` + 10 icon JS/TS/React/Next/Node/Tailwind/HTML/CSS/Git/GitHub SVG inline monochrome card `h-10 w-10 rounded-xl border shadow-sm` (chosen), B) tambah `react-icons`, C) `h-8` flat tanpa card. Dipilih A: 10 icon representatif Full Stack, zero-dependency seperti `HamburgerIcon` inline SVG, card `rounded-xl` rapi di `bg-white`.
- **Q6 Carousel:** A) CSS `@keyframes marquee 25s linear infinite` duplikasi `[...icons, ...icons]` + `hover/focus pause` + fade mask + `prefers-reduced-motion` → wrap statis, extract `app/components/skills-carousel.tsx` Client (chosen), B) JS lib `swiper/embla`, C) finite scroll panah. Dipilih A: GPU `transform`, tanpa dependency baru, `25s` tengah (tolak `18s` cepat / `35s` lambat), pause untuk aksesibilitas, extract kecil agar `AboutSection` tetap Server Component seperti `app/sections/hero.tsx:1`.

## Decision

1. **Rewrite AboutSection `app/sections/about.tsx:1`** sebagai Server Component `export default function AboutSection` dengan `id="about"`:
   ```tsx
   <section id="about" className="bg-white py-16 lg:py-20">
     <div className="mx-auto max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
       {/* heading order-1, image order-2 → lg:col-start-2 lg:row-span-3, paragraf order-3, skills order-4 */}
     </div>
   </section>
   ```

2. **Konten `app/sections/about.tsx:8-42`:**
   - Heading `About Me` `text-2xl lg:text-4xl font-semibold tracking-tight text-zinc-900 text-center lg:text-left`
   - Dummy `div max-w-[340px] lg:max-w-[440px] aspect-[4/3] lg:aspect-square rounded-[24px] bg-zinc-100 border-zinc-200` berisi `🧑‍💻` + `Cartoon placeholder`
   - Paragraf `max-w-[480px] lg:max-w-[560px] text-[15px] lg:text-[17px] text-zinc-600 lg:text-zinc-700 text-center lg:text-left`
   - Skills `h3` `Skills` `text-[16px] lg:text-[18px] font-semibold` + `<SkillsCarousel />`

3. **SkillsCarousel `app/components/skills-carousel.tsx:1`** Client Component `"use client"`:
   - `SKILLS` 10 item digandakan 20, tiap icon `h-10 w-10 rounded-xl bg-white border border-zinc-100 shadow-sm p-2 text-zinc-700` berisi SVG `rect + text abbr`
   - Wrapper `group marquee-container overflow-hidden [mask-image:linear-gradient(to_right,...)]`
   - Track `marquee-track animate-marquee flex w-max gap-4 py-2` dengan `@keyframes marquee` `translateX(-50%)` di `app/globals.css:25`

4. **Styling `app/globals.css:25`:**
   ```css
   @keyframes marquee { from {transform: translateX(0)} to {transform: translateX(-50%)} }
   .animate-marquee { animation: marquee 25s linear infinite; will-change: transform; }
   .group:hover .animate-marquee, .group:focus-within .animate-marquee { animation-play-state: paused; }
   @media (prefers-reduced-motion: reduce) { .animate-marquee {animation:none} .marquee-container{mask-image:none} .marquee-track{flex-wrap:wrap; width:auto} }
   ```

## Consequences

- **Positif:** Mobile 1-kolom 4-baris presisi → desktop 2-kolom tanpa duplikasi DOM; gambar dummy siap swap ke `next/image` tanpa ubah grid; carousel infinite seamless, pause on hover/focus, respeK `prefers-reduced-motion`; zero-dep baru (tetap `next`+`react`); `AboutSection` tetap Server Component konsisten dengan `HeroSection`; container sinkron Navbar & Hero.
- **Negatif:** Dummy `div` dengan `aspect` butuh ruang vertikal di mobile (340×255) — tidak sepresisi fixed `327×530` Hero Card tapi fleksibel. Marquee CSS `25s` tidak draggable/swipe — jika butuh drag, ADR baru diperlukan.
- **Trade-off:** Card icon `h-10 rounded-xl shadow-sm` vs flat `h-8` — card lebih rapi di `bg-white` tapi sedikit lebih berat. Duplikasi 20 item vs JS virtual loop — duplikasi sederhana tanpa JS.
- **Reversal cost:** Low — revert `app/sections/about.tsx` ke dummy `min-h-[60vh]`, hapus `app/components/skills-carousel.tsx` dan keyframes di `app/globals.css:25`, revert `CONTEXT.md:17`, hapus file ini.

## References

- `app/sections/about.tsx:1` — About Section, heading, paragraf, cartoon placeholder, skills label, grid
- `app/components/skills-carousel.tsx:1` — SkillsCarousel, 10→20 icons, SVG inline, marquee
- `app/globals.css:25` — `@keyframes marquee`, `.animate-marquee`, reduced-motion
- `app/page.tsx:2` — import AboutSection
- `app/components/navbar.tsx:42` — Breakpoint lg 1024px penentu `grid`
- `app/sections/hero.tsx:1` — pola Server Component + Poppins + container
- `CONTEXT.md:17` — glossary About Section domain
- `.scratch/about-section/spec.md` — spec lengkap 25 user stories
