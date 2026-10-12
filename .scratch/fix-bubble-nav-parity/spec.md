# Spec — Fix Bubble Navigation Parity (Underline + Hash Scroll Blocked by Scroll Lock)

Status: ready-for-agent

## Problem Statement

Pengunjung yang membuka portfolio di desktop (`>=1024px`) melihat navigasi bekerja sempurna: saat cursor diarahkan ke Navigation Item (`About`, `Projects`, `Contact`) muncul animasi underline `center→sides` (`h-[2px] bg-current`), dan saat item ditekan halaman smooth scroll ke section target (`#about`, `#projects`, `#contact`). 

Pengunjung yang membuka di tablet/mobile (`<1024px`) via Hamburger Button dan Bubble Menu mengalami disparitas:

- Saat cursor diarahkan ke Navigation Item di dalam Bubble Menu, animasi underline tidak muncul.
- Saat Navigation Item di dalam Bubble Menu ditekan, halaman tidak bergerak ke section tujuan (tetap di posisi semula).

Dampaknya: paritas interaksi yang dijanjikan di glossary (`Navigation Item` konsisten desktop & bubble 1:1) dan keputusan ADR 0005 (Scroll Lock + underline identik) tidak tercapai. User mengira navigasi rusak di mobile, padahal build tanpa error dan lint lolos. Akar masalah adalah kombinasi (a) kelas `peer`/`peer-hover` yang invalid di bubble, (b) `body overflow hidden` (Scroll Lock) yang memblokir hash scroll native karena restore async, dan (c) `containerRef` yang hanya mencakup bar header sehingga `mousedown` outside memicu close prematur sebelum `click` pada link, lalu bubble langsung `pointer-events-none` sebelum navigasi.

## Solution

Pulihkan paritas bubble = desktop tanpa mengorbankan Scroll Lock yang sudah disepakati di ADR 0005:

- Sederhanakan underline di Bubble Menu menjadi identik persis dengan desktop: hanya `group` di link dan `group-hover:w-full` + `group-focus-visible:w-full` di span, hapus `peer`/`peer-hover` yang tidak relevan. Animasi tetap `center→sides h-[2px] bg-current duration-200 ease-out`.
- Luaskan cakupan deteksi click-outside agar mencakup seluruh header termasuk Bubble Menu, sehingga klik di dalam bubble tidak lagi dianggap outside.
- Ganti navigasi hash native di bubble dengan handler manual yang close menu, tunggu unlock scroll (via `requestAnimationFrame` setelah `body overflow` restore), lalu `scrollIntoView({behavior: 'smooth'})` dan update URL hash via `history.pushState`. Desktop tetap pakai hash native karena tidak ada Scroll Lock di `>=1024px`.

Perubahan hanya di visual/interaksi bubble dan logika tutup-menu; tidak mengubah geometri bubble `154×172`, warna per-item, tipografi Poppins, atau strategi `Breakpoint lg` `1024px`.

## User Stories

