# Spec — About Section Responsive (1-col Mobile → 2-col Desktop + Skills Marquee)

Status: ready-for-agent

## Problem Statement

Portfolio memiliki `About Section` dengan `id="about"` yang masih dummy (`"ABOUT SECTION"` dengan `min-h-[60vh]` dan teks placeholder) dan tidak merepresentasikan profil pemilik. Pengunjung — baik di mobile maupun desktop — tidak mendapatkan konteks siapa Akmal, apa keahliannya, dan stack apa yang dikuasai.

Kebutuhan baru (hasil grill 6 ronde) menuntut About Section yang:

- Menampilkan identitas sebagai Full Stack Developer melalui satu paragraf yang sudah disepakati,
- Menampilkan ilustrasi kartun (dummy dulu, siap diganti foto/aset nyata tanpa ubah layout),
- Menampilkan judul `About Me` dan sub-judul `Skills` dengan hierarki tipografi yang konsisten dengan Hero Section dan Navbar,
- Menampilkan daftar skill (JS, TS, React, Next.js, dll) sebagai carousel yang bergerak otomatis ke samping,
- Bekerja presisi di dua mode: mobile 1 kolom 4 baris (judul → gambar → paragraf → skills) dan desktop 2 kolom (kiri: judul+paragraf+skills, kanan: gambar) pada breakpoint yang sama dengan Navbar (`1024px`).

Tanpa ini, anchor `About` di Navbar (`#about`) hanya membawa ke placeholder, mengurangi kredibilitas portfolio dan memutus alur scroll single-page yang sudah dijanjikan di glossary.

## Solution

Bangun About Section final yang menggantikan dummy dengan layout responsive presisi dan marquee skills tanpa library tambahan:

- **Mobile** 1 kolom 4 baris berurutan: baris 1 judul `About Me`, baris 2 gambar kartun dummy terpusat, baris 3 paragraf Full Stack Developer, baris 4 judul `Skills` + carousel icon horizontal yang auto-scroll.
- **Desktop** 2 kolom di breakpoint desktop: kolom kiri berisi 3 baris vertikal (judul, paragraf, skills) rata kiri; kolom kanan berisi 1 gambar kartun yang mengisi tinggi seimbang dengan teks kiri. Gambar tidak diduplikasi — satu DOM yang dipindah posisi via `order`/grid placement.
- **Container** `max-w-6xl` yang melebar ke `1100px` di desktop, padding horizontal sinkron dengan Navbar, padding vertikal `py-16 → py-20`, background `white`, grid `gap-8 → gap-12` agar ritme konsisten dengan Hero Section yang tinggi menyesuaikan card.
- **Gambar dummy** berupa `div` `rounded-[24px]` `bg-zinc-100` dengan border halus dan aspek `4/3` di mobile menjadi `square` di desktop, berisi emoji/icon tengah dan label `Cartoon placeholder`. Alt text placeholder disediakan; penggantian ke `next/image` di masa depan tidak mengubah layout atau grid.
- **Tipografi** mengikuti sistem Poppins yang sudah ada: heading `2xl → 4xl semibold tracking-tight zinc-900`, skills label `16→18px semibold`, paragraf `15→17px leading-relaxed zinc-600→700`, semuanya `center` di mobile dan `left` di desktop dengan `max-width` yang membatasi panjang baris di `1100px`.
- **Skills carousel** infinite marquee CSS-only: daftar 10 icon (JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, HTML5, CSS3, Git, GitHub) digandakan menjadi 20 untuk loop seamless `translateX(-50%)`, animasi `marquee 25s linear infinite`, pause saat hover/focus, fade mask di tepi kiri-kanan, dan `prefers-reduced-motion` yang mematikan animasi menjadi `flex wrap` statis. Icon dirender sebagai SVG inline monochrome dalam card `rounded-xl bg-white border shadow-sm` tanpa menambah dependensi.

