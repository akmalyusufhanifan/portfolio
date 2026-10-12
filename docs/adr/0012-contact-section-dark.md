# ADR 0012 — Contact Section Dark #111827: Bilingual EN + 3 Social CTA

- **Status:** Accepted
- **Date:** 2026-09-23
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/sections/contact.tsx:1`, `app/page.tsx:4`, `public/contact-section-image.png`, `app/components/navbar.tsx:5`, `app/sections/hero.tsx:1`, `app/sections/about.tsx:1`, `app/sections/projects.tsx:1`, `CONTEXT.md:27`, `docs/adr/0008-about-section-responsive-carousel.md`, `docs/adr/0010-projects-coming-soon-skeleton.md`
- **Grill:** Q1 (tipografi), Q2 (email dummy), Q3 (sosmed CTA), Q4 (layout & spacing), Q5 (detail visual), Q6 (wording EN) — grill-with-docs 1-per-1

## Context

`Contact Section` masih dummy di `app/sections/contact.tsx:1` (`flex min-h-[60vh] bg-white`, heading `CONTACT SECTION`). Brief awal minta:

- Background `#111827`, teks putih
- Mobile 1 kolom 4 row: judul `punya ide?` → subjudul `mari wujudkan bersama!` → email dummy → CTA icon sosmed (buka tab baru)
- Desktop 2 kolom: kiri tulisan identik mobile, kanan gambar `public/contact-section-image.png`
- Grill-with-docs 1-per-1 sebelum implementasi

Amend 2026-09-23: judul/subjudul switch ke bahasa Inggris per request `ubah teks judul dan subjudul dalam bahasa inggris` → lock `got an idea?` / `let's make it happen!` (Q6).

Investigasi existing:

- `Contact Section` `id="contact"` adalah target anchor untuk `Navigation Item Contact → #contact` `app/components/navbar.tsx:5` dan `Contact CTA` `app/sections/hero.tsx:45` + `Coming Soon Overlay` `app/sections/projects.tsx:48` — harus retain `id`.
- `About`/`Projects` sudah settled `bg-white py-16 lg:py-20` + container `max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8` (`app/sections/about.tsx:6`, `app/sections/projects.tsx:4`) — `Contact` perlu selaras ritme tapi dengan `bg-[#111827]` full-bleed.
- Asset `public/contact-section-image.png` verified ada, 1254×1254 square, 1.07 MB — cocok `aspect-square` + `rounded-[24px]` + `object-cover`.
- `react-icons@5.7.0` sudah terinstall di `package.json:15` — tidak perlu dependency baru untuk sosmed.
- Poppins via `app/layout.tsx:6` (`--font-poppins`) — semua text contact pakai sama.
- Repo tanpa test harness (hanya `dev`/`build`/`lint` `package.json:5`); `ContactSection` tetap Server Component seperti `app/sections/about.tsx:1`.

## Alternatives (6 grill rounds)

1. **Q1 Tipografi judul/subjudul (chosen A: Putih polos lowercase)**
   - A) **Putih polos lowercase verbatim `punya ide?` / `mari wujudkan bersama!` `text-white` tanpa aksen warna** (chosen → amended EN `got an idea?` / `let's make it happen!`)
   - B) Title Case `Punya Ide?` dengan aksen `#F59E0B` di `ide?` konsisten `About Me` `app/sections/about.tsx:11`
   - C) Custom size/warna lain
   - Dipilih A: sesuai brief eksplisit `warna teks putih`, lowercase memberi vibe casual. Trade-off: kehilangan aksen warna yang sinkron `Projects` `#38BDF8`; mitigasi: semua putih tetap kontras tinggi di `#111827`.

2. **Q2 Email dummy (chosen B: `akmal@example.com` `mailto:`)**
   - A) `hello@akmal.dev` `mailto:` — brandable tapi belum owned
   - B) **`akmal@example.com` `mailto:akmal@example.com` `text-white hover:underline`** (chosen)
   - C) `akmal@example.com` + tombol `copy-to-clipboard` Client Component
   - Dipilih B: generik, aman untuk dummy, `mailto:` cukup. `C` butuh `"use client"` + state copy — overkill untuk placeholder; bisa di-ADR selanjutnya saat email real `hello@akmal.dev`.

