# ADR 0007 — Hero Gradient Card Responsive

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/page.tsx:1`, `app/sections/hero.tsx:1`, `app/components/navbar.tsx:96`, `CONTEXT.md:6`, `app/layout.tsx:6`, `app/globals.css:1`
- **Grill:** Q1 (hero bg + centering + tablet fluid), Q2 (radius/shadow/diagonal), Q3 (profile circle), Q4 (typography), Q5 (button), Q6 (spacing + extract)

## Context

Hero sebelumnya dummy di `app/page.tsx:8` (`flex min-h-[60vh] border-b bg-white`, teks "HERO SECTION") tidak merepresentasikan brief baru. Brief meminta satu responsive card di hero dengan:

- Ukuran mobile `327×530`, desktop `1100×632`, tablet menyesuaikan
- Gradient kiri `#FBED96` → kanan `#ABECD6`
- Stack vertikal: lingkaran profile kecil → `"Hi, I'm Akmal 👋"` → `"I turn ideas into meaningful digital experiences through code."` → dummy button Contact
- Grill mode `grill-with-docs` dengan tanya satu-satu

Investigasi struktur existing:
- Navbar `relative h-16` non-sticky di `app/components/navbar.tsx:96`, Hero harus `min-h-[calc(100vh-64px)]` agar card tepat di tengah viewport sisa layar.
- Typography global Poppins via `app/layout.tsx:6` (`variable --font-poppins`) → semua teks hero ikut Poppins tanpa font baru.
- Section lain (`About`/`Projects`/`Contact`) sudah di-extract ke `app/sections/*.tsx` sebagai Server Component; Hero masih inline di `app/page.tsx:8` — inkonsisten deep-module.
- Tailwind v4 (`@import "tailwindcss"` di `app/globals.css:1`) mendukung arbitrary values `w-[327px]`, `from-[#FBED96]` dsb tanpa config extra.

Alternatif yang dipertimbangkan (6 grill rounds):

- **Q1 Hero layout:** A) hero `bg-white` + card centered `flex items-center justify-center px-4 py-8` + `min-h-[calc(100vh-64px)]` + tablet fluid `w-[90%] max-w-[680px]` (chosen awal), B) hero background gradient, C) `min-h-[60vh]` tetap. Dipilih A awal untuk center viewport. **Amend 2026-09-18 (gap fix):** `min-h-[calc(100vh-64px)]` + `items-center` dihapus → `flex justify-center px-4 py-6 md:py-8 lg:py-10` agar tinggi hero menyesuaikan card (gap minimal, tidak ada ruang kosong besar di viewport tinggi).
- **Q2 Visual card:** A) `rounded-[32px] → lg:rounded-[40px]` + `shadow-[0_20px_60px_rgba(0,0,0,0.08)]` + diagonal `135deg` `bg-gradient-to-br` (chosen), B) tanpa shadow flat, C) 90deg `to-r`. Dipilih A: radius proporsional ukuran, shadow lembut angkat card dari putih, diagonal lebih modern dari 90deg horizontal.
- **Q3 Profile circle:** A) `w-20 h-20 → lg:w-28 lg:h-28 rounded-full bg-white` polos tanpa border/shadow, isi initial "A" (chosen), B) dengan border putih/shadow, C) pakai `next/image`. Dipilih A: sesuai request "putih polos tanpa border dan shadow", initial sementara sampai asset foto ada.
- **Q4 Typography:** A) heading `22px→36px semibold zinc-900` tanpa emoji + paragraf `15px→18px normal zinc-700` centered `max-w-[260px]→480→620` wrap auto (chosen), B) pertahankan emoji 👋, C) left-aligned. Dipilih A: hapus emoji lebih formal, wrap auto rapi tanpa `<br>` paksa, max-w cegah paragraf memanjang di 1100px.
- **Q5 Button:** A) label "Contact Me" `href="#contact"` + `bg-[#111827] text-white rounded-full` tanpa shadow/border text-only (chosen), B) `bg-white text-zinc-900`. Dipilih A: `#111827` (gray-900) kontras tegas di gradient kuning-hijau, tanpa shadow/border sesuai request, link ke `ContactSection` `app/sections/contact.tsx:3`.
- **Q6 Spacing + extract:** A) inner `flex flex-col items-center justify-center p-8 lg:p-12 gap-4 / gap-3 / mt-6→8` + extract ke `app/sections/hero.tsx` (chosen), B) tetap inline di `page.tsx`. Dipilih A: `justify-center` center vertikal dalam `h-[530]/[632]`, tablet `h-auto min-h-[530]` hindari crop; extract konsisten dengan `AboutSection` `app/sections/about.tsx:1`.

