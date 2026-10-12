# ADR 0010 — Projects Coming Soon: Skeleton Carousel Blur + Overlay

- **Status:** Accepted (amended — carousel)
- **Date:** 2026-09-21
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/sections/projects.tsx:1`, `app/page.tsx:3`, `app/sections/about.tsx:1`, `app/sections/hero.tsx:1`, `app/globals.css:25`, `app/components/skills-carousel.tsx:1`, `CONTEXT.md:23`, `docs/adr/0008-about-section-responsive-carousel.md:1`, `docs/adr/0009-skills-carousel-logo-swap.md:1`
- **Grill:** Q1 (anatomi skeleton), Q2 (overlay copy), Q3 (interaksi blur), Q4 (wrapper & heading), Q5 (grid & dimensi), Q6 (intensitas blur), Q7 (animasi), Q8 (migrasi) — **+ Q9–Q14 carousel** (mekanika, ukuran mobile, jumlah duplikasi, overlay statis, kecepatan, reduced-motion)

## Context

`Projects Section` masih dummy di `app/sections/projects.tsx:1` (`flex min-h-[60vh] border-b border-zinc-100 bg-zinc-50`, teks `"PROJECTS SECTION"`). Brief awal (grill-with-docs 8 ronde) minta konsep **coming soon** tanpa project real:

- Tampilkan 3 skeleton load card yang di-blur, ditimpa tulisan `"want to be my first client?"`
- Mobile: 3 card menurun vertikal; desktop: 3 card menyamping horizontal
- Harus sinkron dengan sistem existing: Poppins via `app/layout.tsx:2`, breakpoint `lg:1024px` via `app/components/navbar.tsx:42`, container `max-w-6xl lg:max-w-[1100px]` via `app/sections/about.tsx:6`, ritme `py-16 lg:py-20`, heading `56→92px` via `app/sections/about.tsx:11`, dan `Contact CTA` `app/sections/hero.tsx:38` (`rounded-full bg-[#111827]`).

Amend terbaru (grill-with-docs carousel 6 ronde, 2026-09-21): ubah skeleton statis `grid` menjadi **carousel bergerak ke samping** untuk semua viewport, mobile ukuran sedikit lebih kecil (`w-[300px] h-[220px]` vs `lg:w-[360px] lg:h-[320px]`), tetap di-blur di belakang overlay statis.

Investigasi existing:
- `Projects Section` `id="projects"` adalah target anchor `Navigation Item Projects → #projects` di `app/components/navbar.tsx:5` — harus retain `id`.
- `About Section` sudah settled `bg-white py-16 lg:py-20` + `grid` — Projects harus selang-seling konsisten (tolak `bg-zinc-50` dummy yang menyamarkan `bg-white` card).
- Hero Card `app/sections/hero.tsx:7` pakai `rounded-[32px] lg:rounded-[40px]` + `shadow-[0_20px_60px_rgba(0,0,0,0.08)]`; About placeholder `rounded-[24px]` — skeleton card `rounded-[24px]` proporsional.
- `SkillsCarousel` `app/components/skills-carousel.tsx:1` sudah membuktikan pola marquee CSS-only: `flex w-max gap-4`, `animate-marquee 25s linear infinite translateX(-50%)` di `app/globals.css:25`, `group:hover pause`, fade mask, `prefers-reduced-motion` wrap — reusable untuk skeleton carousel tanpa dependency baru.
- Tailwind v4 `@import "tailwindcss"` di `app/globals.css:1` mendukung `blur-[2px]`, `backdrop-blur-[1px]`, `animate-pulse`, `motion-reduce:` tanpa config.
- Repo tanpa test harness (hanya `dev`/`build`/`lint` di `package.json:5`); `ProjectsSection` tetap Server Component seperti `app/sections/about.tsx:1` dan `app/sections/hero.tsx:1`.

Alternatif yang dipertimbangkan (8 + 6 grill rounds):

- **Q1 Anatomi skeleton:** A) **Image 16:9 + 2 bar judul + 1 deskripsi + 2 pill tag** `rounded-[24px] border bg-white p-4` `bg-zinc-200 animate-pulse` (chosen), B) minimal image+1 judul, C) full + avatar/date. Dipilih A: meyakinkan sebagai "project card" real, swap ke `ProjectCard` nanti tanpa ubah dimensi — konsisten dengan `Cartoon Placeholder` `rounded-[24px]` About.
- **Q2 Overlay copy:** A) exact lower-case `"want to be my first client?"` tanpa CTA, B) **Title Case `"Want to be my first client?"` + sub `"Let's build something together"` + button `"Contact Me" → #contact`** (chosen), C) Title Case tanpa button. Dipilih B: Title Case konsisten `About Me` `app/sections/about.tsx:11` + Navbar; button memberi next-step jelas (tanpa button = dead-end); lower-case di Poppins semibold terkesan typo.
- **Q3 Interaksi:** A) **Statis blur permanen, card `pointer-events-none aria-hidden`, overlay center `absolute inset-0`** berisi teks+button (chosen), B) hover reveal hilang blur, C) klik anywhere. Dipilih A: pesan coming soon tegas — hover reveal membingungkan (user kira bisa buka project); `A` paling accessible (button fokusable, no surprise); di mobile tidak ada hover jadi `B` inkonsisten.
- **Q4 Wrapper & heading:** A) **`bg-white py-16 lg:py-20` + `max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8` + heading `"Projects" text-[56px] lg:text-[92px] font-semibold`** (chosen), B) tanpa heading langsung grid `bg-zinc-50`, C) heading kecil `text-2xl`. Dipilih A: sinkron ritme About `py-16` + container Navbar `max-w-6xl` + Hero `1100px`; anchor `#projects` butuh heading landmark; `bg-white` agar `bg-white` card kontras via `border/shadow` (di `zinc-50` hilang).
- **Q5 Grid & dimensi (awal):** A) **`grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8` + card `mx-auto w-full max-w-[400px] h-[280px] lg:mx-0 lg:max-w-none lg:h-[320px]`** (chosen awal), B) `flex flex-col lg:flex-row`, C) `h-[360px]` tinggi. Dipilih A awal: `grid` equal height tanpa JS, `gap 24→32` proporsional `gap-8→12` About, `max-w-[400px]` batasi di mobile 375px, `h-[280→320]` cukup untuk image+text tanpa scroll panjang (tolak `360px` = 1080px total).
- **Q9 Mekanika carousel (amend):** A) **CSS marquee reuse `Skills Carousel` `flex w-max gap-6` + `animate-marquee 25s` + duplikasi `3×2=6` + `overflow-hidden` + fade mask** (chosen), B) JS lib `embla/swiper`, C) `requestAnimationFrame scrollLeft`. Dipilih A: zero-dep, GPU `transform`, sudah terbukti `app/components/skills-carousel.tsx:35` + `app/globals.css:25`; `B` tambah bundle, `C` overkill.
- **Q10 Ukuran carousel (amend):** A) **Mobile `w-[300px] h-[220px]` + desktop `lg:w-[360px] lg:h-[320px]` `shrink-0`** (chosen), B) `w-[260px] h-[180px]`, C) tetap `280px`. Dipilih A: `w` fixed untuk `w-max` (bukan `w-full`), `300px` di `375px` viewport muat 1 + intip card kedua (affordance geser), tidak cramped seperti `B`; `C` tidak lebih kecil sesuai brief.
- **Q11 Jumlah duplikasi (amend):** A) **6 card (`3×2`)** (chosen), B) 9 (`3×3`), C) 12. Dipilih A: minimal seamless `translateX(-50%)`, track `≈1896px` mobile / `2256px` desktop cukup di `1100px` container; `B/C` overkill DOM.
- **Q12 Overlay di atas carousel (amend):** A) **Overlay statis `absolute inset-0 bg-white/30` center, carousel `overflow-hidden blur-[2px] opacity-85 pointer-events-none` di belakang, `group` pause via `app/globals.css:39`** (chosen), B) overlay ikut geser, C) tanpa `bg`. Dipilih A: pesan coming soon fokus, tidak ikut geser, `group:hover` di wrapper jadi hover overlay juga pause — intuitif; `B` tidak terbaca, `C` skeleton terlalu jelas.
- **Q13 Kecepatan & fade (amend):** A) **Pertahankan `25s gap-6` + mask `transparent 10%→90%` + `group:hover/focus-within pause` + `prefers-reduced-motion` wrap** (chosen), B) `18s`, C) `35s`. Dipilih A: 1:1 `Skills Carousel`, `25s` sedang (tidak pusing/lamban).
- **Q14 Reduced-motion (amend):** A) **Ya 1:1 `app/globals.css:44` — `animation:none` + `mask-image:none` + `marquee-track flex-wrap justify-center width:auto`** (chosen), B) tanpa pause, C) `display:none`. Dipilih A: accessible, carousel jadi static wrap center tetap blur di balik overlay.
- **Q6 Intensitas blur:** A) **`blur-[3px] opacity-60` + overlay `bg-white/45 backdrop-blur-[1px]`** (chosen awal), B) `blur-[6px] opacity-40 bg-white/70`, C) tanpa backdrop. Dipilih A awal: `3px` cukup blur tapi masih terlihat bentuk 3 card; **Amend 2026-09-21** pasca-feedback "lebih jelas": `blur-[2px] opacity-85` + `bg-zinc-300` (was 200) + `border-zinc-300 shadow-md` (was 200/sm) + overlay `bg-white/30` (was 45) — visibilitas skeleton ditingkatkan, card edge lebih tegas, pulse tetap terlihat meski blur lebih tipis. `B` terlalu frosted — konsep skeleton hilang; `C` kontras teks buruk.
- **Q7 Animasi:** A) **`animate-pulse motion-reduce:animate-none` per bar** (chosen), B) shimmer sweep `translateX`, C) statis. Dipilih A: `animate-pulse` built-in Tailwind murah GPU, denyut lembut terlihat di balik `blur-[3px]`→`[2px]` reinforce "loading"; respect `prefers-reduced-motion`; `B` overkill (butuh keyframes baru, efek hilang di balik blur); `C` kehilangan affordance loading.
- **Q8 Migrasi:** A) extract `SkeletonProjectCard` component, B) flag `COMING_SOON`, C) **buang total — rewrite `projects.tsx` dari nol saat project real ada** (chosen). Dipilih C per user: paling simpel sekarang, tanpa branching permanen atau file ekstra; trade-off: grid/container `Q4+Q5` perlu ditulis ulang nanti (jika ingin low-effort migrasi, ADR baru diperlukan untuk pindah ke `A`).

