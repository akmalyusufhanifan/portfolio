# ADR 0013 — Entrance Reveal Animation: Fade + Slide-up + Stagger (CSS-only)

- **Status:** Accepted
- **Date:** 2026-09-28
- **Deciders:** Akmal, Muse Spark
- **Context:** `app/page.tsx:1`, `app/sections/hero.tsx:1`, `app/sections/about.tsx:1`, `app/sections/projects.tsx:1`, `app/sections/contact.tsx:1`, `app/components/reveal.tsx:1`, `app/globals.css`, `app/layout.tsx`, `CONTEXT.md`, `.scratch/entrance-reveal-animation/spec.md`
- **Grill:** Q1 scope (B), Q2 style (C), Q3 tech (A), Q4 duration (B), Q5 a11y (A) — grill-with-docs 1-per-1

## Context

Semua konten muncul instan tanpa transisi saat website dibuka — tidak ada load-in, terasa "pop"/kaku. Brief minta load-in rapih dan smooth untuk semua content. Investigasi existing:

- Semua section adalah Server Component diimpor di `app/page.tsx:1` — belum ada animasi entrance; satu-satunya animasi adalah loop marquee (`Skills Carousel` + skeleton Projects, `25s linear infinite` di `app/globals.css:25`) dan hover scale.
- Repo zero-animation-dependency (`package.json` tanpa `motion`/`framer-motion`/`gsap`) — menambah lib hanya untuk fade+slide adalah overkill.
- Pola a11y existing: `prefers-reduced-motion: reduce → animation:none` + layout statis (`app/globals.css:44`) — entrance harus konsisten dengan pola ini.
- Kendala grid About (`order-*` + `lg:col-start-*`) dan Contact image (`relative` + `fill`): wrapper animasi tidak boleh merusak kelas layout tersebut.

## Alternatives (5 grill rounds)

1. **Q1 Scope (chosen B: Hero on-load + bawah on-scroll)**
   - A) Semua section animasi bareng saat load — ditolak: animasi section bawah selesai di luar layar, user tidak melihatnya.
   - B) **Hero `immediate` on-mount + About/Projects/Contact `IntersectionObserver` once** (chosen) — setiap animasi selalu terlihat user, standar portfolio.

2. **Q2 Style (chosen C: fade + slide-up 16px + stagger)**
   - A) Fade only — ditolak: terasa hambar.
   - B) Fade + slide-up tanpa stagger — kurang rapih berurutan.
   - C) **Fade + slide-up 16px + stagger 0/90/180/270ms** (chosen) — kesan premium-smooth tanpa norak; 16px cukup halus, tidak lompat.

3. **Q3 Tech (chosen A: CSS-only + IntersectionObserver)**
   - A) **Satu Client Component `Reveal` + CSS transition** (chosen) — tanpa dependency, bundle minimal, SSR-safe.
   - B) `motion`/`framer-motion` — ditolak: ±50KB+ bundle untuk efek yang murni CSS-able.

4. **Q4 Duration (chosen B: 600ms + stagger 90ms)**
   - A) 400ms/60ms snappy — terlalu kilat untuk "smooth".
   - B) **600ms `cubic-bezier(0.22,1,0.36,1)` + stagger 90ms** (chosen) — sweet spot premium.
   - C) 800ms+/120ms+ lux — risiko terasa lemot di mobile.

5. **Q5 A11y (chosen A: reduced-motion safe + default visible)**
   - A) **`prefers-reduced-motion → transition:none + visible`, no-JS `<noscript>` fallback visible** (chosen) — konsisten pola marquee existing.
   - B) Paksa animasi semua user — ditolak: langgar a11y.

## Decision

1. **New `app/components/reveal.tsx:1`** (`"use client"`, satu-satunya seam):
   - Props `delay` (0/90/180/270 → inline `transitionDelay`), `immediate` (Hero: double-rAF reveal on-mount, skip observer), `className` (forward agar grid About/Contact tidak rusak).
   - Observer `threshold 0.15`, `rootMargin 0px 0px -8% 0px`, `once` (disconnect setelah visible — tidak re-animate bolak-balik).
   - Fallback browser tanpa `IntersectionObserver`: `setTimeout 0` reveal async (lolos `react-hooks/set-state-in-effect`).

2. **CSS di `app/globals.css`:** `.reveal { opacity:0; translateY(16px); transition 600ms }` → `.is-visible { opacity:1; none }`; blok `prefers-reduced-motion` memaksa visible tanpa transisi.

3. **Wrapping tanpa ubah layout:** Hero 4× `immediate` (0/90/180/270); About 4× observer (heading/gambar/paragraf/skills, kelas grid diteruskan ke `Reveal`); Projects heading + marquee container; Contact title/sub/email/sosmed + image. Navbar tidak ikut reveal.

4. **No-JS:** `<noscript><style>.reveal{opacity:1;transform:none}</style></noscript>` di `app/layout.tsx`.

## Consequences

- **Positif:** Load-in rapih berurutan di semua viewport; satu seam client kecil, section tetap Server Component; anchor `id`/`scroll-smooth`/marquee/scroll-lock tidak regresi (`npm run lint` bersih, `npm run build` sukses).
- **Negatif:** SSR render awal `opacity:0` — sebelum hidrasi ada jeda invisibel singkat (acceptable, hidrasi <1s); tiap `Reveal` adalah boundary client tambahan (ringan, hanya observer).
- **Trade-off:** `once` vs re-animate tiap scroll — pilih `once` agar rapih, bukan playful. `translateY(16px)` vs jarak besar — pilih kecil agar tidak lompat/CLS.
- **Reversal cost:** Low — hapus `<Reveal>` wrapper (kembalikan DOM semula), hapus blok `.reveal` di CSS + `<noscript>` di layout, revert `CONTEXT.md`, hapus file ini + `app/components/reveal.tsx`.

## References

- `.scratch/entrance-reveal-animation/spec.md` — spec to-spec (`ready-for-agent`)
- `app/components/reveal.tsx:1` — Reveal wrapper
- `app/globals.css` — `.reveal` + reduced-motion
- `app/layout.tsx` — noscript fallback
- `CONTEXT.md` — glossary Entrance Animation / Reveal on-scroll / Stagger / Reveal Wrapper