Perubahan terbatas pada visual About Section dan komponen carousel; tidak mengubah Navbar, Hero Section, Projects/Contact dummy, routing anchor, atau strategi `Breakpoint lg`.

## User Stories

1. As a visitor di mobile, I want melihat judul `About Me` di urutan paling atas About Section, so that saya langsung tahu ini bagian profil.
2. As a visitor di mobile, I want judul `About Me` terlihat terpusat (`center`) dengan ukuran yang hierarkis, so that fokus awal seimbang dengan gambar di bawahnya yang juga terpusat.
3. As a visitor di desktop, I want judul `About Me` rata kiri (`left`) di kolom kiri atas, so that sejajar dengan paragraf dan skills di bawahnya dan gambar di kanan.
4. As a mobile visitor, I want gambar kartun dummy muncul di baris kedua di bawah judul, terpusat dan tidak overflow di layar sempit, so that bagian visual tidak mendorong teks ke luar viewport.
5. As a desktop visitor, I want gambar kartun muncul di kolom kanan, seimbang tinggi dengan teks kiri, so that layout terasa dua kolom editorial bukan stack.
6. As a visitor, I want gambar dummy berupa placeholder yang jelas (`bg-zinc-100` + icon tengah + label) dengan `rounded` dan border halus, so that saya paham ini sengaja placeholder bukan gambar rusak.
7. As a future maintainer, I want bisa mengganti dummy `div` dengan foto/aset nyata tanpa mengubah grid atau container, so that iterasi aset tidak butuh refactor layout.
8. As a visitor, I want membaca satu paragraf Full Stack Developer yang utuh ("I’m a Full Stack Developer who enjoys turning ideas... useful, intuitive, and enjoyable to use.") di bawah gambar (mobile) atau di bawah judul (desktop), so that saya paham positioning dan motivasi Akmal.
9. As a mobile visitor, I want paragraf terpusat dengan lebar maksimum yang nyaman dibaca (~480px) tanpa baris terlalu panjang, so that readability terjaga di layar sempit.
10. As a desktop visitor, I want paragraf rata kiri dengan lebar ~560px di kolom kiri, so that eye-scan natural dari judul ke teks ke skills.
11. As a visitor, I want hierarki paragraf lebih lembut dari heading (`text-zinc-600/700` vs `zinc-900`, `15→17px` vs `24→36px`), so that heading tetap dominan.
12. As a visitor di mobile, I want setelah paragraf melihat label `Skills` terpusat diikuti carousel icon yang bergerak otomatis ke samping, so that saya diajak scanning stack tanpa interaksi manual.
13. As a visitor di desktop, I want label `Skills` rata kiri di bawah paragraf dengan carousel yang sama, so that konsistensi heading → body → skills terjaga di kolom kiri.
14. As a visitor, I want melihat 10 skill yang representatif (JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, HTML5, CSS3, Git, GitHub) sebagai icon yang mudah dikenali, so that saya cepat menilai kecocokan stack.
15. As a visitor, I want tiap icon tampil dalam card kecil `rounded-xl bg-white border shadow-sm` dengan SVG monochrome, so that carousel terlihat rapi dan tidak berisik warna di atas `bg-white`.
16. As a visitor, I want carousel bergerak otomatis infinite tanpa ujung yang terlihat (seamless loop `JS→GitHub→JS...`), so that tidak ada jeda kosong atau lompatan saat loop.
17. As a visitor dengan mouse, I want hover di area carousel menghentikan gerakan (`pause`), so that saya bisa fokus membaca label icon tanpa pusing.
18. As a keyboard user, I want focus di dalam carousel juga menghentikan gerakan, so that navigasi keyboard tidak terganggu animasi.
19. As a visitor yang mengaktifkan `prefers-reduced-motion: reduce`, I want carousel tidak beranimasi melainkan tampil sebagai `flex wrap` statis, so that aksesibilitas motion terjaga.
20. As a visitor, I want tepi kiri-kanan carousel memudar halus (fade mask) bukan terpotong tajam, so that kesan marquee premium.
21. As a visitor yang scroll via anchor Navbar `About → #about`, I want mendarat tepat di awal About Section tanpa terhalang header (header non-sticky `relative h-16`), so that judul `About Me` terlihat penuh.
22. As a visitor di viewport `≈1024px` (breakpoint), I want perpindahan dari 1-kolom ke 2-kolom terjadi tepat di `1024px` tanpa flicker atau duplikat gambar, so that konsistensi dengan Navbar terjaga.
23. As a developer, I want About Section tetap Server Component dan hanya carousel yang butuh boundary client minimal (jika perlu), so that pola ekstraksi section (`HeroSection` dll) tetap konsisten dan tidak menambah JS yang tidak perlu.
24. As a developer, I want build dan lint tetap lolos tanpa dependensi baru (`next` + `react` saja), so that pipeline tidak menambah beban.
25. As a developer, I want keputusan layout dan marquee ini terdokumentasi di glossary dan ADR, so that reversal dan alasan CSS-only vs library jelas bagi pembaca masa depan.