## Decision

1. **Rewrite `ProjectsSection` `app/sections/projects.tsx:1`** sebagai Server Component `export default function ProjectsSection` (amended carousel):
   ```tsx
   <section id="projects" className="bg-white py-16 lg:py-20">
     <div className="mx-auto max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8">
       <h2 className="text-center text-[56px] font-semibold tracking-tight text-zinc-900 lg:text-left lg:text-[92px]">Projects</h2>
       <div className="group marquee-container relative mt-8 overflow-hidden lg:mt-10"
            style={{maskImage:"linear-gradient(to right, transparent, black 10%, black 90%, transparent)"}}>
         <div className="marquee-track animate-marquee flex w-max gap-6 py-2 blur-[2px] opacity-85 pointer-events-none select-none" aria-hidden="true">
           {/* 6× SkeletonProjectCard w-[300px] h-[220px] lg:w-[360px] lg:h-[320px] rounded-[24px] border-zinc-300 bg-white p-4 shadow-md shrink-0 */}
           {/* image h-24 lg:h-36 rounded-[16px] bg-zinc-300 animate-pulse + 2 judul + 1 deskripsi + 2 pill */}
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px] px-4 text-center">
           <h3 className="text-[22px] lg:text-[32px] font-semibold tracking-tight text-zinc-900">Want to be my first client?</h3>
           <p className="mt-2 text-[14px] lg:text-[16px] text-zinc-600">Let's build something together</p>
           <a href="#contact" className="mt-5 rounded-full bg-[#111827] px-7 py-3 text-[14px] lg:text-[15px] font-medium text-white hover:bg-black">Contact Me</a>
         </div>
       </div>
     </div>
   </section>
   ```