3. **Q3 Sosmed CTA (chosen A: 3 icon GitHub/LinkedIn/IG bulat putih)**
   - A) **3 icon `FaGithub`→`https://github.com`, `FaLinkedin`→`https://linkedin.com`, `FaInstagram`→`https://instagram.com` `h-10 w-10 rounded-full bg-white text-[#111827]` `target="_blank" rel="noopener"`** (chosen)
   - B) 4 icon + `FaXTwitter`/`FaTwitter`
   - C) Outline transparan `border-white text-white bg-transparent`
   - Dipilih A: 3 populer cukup, `react-icons/fa` `FaGithub/FaLinkedin/FaInstagram` tersedia, `bg-white` kontras maksimal di `#111827`, `hover:scale-105` feedback murah GPU. `C` kurang kontras di dark; `B` tambah clutter.

4. **Q4 Layout & spacing (chosen A: Center mobile, container)**
   - A) **`Mobile center `text-center` → desktop `lg:text-left`, `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center`, container `max-w-6xl lg:max-w-[1100px]`, image `aspect-square max-w-[340px] lg:max-w-[480px] rounded-[24px] overflow-hidden`** (chosen)
   - B) Left-aligned mobile + full-bleed tanpa container `max-w-none`
   - C) Image `aspect-[4/3]` tanpa rounded
   - Dipilih A: `center` mobile memanfaatkan 1-kolom 4-row tetap readable di 375px; `lg:text-left` selaras `About`/`Projects` `text-center lg:text-left`; container 1100px sinkron semua section; `340→480px` square proporsional dengan 1254² asset; `rounded-[24px]` konsisten `Skeleton Project Card` `app/sections/projects.tsx:25`.

5. **Q5 Detail visual (chosen A: Full section #111827, icon _blank, email underline, tanpa footer)**
   - A) **Full section `bg-[#111827] text-white py-16 lg:py-20`, icon `bg-white` `hover:scale-105` `_blank`, email `hover:underline`, tanpa footer copyright** (chosen)
   - B) `bg-white` section + card dalam `bg-[#111827] rounded-[32px]` seperti `Hero Card` `app/sections/hero.tsx:7`
   - C) Tambah footer `© 2026 Akmal.dev`
   - Dipilih A: brief minta `warna background #111827` full section; card dalam dark memberi gap putih ganda tidak perlu. Icon `_blank` sesuai `membuka website sosmed`; `C` bisa next iteration jika butuh footer site-wide.

6. **Q6 Wording EN (chosen A: `got an idea?` / `let's make it happen!`)**
   - A) **`got an idea?` + `let's make it happen!` lowercase** (chosen, lock 2026-09-23)
   - B) `have an idea?` + `let's build it together!`
   - C) Custom wording user
   - Dipilih A: terjemahan natural dari `punya ide?` / `mari wujudkan bersama!`, pendek, retain lowercase verbatim — konsisten grill Q1. `B` lebih formal tapi lebih panjang.

## Decision

1. **Rewrite `app/sections/contact.tsx:1`** sebagai Server Component `export default function ContactSection`:
   ```tsx
   <section id="contact" className="bg-[#111827] py-16 lg:py-20 text-white" aria-label="Contact section">
     <div className="mx-auto max-w-6xl lg:max-w-[1100px] px-4 sm:px-6 lg:px-8">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
         <div className="flex flex-col gap-4 text-center lg:text-left">
           <h2 className="text-[36px] lg:text-[56px] font-semibold tracking-tight text-white">got an idea?</h2>
           <p className="text-[18px] lg:text-[24px] text-white">let's make it happen!</p>
           <a href="mailto:akmal@example.com" className="text-[16px] lg:text-[18px] font-medium hover:underline">akmal@example.com</a>
           <ul className="flex justify-center lg:justify-start gap-4" aria-label="Social media links">
             {/* 3× a h-10 w-10 rounded-full bg-white text-[#111827] hover:scale-105 FaGithub/FaLinkedin/FaInstagram target="_blank" */}
           </ul>
         </div>
         <div className="relative mx-auto aspect-square w-full max-w-[340px] rounded-[24px] overflow-hidden lg:ml-auto lg:max-w-[480px]">
           <Image src="/contact-section-image.png" alt="Contact illustration" fill className="object-cover" sizes="(min-width:1024px) 480px, 340px" />
         </div>
       </div>
     </div>
   </section>
   ```