## Implementation Decisions

- **Layout & container** Pilih `grid` `1 kolom → 2 kolom` di breakpoint desktop yang sama dengan Navbar (desktop `>=1024px`, mobile `<1024px`). Container `max-w-6xl` yang melebar ke `1100px` di desktop dengan padding horizontal sinkron Navbar dan padding vertikal `16 → 20`, background `white` (selang-seling dengan Projects yang `zinc-50`). Tolak `flex` murni dan `1024px`-custom agar tidak menambah breakpoint baru; pilih `grid` karena menyeimbangkan tinggi kolom kanan-kiri tanpa JS. Satu DOM gambar dipindah via `order`/grid placement; tolak duplikasi gambar mobile/desktop karena menambah maintenance dan risiko `alt` ganda.

- **Heading & label** `About Me` Title Case sebagai teks sumber (render konsisten dengan Navbar `About`), dengan ukuran `2xl → 4xl semibold tracking-tight zinc-900` dan alignment `center → left`. Label `Skills` sebagai sub-judul `16→18px semibold zinc-900` dengan margin `mt-8` dari paragraf. Tolak all-lowercase literal dan tolak `uppercase tracking-widest` karena menyimpang dari hierarki Hero Heading (`22→36px semibold`).

- **Gambar dummy** `div` placeholder `max-w-[340px] → [440px]` `aspect-[4/3] → square` `rounded-[24px] bg-zinc-100 border-zinc-200` berisi emoji/icon tengah + teks `Cartoon placeholder`. Tanpa `next/image` di iterasi ini untuk menghindari konfigurasi domain external; tanpa shadow berat agar tidak bersaing dengan Hero Card yang sudah memiliki `shadow-[0_20px_60px_rgba(0,0,0,0.08)]`. Alt text placeholder disediakan; swap ke aset nyata hanya mengganti inner tanpa menyentuh grid.

- **Paragraf** Satu paragraf utuh (tidak dipecah menjadi dua) sesuai brief, dengan `15→17px leading-relaxed zinc-600→700` dan `max-w 480→560` `center → left`. Pilih `zinc-600` di mobile yang sedikit lebih soft dari Hero Tagline `zinc-700` untuk menjaga hierarki heading > body; lebar dibatasi agar tidak memanjang di `1100px` seperti Hero Tagline `max-w 260→620`.

- **Daftar skill** Kunci 10 item awal yang representatif Full Stack sesuai paragraf: JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, HTML5, CSS3, Git, GitHub. Ekstensi (Prisma, PostgreSQL, Docker, Figma) ditunda agar carousel tidak overcrowded di iterasi pertama; penambahan hanya menambah entri tanpa ubah mekanisme. Icon sebagai SVG inline monochrome `currentColor` dalam card `h-10 w-10 rounded-xl bg-white border-zinc-100 shadow-sm`; tolak `react-icons`/`simple-icons` CDN untuk menjaga zero-dependency seperti Navbar yang hanya inline SVG.

