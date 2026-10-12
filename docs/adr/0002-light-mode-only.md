# ADR 0002 — Light Mode Only untuk Navbar

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Akmal
- **Context:** `app/globals.css:15`, `app/components/navbar.tsx:42`, `app/layout.tsx:28`

## Context

`app/globals.css:15` awalnya memiliki `@media (prefers-color-scheme: dark)` yang mengubah `--background: #0a0a0a` dan `--foreground: #ededed`. User memutuskan website **hanya light mode**, tidak berencana dark mode. Navbar harus konsisten light meski OS user dalam dark mode.

Alternatif:

1. **Hapus dark media query global + lock warna eksplisit** (chosen)
2. **Biarkan dark mode global, tapi navbar pakai `dark:` overrides** — navbar tetap light, tapi body bisa dark, inkonsistensi visual.
3. **Dukung full dark mode** — butuh `dark:` classes di semua komponen, scope lebih besar.

## Decision

Pilih **Opsi 1**:

- Hapus blok `@media (prefers-color-scheme: dark)` dari `app/globals.css:15`.
- Set `html { scroll-behavior: smooth }` untuk anchor scroll.
- Navbar pakai warna eksplisit light: `bg-white/80`, `bg-white`, `text-zinc-900`, `text-zinc-600`, `border-zinc-200` — tidak pakai `var(--background)` / `var(--foreground)` yang bisa terpengaruh dark. `app/components/navbar.tsx:42`.
- `app/layout.tsx:28` body pakai `bg-white text-zinc-900` eksplisit.

## Consequences

- **Positif:** Visual konsisten light, tidak perlu maintain `dark:` variants, lebih simple untuk fase awal portfolio.
- **Negatif:** Jika user OS dark, website tetap light — mungkin terasa terlalu terang. Future reversal butuh re-introduce dark query + audit warna.
- **Reversal cost:** Medium — perlu tambah kembali media query dan ganti warna eksplisit ke `dark:` di navbar.

## References

- `app/globals.css:1` — Tailwind import
- `CONTEXT.md` — Non-Goals: dark mode tidak didukung
