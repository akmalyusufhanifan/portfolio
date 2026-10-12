# ADR 0004 — Navbar Non-Sticky, Borderless Unified, Typography Poppins

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `app/layout.tsx:2`, `app/globals.css:8`, `CONTEXT.md:9`, `docs/adr/0001-navbar-responsive-strategy.md`, `docs/adr/0003-bubble-chat-navigation.md`
- **Spec:** `.scratch/navbar-nonsticky-poppins/spec.md`

## Context

`app/components/navbar.tsx:65` sebelumnya memakai `sticky top-0 z-50 h-16 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md` — header selalu menempel di viewport dengan garis border bawah dan efek kaca blur yang memisahkan header dari konten `app/page.tsx:4` (`bg-white`/`bg-zinc-50`). Tipografi memakai `Geist` + `Geist_Mono` via `next/font/google` (`app/layout.tsx:2`, `app/globals.css:8`) dengan fallback `Arial`. User meminta revisi: (1) navbar tidak sticky sehingga ikut scroll hilang, (2) hilangkan bottom border/shadow sehingga header menyatu dengan halaman, (3) ubah semua tulisan ke Poppins.

Kontradiksi dengan keputusan sebelumnya:
- ADR 0001 mengasumsikan header sticky sebagai strategi responsive.
- ADR 0003 Amendment menambahkan overlay `fixed inset-0 top-16` + header dim `absolute inset-0` yang mengasumsikan header sticky (fixed overlay selaras dengan viewport).

Alternatif yang dipertimbangkan:

1. **Header scroll-away penuh + borderless solid + Poppins 400/500/600/700 (chosen)**
   - Header `relative h-16 w-full bg-white` (tanpa sticky/top/z-50/border/blur), bubble tetap `absolute right-4 top-16` ikut scroll, overlay `fixed` → `absolute` agar scroll bersama header.
2. **Header static tapi bubble fixed**
   - Header `static` agar scroll, bubble diubah jadi `fixed` agar tetap terlihat saat header hilang. Lebih kompleks, inkonsisten — bubble terlihat mengambang tanpa header.
3. **Header transparan `bg-transparent`**
   - Benar-benar menyatu tapi teks header overlap dengan konten saat scroll, butuh `mix-blend` dan audit kontras lebih rumit.
4. **Bubble juga borderless tanpa shadow (flat)**
   - Header + bubble tanpa border/shadow. Bubble `bg-white` tanpa border/shadow akan invisible di atas page putih, terutama teks `#F59E0B` kontras rendah.
5. **Poppins semua weight 100-900 atau hanya 400+700**
   - Semua weight: payload besar (~9 file woff2). Hanya 400+700: hemat tapi `font-medium 500` di Navigation Item jadi faux-bold tidak crisp.

## Decision

Pilih **Opsi 1** — detail keputusan grill Q1-Q3:

- **Positioning (Q1 — Recommended A):** Ubah `app/components/navbar.tsx:65` dari `sticky top-0 z-50 h-16 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md` menjadi `relative z-20 h-16 w-full bg-white`. Hapus `sticky`, `top-0`, `border-b border-zinc-200`, `bg-white/80`, `backdrop-blur-md`; ganti dengan `relative` + `bg-white` solid + `z-20` untuk stacking bubble di atas backdrop. Bubble `app/components/navbar.tsx:118` tetap `absolute right-4 top-16` inside header sehingga ikut scroll hilang bersama header. Overlay backdrop `app/components/navbar.tsx:155` diubah dari `fixed inset-0 top-16 z-40` menjadi `absolute inset-0 top-16 z-10 bg-black/20` — absolute agar ikut scroll dengan header, z lebih rendah dari header (`z-20` vs `z-10`) sehingga header/bubble tetap di atas dim. Header dim `app/components/navbar.tsx:67` tetap `absolute inset-0 bg-black/20` di dalam header.
- **Visual unification (Q2 — Recommended A):** Hanya header yang dibersihkan. Header tanpa border/shadow/blur; background solid `bg-white` identik dengan `app/layout.tsx:28` `bg-white` dan section `app/page.tsx:4`. Bubble `border border-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)]` dan tail `border-l border-t` sengaja dipertahankan agar tetap terbaca sebagai elemen mengambang.
- **Typography (Q3 — Recommended A):** Ganti `app/layout.tsx:2` dari `Geist`/`Geist_Mono` (`--font-geist-sans`/`--font-geist-mono`) ke `Poppins` via `next/font/google` dengan `weight ["400","500","600","700"]`, `subsets ["latin"]`, `variable "--font-poppins"`, `display "swap"`. Hapus variabel Geist dari `app/layout.tsx:26` (`${poppins.variable} h-full scroll-smooth antialiased`). Update `app/globals.css:8` mapping `@theme inline` dari `--font-geist-*` ke `--font-poppins` untuk `--font-sans` dan `--font-mono`, serta `body { font-family: var(--font-poppins), sans-serif }` menggantikan `Arial, Helvetica`.

## Consequences

- **Positif:** Header benar-benar menyatu dengan halaman tanpa garis pemisah; scroll-away terasa ringan; semua teks konsisten Poppins dengan hierarki crisp (400 body, 500 nav, 600/700 heading/brand) tanpa payload berlebih; display swap mencegah FOIT; bubble tetap terlihat karena retain shadow; stacking `z-20` vs `z-10` menjaga bubble di atas backdrop meski absolute.
- **Negatif:** Navbar hanya terlihat di paling atas halaman — user harus scroll balik ke atas untuk navigasi, tidak ada quick access mid-page. Overlay absolute mencakup tinggi dokumen (bukan viewport tetap) sehingga area dim berbeda dari fixed sebelumnya; bubble ikut hilang saat scroll sehingga jika user buka bubble lalu scroll, menu hilang — mitigasi auto-close tetap jalan via clickOutside/ESC/resize.
- **Trade-off:** Menghapus blur semi-transparan menghilangkan efek kaca modern; tapi sesuai brief "menyatu" blur justru memisahkan. Poppins 4 weight menambah beberapa file woff2 vs Geist sebelumnya, namun masih efisien dibanding 9 weight.
- **Reversal cost:** Low-Medium — kembalikan `app/components/navbar.tsx:65` ke `sticky top-0 z-50 ... border-b ... bg-white/80 backdrop-blur-md`, ubah backdrop kembali ke `fixed z-40`, dan ganti `app/layout.tsx:2`/`app/globals.css:8` kembali ke Geist. Glossary `CONTEXT.md:9` juga perlu revert.
- **Docs sync:** `CONTEXT.md:9` Navbar diperbarui dari sticky ke non-sticky relative, `Bubble Menu` overlay diperbarui dari `fixed` ke `absolute`, tambah glossary `Typography` untuk Poppins.

## References

- `app/components/navbar.tsx:1` — implementasi header relative, bubble, overlay
- `app/layout.tsx:2` — import Poppins, variable `--font-poppins`
- `app/globals.css:8` — theme inline mapping `--font-sans: var(--font-poppins)`
- `CONTEXT.md:9` — Glossary Navbar (non-sticky), Typography
- `docs/adr/0001-navbar-responsive-strategy.md` — asumsi sticky sebelumnya
- `docs/adr/0003-bubble-chat-navigation.md` — asumsi overlay fixed sebelumnya
- `.scratch/navbar-nonsticky-poppins/spec.md` — spec lengkap
- Next.js docs: `next/font/google` — Poppins optimization