2. **Detail `app/sections/contact.tsx:1`:**
   - `SOCIAL_LINKS` const 3 entry `label/href/icon` (`FaGithub`, `FaLinkedin`, `FaInstagram` dari `react-icons/fa`) — `target="_blank" rel="noopener noreferrer"` + `aria-label` + `focus-visible:ring-white/ring-offset-[#111827]`.
   - Grid `grid-cols-1 lg:grid-cols-2` — mobile natural 4 rows (`flex flex-col gap-4`), desktop 2 col `items-center`, image `ml-auto`.
   - Typografi Poppins via `app/layout.tsx:6` — tidak tambah font config.
   - `next/image` `fill` + `object-cover` + `sizes` — `priority` tidak perlu (below fold).

3. **Docs sync:**
   - `CONTEXT.md:27` Contact Section + 4 entri baru **Contact Heading** / **Contact Subheading** / **Contact Email** / **Social CTA** / **Contact Image** (ref ADR 0012).
   - No change `app/globals.css:1` (Tailwind v4 `@import "tailwindcss"` sudah support `bg-[#111827]`, `rounded-[24px]`), `app/components/navbar.tsx:5` (retain anchor).

## Consequences

- **Positif:** Full-bleed `#111827` sesuai brief; mobile 1×4 center → desktop 2-col left+image 340→480px sinkron semua section `max-w-[1100px] py-16`; EN `got an idea?` / `let's make it happen!` lowercase putih polos; `akmal@example.com` `mailto:` siap ganti real; 3 icon bulat putih `hover:scale-105` kontras maksimal, `_blank` benar; `aspect-square` reuse 1254² tanpa crop aneh; Server Component tanpa JS baru.
- **Negatif:** `bg-[#111827]` sangat gelap — semua child harus `text-white` explicit (tidak inherit `text-zinc-900` global); jika lupa, kontras hilang. Fixed 3 sosmed — tambah platform butuh edit `SOCIAL_LINKS` + ADR amend. `mailto:` dummy tidak punya fallback copy jika user tanpa mail client — acceptable.
- **Trade-off:** Full section vs card `Hero` (`bg-white` + `rounded-[40px]` di tengah) — full section pilih immersive sesuai brief, trade heavy dark. `FaLinkedin` (fa v5 name) vs `FaLinkedinIn` — pilih yang ada di bundle `react-icons/fa` v5; jika tidak ada, fallback `FaLinkedinIn`.
- **Reversal cost:** Low — revert `app/sections/contact.tsx:1` ke dummy `bg-white min-h-[60vh]` atau ke versi ID `punya ide?`, revert `CONTEXT.md:27`, hapus file ini.

## References

- `app/sections/contact.tsx:1` — Contact Section (dark, EN, 3 social, image)
- `public/contact-section-image.png` — 1254×1254 asset
- `app/page.tsx:4` — import ContactSection
- `app/components/navbar.tsx:5` — Navigation Item `Contact → #contact` retain
- `app/sections/hero.tsx:38` — Contact CTA `href="#contact"` target
- `app/sections/projects.tsx:38` — Coming Soon Overlay target
- `app/sections/about.tsx:6` — pola `max-w-6xl lg:max-w-[1100px]` + `py-16 lg:py-20` reuse
- `app/layout.tsx:6` — Poppins typography
- `package.json:15` — `react-icons` 5.7.0
- `CONTEXT.md:27` — glossary Contact Section + sub-entries
