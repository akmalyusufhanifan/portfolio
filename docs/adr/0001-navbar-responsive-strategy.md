# ADR 0001 — Navbar Responsive Strategy

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `app/layout.tsx:21`, `app/globals.css:15`

## Context

Navbar harus responsive: desktop tampil semua Navigation Items, tablet/mobile pakai Hamburger Button di kanan. Portfolio adalah Next.js 16 App Router + Tailwind CSS v4 (`app/globals.css:1`). Butuh strategi breakpoint dan mekanisme toggle yang minimal dependency dan aksesibel.

Alternatif yang dipertimbangkan:

1. **Tailwind CSS breakpoint `lg:1024px` + React `useState`** (chosen)
   - Pakai `hidden lg:flex` / `lg:hidden` untuk visibility, toggle dengan `useState`, animasi `transition-all duration-200`.
2. **JS `window.matchMedia` manual + resize listener** tanpa Tailwind
   - Lebih fleksibel untuk custom breakpoint 900px, tapi duplikasi logika CSS-JS dan perlu sync.
3. **Library drawer (Headless UI, Radix, shadcn Sheet)**
   - Aksesibel out-of-the-box, tapi tambah dependency, overkill untuk 3 item.

## Decision

Pilih **Opsi 1: Tailwind `lg:1024px` + React `useState`**:

- Breakpoint `lg:1024px` — `>=1024px` desktop, `<1024px` hamburger. Sesuai `app/components/navbar.tsx:49` dan `tailwindcss v4` default.
- Dropdown panel `absolute top-16 left-0 w-full bg-white border-t shadow-md` dengan `translate-y-0 opacity-100` / `pointer-events-none -translate-y-2 opacity-0` + `duration-200`. `app/components/navbar.tsx:99`.
- Auto-close: click link (`onClick={() => setOpen(false)}`), click outside (`mousedown` listener `app/components/navbar.tsx:26`), `ESC` (`keydown` `app/components/navbar.tsx:36`), dan `resize >=1024px` (`app/components/navbar.tsx:62`).
- Body scroll lock hanya saat `<1024px` open (`app/components/navbar.tsx:47`).
- Ikon inline SVG Hamburger/Close tanpa library (`app/components/navbar.tsx:132`).

## Consequences

- **Positif:** Zero dependency tambahan (`package.json:11` tetap `next`+`react`), konsisten dengan Tailwind, ringan, aksesibel (`aria-expanded`, `aria-controls`, `aria-hidden`, `sr-only`).
- **Negatif:** Custom 900px tidak bisa tanpa config Tailwind tambahan. Jika butuh, buat ADR revisi dan tambah `theme.extend.screens` di Tailwind config.
- **Trade-off:** Dropdown `absolute` bukan `fixed drawer` — lebih simple tapi tidak ada overlay gelap. Jika nanti butuh drawer slide-in, ADR baru diperlukan.

## References

- Next.js docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` — RootLayout pattern
- Next.js docs: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` — Client Component boundary
- Tailwind CSS v4 — breakpoint `lg` = 1024px
