# ADR 0003 — Bubble Chat Navigation (177×197 → 154×172)

- **Status:** Accepted (Amended 2026-09-17)
- **Date:** 2026-09-17
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `app/page.tsx:4`, `CONTEXT.md:1`, `docs/adr/0001-navbar-responsive-strategy.md`

## Context

`app/components/navbar.tsx:126` sebelumnya memakai `Dropdown Menu` full-width (`absolute left-0 top-16 w-full border-t shadow-md` dengan `translate-y` ) untuk `<1024px`. User meminta navigasi hamburger berbentuk **bubble chat** fixed `177×197px`, button di tengah, pojok kanan-atas lancip (tail) yang berdekatan dengan hamburger, tiap item punya warna teks berbeda (`About #F59E0B`, `Projects #38BDF8`, `Contact #34D399`), teks Inggris, bubble tetap `bg-white`, hover underline animasi `center→sides` warna sinkron.

Alternatif yang dipertimbangkan:

1. **Bubble fixed 177×197 `right-4 top-16` + `rounded-tr-none` + tail square rotated + `scale` anim, warna teks `text-[#hex]` + underline `bg-current`** (chosen)
   - Bubble kecil terpusat, tail menempel hamburger, 3 item `flex flex-col items-center justify-center gap-5` di tengah bubble.
2. **Pill solid background** — tiap item `bg-[#hex]` + `text-white rounded-full`
   - Lebih pop tapi butuh kontras audit lebih ketat dan bubble jadi penuh warna, tidak sesuai brief "bubble tetap white".
3. **Tetap full-width dropdown tapi tambah warna** — minimal ubah, tapi tidak penuhi dimensi 177×197 & tail lancip.

## Decision

Pilih **Opsi 1** — detail keputusan grill Q1-Q7:

- **Geometri:** `absolute right-4 top-16 w-[177px] h-[197px]` fixed untuk `<1024px`, `rounded-[20px] rounded-tr-none` + tail `absolute -top-[8px] right-0 h-3 w-3 rotate-45 border-l border-t border-zinc-100 bg-white` (`app/components/navbar.tsx:95`). `origin-top-right scale-95 opacity-0 → scale-100 opacity-100 duration-200 ease-out` menggantikan `translate-y`.
- **Warna:** Bubble `bg-white` solid, teks per-item `About text-[#F59E0B]`, `Projects text-[#38BDF8]`, `Contact text-[#34D399]` (`app/components/navbar.tsx:10`), konsisten di desktop (`app/components/navbar.tsx:55`) & bubble (`app/components/navbar.tsx:117`). Hover `brightness-95` ringan.
- **Underline:** `group relative` + `span absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current transition-all duration-200 group-hover:w-full group-focus-visible:w-full` — muncul dari tengah ke kiri+kanan bersamaan, warna `bg-current` sinkron dengan teks.
- **i18n:** `NAV_ITEMS` + `app/page.tsx:9,24,39` headings jadi English `About/Projects/Contact`. `aria-label` & `sr-only` juga English (`back to top`, `Open/Close menu`).
- **Layout:** Isi bubble `flex h-full items-center justify-center` + `ul flex-col items-center gap-5`, link `inline-block px-2 py-1.5 text-center text-[15px] font-medium`.
- **Behavior:** Hapus `body scroll lock` (`app/components/navbar.tsx:51` lama) karena bubble kecil tidak butuh overlay. Tetap `clickOutside` + `ESC` + `resize ≥1024 close` (`app/components/navbar.tsx:22,40`).

### Amendment 2026-09-17 — Refinement (Hamburger, Tail, Size)

- **Hamburger:** Hapus `hover:bg-zinc-100 hover:text-zinc-900 transition-colors` di `app/components/navbar.tsx:104`, ganti jadi `cursor-pointer` saja + `focus-visible:ring` tetap. Alasan: feedback hover warna tidak diperlukan, cukup cursor.
- **Tail:** Geser `right-0` → `right-4` (16px) `absolute -top-[8px] right-4` (`app/components/navbar.tsx:128`) agar tidak di ujung kanan bubble, lebih di bawah hamburger.
- **Bubble size:** Kecilkan `177×197 rounded-[20px] gap-5 text-[15px]` → `154×172 rounded-[16px] gap-4 text-[14px]` (`app/components/navbar.tsx:118`) agar terlihat tidak terlalu besar, tetap proporsional dan readable. `gap-5→gap-4`, `15px→14px`.
- **Overlay:** Tambah `fixed inset-0 top-16 bg-black/20` untuk konten + `absolute inset-0 bg-black/20` di header saat open (`app/components/navbar.tsx:66,155`) agar header & background sama-sama gelap, bubble tetap putih terang.

## Consequences

- **Positif:** Identitas warna per-item jelas, bubble kompak 154×172 pas di kanan hamburger (lebih kecil, tidak terlalu besar), tail 16px inset tidak di sudut, animasi `scale` lebih halus untuk elemen kecil, underline center→sides ringan & a11y via `focus-visible`, header + background dim `bg-black/20` saat open.
- **Negatif:** `#F59E0B` on white kontras ~2.1:1 (di bawah WCAG AA untuk teks 14px) — mitigasi `font-medium` + `hover:brightness-95`, tetap brand color murni sesuai brief. Tail butuh pixel-perfect, hamburger tanpa hover feedback visual selain cursor.
- **Trade-off:** Desktop sekarang juga colorful (bukan `zinc-600` netral) — konsisten tapi header lebih ramai. Jika ingin desktop netral, buat ADR revisi.
- **Reversal cost:** Low — ganti `NAV_ITEMS` color map & bubble `className` kembali ke `w-full left-0` + `translate-y`, atau kembalikan ukuran `177×197`.

## References

- `app/components/navbar.tsx:1` — implementasi bubble, warna, underline, tail
- `app/page.tsx:4` — headings English
- `CONTEXT.md:1` — Glossary `Bubble Menu`, `Bubble Tail`, `Navigation Item`
- `docs/adr/0001-navbar-responsive-strategy.md` — strategi `lg:1024` sebelumnya
- Tailwind CSS v4 — `lg` = 1024px, arbitrary values `w-[177px]`/`bg-[#hex]`
