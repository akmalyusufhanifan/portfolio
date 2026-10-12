# ADR 0006 — Fix Bubble Nav Parity: Underline + Hash Scroll Terblokir Scroll Lock

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `CONTEXT.md:11,13`, `docs/adr/0005-scroll-lock-bubble-underline.md`, `.scratch/navbar-nonsticky-poppins/spec.md`
- **Grill:** Q1A (paritas underline), Q2A (retain scroll lock + manual scroll), Q3A (containerRef ke header), Q4A (ADR baru)

## Context

Setelah ADR 0005, laporan bug: di mode desktop (`>=1024px`) animasi underline `center→sides` dan navigasi hash `About→#about` dls bekerja, tapi di mode mobile/bubble (`<1024px`):
1. Saat cursor diarahkan ke Navigation Item di bubble, underline tidak muncul.
2. Saat Navigation Item ditekan, halaman tidak scroll ke section tujuan.

Investigasi `app/components/navbar.tsx:1` menemukan 3 root cause yang saling memperkuat:

- **Underline:** Bubble `app/components/navbar.tsx:154` memakai `group peer` dan span `app/components/navbar.tsx:157` memakai `group-hover:w-full peer-hover:w-full`. `peer-hover` invalid karena span adalah child bukan sibling (`peer` butuh `~ sibling`). `group-hover` seharusnya tetap jalan, tapi redundansi + `peer` menambah kebingungan dan dilaporkan tidak jalan di test cursor `<1024px`.
- **Scroll terblokir Scroll Lock:** `useEffect` `app/components/navbar.tsx:63` `document.body.style.overflow="hidden"` saat `open=true` di `<1024px`. Browser mencoba hash-scroll sinkron saat klik `<a href="#about">`, tapi body masih `hidden` — cleanup restore baru jalan setelah `setOpen(false)` re-render berikutnya (async), sehingga hash navigation gagal. Ditambah `onClick={() => setOpen(false)}` `app/components/navbar.tsx:153` tidak preventDefault/manual scroll, jadi tidak ada fallback.
- **containerRef sempit:** `containerRef` `app/components/navbar.tsx:24,85` hanya di `div flex h-16` (Site Name + Hamburger), tidak mencakup Bubble `app/components/navbar.tsx:130` yang adalah sibling. `handleClickOutside` `app/components/navbar.tsx:28` menganggap klik di bubble sebagai outside → `mousedown` langsung `setOpen(false)` sebelum `click` pada `<a>` fire, bubble langsung `pointer-events-none` `app/components/navbar.tsx:134` sebelum navigasi, memperkuat race dengan Scroll Lock.

Alternatif yang dipertimbangkan (grill rounds):

- **Q1 Underline:** A) paritas murni hapus `peer` pertahankan `group-hover` identik desktop (chosen), B) touch-first tambah `active:` , C) underline selalu visible. Dipilih A karena `CONTEXT.md:11` sudah janji 1:1 dan `hover` tetap relevan saat test pakai mouse di lebar mobile; `focus-visible` sudah cover keyboard/tap.
- **Q2 Scroll:** A) retain lock + manual `scrollIntoView` via `handleNavClick` (chosen), B) hapus lock sepenuhnya, C) ganti ke `position:fixed`. Dipilih A untuk menjaga modal feel ADR 0005 (lock mencegah bubble hilang saat header `relative` ikut scroll) tanpa mengorbankan navigasi; cost hanya +~10 baris `requestAnimationFrame` workaround.
- **Q3 containerRef:** A) pindah `ref` ke `<header>` mencakup bubble (chosen), B) ubah `mousedown`→`click`, C) biarkan sempit. Dipilih A — paling semantik (header+bubble satu menu) dan zero-logic baru; B telat, C tidak close saat klik padding bubble.
- **Q4 Docs:** A) ADR baru 0006 + patch CONTEXT (chosen), B) amend 0005, C) hanya CONTEXT. Dipilih A agar jejak bug vs intent 0005 tetap, future reader paham trade-off.

## Decision

1. **Underline fix (Q1A):** Di bubble `app/components/navbar.tsx:168,170` hapus `peer` dan `peer-hover:w-full`:
   ```tsx
   // sebelum
   className={`group peer relative ...`}
   <span className="... group-hover:w-full peer-hover:w-full group-focus-visible:w-full" />
   // sesudah
   className={`group relative ...`}
   <span className="... group-hover:w-full group-focus-visible:w-full" />
   ```
   Struktur kini identik dengan desktop `app/components/navbar.tsx:105,108` (`group relative` + `span absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current duration-200 group-hover:w-full group-focus-visible:w-full`).

2. **containerRef fix (Q3A):** Ubah `containerRef` type `HTMLDivElement` → `HTMLElement` `app/components/navbar.tsx:23` dan pindah `ref={containerRef}` dari `div` `app/components/navbar.tsx:85` ke `<header>` `app/components/navbar.tsx:77`. `handleClickOutside` `app/components/navbar.tsx:30` kini benar: klik di bubble tidak lagi dianggap outside.

3. **Navigasi manual fix (Q2A):** Tambah handler `app/components/navbar.tsx:24`:
   ```ts
   function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
     e.preventDefault();
     setOpen(false);
     const id = href.slice(1);
     requestAnimationFrame(() => {
       document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
       history.pushState(null, "", href);
     });
   }
   ```
   Ganti bubble link `app/components/navbar.tsx:154` `onClick={() => setOpen(false)}` → `onClick={(e) => handleNavClick(e, item.href)}`. `rAF` memastikan `useEffect` scroll lock cleanup (`body overflow` restore) sudah run sebelum `scrollIntoView`. Desktop nav `app/components/navbar.tsx:105` tetap hash native (tanpa lock di `>=1024`).

## Consequences

- **Positif:** Parity visual 1:1 `center→sides` di semua breakpoint; klik bubble di `<1024` close + unlock + smooth scroll + hash update jalan meski `overflow:hidden` aktif; outside click tidak false-positive; `CONTEXT.md:11,13` terdokumentasi.
- **Negatif:** Navigasi bubble kini via JS bukan native hash — jika JS disabled gagal (acceptable untuk portfolio SPA). `rAF` delay 1 frame (~16ms) sebelum scroll.
- **Trade-off:** Desktop tetap native, bubble manual — sedikit divergensi code path demi preservasi Scroll Lock. Jika ingin unifikasi, bisa samakan desktop juga pakai handler (ADR revisi).
- **Reversal cost:** Low — revert 3 lokasi `app/components/navbar.tsx:23,24,77,168` + hapus handler + revert CONTEXT `:11,13` + hapus file ini.

## References

- `app/components/navbar.tsx:1` — Client Component, handleNavClick, containerRef header, bubble underline
- `CONTEXT.md:11` — Navigation Item (parity + handleNavClick)
- `CONTEXT.md:13` — Bubble Menu (containerRef header + handleNavClick)
- `CONTEXT.md:15` — Breakpoint lg
- `docs/adr/0005-scroll-lock-bubble-underline.md` — intent awal scroll lock & underline 1:1
- `app/page.tsx:4` — target sections `#about/#projects/#contact`
- `app/layout.tsx:23` / `app/globals.css:15` — `scroll-smooth` existing
