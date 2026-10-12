# ADR 0005 — Scroll Lock saat Hamburger Open & Bubble Underline 1:1

- **Status:** Accepted
- **Date:** 2026-09-18
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/components/navbar.tsx:1`, `CONTEXT.md:13`, `docs/adr/0003-bubble-chat-navigation.md`, `docs/adr/0004-navbar-non-sticky-borderless-poppins.md`
- **Spec:** `.scratch/navbar-nonsticky-poppins/spec.md` (Amend 2026-09-18)

## Context

Setelah ADR 0004 mengubah Navbar menjadi `relative z-20 h-16 w-full bg-white` non-sticky dengan Bubble `absolute` dan overlay `absolute z-10`, dua kebutuhan lanjutan muncul:

1. Saat `Hamburger Button` (`app/components/navbar.tsx:104`) ditekan dan `Bubble Menu` (`app/components/navbar.tsx:118`) open di `<1024px`, halaman di belakang overlay masih bisa di-scroll. Karena header sekarang non-sticky ikut scroll, user yang scroll saat bubble open akan melihat bubble ikut hilang bersama header — tidak terasa modal. ADR 0003 sempat hapus `body scroll lock` karena bubble kecil `154×172` dianggap tidak butuh; brief baru meminta lock kembali.
2. Perlu memastikan hover underline di dalam Bubble identik dengan desktop. Fakta saat ini: desktop `app/components/navbar.tsx:94` dan bubble `app/components/navbar.tsx:152` sudah memakai struktur identik `group relative` + `span absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current transition-all duration-200 group-hover:w-full group-focus-visible:w-full` — hanya beda padding/size, underline sama.

Alternatif yang dipertimbangkan:

1. **Scroll lock `body overflow hidden` via `useEffect` watch `open` + restore (chosen — Q1 Opsi A)**
   - Saat `open=true` dan `window.innerWidth < 1024`, simpan `prev = document.body.style.overflow`, set `hidden`; saat `open=false`/resize ≥1024/ESC/outside/backdrop/unmount restore ke `prev`. Simple, zero-dependency, konsisten dengan `useEffect` existing di `app/components/navbar.tsx:25`.
2. **`position: fixed` + `top: -scrollY`**
   - Lock lebih kuat di iOS, tapi butuh simpan/restore `scrollY`, set `body position fixed width 100%`, risiko layout shift dan perlu sync dengan `app/layout.tsx:28`.
3. **Library `body-scroll-lock`**
   - Overkill untuk satu bubble kecil.
4. **Bubble underline 1:1 identik (chosen — Q2 Opsi A)**
   - Pertahankan `h-[2px] bg-current center→sides duration-200` identik di desktop dan bubble; no-op karena sudah sama. Verifikasi saja.
5. **Tweak mobile underline (ditolak)**
   - `h-[1.5px]` atau `duration-150` lebih tipis/cepat di bubble karena `text-[14px]` vs `text-sm` desktop — terlihat proporsional tapi menambah divergensi maintenance tanpa nilai jelas.

## Decision

Pilih **Opsi 1 + Opsi 4**:

- **Scroll Lock (Q1):** Tambah `useEffect` di `app/components/navbar.tsx:63` yang watch `open`:
  ```ts
  useEffect(() => {
    if (!open) return;
    if (window.innerWidth >= 1024) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  ```
  Guard `<1024px` sesuai `Breakpoint lg` di `CONTEXT.md:15`. Unlock juga terpicu via existing close paths: klik `Navigation Item` (`app/components/navbar.tsx:152` `onClick setOpen false`), klik outside (`app/components/navbar.tsx:28`), ESC (`app/components/navbar.tsx:38`), klik backdrop (`app/components/navbar.tsx:156`), dan `resize ≥1024` (`app/components/navbar.tsx:52`) — semua set `open=false` sehingga cleanup restore jalan. Unmount juga restore via cleanup return.

- **Bubble underline (Q2):** Tidak ada perubahan kode. Pertahankan `app/components/navbar.tsx:152` `group relative` + `span` underline identik dengan `app/components/navbar.tsx:94`. Dokumentasikan di `CONTEXT.md:11` sebagai konsisten 1:1.

## Consequences

- **Positif:** Saat bubble open di mobile, halaman terkunci tidak bisa scroll — fokus tetap di menu, overlay `absolute` tidak perlu scroll sinkron rumit; karena header non-sticky, lock mencegah bubble hilang saat user tidak sengaja scroll. Underline konsisten `center→sides` di semua breakpoint, `focus-visible` jaga a11y keyboard dan `hover` tetap trigger saat tap di touch.
- **Negatif:** `overflow hidden` di iOS Safari masih bisa bounce overscroll minor (acceptable untuk portfolio light). Jika butuh lock sekuat modal native, perlu ADR revisi ke `position: fixed`.
- **Trade-off:** Lock hanya `<1024px` — di desktop `≥1024px` tidak ada lock karena menu selalu visible dan tidak ada bubble; resize dari mobile open ke desktop otomatis close + restore, tidak ada state terkunci tertinggal.
- **Reversal cost:** Low — hapus `useEffect` scroll lock di `app/components/navbar.tsx:63` dan revert `CONTEXT.md:13` (hapus kalimat Scroll Lock) serta `CONTEXT.md:16` (hapus glossary Scroll Lock). Underline tidak perlu revert karena no-op.

## References

- `app/components/navbar.tsx:1` — Client Component, useEffect scroll lock, bubble underline
- `CONTEXT.md:11` — Glossary Navigation Item (konsisten desktop & bubble 1:1)
- `CONTEXT.md:13` — Glossary Bubble Menu + Scroll Lock
- `CONTEXT.md:16` — Glossary Scroll Lock baru
- `docs/adr/0003-bubble-chat-navigation.md` — sempat hapus scroll lock
- `docs/adr/0004-navbar-non-sticky-borderless-poppins.md` — header non-sticky
- `.scratch/navbar-nonsticky-poppins/spec.md` — spec amend user stories 25-30