- **Carousel — mekanisme** CSS-only `@keyframes marquee` `translateX(-50%)` `linear infinite` dengan duplikasi daftar `[...icons, ...icons]` untuk seamless loop. Pilih CSS karena performa GPU (`transform`), tanpa JS, dan mudah untuk `prefers-reduced-motion`; tolak `swiper/embla/framer-motion` yang menambah dependensi dan JS untuk kasus yang bisa diselesaikan CSS. Durasi `25s` sebagai tengah (tolak `18s` yang terlalu cepat/pusing dan `35s` yang terasa lambat). Pause via `hover:[animation-play-state:paused]` dan `focus-within:paused`; tolak tanpa pause (aksesibilitas buruk) dan tolak pause via JS state (overkill). Tepi difade via `mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`; `overflow-hidden` sebagai viewport. `prefers-reduced-motion: reduce` mematikan animasi dan menampilkan `flex wrap` statis.

- **Batas komponen** About Section tetap Server Component mengikuti pola `HeroSection`; carousel diekstrak sebagai komponen kecil terpisah dengan boundary client minimal hanya jika butuh interaktivitas pause — jika CSS-only cukup, tetap Server. Tolak menjadikan seluruh AboutSection client.

- **Aksesibilitas** Carousel diberi `aria-label="Skills carousel"`; tiap icon memiliki `aria-label`/`title` dengan nama skill. Animasi menghormati `prefers-reduced-motion`; tidak ada auto-play dengan suara; kontras `zinc-700` di atas `white` card memenuhi rasio baca.

- **Arsitektur & dependensi** Tidak ada skema, API, atau state global baru. Styling sepenuhnya Tailwind v4 arbitrary values yang sudah ada (`from-[#FBED96]` dll di Hero membuktikan dukungan). Tidak ada perubahan pada Navbar, Hero Card, atau strategi `Breakpoint lg`.

## Testing Decisions

- **Prinsip uji** Hanya uji perilaku eksternal yang dilihat pengunjung (urutan visual, gerakan carousel, pause, reduced-motion, anchor scroll), bukan string class mentah. Uji harus deterministik di `1024px` sebagai titik pecah dan di `375px`/`1280px` sebagai ekstrem.

- **Seam tertinggi — E2E browser (diutamakan)** Satu suite Playwright/Cypress yang merender halaman penuh dapat menguji semua cerita dalam satu tempat: (a) di `<1024px` urutan DOM `heading → gambar → paragraf → skills` dan semua `text-center`; (b) di `>=1024px` `grid 2 kolom` dengan gambar di `col-start-2` dan teks `text-left`; (c) carousel `translateX` bergerak (computed `transform` berubah dalam 1s) dan loop tanpa gap (duplikasi 20 item); (d) `hover` di carousel mengubah `animation-play-state` ke `paused`; (e) `prefers-reduced-motion: reduce` membuat animasi `none` dan layout menjadi wrap; (f) anchor `#about` dari Navbar mendarat dengan `heading` terlihat (top < 100px dari viewport). Seam ini mencakup integrasi antara header non-sticky, Hero Section yang tinggi menyesuaikan card, dan About Section baru tanpa mock.

- **Seam komponen — unit Testing Library (pelengkap jika E2E belum ada)** Render About Section terisolasi: assert `heading` `About Me` ada, `paragraph` mengandung substring `Full Stack Developer`, `image placeholder` ada dengan `alt`, `Skills` label ada, carousel merender 20 card (10×2) dengan `aria-label` tiap skill, dan container memiliki class grid responsif. Untuk carousel, mock `matchMedia` untuk `prefers-reduced-motion` dan verifikasi `animation` dimatikan. Tidak perlu snapshot pixel-perfect.

- **Seam visual — regresi ringan (opsional)** Perbandingan screenshot `375px` vs `1024px` untuk memastikan tidak ada overflow horizontal (`scrollWidth <= clientWidth`) dan gap `8 → 12` konsisten.

