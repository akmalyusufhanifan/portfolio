# Spec — Navbar Non-Sticky, Borderless Unified, Typography Poppins (+ Amend 2026-09-18 Scroll Lock & Bubble Underline)

Status: ready-for-agent

## Problem Statement

Pengunjung portfolio melihat Navbar yang saat ini selalu menempel di atas viewport (sticky) dengan garis border bawah dan efek blur semi-transparan yang memisahkan header dari konten halaman. Secara visual, header terasa seperti lapisan terpisah, bukan bagian menyatu dari halaman. Selain itu, tipografi situs masih memakai Geist / Geist Mono + fallback Arial, sementara pemilik situs menginginkan konsistensi penuh memakai Poppins di seluruh tulisan website. Setelah revisi non-sticky/borderless/Poppins, ditemukan dua kebutuhan lanjutan: (1) saat Hamburger/Bubble Menu terbuka di mobile, halaman di belakang masih bisa di-scroll sehingga bubble terasa tidak modal; (2) perlu memastikan hover underline di dalam Bubble (mobile) konsisten dengan desktop (center→sides).

Dampaknya:
- Scroll halaman meninggalkan Navbar tetap di viewport, bukan ikut bergerak — bertentangan dengan ekspektasi desain baru yang ingin header scroll-away bersama konten.
- Border dan blur menciptakan garis pemisah yang tidak diinginkan antara Navbar dan section pertama (About).
- Inkonsistensi font mengurangi identitas visual yang diinginkan.
- Tanpa scroll lock, user yang membuka Bubble Menu di `<1024px` masih bisa scroll konten di belakang overlay, mengganggu fokus dan menyebabkan bubble ikut hilang karena header non-sticky ikut scroll.
- Jika hover underline di bubble tidak sama dengan desktop, inkonsistensi interaksi mengurangi polish.

## Solution

Ubah Navbar menjadi non-sticky (ikut scroll hilang ke atas) dan bersihkan visual header sehingga menyatu dengan halaman: hapus border bawah, shadow, dan backdrop-blur, ganti background semi-transparan menjadi solid putih yang sama dengan background halaman. Bubble Menu untuk viewport di bawah Breakpoint lg tetap mempertahankan border dan shadow agar tetap terbaca sebagai elemen mengambang. Ganti seluruh tipografi situs dari Geist ke Poppins (weight 400/500/600/700, subset latin, display swap) dan hapus dependensi Geist, sehingga semua teks — Site Name, Navigation Item, heading, paragraf — dirender dengan Poppins.

Amend 2026-09-18:
- Saat Bubble Menu open di `<1024px`, kunci scroll halaman (body overflow hidden) sehingga user tidak bisa scroll konten di belakang; unlock otomatis saat bubble close via klik Navigation Item, klik outside/backdrop, ESC, atau resize ≥1024.
- Pastikan hover underline di Bubble identik 1:1 dengan desktop (`h-[2px] bg-current left-1/2 w-0 → w-full duration-200 center→sides` + `group-focus-visible`) — secara kode sudah sama, jadi hanya verifikasi/dokumentasi tanpa perubahan visual tambahan (no-op).

Perubahan bersifat visual dan layout, tanpa mengubah struktur navigasi, warna per-item, maupun perilaku Hamburger Button dan Bubble Menu selain scroll lock dan penyesuaian posisi overlay.

## User Stories