2. **Konten `app/sections/projects.tsx:14-38` (carousel):**
   - Wrapper `group marquee-container relative mt-8 overflow-hidden lg:mt-10` dengan fade mask `linear-gradient(to right, transparent, black 10%, black 90%, transparent)` (via inline `maskImage`) — reuse `SkillsCarousel` pattern
   - Track `marquee-track animate-marquee flex w-max gap-6 py-2 blur-[2px] opacity-85 pointer-events-none select-none aria-hidden` — 6 card (3×2 duplikasi) `flex h-[220px] w-[300px] shrink-0 flex-col gap-3 rounded-[24px] border border-zinc-300 bg-white p-4 shadow-md lg:h-[320px] lg:w-[360px]`
   - Overlay `absolute inset-0 bg-white/30 backdrop-blur-[1px] flex flex-col items-center justify-center px-4` statis center — `group` pause via `app/globals.css:39`
   - Reuse `app/globals.css:25` `@keyframes marquee 25s` + `prefers-reduced-motion` `app/globals.css:44` tanpa keyframes baru

3. **Update `CONTEXT.md:23`**: ganti dummy `min-h-[60vh] bg-zinc-50` → `bg-white py-16 lg:py-20` + container + heading `56→92px`; `Projects Section` jadi `group marquee-container overflow-hidden` fade mask; `Skeleton Project Card` `w-[300px] h-[220px] lg:w-[360px] lg:h-[320px]` `flex w-max gap-6` marquee `25s` 6 card; `Coming Soon Overlay` `bg-white/30` statis center (ref ADR 0010).

