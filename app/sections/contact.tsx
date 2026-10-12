import Image from "next/image";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import Reveal from "../components/reveal";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/akmalyusufhanifan",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akmal-yusuf-hanifan",
    icon: FaLinkedin,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
] as const;

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-[#111827] py-16 text-white lg:pt-20 lg:pb-10 lg:rounded-t-[64px]"
      aria-label="Contact section"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-[1100px] lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column — 4 rows on mobile, stacked */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            {/* Row 1 — Title */}
            <Reveal delay={0}>
              <h2 className="text-[48px] font-semibold tracking-tight text-white lg:text-[92px]">
                Got an idea?
              </h2>
            </Reveal>

            {/* Row 2 — Subtitle */}
            <Reveal delay={90}>
              <p className="text-[20px] font-normal leading-relaxed text-white lg:text-[28px]">
                let&apos;s make it happen!
              </p>
            </Reveal>

            {/* Row 3 — Email */}
            <Reveal delay={180}>
              <a
                href="mailto:akmalyusufhanifan.career@gmail.com"
                className="text-[16px] font-medium text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] lg:text-[18px]"
              >
                akmalyusufhanifan.career@gmail.com
              </a>
            </Reveal>

            {/* Row 4 — Social CTA */}
            <Reveal delay={270}>
            <ul
              className="mt-2 flex justify-center gap-4 lg:justify-start"
              aria-label="Social media links"
            >
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] transition hover:scale-105 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            </Reveal>
          </div>

          {/* Right column — Image (desktop visible, mobile below text as 2nd visual block) */}
          <Reveal
            delay={180}
            className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-[24px] lg:mx-0 lg:ml-auto lg:max-w-[480px]"
          >
            <div className="relative h-full w-full">
              <Image
                src="/contact-section-image.png"
                alt="Contact illustration"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 340px"
              />
            </div>
          </Reveal>
        </div>

        {/* Footer copyright — bottom of Contact Section */}
        <p className="mt-12 border-t border-white/10 pt-8 text-center text-[13px] leading-relaxed text-white/60 lg:mt-16 lg:text-[14px]">
          © 2026 Akmal Yusuf Hanifan. All rights reserved.
        </p>
      </div>
    </section>
  );
}