1. As a visitor di desktop `>=1024px`, I want hover di Navigation Item menampilkan underline `h-[2px]` yang tumbuh dari tengah ke kedua sisi, so that saya mendapat feedback visual yang konsisten.
2. As a visitor di desktop, I want klik Navigation Item melakukan anchor scroll smooth ke section target, so that navigasi single-page berfungsi.
3. As a mobile visitor `<1024px`, I want menekan Hamburger Button membuka Bubble Menu `154×172` di kanan atas dekat tombol, so that navigasi tetap accessible.
4. As a mobile visitor dengan mouse/trackpad (mis. DevTools resize `<1024px`), I want hover di Navigation Item di dalam Bubble Menu menampilkan underline `center→sides` identik desktop, so that paritas visual terjaga saat test pakai cursor.
5. As a mobile visitor dengan jari, I want tap pada Navigation Item di Bubble Menu menutup bubble dan membawa saya ke section target dengan smooth scroll, so that navigasi terasa responsif.
6. As a mobile visitor, I want saat Bubble Menu terbuka halaman di belakang terkunci tidak bisa di-scroll, so that fokus tetap di menu dan bubble tidak ikut hilang karena header non-sticky ikut scroll.
7. As a mobile visitor, I want setelah saya memilih Navigation Item di bubble, scroll lock terbuka kembali dan halaman kembali bisa di-scroll normal tanpa jump, so that tidak ada state terkunci tertinggal.
8. As a mobile visitor, I want klik di luar bubble (backdrop/area halaman) menutup Bubble Menu dan unlock scroll, so that saya bisa dismiss tanpa memilih navigasi.
9. As a keyboard user di bubble, I want focus-visible pada Navigation Item menampilkan underline yang sama dengan hover, so that aksesibilitas terjaga meski di bubble.
10. As a keyboard user, I want tekan `ESC` saat bubble terbuka menutup menu dan unlock scroll, so that saya bisa keluar tanpa mouse.
11. As a visitor yang resize dari `<1024px` ke `>=1024px` saat bubble terbuka, I want bubble otomatis close dan scroll lock restore, so that tidak ada overlay tertinggal di desktop.
12. As a visitor yang klik Navigation Item di bubble, I want URL hash berubah ke `#about`/`#projects`/`#contact`, so that saya bisa share/bookmark posisi.
13. As a visitor, I want klik Site Name (`Akmal.dev`) menutup bubble jika terbuka, so that interaksi konsisten.
14. As a developer, I want tidak ada regresi pada animasi bubble `origin-top-right scale-95 opacity-0 → scale-100 opacity-100 duration-200`, so that open/close tetap halus.
15. As a developer, I want build dan lint tetap lolos setelah fix, so that pipeline tidak break.
16. As a developer, I want keputusan fix ini terdokumentasi di glossary dan ADR baru, so that reversal jelas dan jejak bug vs intent ADR 0005 tidak hilang.

## Implementation Decisions

- **Underline parity — hapus `peer`** Pilih paritas murni: pertahankan `group relative` pada link dan `span absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current duration-200 group-hover:w-full group-focus-visible:w-full` identik di desktop dan bubble. Tolak varian touch-first `active:` dan varian selalu-visible karena glossary sudah janji 1:1 dan `hover` tetap relevan saat test pakai mouse di lebar mobile; `focus-visible` sudah cover keyboard/tap.
- **Scroll tetap terkunci saat bubble open** Tetap gunakan `body overflow hidden` via `useEffect` watch `open` hanya di `<1024px` seperti ADR 0005. Tolak hapus lock (kehilangan modal feel, bubble ikut hilang saat header non-sticky di-scroll) dan tolak `position: fixed + scrollY` (lebih kuat di iOS tapi butuh simpan/restore scrollY dan risiko layout shift).
- **Navigasi bubble via handler manual** Karena `overflow hidden` memblokir hash scroll native yang sinkron, pilih handler yang `preventDefault`, `setOpen(false)`, lalu `requestAnimationFrame` → `scrollIntoView({behavior: 'smooth', block: 'start'})` + `history.pushState`. `rAF` memastikan cleanup restore `body overflow` sudah run sebelum scroll. Desktop tetap hash native (tanpa lock) untuk minimal divergensi. Alternatif `setTimeout` atau `scrollIntoView` tanpa `rAF` ditolak karena timing tidak deterministic dengan React commit.
- **Click-outside mencakup bubble** Luaskan `containerRef` dari div inner `flex h-16` ke elemen header yang membungkus bubble, sehingga bubble termasuk inside. Alternatif ubah `mousedown` → `click` ditolak (close telat) dan biarkan sempit ditolak (false-positive).
- **Scope modul** Hanya Client Component Navbar yang diubah; Root Layout, Global Styles, halaman sections, dan `Breakpoint lg` tidak disentuh. Tidak ada dependensi baru.
- **Aksesibilitas** Tidak mengubah atribut `aria-expanded`, `aria-controls`, `aria-hidden` pada Hamburger Button dan Bubble Menu; `group-focus-visible` tetap ada di desktop dan bubble.
- **Geometri tetap** Bubble tetap `w-[154px] h-[172px] rounded-[16px] right-4 top-16` dengan tail `12×12 right-4 -top-[8px] rotate-45`, warna per-item (`About` amber, `Projects` sky, `Contact` emerald) tetap, background bubble tetap `bg-white`.

