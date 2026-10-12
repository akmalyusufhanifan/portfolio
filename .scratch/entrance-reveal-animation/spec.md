# Spec — Entrance Reveal Animation (Load-in Rapih & Smooth)

- **Feature slug:** `entrance-reveal-animation`
- **Status:** `ready-for-agent`
- **ADR:** `docs/adr/0013-entrance-reveal-animation.md`
- **Glossary:** `CONTEXT.md` (Entrance Animation, Reveal on-scroll, Stagger)
- **Grill:** Q1 scope (B), Q2 style (C), Q3 tech (A), Q4 duration (B), Q5 a11y (A) — grill-with-docs 1-per-1

## Problem Statement

Saat website dibuka, semua konten (Hero, About, Projects, Contact) muncul sekaligus secara instan tanpa transisi. Tidak ada load-in — konten terasa "pop" / kaku, tidak rapih dan tidak smooth, terutama di Hero Card yang merupakan first impression.

## Solution

Tambahkan Entrance Animation halus di semua konten: Hero animasi saat on-load, About/Projects/Contact animasi saat masuk viewport (Reveal on-scroll). Gaya fade + slide-up 16px + stagger 90ms per elemen, durasi 600ms dengan easing premium, implementasi CSS-only + satu IntersectionObserver wrapper, menghormati `prefers-reduced-motion`.

## User Stories

1. As a visitor membuka website, I want to see Hero Card muncul dengan fade + slide-up halus, so that first impression terasa premium bukan pop instan.
2. As a visitor melihat Hero, I want to see elemen muncul berurutan (foto → heading → tagline → CTA) dengan jeda 90ms, so that load-in terasa rapih berurutan.
3. As a visitor scroll ke About, I want to see heading/paragraf/gambar/skills reveal saat masuk viewport, so that animasi selalu terlihat (tidak jalan di luar layar).
4. As a visitor scroll ke Projects, I want to see heading + carousel skeleton reveal halus, so that transisi antar section konsisten.
5. As a visitor scroll ke Contact, I want to see teks kiri + gambar kanan reveal halus, so that section penutup tetap smooth.
6. As a visitor di mobile (375px), I want to see animasi tetap smooth 60fps tanpa jank, so that pengalaman mobile tidak lemot.
7. As a visitor di desktop (1024px+), I want to see stagger yang sama proporsional, so that ritme konsisten semua viewport.
8. As a keyboard user tab navigating, I want to see konten tetap focusable meski belum reveal, so that navigasi tidak terjebak.
9. As a user with `prefers-reduced-motion: reduce`, I want to see konten langsung tampil statis tanpa animasi, so that motion tidak mengganggu.
10. As a visitor dengan JS mati, I want to see konten tetap visible (tidak blank), so that website tetap usable.
11. As a visitor klik anchor nav (About/Projects/Contact), I want to see smooth scroll existing tidak rusak oleh reveal, so that navigasi anchor tetap bekerja.
12. As a visitor hover Skills Carousel / Projects marquee, I want to see pause on hover tetap bekerja, so that tidak ada regresi animasi existing.
13. As a maintainer, I want to see satu seam wrapper saja, so that bundle client minimal dan section tetap Server Component.
14. As a maintainer, I want to see glossary + ADR sinkron, so that domain docs tidak drift.

## Implementation Decisions

- **Seam tunggal (S1):** Satu Client Component `Reveal` sebagai wrapper — section tetap Server Component, hanya dibungkus di dalamnya. Tidak mengubah section menjadi `"use client"`, tidak menyentuh anchor `id`.
- **Mekanika Reveal:** IntersectionObserver dengan threshold rendah agar reveal terasa responsif, trigger sekali saja (once, tidak re-animate saat scroll bolak-balik agar rapih). Hero memakai mode on-mount langsung visible (tanpa menunggu observer karena above-the-fold).
- **Visual:** Initial state opacity 0 + translateY 16px, visible opacity 1 + translateY 0. Transisi 600ms dengan easing premium. Stagger via prop delay berjenjang 0/90/180/270ms per grup.
- **CSS:** Class baru di stylesheet global existing, mengikuti pola marquee existing (keyframes + `prefers-reduced-motion` block). Tidak menambah dependency baru — Tailwind + CSS murni cukup.
- **Aksesibilitas:** Blok `prefers-reduced-motion: reduce` menonaktifkan transform/opacity transition (konten langsung tampil). Default state harus visible jika observer belum jalan (progressive enhancement, no-JS aman). Tidak memakai `aria-hidden` pada konten reveal agar screen reader / keyboard tetap mencapai konten.
- **Non-perubahan:** Layout, spacing, warna, tipografi Poppins, anchor `href="#..."`, marquee `25s`, scroll-lock bubble, dan footer tidak diubah. Navbar tidak ikut reveal (selalu visible sebagai chrome).
- **Docs:** Tambah 3 entri glossary (Entrance Animation, Reveal on-scroll, Stagger) + ADR baru merekam 5 ronde grill.

## Testing Decisions

- **Philosophy:** Only test external behavior, not implementation details. Assert apa yang visitor lihat, bukan internal observer props atau class names.
- **Seam tertinggi — E2E browser (preferred):** Single suite render halaman penuh `/`:
  - (a) Load awal Hero elemen berurutan opacity 0→1 dalam ~600ms + stagger terukur.
  - (b) Scroll ke About/Projects/Contact memicu reveal sekali, tidak re-trigger saat scroll kembali ke atas.
  - (c) `prefers-reduced-motion: reduce` emulate → semua konten langsung visible tanpa transisi.
  - (d) JS disabled → semua konten visible, tidak blank.
  - (e) Anchor click `#about`/`#projects`/`#contact` tetap smooth scroll ke id yang benar.
  - (f) Marquee existing tetap jalan + hover pause tidak regresi.
- **Prior art:** Pola E2E marquee di spec skills-carousel-logo-swap; repo tanpa unit harness (hanya `dev`/`build`/`lint`) — E2E adalah seam tertinggi.
- **Fallback manual:** Jika E2E belum ada, verify via `npm run lint` bersih, `npm run build` sukses, `npm run dev` visual check load + scroll reveal + reduced-motion emulate di DevTools Rendering tab + throttle CPU 4x untuk jank check.

## Out of Scope

- Mengubah layout/spacing/warna/tipografi section mana pun — hanya tambah animasi.
- Menganimasikan Navbar / Bubble Menu — chrome selalu visible.
- Menambah library animasi (`motion`/`framer-motion`/`gsap`) — CSS-only per grill Q3.
- Mengubah durasi marquee (25s), fade mask, atau mekanika carousel — tetap.
- Parallax, scroll-progress bar, page transition antar route, atau hero loader/splash screen.
- Menambah unit test framework baru — repo tetap tanpa harness.

## Further Notes

- Grill 5 ronde 1-per-1: Q1 B (hero on-load + bawah on-scroll), Q2 C (fade+slide+stagger), Q3 A (CSS-only), Q4 B (600ms + 90ms), Q5 A (reduced-motion safe + default visible).
- Reversal low: hapus wrapper = balik statis instan, hapus CSS block, revert glossary + hapus ADR.
