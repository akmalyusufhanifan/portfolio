# Spec — Navbar Website Logo & Desktop Nav Scale

- **Status:** ready-for-agent
- **Feature:** navbar-website-logo
- **Related ADR:** docs/adr/0011-navbar-website-logo-desktop-nav-scale.md
- **Glossary:** CONTEXT.md (Navbar, Website Logo, Site Name, Navigation Item, Breakpoint lg)

## Problem Statement

Pengguna membuka portfolio di desktop (`>=1024px`) melihat sisi kiri Navbar masih berupa teks `Akmal.dev` (`app/components/navbar.tsx:104`) padahal aset brand final sudah tersedia di `public/website-logo.png` (1765×882, ratio 2:1). Selain itu, button navigasi desktop (`About`/`Projects`/`Contact`) terasa kecil (`text-sm` 14px di `app/components/navbar.tsx:120`) dibandingkan header `h-16` dan kurang proporsional setelah logo image dipasang. Di mobile (`<1024px`) ukuran `text-[14px]` di Bubble Menu sudah dianggap pas dan tidak boleh ikut berubah.

## Solution

Ganti teks kiri Navbar menjadi image brand via `next/image` dari `public/website-logo.png` dengan tinggi constrained `h-8` mobile → `lg:h-10` desktop (ratio 2:1 terjaga, pas di `h-16`), tetap link ke `#hero` dengan `alt`/`aria-label` dari prop `siteName`. Perbesar Navigation Items hanya untuk desktop dari `text-sm` 14px menjadi `text-[16px]` dengan hit area `px-2 py-2` dan jarak `gap-10`, sementara mobile Bubble Menu tetap `text-[14px]`. Update glossary `CONTEXT.md` untuk merefleksikan Website Logo dan skala nav baru.

## User Stories

1. As a visitor di desktop, I want melihat logo image di kiri Navbar menggantikan teks, so that brand terlihat profesional dan konsisten dengan aset yang sudah disiapkan.
2. As a visitor di desktop, I want logo di kiri tetap bisa diklik menuju Hero Section (`#hero`), so that saya bisa kembali ke atas dengan cepat.
3. As a visitor menggunakan screen reader, I want logo memiliki `alt` yang bermakna (`Akmal.dev`), so that brand tetap teridentifikasi saat image gagal load.
4. As a site owner, I want prop `siteName` tetap berfungsi sebagai fallback `alt`/`aria-label`, so that `<Navbar />` di `app/layout.tsx:25` tanpa prop tetap valid dan brand bisa diganti tanpa edit komponen.
5. As a visitor di desktop, I want Navigation Items (`About`/`Projects`/`Contact`) lebih besar (`16px`), so that lebih mudah dibaca dan diklik di layar lebar.
6. As a visitor di desktop, I want jarak antar Navigation Items lebih lega (`gap-10`), so that tidak terlihat sesak di samping logo 2:1 yang lebar.
7. As a visitor di desktop, I want hit area tiap Navigation Item lebih besar (`px-2 py-2`), so that hover/focus underline dan klik lebih nyaman.
8. As a visitor di mobile/tablet, I want ukuran Navigation Items di Bubble Menu tetap `14px`, so that tidak overflow di panel `w-[154px] h-[172px]`.
9. As a visitor di desktop, I want warna Navigation Items tetap (`#F59E0B`/`#38BDF8`/`#34D399`) dan underline animasi `center→sides` tetap, so that identitas visual tidak hilang setelah scaling.
10. As a visitor, I want Navbar tetap non-sticky `relative h-16 w-full bg-white` tanpa border/shadow, so that menyatu dengan halaman seperti sebelumnya.
11. As a developer, I want logo di-load dengan `priority` via `next/image`, so that LCP above-the-fold optimal di Next.js 16.
12. As a developer, I want dokumentasi glossary ter-update (Website Logo, Navigation Item skala), so that future contributor paham kenapa kiri jadi image dan kenapa hanya desktop yang di-scale.