4. **No change** `app/globals.css:1` (reuse `@keyframes marquee 25s` + `animate-pulse` existing), `app/components/navbar.tsx:5` (anchor retain), `app/sections/contact.tsx:1` (target `#contact`).

## Consequences

- **Positif:** Carousel horizontal untuk semua viewport (`300×220` mobile lebih kecil → `360×320` desktop) + 6 card loop seamless `25s` reuse `SkillsCarousel` pattern tanpa dependency; fade mask halus, `group:hover/focus-within pause` + `prefers-reduced-motion wrap` accessible; overlay CTA jelas ke `#contact` tetap center tidak ikut geser; blur `2px` + `opacity-85` + `zinc-300` + `shadow-md` + `bg-white/30` visibilitas seimbang; heading `Projects` besar jaga hierarki About→Projects; Server Component tanpa JS baru.
- **Negatif:** Track `w-max ≈1896px` mobile / `2256px` desktop `will-change: transform` — paint area lebih besar dari `grid` statis 3 card; `h-[220→320px]` fixed — jika `ProjectCard` real butuh tinggi dinamis, perlu adjust; overlay `absolute inset-0` menutupi penuh carousel — tidak bisa drag carousel di coming soon (by design, `pointer-events-none`).
- **Trade-off:** Carousel marquee `flex w-max` vs `grid` statis awal — marquee pilih motion affordance "loading" untuk semua mode vs grid vertikal mobile; `300×220` vs `280×400` — 300/220 lebih kecil sesuai brief agar intip card kedua terlihat di `375px`; `6` card vs `3` — 6 minimal seamless `translateX(-50%)`; `Q8 C` rewrite total vs extract — C simpel sekarang tapi duplikasi usaha nanti.
- **Reversal cost:** Low — revert `app/sections/projects.tsx:1` ke dummy `min-h-[60vh] bg-zinc-50` atau ke `grid` statis 3 card, revert `CONTEXT.md:23`, hapus/ amend file ini; tanpa perubahan `app/globals.css` (hanya reuse keyframes).

## References

- `app/sections/projects.tsx:1` — Projects Section, skeleton carousel, overlay
- `app/page.tsx:3` — import ProjectsSection
- `app/sections/about.tsx:1` — pola container `max-w-6xl lg:max-w-[1100px]` + `py-16 lg:py-20` + heading `56→92px` referensi
- `app/sections/hero.tsx:1` — Hero Card `rounded-[32→40px]` + `Contact CTA` referensi
- `app/components/navbar.tsx:5` — anchor `#projects` retain
- `app/globals.css:25` — `@keyframes marquee 25s`, `.animate-marquee`, `group:hover pause`, `prefers-reduced-motion`
- `app/components/skills-carousel.tsx:1` — SkillsCarousel pattern reuse (marquee, fade mask, 25s, pause)
- `CONTEXT.md:23` — glossary Projects Section, Skeleton Project Card, Coming Soon Overlay (carousel)
- `.scratch/projects-coming-soon/spec.md` — spec lengkap 8+6 Q carousel