## Decision

1. **Extract Hero:** Buat `app/sections/hero.tsx:1` Server Component `export default function HeroSection` dengan `id="hero"` (`app/sections/hero.tsx:3`). `app/page.tsx:1` hanya `import HeroSection` dan render `<HeroSection />` (hapus dummy section).

2. **Hero wrapper `app/sections/hero.tsx:3` (amended):**
   ```tsx
   <section id="hero" className="flex justify-center bg-white px-4 py-6 md:py-8 lg:py-10">
   ```
   Tinggi menyesuaikan card, tanpa `min-h-[calc(100vh-64px)]`/`items-center` agar gap atas/bawah minimal (amend gap fix 2026-09-18).

3. **Card `app/sections/hero.tsx:7`:**
   ```tsx
   className="
     flex flex-col items-center justify-center gap-4
     bg-gradient-to-br from-[#FBED96] to-[#ABECD6]
     shadow-[0_20px_60px_rgba(0,0,0,0.08)]
     w-[327px] h-[530px] rounded-[32px]
     md:w-[90%] md:max-w-[680px] md:h-auto md:min-h-[530px] md:py-12
     lg:w-[1100px] lg:h-[632px] lg:rounded-[40px] lg:p-12 lg:gap-5
   "
   ```

4. **Stack konten `app/sections/hero.tsx:22-48`:**
   - Circle `h-20 w-20 lg:h-28 lg:w-28 rounded-full bg-white` + initial "A" `text-zinc-700`
   - `h1` "Hi, I'm Akmal" `text-[22px] lg:text-[36px] font-semibold text-zinc-900`
   - `p` "I turn ideas..." `max-w-[260px] md:max-w-[480px] lg:max-w-[620px] text-[15px] lg:text-[18px] text-zinc-700 leading-relaxed`
   - `a href="#contact"` "Contact Me" `bg-[#111827] text-white rounded-full px-7 py-3 text-[14px] lg:text-[15px] hover:bg-black`

## Consequences

- **Positif:** Card presisi 327×530 mobile / 1100×632 desktop sesuai brief, tablet fluid tidak overflow; gradient diagonal modern; center vertikal presisi di viewport; extract menyamakan pola `app/sections/*`; semua teks ikut Poppins; button CTA jelas ke `#contact`.
- **Negatif:** Card fix `h-[530]/[632]` bisa terasa tinggi di viewport pendek (<600px) — diatasi `md:h-auto min-h`. Gradient arbitrary `from-[#FBED96]` butuh Tailwind v4 (sudah ada).
- **Trade-off:** Desktop fix height vs tablet auto — ritme visual desktop presisi, tablet fleksibel. Shadow lembut menambah depth tapi sedikit beda dari flat spec awal (approved Q2.2).
- **Reversal cost:** Low — hapus `app/sections/hero.tsx`, revert `app/page.tsx:1` ke dummy `min-h-[60vh]`, hapus file ini, revert `CONTEXT.md:6-10`.

## References

- `app/sections/hero.tsx:1` — HeroSection, Hero Card, gradient, profile circle, typography, button
- `app/page.tsx:1` — import HeroSection
- `app/components/navbar.tsx:96` — Navbar `h-16` penentu `calc(100vh-64px)`
- `app/layout.tsx:6` / `app/globals.css:8` — Poppins typography
- `app/sections/about.tsx:1` — pola extract section
- `CONTEXT.md:6-10` — glossary Hero domain