- **Prior art** Repo saat ini tidak memiliki harness test (hanya `dev`/`build`/`lint` di `package.json`); pola ini konsisten dengan usulan testing di spec sebelumnya (`navbar-nonsticky-poppins`, `fix-bubble-nav-parity`) yang mengusulkan memulai dengan satu file E2E atau satu file Testing Library sebagai fondasi. Tidak ada contoh test About sebelumnya untuk dirujuk — buat fondasi baru yang paling tinggi (E2E) dahulu.

- **Verifikasi manual wajib** Karena visual dan animasi: (a) buka di mobile (`375px`) — verifikasi 4 baris berurutan dan carousel bergerak; (b) hover carousel — harus pause; (c) aktifkan `Emulate CSS prefers-reduced-motion: reduce` di DevTools — carousel harus statis wrap; (d) resize ke `>=1024px` — verifikasi 2 kolom tanpa duplikat gambar; (e) klik Navbar `About` — smooth scroll ke About Section; (f) ganti dummy dengan `next/image` sementara — layout tidak bergeser.

- **Quality gates** `lint` dan `build` wajib lolos; `tsc --noEmit` tanpa error; tidak ada perubahan skema/API.

## Out of Scope

- Dark mode — tetap `light-only` sesuai keputusan yang ada; tidak ada varian dark untuk About Section atau carousel.
- Multi-page routing — tetap anchor scroll single-page `#about`; tidak menambah route `/about`.
- Perubahan `Breakpoint lg` `1024px` — tetap; tidak menambah breakpoint custom untuk About.
- Aset ilustrasi final — tetap dummy `div` di iterasi ini; tidak mengimpor file kartun nyata, tidak menambah konfigurasi `next.config` untuk domain external, tidak menambah file di `public/`.
- Perubahan pada Hero Section, Navbar (termasuk Scroll Lock, Bubble Menu, underline), Projects/Contact dummy, atau `Contact CTA` — tidak.
- Library carousel JS (`swiper`, `embla`, `framer-motion`) atau penambahan dependensi baru — tidak; tetap CSS-only.
- Focus trap, drag/swipe manual, atau pagination dot di carousel — tidak.
- Penambahan backend, CMS, atau i18n untuk paragraf/skills — tidak.
- Test harness berat (visual regression cloud, coverage threshold) — cukup satu suite E2E/unit minimal seperti di atas.

## Further Notes

- **ADRs terkait** Keputusan ini melanjutkan `ADR 0007 Hero Gradient Card` (card `327×530 → 1100×632`, wrapper `flex justify-center`, Poppins) dan `ADR 0001/0003/0005/0006 Navbar` (breakpoint `1024px`, bubble, scroll lock). Kontradiksi tidak ada; About Section baru melanjutkan ritme `bg-white` selang-seling dengan `Projects` `bg-zinc-50`. Reversal cost low: revert About Section ke dummy `min-h-[60vh]` dan hapus komponen carousel + keyframes + ADR baru.

- **Glossary yang digunakan** `About Section`, `Hero Section`, `Hero Card`, `Navbar`, `Navigation Item`, `Breakpoint lg`, `Client Component`, `Typography` (Poppins) — sesuai `CONTEXT.md`. Jika ADR baru dibuat, ia akan mereferensikan istilah ini tanpa menambah sinonim.

- **Catatan implementasi** Carousel `25s` adalah kompromi kehalusan vs kebosanan; jika di masa depan daftar skill bertambah >14, durasi dapat dinaikkan proporsional tanpa mengubah keyframes. Penggantian dummy ke `next/image` hanya mengganti inner `div` — pertahankan `aspect` dan `rounded` agar tidak ada layout shift.

- **Aksesibilitas lanjutan** Jika carousel diisi warna brand asli per icon, pastikan kontras tetap di atas `3:1` untuk icon-only; untuk sekarang monochrome `zinc-700` sudah aman.