## Testing Decisions

- **Prinsip:** Uji perilaku eksternal pengguna, bukan string className mentah. Verifikasi visual dan navigasi yang terlihat.
- **Seam tertinggi — E2E browser (diutamakan):** Satu suite Playwright yang render halaman penuh dapat menguji semua cerita: (a) di `>=1024` hover menampilkan underline (computed width dari `0` → `100%`), (b) di `<1024` hover bubble menampilkan underline identik, (c) klik bubble → `document.body.style.overflow` dari `hidden` kembali `""`, hash di URL, dan `scrollY` mendekati offset target section, (d) klik outside/ESC/resize menutup dan unlock, (e) animasi bubble `scale/opacity` tidak regresi. Seam ini mencakup integrasi antara header non-sticky, overlay absolute, scroll lock, dan scrollIntoView.
- **Seam komponen — Navbar unit (pelengkap jika E2E tidak ada):** Testing Library untuk Navbar: render, toggle Hamburger Button membuka bubble (`aria-hidden=false`), klik Navigation Item memanggil `scrollIntoView` mock dan `history.pushState`, assert `document.body.style.overflow === "hidden"` saat open di viewport `<1024` dan restore saat close, outside click tidak menutup saat target di dalam header/bubble, ESC dan resize `>=1024` menutup. Perlu mock `window.innerWidth`, `requestAnimationFrame`, dan `document.body`.
- **Seam underline — snapshot ringan:** Assert kehadiran `span` underline di desktop dan bubble dengan attribute yang sama (`h-[2px] bg-current`, `group-hover:w-full`), tanpa pixel-perfect.
- **Prior art:** Repo belum punya harness test (hanya `dev`/`build`/`lint`). Diusulkan mulai dengan satu file E2E Playwright atau satu file Testing Library untuk Navbar sebagai fondasi, konsisten dengan usulan testing di spec `navbar-nonsticky-poppins`.
- **Verifikasi manual wajib:** Karena visual dan scroll: (a) scroll di desktop header ikut hilang (non-sticky) dan hash tetap jalan, (b) buka bubble `<1024` → coba scroll halaman harus lock, (c) hover bubble pakai mouse → underline `center→sides`, (d) tap tiap item bubble → close + smooth scroll ke About/Projects/Contact + hash update, (e) dismiss via outside/backdrop/ESC/resize.
- **Quality gates:** `lint` dan `build` wajib lolos; `tsc --noEmit` tanpa error. Tidak ada perubahan skema atau API.

## Out of Scope

- Dark mode — tetap light-only sesuai glossary, tidak ada varian dark baru.
- Multi-page routing — tetap anchor scroll single-page `/#about` dls, tidak menambah route `/about`.
- Perubahan `Breakpoint lg` `1024px` — tetap.
- Perubahan geometri Bubble Menu (`154×172`), tail (`right-4`), warna per-item, atau tipografi Poppins — tetap.
- Mengganti mekanisme Scroll Lock ke `position: fixed` atau library `body-scroll-lock` — tidak; tetap `overflow hidden`.
- Focus trap di dalam Bubble Menu — tidak.
- Mengubah navigasi desktop ke handler manual — tetap hash native di `>=1024`.
- Penambahan test harness berat sebelum kebutuhan lebih luas — cukup satu suite E2E/unit minimal.

## Further Notes

- Fix ini secara eksplisit merevisi asumsi ADR 0005 yang menganggap hash native tetap jalan di bawah Scroll Lock. Kontradiksi dicatat di ADR 0006 sebagai bug fix, bukan perubahan intent lock. Reversal cost low: revert handler + `containerRef` + `peer` dan hapus ADR 0006.
- Pilihan `requestAnimationFrame` untuk delay 1 frame (~16ms) adalah trade-off minimal demi determinisme restore overflow; jika di masa depan dibutuhkan navigasi instan tanpa smooth, ADR revisi bisa ganti ke `scrollIntoView` tanpa `behavior: smooth`.
- Istilah domain mengikuti glossary: Navbar, Site Name, Navigation Item, Hamburger Button, Bubble Menu, Bubble Tail, Breakpoint lg, Client Component, Scroll Lock, Typography.
