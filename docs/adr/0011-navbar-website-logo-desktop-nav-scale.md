# ADR 0011 — Navbar Website Logo & Desktop Nav Scale

- **Status:** Accepted
- **Date:** 2026-09-22
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `app/layout.tsx:25`, `public/website-logo.png`, `CONTEXT.md:9`, `docs/adr/0001-navbar-responsive-strategy.md`, `docs/adr/0004-navbar-non-sticky-borderless-poppins.md`
- **Grill:** Q1 (strategi logo), Q2 (tinggi display), Q3 (besaran desktop), Q4 (fallback/alt), Q5 (scope docs) — grill-with-docs 1-per-1

## Context

`Navbar` di `app/components/navbar.tsx:1` adalah Client Component non-sticky `relative h-16 w-full bg-white` (`CONTEXT.md:9`, ADR 0004) dengan kiri **Site Name** teks `Akmal.dev` (`app/components/navbar.tsx:104` `text-lg font-bold`, prop `siteName` `app/components/navbar.tsx:17`) dan kanan **Navigation Items** 3 anchor (`About`/`Projects`/`Contact`) via `NAV_ITEMS` `app/components/navbar.tsx:5`. Desktop nav (`hidden lg:block`) memakai `text-sm px-1 py-1 gap-8` (`app/components/navbar.tsx:115-120`), bubble mobile `text-[14px] px-2 py-1.5 gap-4` (`app/components/navbar.tsx:168`). Asset baru `public/website-logo.png` (99451B, 1765×882, ratio 2:1) sudah disiapkan user untuk menggantikan teks kiri. User minta: (1) pakai logo tersebut di kiri, (2) perbesar button navigasi hanya untuk desktop, mobile sudah pas.

Investigasi:
- `public/website-logo.png` verified ada, 2:1 sangat lebar — karakteristik horizontal header, bukan square avatar.
- `app/components/navbar.tsx:102` container `flex items-center justify-between h-16` — tinggi display logo harus leave breathing room vertikal.
- `app/layout.tsx:25` memanggil `<Navbar />` tanpa prop — backward compat harus dijaga.
- Breakpoint `lg:1024px` tetap (`app/components/navbar.tsx:42`, `CONTEXT.md:31`).
- Tidak ada `next.config.ts` image remote config diperlukan untuk local `public/`.

Alternatif yang dipertimbangkan (5 grill rounds):

1. **Q1 Strategi logo (chosen A: Replace total via `next/image`)**
   - A) **Replace total — `next/image` `src="/website-logo.png"` di dalam `<a href="#hero">`, prop `siteName` jadi `alt` fallback** (chosen)
   - B) Hybrid logo + teks `Akmal.dev` berdampingan
   - C) `<img>` biasa tanpa optimasi
   - Dipilih A: paling bersih jika logo sudah include tulisan (ratio 2:1 mengindikasikan sudah final). `next/image` beri optimasi, `priority` untuk LCP above-the-fold, `alt` tetap terbaca sebagai brand. B duplikat brand jika logo sudah berisi teks; C kehilangan optimasi Next 16. Trade-off: `width/height` prop wajib meski CSS yang mengontrol render size.

2. **Q2 Tinggi display (chosen A: `h-8 lg:h-10` → amended `h-10 lg:h-12` per user request "perbesar logo")**
   - A) **`h-8 (32px) mobile → lg:h-10 (40px) desktop, w-auto object-contain`** (chosen awal 2026-09-22)
   - B) **`h-10 (40px) mobile → lg:h-12 (48px) desktop, w-auto object-contain`** (amended — user minta perbesar, 40→48px leave 16px di `h-16`, proporsional dengan nav `text-[16px]` yang sudah di-scale, lebar hasil `≈80px → 96px` (2:1) masih muat di `max-w-6xl`)
   - C) `h-7 → lg:h-8` (28→32px) minimalis tapi kalah dari nav 16px
   - Dipilih awal A, diamend ke **B** pada 2026-09-22 malam: 40px mobile leave 24px, 48px desktop leave 16px di `h-16` — lebih dominan tanpa overflow, seimbang dengan `gap-10` desktop.

3. **Q3 Besaran desktop (chosen A: `text-[16px] px-2 py-2 gap-10`)**
   - A) **`text-sm (14px) → text-[16px] + px-1 py-1 → px-2 py-2 + gap-8 → gap-10` desktop-only** (chosen)
   - B) `text-[17/18px]` + `gap-10` lebih bold, risiko sesak di 1024px dengan logo 2:1
   - C) Tetap `text-sm` hanya perbesar hit area `px-3 py-2` — tidak terasa "memperbesar"
   - Dipilih A: naik 14% terasa tanpa refactor layout, `gap-10` kompensasi lebar logo. Mobile bubble `app/components/navbar.tsx:168` sengaja **tidak diubah** (`text-[14px]`) sesuai brief.