## Implementation Decisions

- Modul yang dimodifikasi adalah Navbar sebagai Client Component yang mengelola toggle, scroll lock, dan navigasi anchor; tidak ada modul baru yang diperkenalkan dan tidak ada perubahan pada layout root selain kompatibilitas prop yang sudah ada.
- Interface `NavbarProps` dengan `siteName` opsional dipertahankan; perilaku berubah dari render teks menjadi render image dengan `alt` dari prop tersebut, menjaga backward compatibility untuk pemanggil tanpa argumen.
- Keputusan teknis untuk merender logo menggunakan komponen image ter-optimasi framework dengan sumber dari folder public, dengan dimensi asli dipertahankan sebagai metadata optimasi sementara ukuran visual dikontrol sepenuhnya oleh kelas tinggi responsif dan lebar otomatis untuk menjaga rasio 2:1.
- Tinggi visual dipilih `h-8` untuk viewport di bawah breakpoint dan `lg:h-10` untuk desktop agar menyisakan padding vertikal yang seimbang di dalam header `h-16` dan tidak bertabrakan dengan tombol hamburger `h-10 w-10`.
- Skala navigasi desktop diputuskan sebagai kenaikan moderat dari 14px ke 16px dengan padding dan gap yang disesuaikan, diterapkan hanya pada cabang `hidden lg:block`, sementara cabang bubble menu dibiarkan tidak tersentuh sesuai permintaan untuk menjaga ukuran mobile.
- Tidak ada perubahan pada logika scroll lock, click-outside, ESC, resize, maupun animasi underline; semua interaksi dipertahankan 1:1.
- Tidak ada perubahan schema, API contract, atau konfigurasi image remote karena aset bersifat lokal.

## Testing Decisions

- Prinsip pengujian: hanya menguji perilaku eksternal (logo tampil dan link ke hero, nav desktop 16px, mobile tetap 14px), bukan detail implementasi kelas Tailwind spesifik; verifikasi visual dilakukan via inspeksi browser dan build.
- Modul yang akan diuji adalah Navbar sebagai satu-satunya seam yang tersentuh; seam tertinggi yang ada sudah cukup karena Navbar adalah Client Component terisolasi tanpa dependensi eksternal baru.
- Prior art untuk pengujian di repo ini adalah tidak adanya test harness formal; validasi mengandalkan `next build` dan `eslint` serta inspeksi manual di breakpoint `1024px` (sesuai strategi `lg:` yang sudah ada), mengikuti pola yang sama seperti ADR sebelumnya yang mengandalkan build check.
- Pengujian aksesibilitas memverifikasi bahwa link logo memiliki `aria-label` dan image memiliki `alt` yang terbaca screen reader, serta fokus keyboard tetap visible.

## Out of Scope

- Kompresi atau penggantian file `public/website-logo.png` itu sendiri (hanya konsumsi).
- Perubahan ukuran, warna, atau layout Bubble Menu mobile selain yang sudah ada.
- Penambahan dark mode, sticky header, atau perubahan routing dari anchor scroll ke multi-page.
- Perubahan pada section lain (Hero, About, Projects, Contact) dan animasi marquee yang sudah ada.
- Penambahan dependency baru atau konfigurasi Tailwind custom breakpoint selain `lg:1024px`.

## Further Notes

- Prop `siteName` yang kini hanya sebagai `alt` memungkinkan rebranding tanpa menyentuh file image; jika di masa depan logo diganti dengan SVG atau varian dark mode, ADR baru diperlukan.
- Jika header terasa padat di `1024px` exact (logo `~80px` + `gap-10`), mitigasi adalah turunkan `gap-10` kembali ke `gap-8` atau logo ke `lg:h-9` tanpa mengubah kontrak mobile.
- Keputusan `priority` untuk image dipertahankan karena logo berada di above-the-fold; jika halaman menambah hero image besar, evaluasi ulang `priority` untuk menghindari contention LCP.