1. As a visitor di desktop, I want to melihat Navbar di paling atas halaman saat pertama load, so that saya tahu brand dan navigasi tersedia.
2. As a visitor, I want ketika saya scroll ke bawah Navbar ikut bergerak hilang ke atas (tidak sticky), so that konten halaman terasa menyatu tanpa header yang menghalangi.
3. As a visitor yang sudah scroll jauh ke bawah, I want untuk melihat Navbar lagi saya harus scroll balik ke paling atas, so that perilaku scroll-away konsisten (tidak reappear mid-scroll).
4. As a visitor, I want tidak ada garis border bawah atau shadow di bawah Navbar, so that transisi antara header dan section About terlihat seamless tanpa pemisah.
5. As a visitor, I want background Navbar solid putih sama persis dengan background halaman, so that header dan konten terlihat satu permukaan (tidak ada efek kaca/blur).
6. As a visitor di desktop, I want Navigation Items (About, Projects, Contact) tetap tampil horizontal dengan warna masing-masing dan underline animasi center→sides, so that navigasi tetap fungsional meski header tidak sticky.
7. As a visitor, I want mengklik Navigation Item melakukan anchor scroll smooth ke section target (#about, #projects, #contact), so that navigasi single-page tetap bekerja meski header ikut scroll.
8. As a visitor, I want mengklik Site Name kembali ke paling atas halaman (#top), so that saya bisa cepat kembali ke awal tanpa tombol tambahan.
9. As a mobile visitor di bawah Breakpoint lg, I want melihat Hamburger Button di kanan Navbar, so that saya bisa membuka navigasi di layar kecil.
10. As a mobile visitor, I want menekan Hamburger Button membuka Bubble Menu berukuran compact di kanan atas dekat tombol, so that navigasi tetap accessible.
11. As a mobile visitor, I want Bubble Menu tetap memiliki border tipis dan shadow sehingga terlihat mengambang di atas konten, so that menu tetap terbaca meski header sudah borderless.
12. As a mobile visitor, I want ekor Bubble Tail tetap mengarah ke Hamburger Button, so that hubungan visual antara tombol dan bubble jelas.
13. As a mobile visitor, I want ketika Bubble Menu terbuka lalu saya scroll halaman, bubble ikut scroll bersama header (tidak fixed di viewport), so that perilaku konsisten dengan header non-sticky.
14. As a mobile visitor, I want overlay yang meredupkan background menyesuaikan posisi (tidak lagi fixed top-16 yang salah saat scroll), so that dim tidak tertinggal di tengah viewport saat header sudah ter-scroll.
15. As a mobile visitor, I want Bubble Menu menutup saat saya klik di luar bubble, klik Navigation Item, tekan ESC, atau resize ke desktop (≥1024px), so that interaksi tetap konsisten dengan perilaku sebelumnya.
16. As a visitor pengguna keyboard, I want fokus pada Navigation Item menampilkan underline yang sama dengan hover (center→sides) via focus-visible, so that aksesibilitas terjaga.
17. As a visitor, I want Hamburger Button memiliki aria-expanded, aria-controls, dan label SR yang benar, so that screen reader memahami state menu.
18. As a visitor, I want seluruh tulisan di website — Site Name, Navigation Items, heading About/Projects/Contact, paragraf placeholder — dirender dengan Poppins, so that identitas tipografi konsisten.
19. As a visitor, I want weight Poppins yang berbeda tampil crisp: medium untuk Navigation Item, bold untuk Site Name dan heading, regular untuk body, so that hierarki tipografi jelas tanpa faux-bold.
20. As a visitor dengan koneksi lambat, I want font Poppins load dengan display swap, so that teks tetap tampil cepat dengan fallback lalu swap tanpa FOIT panjang.
21. As a visitor, I want tidak ada sisa font Geist yang ter-load, so that tidak ada duplikasi font dan payload berkurang.
22. As a developer, I want perubahan ini terdokumentasi di glossary dan ADR baru, so that keputusan non-sticky + borderless + Poppins dapat dilacak dan direversal jika perlu.
23. As a developer, I want tidak ada regresi pada animasi Bubble Menu (scale origin-top-right, opacity transition), so that pengalaman buka/tutup tetap halus.
24. As a developer, I want build dan lint tetap lolos setelah perubahan, so that tidak ada break pada pipeline.
25. As a mobile visitor yang membuka Bubble Menu, I want halaman di belakang tidak bisa di-scroll (scroll lock), so that fokus tetap di menu dan konten tidak bergeser di belakang overlay.
26. As a mobile visitor, I want scroll lock aktif hanya di `<1024px` saat Bubble open, dan otomatis unlock saat saya klik Navigation Item, klik outside/backdrop, tekan ESC, atau resize ke ≥1024px, so that tidak ada state terkunci yang tertinggal.
27. As a mobile visitor, I want scroll kembali normal tanpa jump setelah Bubble close, so that posisi scroll ter-restore dengan benar.
28. As a mobile visitor, I want hover underline di dalam Bubble terlihat sama persis dengan desktop — garis `h-[2px] bg-current` muncul dari tengah ke kiri+kanan (`center→sides`) saat hover/tap, so that interaksi konsisten di semua breakpoint.
29. As a keyboard user di mobile, I want focus-visible pada Navigation Item di Bubble juga menampilkan underline yang sama, so that aksesibilitas terjaga meski di bubble.
30. As a developer, I want scroll lock dan kesamaan underline ini terdokumentasi di glossary dan ADR baru, so that reversal dan testing jelas.

## Implementation Decisions

- **Header positioning — scroll-away penuh:** Header diubah dari sticky dengan top dan z-index tinggi menjadi posisi flow normal (relative) tanpa top/z-index, sehingga ikut ter-scroll keluar viewport. Bubble Menu tetap diposisikan absolute relatif terhadap header (right-4 top-16) agar ikut bergerak bersama header. Overlay yang sebelumnya fixed dengan inset top-16 diubah menjadi absolute di dalam konteks header atau dihapus, karena fixed tidak lagi selaras dengan header yang ikut scroll.

- **Visual unification — hanya header dibersihkan:** Hapus border bawah, backdrop-blur, dan background semi-transparan dari header; ganti dengan background solid putih yang identik dengan background halaman. Tidak menambahkan shadow baru pada header. Bubble Menu sengaja mempertahankan border tipis dan shadow lembutnya agar tetap terlihat sebagai elemen mengambang di atas konten — menghapusnya akan membuat bubble tidak terbaca di atas background putih, terutama untuk warna teks kontras rendah.

- **Warna dan animasi tetap:** Warna per Navigation Item, hover brightness, dan underline center→sides dengan currentColor tetap dipertahankan di desktop dan bubble. Tidak ada perubahan palette.

- **Typography — Poppins full replacement:** Ganti import font di Root Layout dari Geist/Geist Mono ke Poppins via next/font/google dengan konfigurasi weight 400, 500, 600, 700, subset latin, variable kustom, dan display swap. Hapus variabel Geist sepenuhnya dari layout dan dari mapping theme inline di Global Styles. Petakan font sans global ke variabel Poppins dan atur font-family body ke variabel tersebut dengan fallback sans-serif. Pilihan empat weight menyeimbangkan kebutuhan aktual (400 regular body, 500 medium nav, 600 semi-bold, 700 bold heading/brand) tanpa membebani payload dengan sembilan weight penuh; opsi hanya 400+700 ditolak karena akan menghasilkan faux-medium.

- **Global Styles — theme inline:** Perbarui definisi token font di Global Styles agar sistem desain Tailwind v4 mengarah ke Poppins. Pertahankan smooth scroll pada html.

- **Scroll lock saat Bubble open (Amend):** Tambah efek di Navbar yang watch `open`: saat `open=true` dan viewport `<1024px`, simpan `document.body.style.overflow` awal dan set ke `hidden`; saat `open=false`, resize ≥1024, ESC, click outside/backdrop, atau unmount, restore ke nilai awal. Pilih mekanisme `overflow hidden` (Opsi A) karena simple, zero-dependency, dan konsisten dengan pola useEffect existing; tolak `position: fixed + scrollY` (lebih kuat di iOS tapi butuh simpan/restore scrollY dan risiko layout shift) dan library `body-scroll-lock` (overkill).

- **Bubble hover underline 1:1 (Amend):** Verifikasi bahwa Bubble link sudah memakai struktur identik dengan desktop: `group relative` + `span absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-current transition-all duration-200 group-hover:w-full group-focus-visible:w-full`. Pilih pertahankan identik (Opsi A); tolak tweak tipis/cepat (Opsi B) untuk jaga konsistensi maintenance. Secara implementasi ini no-op — hanya pastikan tidak ada divergensi.

- **Domain docs — glossary dan ADR:** Perbarui glossary untuk Navbar dari definisi sticky menjadi non-sticky/relative yang ikut scroll dan menyatu tanpa border/shadow, serta tambahkan entri Typography untuk Poppins. Tambahkan entri Scroll Lock di glossary Bubble Menu dan buat ADR baru yang mencatat konteks (keputusan sebelumnya mengasumsikan sticky dan sempat hapus scroll lock di ADR 0003), alternatif yang dipertimbangkan (header transparan, bubble flat tanpa shadow, semua weight Poppins, hanya 400+700, overflow hidden vs position fixed), trade-off, dan reversal cost. ADR ini secara eksplisit merevisi asumsi pada ADR strategi responsive dan bubble chat sebelumnya.

- **Modul yang dimodifikasi:** Navbar, Root Layout, Global Styles. Tidak ada penambahan dependensi baru; tetap mengandalkan next/font.

- **Aksesibilitas dipertahankan:** Tidak mengubah atribut ARIA Hamburger Button, peran navigasi, atau logika focus-visible; underline `group-focus-visible` tetap di desktop dan bubble.

- **Urutan eksekusi yang direkomendasikan:** Typography terlebih dahulu (isolated, risiko rendah), lalu header visual (posisi + border), lalu scroll lock, terakhir dokumentasi dan verifikasi underline. Urutan ini memudahkan verifikasi per langkah.

## Testing Decisions

- **Prinsip:** Uji perilaku eksternal yang dilihat pengguna, bukan detail implementasi kelas CSS spesifik. Hindari assert string className mentah; prefer computed style atau visual assertion.

- **Seam tertinggi — visual / E2E (diutamakan):** Render halaman penuh di browser (mis. Playwright) adalah seam tertinggi dan ideal untuk fitur ini. Satu suite dapat menguji: (a) header tidak sticky — computed position bukan sticky dan header keluar viewport setelah scroll, (b) tidak ada border bawah / shadow / blur — computed border-width 0 dan background solid, (c) font-family ter-render mengandung Poppins untuk heading, nav, dan body, (d) anchor scroll tetap bekerja, (e) scroll lock — saat Bubble open di `<1024px` `document.body.style.overflow === "hidden"` dan user tidak bisa scroll, saat close kembali `""`. Seam ini mencakup integrasi antara Root Layout, Global Styles, dan Navbar sekaligus.

- **Seam komponen — Navbar unit (jika E2E tidak tersedia):** Uji unit React (mis. Testing Library) untuk Navbar: render, toggle Hamburger Button membuka Bubble Menu, klik outside/ESC/resize menutup, atribut aria-expanded/aria-hidden benar, opsi fallback visual bahwa header tidak memiliki border, serta uji scroll lock — simulasi `open=true` di `<1024px` lalu assert `document.body.style.overflow === "hidden"` dan setelah `open=false` restore. Seams ini lebih rendah dan memerlukan mock window resize dan `document.body`, jadi jadikan pelengkap, bukan pengganti E2E.

- **Seam tipografi — snapshot style:** Uji ringan bahwa variabel font Poppins ada di elemen root dan Global Styles memetakan font-sans ke variabel tersebut. Tidak perlu mengunduh file woff2 dalam test; cukup verifikasi kelas/variabel terpasang dan computed font-family.

- **Seam underline — visual snapshot:** Assert bahwa link di desktop dan di Bubble memiliki `span` underline dengan kelas identik `h-[2px] bg-current` dan `group-hover:w-full` — cukup cek kehadiran elemen, tidak perlu pixel-perfect.

- **Prior art:** Repo saat ini belum memiliki harness test (hanya skrip dev/build/lint). Tidak ada pola test sebelumnya untuk diikuti, sehingga diusulkan memulai dengan satu file E2E Playwright atau satu file Testing Library untuk Navbar sebagai fondasi. Keputusan sengaja menghindari menambah harness berat sebelum kebutuhan lebih luas muncul.

- **Verifikasi manual wajib:** Karena perubahan visual, verifikasi manual tetap diperlukan: scroll test di desktop dan di bawah Breakpoint lg, buka/tutup Bubble Menu, cek kesatuan warna header vs section About/Projects, cek Poppins di semua teks termasuk fallback swap, cek scroll lock (buka bubble → coba scroll → harus lock; tutup via link/outside/ESC/resize → scroll normal), cek hover/tap underline di bubble sama dengan desktop.

- **Quality gates:** Lint dan build harus lolos. Tidak ada perubahan skema atau kontrak API, jadi tidak ada uji migrasi.

## Out of Scope

- Dark mode — tetap light-only sesuai keputusan sebelumnya; tidak menambah varian dark.
- Multi-page routing — navigasi tetap anchor scroll single-page; tidak menambah route /about dll.
- Perubahan Breakpoint lg (1024px) — tetap; tidak menambah custom 900px.
- Perubahan ukuran/geometri Bubble Menu (154×172) atau posisi tail — tetap.
- Perubahan palette warna Navigation Item — tetap; underline `center→sides` tetap `h-[2px] bg-current`.
- Penambahan font mono terpisah untuk code block — tidak; Geist Mono dihapus tanpa pengganti.
- Optimasi font tambahan seperti subset latin-ext atau preload manual — tidak, kecuali terbukti perlu.
- Penambahan library drawer (Headless UI/Radix) — tetap useState sederhana.
- Penambahan library scroll lock eksternal — tidak; pakai `overflow hidden` native.
- Focus trap di dalam Bubble — tidak.

## Further Notes

- Keputusan ini merevisi asumsi implisit pada ADR strategi responsive dan ADR bubble chat yang mengasumsikan Navbar sticky dengan border/shadow. Kontradiksi ditandai eksplisit dan direkonsiliasi di ADR 0004; Amend scroll lock merevisi ADR 0003 yang sempat hapus body scroll lock — direkonsiliasi di ADR 0005. Reversal cost dinilai low-medium (kembalikan kelas sticky/border/blur dan import Geist) dan low untuk scroll lock (hapus useEffect overflow).
- Efek blur semi-transparan sengaja dihapus meski secara estetika menarik, karena brief menekankan "menyatu" — blur justru menciptakan lapisan terpisah. Jika di masa depan diinginkan efek kaca, buat ADR revisi yang menimbang kontras dan performa.
- Memuat empat weight Poppins menambah beberapa file woff2 tetapi masih jauh lebih hemat dari sembilan weight; perf impact dipantau via build Next.js. Display swap dipilih untuk menghindari FOIT, dengan konsekuensi FOUT singkat yang dapat diterima untuk portfolio.
- Overlay fixed sebelumnya (inset-0 top-16) menjadi tidak valid untuk header non-sticky; solusi absolute di dalam header lebih sederhana daripada mempertahankan fixed yang harus dihitung ulang terhadap scroll. Jika overlay dihapus total, pastikan bubble tetap cukup kontras tanpa dim.
- Scroll lock dipilih `overflow hidden` bukan `position: fixed` untuk simplicity; trade-off iOS bounce minor masih mungkin tapi acceptable untuk portfolio light. Jika diperlukan lock sekuat native modal, buat ADR revisi dengan `position: fixed + scrollY`.
- Hover underline di bubble sengaja dipertahankan identik dengan desktop untuk konsistensi; tidak ada divergensi `h-[2px]`/`duration-200`. Verifikasi touch: hover akan trigger saat tap sebelum close, dan `focus-visible` menjaga a11y keyboard.
- Semua istilah domain mengikuti glossary: Navbar, Site Name, Navigation Item, Hamburger Button, Bubble Menu, Bubble Tail, Breakpoint lg, Client Component, Typography, Scroll Lock.