4. **Q4 Fallback/alt (chosen A: pertahankan prop `siteName` sebagai `alt`)**
   - A) **Pertahankan `siteName?: string` default `"Akmal.dev"` sebagai `alt` + `aria-label`** (chosen)
   - B) Hapus prop, hardcode `alt="Akmal.dev"`
   - C) Tambah `<span sr-only>` duplikat
   - Dipilih A: backward compat `app/layout.tsx:25`, `alt` handle SEO/a11y saat image gagal, tidak perlu `onError` khusus. B hilang fleksibilitas brand swap; C redundan karena `alt` sudah cukup.

5. **Q5 Scope docs (chosen A: ADR + CONTEXT patch)**
   - A) **ADR 0011 + patch CONTEXT.md** (chosen)
   - B) Hanya patch CONTEXT
   - Dipilih A: memenuhi 3 syarat ADR — hard to reverse (ratio/alt decision), surprising (kenapa 2:1 + desktop-only), real trade-off (`next/image` vs `img`, sizing).

## Decision

1. **Update `app/components/navbar.tsx:1`** — tambah `import Image from "next/image"`.

2. **Ganti left block `app/components/navbar.tsx:104-111`** dari:
   ```tsx
   <a className="text-lg font-bold ...">{siteName}</a>
   ```
   menjadi:
   ```tsx
   <a href="#hero" onClick={() => setOpen(false)} className="flex items-center overflow-hidden" aria-label={`${siteName} - back to hero`}>
     <div className="relative h-10 w-[132px] overflow-hidden lg:h-12 lg:w-[156px]">
       <Image src="/website-logo.png" alt={siteName} fill priority className="object-cover object-center" sizes="(min-width: 1024px) 156px, 132px" />
     </div>
   </a>
   ```
   `fill` + wrapper fixed `h-10 w-[132px] lg:h-12 lg:w-[156px]` + `object-cover object-center` untuk zoom (amended dari `width/height + h-10 w-auto object-contain lg:h-12` — `object-cover` crop whitespace di `public/website-logo.png` agar logo terlihat lebih besar tanpa menambah tinggi header `h-16`). `sizes` disesuaikan container.

3. **Scale desktop nav `app/components/navbar.tsx:114-126`:**
   - `ul` `gap-8 → gap-10` (`app/components/navbar.tsx:115`)
   - `a` `text-sm → text-[16px]` + `px-1 py-1 → px-2 py-2` (`app/components/navbar.tsx:122`)
   - `font-medium`, warna `text-[#F59E0B]/#38BDF8/#34D399`, underline `h-[2px] group-hover:w-full` tetap
   - Mobile bubble `app/components/navbar.tsx:168` tidak diubah

4. **Docs sync:**
   - `CONTEXT.md:9` Navbar: `Site Name → Website Logo`
   - `CONTEXT.md:10` baru **Website Logo** + retain **Site Name** sebagai prop fallback
   - `CONTEXT.md:11` Hero Section anchor `Site Name → Website Logo`
   - `CONTEXT.md:27` Navigation Item: tambah deskripsi desktop `text-[16px] px-2 py-2 gap-10` vs mobile `text-[14px]` tetap

## Consequences

- **Positif:** Brand kiri konsisten image; `next/image fill priority` + wrapper zoom `object-cover` crop whitespace sehingga logo terlihat lebih besar tanpa tambah tinggi `h-16` (40px mobile `w-[132px]`, 48px desktop `w-[156px]`); desktop nav 16px lebih readable tanpa ganggu mobile 14px yang sudah pas; `gap-10` + `px-2 py-2` hit area lebih besar; backward compat prop terjaga; glossary jelas untuk future reader.
- **Negatif:** `object-cover` memotong tepi image jika `website-logo.png` memiliki padding penting di pinggir — mitigasi `object-center` + kurangi `w-[...]` atau kembali ke `object-contain`. Header di `1024px` exact lebih padat (wrapper `156px` + `gap-10` 40px ×2). Jika overflow, kurangi `w-[156px] → 140px` atau `gap-10 → gap-8`. Payload 99KB + `priority` masih wajar.
- **Trade-off:** `next/image` vs `<img>` — pilih optimasi Next meski wajib `width/height` prop (sedikit verbositas). `text-[16px]` vs `18px` — pilih kenaikan moderat agar logo tetap hero, bukan nav yang dominan.
- **Reversal cost:** Low — revert `app/components/navbar.tsx:1` hapus `Image` import, kembalikan `<a className="text-lg font-bold">{siteName}</a>`, revert `gap-10 → gap-8` + `text-[16px] → text-sm` + `px-2 py-2 → px-1 py-1`, revert `CONTEXT.md:9-10` dan hapus file ini.

## References

- `app/components/navbar.tsx:1` — implementasi Website Logo + scaled nav
- `public/website-logo.png` — asset 1765×882 ratio 2:1
- `app/layout.tsx:25` — `<Navbar />` compat
- `CONTEXT.md:9` — Navbar (Website Logo)
- `CONTEXT.md:10` — Website Logo + Site Name (prop fallback)
- `CONTEXT.md:27` — Navigation Item (16px desktop, 14px mobile)
- `docs/adr/0001-navbar-responsive-strategy.md` — breakpoint `lg:1024px` + toggle strategy
- `docs/adr/0004-navbar-non-sticky-borderless-poppins.md` — non-sticky header context
- `app/globals.css:8` — Poppins typography (unchanged)

